#!/usr/bin/env node
/**
 * Migrate a markdown blog post to Sanity CMS.
 *
 * Usage: node scripts/migrate-post-to-sanity.js <path-to-markdown-file>
 *
 * Requires environment variables:
 * - SANITY_PROJECT_ID (or PUBLIC_SANITY_PROJECT_ID)
 * - SANITY_DATASET (or PUBLIC_SANITY_DATASET)
 * - SANITY_API_TOKEN (write token from sanity.io/manage)
 */

import { createClient } from '@sanity/client';
import matter from 'gray-matter';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { randomUUID } from 'crypto';

// ============================================================================
// Configuration
// ============================================================================

const projectId =
    process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset =
    process.env.SANITY_DATASET ||
    process.env.PUBLIC_SANITY_DATASET ||
    'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
    console.error('Missing required environment variables:');
    if (!projectId)
        console.error('  - SANITY_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID');
    if (!token) console.error('  - SANITY_API_TOKEN');
    console.error('\nGet a write token from: https://sanity.io/manage');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
});

// ============================================================================
// Portable Text Helpers
// ============================================================================

function generateKey() {
    return randomUUID().slice(0, 12);
}

function createTextSpan(text, marks = []) {
    return {
        _type: 'span',
        _key: generateKey(),
        text,
        marks,
    };
}

function createBlock(children, style = 'normal', markDefs = []) {
    return {
        _type: 'block',
        _key: generateKey(),
        style,
        markDefs,
        children: Array.isArray(children) ? children : [children],
    };
}

function createListItem(children, level = 1) {
    return {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        listItem: 'bullet',
        level,
        markDefs: [],
        children: Array.isArray(children) ? children : [children],
    };
}

// ============================================================================
// Markdown Parser
// ============================================================================

/**
 * Parse inline markdown (bold, italic, code, links) into Portable Text spans
 */
function parseInlineMarkdown(text) {
    const spans = [];
    const markDefs = [];
    let remaining = text;

    // Regex patterns for inline elements
    const patterns = [
        // Links: [text](url)
        {
            regex: /\[([^\]]+)\]\(([^)]+)\)/,
            handler: (match) => {
                const linkKey = generateKey();
                markDefs.push({
                    _type: 'link',
                    _key: linkKey,
                    href: match[2],
                });
                return { text: match[1], marks: [linkKey] };
            },
        },
        // Bold+Italic: ***text*** or ___text___
        {
            regex: /\*\*\*([^*]+)\*\*\*|___([^_]+)___/,
            handler: (match) => ({
                text: match[1] || match[2],
                marks: ['strong', 'em'],
            }),
        },
        // Bold: **text** or __text__
        {
            regex: /\*\*([^*]+)\*\*|__([^_]+)__/,
            handler: (match) => ({
                text: match[1] || match[2],
                marks: ['strong'],
            }),
        },
        // Italic: *text* or _text_
        {
            regex: /\*([^*]+)\*|_([^_]+)_/,
            handler: (match) => ({ text: match[1] || match[2], marks: ['em'] }),
        },
        // Inline code: `text`
        {
            regex: /`([^`]+)`/,
            handler: (match) => ({ text: match[1], marks: ['code'] }),
        },
    ];

    while (remaining.length > 0) {
        let earliestMatch = null;
        let earliestIndex = Infinity;
        let matchedPattern = null;

        // Find the earliest matching pattern
        for (const pattern of patterns) {
            const match = remaining.match(pattern.regex);
            if (match && match.index < earliestIndex) {
                earliestMatch = match;
                earliestIndex = match.index;
                matchedPattern = pattern;
            }
        }

        if (earliestMatch && matchedPattern) {
            // Add text before the match
            if (earliestIndex > 0) {
                spans.push(createTextSpan(remaining.slice(0, earliestIndex)));
            }

            // Add the matched element
            const result = matchedPattern.handler(earliestMatch);
            spans.push(createTextSpan(result.text, result.marks));

            // Continue with remaining text
            remaining = remaining.slice(
                earliestIndex + earliestMatch[0].length
            );
        } else {
            // No more matches, add remaining text
            if (remaining.length > 0) {
                spans.push(createTextSpan(remaining));
            }
            break;
        }
    }

    return {
        spans: spans.length > 0 ? spans : [createTextSpan(text)],
        markDefs,
    };
}

/**
 * Parse a paragraph into a Portable Text block
 */
function parseParagraph(text, style = 'normal') {
    const { spans, markDefs } = parseInlineMarkdown(text.trim());
    return createBlock(spans, style, markDefs);
}

/**
 * Parse a code block from markdown
 */
function parseCodeBlock(codeContent, meta) {
    // Parse meta: language filename=xxx showLineNumbers
    const languageMatch = meta.match(/^(\w+)/);
    const filenameMatch = meta.match(/filename=([^\s]+)/);
    const showLineNumbers = meta.includes('showLineNumbers');

    return {
        _type: 'codeBlock',
        _key: generateKey(),
        code: codeContent.trim(),
        language: languageMatch ? languageMatch[1] : 'text',
        filename: filenameMatch ? filenameMatch[1] : undefined,
        showLineNumbers,
    };
}

/**
 * Parse a callout block (> [!NOTE] style)
 */
function parseCallout(content, type = 'info') {
    // Remove the > prefix from each line and join
    const cleanContent = content
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim();

    // Parse the content into blocks
    const blocks = parseMarkdownContent(cleanContent);

    return {
        _type: 'callout',
        _key: generateKey(),
        type,
        content: blocks,
    };
}

/**
 * Parse an image reference
 */
function parseImage(alt, path) {
    return {
        _type: 'portableImage',
        _key: generateKey(),
        alt,
        _imagePath: path, // Will be replaced with actual image reference after upload
    };
}

/**
 * Main markdown content parser
 */
function parseMarkdownContent(content) {
    const blocks = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines
        if (line.trim() === '') {
            i++;
            continue;
        }

        // Skip script tags (Svelte imports)
        if (line.trim().startsWith('<script>')) {
            while (i < lines.length && !lines[i].includes('</script>')) {
                i++;
            }
            i++; // Skip closing tag
            continue;
        }

        // Skip Svelte components
        if (line.trim().startsWith('<Author') || line.trim().startsWith('<')) {
            i++;
            continue;
        }

        // Code blocks
        if (line.trim().startsWith('```')) {
            const meta = line.trim().slice(3);
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            blocks.push(parseCodeBlock(codeLines.join('\n'), meta));
            i++; // Skip closing ```
            continue;
        }

        // Callouts (> [!NOTE], > [!WARNING], > [!TIP])
        if (line.trim().match(/^>\s*\[!(NOTE|WARNING|TIP)\]/i)) {
            const typeMatch = line.match(/\[!(NOTE|WARNING|TIP)\]/i);
            const type = typeMatch ? typeMatch[1].toLowerCase() : 'info';
            const calloutLines = [
                line.replace(/\[!(NOTE|WARNING|TIP)\]\s*/i, ''),
            ];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('>')) {
                calloutLines.push(lines[i]);
                i++;
            }
            // Map NOTE to 'info' for Sanity schema
            const sanityType = type === 'note' ? 'info' : type;
            blocks.push(parseCallout(calloutLines.join('\n'), sanityType));
            continue;
        }

        // Regular blockquotes (not callouts)
        if (line.trim().startsWith('>') && !line.trim().match(/^>\s*\[!/)) {
            const quoteLines = [line];
            i++;
            while (i < lines.length && lines[i].trim().startsWith('>')) {
                quoteLines.push(lines[i]);
                i++;
            }
            const quoteContent = quoteLines
                .map((l) => l.replace(/^>\s?/, ''))
                .join(' ')
                .trim();
            blocks.push(parseParagraph(quoteContent, 'blockquote'));
            continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{2,4})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const style = `h${level}`;
            blocks.push(parseParagraph(headingMatch[2], style));
            i++;
            continue;
        }

        // Images
        const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
            blocks.push(parseImage(imageMatch[1], imageMatch[2]));
            i++;
            continue;
        }

        // Unordered lists
        if (line.trim().match(/^[-*]\s+/)) {
            while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
                const listContent = lines[i].trim().replace(/^[-*]\s+/, '');
                const { spans, markDefs } = parseInlineMarkdown(listContent);
                blocks.push({
                    _type: 'block',
                    _key: generateKey(),
                    style: 'normal',
                    listItem: 'bullet',
                    level: 1,
                    markDefs,
                    children: spans,
                });
                i++;
            }
            continue;
        }

        // Regular paragraph - collect until empty line or special element
        const paragraphLines = [line];
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !lines[i].trim().startsWith('#') &&
            !lines[i].trim().startsWith('```') &&
            !lines[i].trim().startsWith('>') &&
            !lines[i].trim().startsWith('-') &&
            !lines[i].trim().startsWith('*') &&
            !lines[i].trim().match(/^!\[/)
        ) {
            paragraphLines.push(lines[i]);
            i++;
        }
        const paragraphText = paragraphLines.join(' ').trim();
        if (paragraphText) {
            blocks.push(parseParagraph(paragraphText));
        }
    }

    return blocks;
}

// ============================================================================
// Sanity Operations
// ============================================================================

/**
 * Upload an image to Sanity
 */
async function uploadImage(imagePath, baseDir) {
    // Resolve path relative to project root
    let fullPath = imagePath;
    if (imagePath.startsWith('/src/')) {
        fullPath = resolve(process.cwd(), imagePath.slice(1));
    } else if (!imagePath.startsWith('/')) {
        fullPath = resolve(baseDir, imagePath);
    }

    if (!existsSync(fullPath)) {
        console.error(`Image not found: ${fullPath}`);
        return null;
    }

    console.log(`  Uploading image: ${basename(fullPath)}`);
    const imageBuffer = readFileSync(fullPath);

    try {
        const asset = await client.assets.upload('image', imageBuffer, {
            filename: basename(fullPath),
        });
        return {
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id,
            },
        };
    } catch (error) {
        console.error(`  Failed to upload ${fullPath}:`, error.message);
        return null;
    }
}

/**
 * Find or create a tag by slug
 */
async function findOrCreateTag(tagSlug) {
    // Check if tag exists
    const existing = await client.fetch(
        `*[_type == "tag" && slug.current == $slug][0]`,
        {
            slug: tagSlug,
        }
    );

    if (existing) {
        return existing._id;
    }

    // Create new tag
    const tagName = tagSlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    console.log(`  Creating tag: ${tagName}`);
    const newTag = await client.create({
        _type: 'tag',
        name: tagName,
        slug: { _type: 'slug', current: tagSlug },
    });

    return newTag._id;
}

/**
 * Find author by name pattern
 */
async function findAuthor(authorId) {
    // Try to find by document ID or partial name match
    const author = await client.fetch(`*[_type == "author"][0]`);
    return author?._id;
}

/**
 * Check if post with slug already exists
 */
async function checkExistingPost(slug) {
    const existing = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0]`,
        { slug }
    );
    return existing;
}

// ============================================================================
// Main Migration Function
// ============================================================================

async function migratePost(markdownPath) {
    console.log(`\n📄 Migrating: ${markdownPath}\n`);

    // Read and parse markdown file
    const fullPath = resolve(process.cwd(), markdownPath);
    const baseDir = dirname(fullPath);
    const content = readFileSync(fullPath, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);

    console.log(`Title: ${frontmatter.title}`);
    console.log(`Slug: ${frontmatter.slug}`);

    // Check if post already exists
    const existing = await checkExistingPost(frontmatter.slug);
    if (existing) {
        console.log(
            `\n⚠️  Post with slug "${frontmatter.slug}" already exists (ID: ${existing._id})`
        );
        console.log(
            '   Use --force to overwrite or delete the existing post first.'
        );
        if (!process.argv.includes('--force')) {
            return;
        }
        console.log('   --force flag detected, will overwrite...');
    }

    // Parse markdown body to Portable Text
    console.log('\n📝 Parsing content...');
    const blocks = parseMarkdownContent(body);
    console.log(`   Found ${blocks.length} blocks`);

    // Upload images
    console.log('\n🖼️  Uploading images...');

    // Cover image
    let coverImageRef = null;
    const postDir = `src/lib/assets/images/posts/${frontmatter.slug}`;
    const coverPath = `${postDir}/cover.png`;
    if (existsSync(coverPath)) {
        coverImageRef = await uploadImage(coverPath, process.cwd());
    } else {
        console.log('   No cover image found');
    }

    // Body images
    for (const block of blocks) {
        if (block._type === 'portableImage' && block._imagePath) {
            const imageRef = await uploadImage(block._imagePath, baseDir);
            if (imageRef) {
                block.image = imageRef;
            }
            delete block._imagePath;
        }
    }

    // Create/find tags
    console.log('\n🏷️  Processing tags...');
    const tagRefs = [];
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
        for (const tag of frontmatter.tags) {
            const tagId = await findOrCreateTag(tag);
            tagRefs.push({
                _type: 'reference',
                _ref: tagId,
                _key: generateKey(),
            });
        }
    }

    // Find author
    console.log('\n👤 Finding author...');
    const authorId = await findAuthor(frontmatter.authorId);
    if (authorId) {
        console.log(`   Found author: ${authorId}`);
    } else {
        console.log('   No author found');
    }

    // Build post document
    const postDoc = {
        _type: 'post',
        title: frontmatter.title,
        slug: { _type: 'slug', current: frontmatter.slug },
        excerpt: frontmatter.excerpt?.trim() || '',
        date: frontmatter.date,
        hidden: frontmatter.hidden || false,
        body: blocks,
        tags: tagRefs.length > 0 ? tagRefs : undefined,
        author: authorId ? { _type: 'reference', _ref: authorId } : undefined,
        keywords: frontmatter.keywords || undefined,
    };

    if (coverImageRef) {
        postDoc.coverImage = {
            ...coverImageRef,
            alt: frontmatter.title,
        };
    }

    // Create or update post
    console.log('\n📤 Creating post in Sanity...');

    try {
        let result;
        if (existing && process.argv.includes('--force')) {
            // Update existing
            result = await client.patch(existing._id).set(postDoc).commit();
            console.log(`\n✅ Updated post: ${result._id}`);
        } else {
            // Create new
            result = await client.create(postDoc);
            console.log(`\n✅ Created post: ${result._id}`);
        }

        console.log(
            `\n🔗 View in Studio: https://${projectId}.sanity.studio/structure/post;${result._id}`
        );
        console.log(`\n📋 Summary:`);
        console.log(`   - Title: ${frontmatter.title}`);
        console.log(`   - Slug: ${frontmatter.slug}`);
        console.log(`   - Body blocks: ${blocks.length}`);
        console.log(`   - Tags: ${tagRefs.length}`);
        console.log(`   - Cover image: ${coverImageRef ? 'Yes' : 'No'}`);

        return result;
    } catch (error) {
        console.error('\n❌ Failed to create post:', error.message);
        throw error;
    }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

if (args.length === 0) {
    console.log(
        'Usage: node scripts/migrate-post-to-sanity.js <path-to-markdown-file> [--force]'
    );
    console.log('\nOptions:');
    console.log('  --force    Overwrite existing post with same slug');
    console.log('\nExample:');
    console.log(
        '  node scripts/migrate-post-to-sanity.js src/content/blog/2025-09-03-tdd-infrastructure-terragrunt.md'
    );
    process.exit(1);
}

migratePost(args[0]).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
