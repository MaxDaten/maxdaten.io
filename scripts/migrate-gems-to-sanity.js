#!/usr/bin/env node
/**
 * Migrate gems to Sanity CMS.
 *
 * Usage:
 *   node scripts/migrate-gems-to-sanity.js              # Migrate all gems
 *   node scripts/migrate-gems-to-sanity.js --dry-run    # Preview migration
 *
 * Requires environment variables:
 * - SANITY_PROJECT_ID (or PUBLIC_SANITY_PROJECT_ID)
 * - SANITY_DATASET (or PUBLIC_SANITY_DATASET)
 * - SANITY_API_TOKEN (write token from sanity.io/manage)
 */

import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';
import { randomUUID } from 'crypto';

// ============================================================================
// CLI Argument Parsing
// ============================================================================

const cliArgs = process.argv.slice(2);
const flags = {
    dryRun: cliArgs.includes('--dry-run'),
    help: cliArgs.includes('--help') || cliArgs.includes('-h'),
};

// ============================================================================
// Help Text
// ============================================================================

if (flags.help) {
    console.log(`
Migrate gems to Sanity CMS.

Usage:
  node scripts/migrate-gems-to-sanity.js              # Migrate all gems
  node scripts/migrate-gems-to-sanity.js --dry-run    # Preview migration

Options:
  --dry-run          Preview what would be migrated (no mutations)
  --help, -h         Show this help message

Environment Variables:
  SANITY_PROJECT_ID    Sanity project ID (or PUBLIC_SANITY_PROJECT_ID)
  SANITY_DATASET       Dataset name (default: production)
  SANITY_API_TOKEN     Write token from sanity.io/manage
`);
    process.exit(0);
}

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

// Allow dry-run without token for previewing
if (!flags.dryRun && (!projectId || !token)) {
    console.error('Missing required environment variables:');
    if (!projectId)
        console.error('  - SANITY_PROJECT_ID or PUBLIC_SANITY_PROJECT_ID');
    if (!token) console.error('  - SANITY_API_TOKEN');
    console.error('\nGet a write token from: https://sanity.io/manage');
    console.error('\nUse --dry-run to preview without credentials.');
    process.exit(1);
}

const client = projectId
    ? createClient({
          projectId,
          dataset,
          apiVersion: '2024-01-01',
          token,
          useCdn: false,
      })
    : null;

// ============================================================================
// Gem Data (from src/lib/data/gems/index.ts)
// ============================================================================

// Hardcoded gem data to avoid complex ESM/TS import issues
const gems = [
    {
        title: 'YouTube Channel: LifeHack Automations',
        description:
            'A channel of a friend which helps you automate your life and win precious time back!',
        tags: ['youtube', 'automation'],
        link: 'https://youtube.com/@LifeHackAutomations-dp9kb',
        coverImage: 'lifehack-automations01.png',
    },
    {
        title: 'YouTube Channel: Kie Codes',
        description:
            'A YouTube channel of friend with the goal to make complex topics around programming easy to grasp for everyone! I sincerely hope you find something helpful here and have a lot of fun while learning.',
        tags: ['youtube', 'programming'],
        link: 'https://www.youtube.com/@KieCodes',
        coverImage: 'kie-codes.png',
    },
    {
        title: 'YouTube Channel: Catangle',
        description:
            'A YouTube channel of a friend mainly focused on dogfights in Star Citizen.',
        tags: ['youtube', 'gaming'],
        link: 'https://www.youtube.com/@cataangle',
        coverImage: 'catangle.png',
    },
];

// ============================================================================
// Helpers
// ============================================================================

function generateKey() {
    return randomUUID().slice(0, 12);
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Generate predictable document ID from title
 */
function generateGemId(title) {
    return `gem-${slugify(title)}`;
}

// ============================================================================
// Sanity Operations
// ============================================================================

/**
 * Upload an image to Sanity
 */
async function uploadImage(imageName) {
    if (!client) return null;

    const fullPath = resolve(
        process.cwd(),
        'src/lib/assets/images/gems',
        imageName
    );

    if (!existsSync(fullPath)) {
        console.error(`  Image not found: ${fullPath}`);
        return null;
    }

    console.log(`  Uploading image: ${imageName}`);
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
    if (!client) return `tag-${tagSlug}`;

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

// ============================================================================
// Main Migration Function
// ============================================================================

async function migrateGem(gem, options = {}) {
    const { dryRun = false } = options;

    const gemId = generateGemId(gem.title);
    const slug = slugify(gem.title);

    console.log(`\nMigrating: ${gem.title}`);
    console.log(`  Slug: ${slug}`);
    console.log(`  ID: ${gemId}`);

    if (dryRun) {
        console.log('  [DRY RUN] Would migrate this gem');
        return { _id: gemId, slug, title: gem.title };
    }

    // Upload cover image
    console.log('  Uploading cover image...');
    const coverImageRef = await uploadImage(gem.coverImage);
    if (!coverImageRef) {
        throw new Error(`Failed to upload cover image for ${gem.title}`);
    }

    // Create/find tags
    console.log('  Processing tags...');
    const tagRefs = [];
    for (const tag of gem.tags) {
        const tagId = await findOrCreateTag(tag);
        tagRefs.push({
            _type: 'reference',
            _ref: tagId,
            _key: generateKey(),
        });
    }

    // Build gem document with predictable ID
    const gemDoc = {
        _id: gemId,
        _type: 'gem',
        title: gem.title,
        slug: { _type: 'slug', current: slug },
        url: gem.link,
        description: gem.description,
        tags: tagRefs.length > 0 ? tagRefs : undefined,
        coverImage: {
            ...coverImageRef,
            alt: gem.title,
        },
    };

    // Create or replace gem (idempotent)
    console.log('  Creating/replacing gem in Sanity...');

    try {
        const result = await client.createOrReplace(gemDoc);
        console.log(`  Created: ${result._id}`);
        console.log(
            `  Studio: https://${projectId}.sanity.studio/structure/gem;${result._id}`
        );

        return result;
    } catch (error) {
        console.error(`  Failed to create gem:`, error.message);
        throw error;
    }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Gem Migration: ${gems.length} gems`);
    console.log(`${'='.repeat(60)}`);

    if (flags.dryRun) {
        console.log('[DRY RUN] No mutations will be made\n');
    }

    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        console.log(`\n[${i + 1}/${gems.length}] ${gem.title}`);

        try {
            await migrateGem(gem, { dryRun: flags.dryRun });
            succeeded++;
        } catch (error) {
            failed++;
            console.error(`\nMigration failed for: ${gem.title}`);
            console.error(`Error: ${error.message}`);
            console.error(
                `\nProgress: ${succeeded} succeeded, ${failed} failed, ${gems.length - i - 1} remaining`
            );
            process.exit(1);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(
        `Migration Complete: ${succeeded}/${gems.length} gems migrated`
    );
    console.log(`${'='.repeat(60)}\n`);
}

main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
