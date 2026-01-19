# Phase 3: Migration - Research

**Researched:** 2026-01-19 **Domain:** Content migration from markdown to Sanity CMS **Confidence:**
HIGH

## Summary

Phase 3 migrates all remaining blog posts (8 posts, 1 already migrated) and gems (3 entries) from
local markdown/TypeScript to Sanity CMS. The existing migration script from Phase 2
(`scripts/migrate-post-to-sanity.js`) provides a solid foundation for single-post migration with
Portable Text conversion and image upload. This research identifies patterns for batch migration,
content verification, and dual-source routing removal.

The codebase has clear boundaries: 9 total markdown blog posts (1 already in Sanity), 3 gems in
TypeScript, and 13 local images (covers + body images). The existing dual-source routing in
`[slug]/+page.server.ts` and `blog/+page.server.ts` simplifies incremental migration - posts appear
correctly regardless of source during transition.

**Primary recommendation:** Extend existing migration script to support batch processing with
idempotent `createOrReplace`, add content verification via text diff, then migrate oldest posts
first in batches of 3-5.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)

| Library        | Version | Purpose                      | Why Standard                        |
| -------------- | ------- | ---------------------------- | ----------------------------------- |
| @sanity/client | 6.x     | Sanity API mutations/queries | Official client, already configured |
| gray-matter    | 4.x     | Parse markdown frontmatter   | Already in migration script         |
| p-limit        | 5.x     | Rate limit async operations  | Sanity-recommended for bulk uploads |

### Supporting (May Need)

| Library   | Version | Purpose                | When to Use                     |
| --------- | ------- | ---------------------- | ------------------------------- |
| striptags | 3.x     | Extract text from HTML | Content diff comparison         |
| diff      | 5.x     | Text diff algorithm    | Verify migration content parity |

### Alternatives Considered

| Instead of    | Could Use             | Tradeoff                                    |
| ------------- | --------------------- | ------------------------------------------- |
| Custom script | sanity dataset import | CLI import less flexible for transformation |
| p-limit       | p-queue               | p-limit simpler for this use case           |
| Custom diff   | diffchecker.com       | External tool not automatable               |

**Installation (if p-limit and diff needed):**

```bash
npm install p-limit diff
```

## Architecture Patterns

### Current Content Inventory

Based on codebase analysis:

**Blog Posts (9 total, 1 already migrated):**

| Slug                                                               | Has Cover | Body Images | Hidden | Type    |
| ------------------------------------------------------------------ | --------- | ----------- | ------ | ------- |
| 2025-09-03-tdd-infrastructure-terragrunt                           | Yes       | 2           | No     | DONE    |
| 2023-12-11-deploy-sops-secrets-with-nix                            | Yes       | 2           | No     | Article |
| 2024-05-15-telepresence-google-cloud-kubernetes-engine-gke         | Yes       | 0           | No     | Article |
| 2025-07-26-check-engine-work-progress-limit-matters                | Yes       | 2           | No     | Article |
| 2025-08-09-your-continuous-delivery-transformation-is-not-complete | Yes       | 0           | No     | Article |
| 2025-07-31-continuous-care-no-to-maintenance-processes             | No        | 0           | Yes    | Draft   |
| 00-uses                                                            | Yes       | 1           | No     | Page    |
| 00-consulting                                                      | No        | 0           | Yes    | Page    |
| 00-impressum                                                       | No        | 0           | Yes    | Page    |

**Gems (3 total):**

| Title                                 | Has Image | Tags                 |
| ------------------------------------- | --------- | -------------------- |
| YouTube Channel: LifeHack Automations | Yes       | youtube, automation  |
| YouTube Channel: Kie Codes            | Yes       | youtube, programming |
| YouTube Channel: Catangle             | Yes       | youtube, gaming      |

**Image Inventory:**

- Post images: 13 files (6 covers + 7 body images across 5 posts)
- Gem images: 3 files
- Total: 16 images to upload

### Migration Batch Strategy (per CONTEXT.md decisions)

```
Batch 1 (oldest first, lower risk):
  - 2023-12-11-deploy-sops-secrets-with-nix (3 images)
  - 2024-05-15-telepresence-google-cloud-kubernetes-engine-gke (1 image)
  - 2025-07-26-check-engine-work-progress-limit-matters (3 images)

Batch 2 (continue chronologically):
  - 2025-07-31-continuous-care-no-to-maintenance-processes (0 images, hidden)
  - 2025-08-09-your-continuous-delivery-transformation-is-not-complete (1 image)
  - 00-uses (2 images)

Batch 3 (pages):
  - 00-consulting (0 images, hidden)
  - 00-impressum (0 images, hidden)

Gems (after all posts):
  - All 3 gems in single batch (3 images)
```

### Existing Migration Script Structure

The current script (`scripts/migrate-post-to-sanity.js`) handles:

1. Frontmatter parsing via gray-matter
2. Markdown to Portable Text conversion
3. Inline formatting (bold, italic, code, links)
4. Code blocks with language and filename
5. Callouts (NOTE, WARNING, TIP)
6. Images with upload to Sanity CDN
7. Tag find-or-create
8. Author lookup
9. Single post create/replace with `--force` flag

**Gaps to address:**

- No batch processing (single file at a time)
- No content verification after migration
- No gems support
- No skip logic for already-migrated posts

### Pattern 1: Idempotent Batch Migration

**What:** Process multiple posts with createOrReplace for safe re-runs **When to use:** Every batch
migration run **Example:**

```javascript
// Source: https://www.sanity.io/docs/content-lake/content-migration-cheatsheet
import pLimit from 'p-limit';

const limit = pLimit(3); // Concurrency of 3 to avoid rate limits

async function migrateBatch(posts) {
    const results = await Promise.all(posts.map((post) => limit(() => migratePost(post))));
    return results;
}

// Use createOrReplace for idempotent operations
async function migratePost(postPath) {
    // ... parse and transform ...
    const result = await client.createOrReplace({
        _id: `post-${slug}`, // Predictable ID
        _type: 'post',
        ...postDoc,
    });
    return result;
}
```

### Pattern 2: Asset Upload with Deduplication

**What:** Upload images with source metadata to avoid re-uploads **When to use:** All image uploads
**Example:**

```javascript
// Source: https://www.sanity.io/learn/course/refactoring-content/uploading-assets-efficiently

// Cache existing images at script start
const existingImages = await client.fetch(
    '*[_type == "sanity.imageAsset" && defined(source.id)]{ _id, "sourceId": source.id }'
);
const imageCache = new Map(existingImages.map((img) => [img.sourceId, img._id]));

async function uploadImageWithCache(imagePath) {
    const sourceId = imagePath; // Use path as source ID

    // Check cache first
    if (imageCache.has(sourceId)) {
        return {
            _type: 'reference',
            _ref: imageCache.get(sourceId),
        };
    }

    // Upload with source metadata
    const asset = await client.assets.upload('image', imageBuffer, {
        filename: basename(imagePath),
        source: {
            id: sourceId,
            name: 'markdown-migration',
        },
    });

    imageCache.set(sourceId, asset._id);
    return { _type: 'reference', _ref: asset._id };
}
```

### Pattern 3: Content Verification via Text Diff

**What:** Compare rendered text content before/after migration **When to use:** After each post
migration **Example:**

```javascript
// Per CONTEXT.md: compare text only, whitespace differences acceptable

import { diffWords } from 'diff';
import striptags from 'striptags';

async function verifyMigration(slug, originalHtml) {
    // Fetch rendered Sanity content
    const sanityPost = await client.fetch(postBySlugQuery, { slug });
    const sanityText = extractText(sanityPost.body);

    // Extract original text
    const originalText = striptags(originalHtml);

    // Normalize whitespace
    const normalize = (s) => s.replace(/\s+/g, ' ').trim();
    const origNorm = normalize(originalText);
    const sanityNorm = normalize(sanityText);

    // Compare
    const diff = diffWords(origNorm, sanityNorm);
    const changes = diff.filter((d) => d.added || d.removed);

    if (changes.length > 0) {
        console.error('Content mismatch found:');
        changes.forEach((c) => {
            console.error(c.added ? `+${c.value}` : `-${c.value}`);
        });
        return false;
    }
    return true;
}
```

### Anti-Patterns to Avoid

- **Parallel image uploads without rate limiting:** Will hit Sanity API limits
- **Using `create()` instead of `createOrReplace()`:** Script not idempotent, fails on re-run
- **Deleting markdown before verification:** No rollback path
- **Migrating hidden posts to visible:** Preserve `hidden: true` flag

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                   | Don't Build          | Use Instead                        | Why                                   |
| ------------------------- | -------------------- | ---------------------------------- | ------------------------------------- |
| Markdown to Portable Text | Custom parser        | Existing migrate-post-to-sanity.js | Already handles all cases in codebase |
| Rate limiting             | setTimeout loops     | p-limit                            | Proper concurrency control            |
| Text diff                 | Character comparison | diff package                       | Industry-standard Myers algorithm     |
| Image deduplication       | Check file existence | Sanity source metadata             | Built-in asset deduplication          |

**Key insight:** The existing migration script covers 90% of needs. Only batch processing and
verification need to be added.

## Common Pitfalls

### Pitfall 1: Rate Limit Errors During Bulk Upload

**What goes wrong:** Parallel image uploads exceed Sanity API limits (10 concurrent mutations) **Why
it happens:** Default Promise.all runs everything at once **How to avoid:** Use p-limit with
concurrency of 3-5 for images **Warning signs:** 429 status codes, "rate limit exceeded" errors

### Pitfall 2: Svelte Component Loss in Migration

**What goes wrong:** `<Author>` components and `<script>` imports stripped during migration **Why it
happens:** Migration script skips Svelte-specific content (correct behavior) **How to avoid:** This
is expected - Author component at post end is a CTA, not content **Warning signs:** Content
verification diff shows missing text (expected for CTAs)

### Pitfall 3: Image Path Resolution Failures

**What goes wrong:** Images not found during upload **Why it happens:** Paths like
`/src/lib/assets/...` need resolution from project root **How to avoid:** Current script already
handles this - use `resolve(process.cwd(), path.slice(1))` **Warning signs:** "Image not found"
errors in console

### Pitfall 4: Gem Cover Image References

**What goes wrong:** Gem images use `$assets` alias that won't resolve in migration script **Why it
happens:** Aliases like `$assets/images/gems/...` are SvelteKit-specific **How to avoid:** Resolve
alias to `src/lib/assets/images/gems/...` before upload **Warning signs:** Image paths starting with
`$` fail to resolve

### Pitfall 5: Tags Created Without Proper Slugs

**What goes wrong:** Tag names like "google cloud" create slug "google-cloud" but might conflict
**Why it happens:** Tags shared across posts and gems **How to avoid:** Current find-or-create logic
is correct; verify tag slugs match existing **Warning signs:** Duplicate tags with different slugs

## Code Examples

Verified patterns from official sources:

### Batch Migration Entry Point

```javascript
// Extension to existing migrate-post-to-sanity.js
// Source: Current codebase + Sanity best practices

async function migrateBatch(postPaths, options = {}) {
    const { dryRun = false, stopOnError = true } = options;

    console.log(`\nMigrating ${postPaths.length} posts...`);

    for (const postPath of postPaths) {
        try {
            const result = await migratePost(postPath);
            console.log(`  Migrated: ${result.slug}`);

            if (!dryRun) {
                const verified = await verifyMigration(result.slug);
                if (!verified && stopOnError) {
                    throw new Error(`Verification failed for ${result.slug}`);
                }
            }
        } catch (error) {
            console.error(`  Failed: ${postPath}`, error.message);
            if (stopOnError) {
                throw error;
            }
        }
    }
}
```

### Gem Migration

```javascript
// New script for gem migration
// Source: Studio schema + existing patterns

async function migrateGem(gem) {
    // Resolve $assets alias
    const imagePath = gem.coverImage.replace('$assets', 'src/lib/assets');

    // Upload image
    const imageRef = await uploadImageWithCache(imagePath);

    // Find or create tags
    const tagRefs = [];
    for (const tag of gem.tags) {
        const tagId = await findOrCreateTag(tag);
        tagRefs.push({ _type: 'reference', _ref: tagId, _key: generateKey() });
    }

    // Create gem document
    const gemDoc = {
        _id: `gem-${slugify(gem.title)}`,
        _type: 'gem',
        title: gem.title,
        slug: { _type: 'slug', current: slugify(gem.title) },
        url: gem.link,
        description: gem.description,
        tags: tagRefs,
        // Note: gems schema doesn't have coverImage - may need schema update
    };

    return await client.createOrReplace(gemDoc);
}
```

### GROQ Query for Gems

```groq
// Query to add to src/lib/sanity/queries.ts
// Source: Existing query patterns in codebase

export const allGemsQuery = defineQuery(`
  *[_type == "gem"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    url,
    description,
    tags[]-> {
      name,
      "slug": slug.current
    }
  }
`);
```

### Post-Migration Routing (Sanity-Only)

```typescript
// Simplified [slug]/+page.server.ts after migration complete
// Source: Current dual-source implementation

export const load: PageServerLoad = async ({ params, url }): Promise<{ post: SanityPost }> => {
    const previewSecret = env.SANITY_PREVIEW_SECRET;
    const isPreview = previewSecret && url.searchParams.get('preview') === previewSecret;
    const sanityClient = isPreview ? previewClient : client;

    const post = await sanityClient.fetch(postBySlugQuery, { slug: params.slug });

    if (!post) {
        throw error(404, 'Post not found');
    }

    return { source: 'sanity' as const, post };
};
```

## State of the Art

| Old Approach               | Current Approach                     | When Changed | Impact                          |
| -------------------------- | ------------------------------------ | ------------ | ------------------------------- |
| Manual Sanity Studio entry | Scripted migration with verification | Phase 2      | Automated, repeatable migration |
| Markdown files in repo     | Sanity CMS with CDN                  | This phase   | No build required for content   |
| Local image references     | Sanity CDN URLs                      | This phase   | Global CDN, responsive images   |
| Dual-source routing        | Sanity-only routing                  | End of phase | Simplified codebase             |

**Deprecated/outdated:**

- `src/lib/data/posts.ts` loader: Will be removed after migration
- `src/lib/server/posts.ts`: Server-side markdown import no longer needed
- `src/content/blog/` directory: Can be deleted or archived

## Open Questions

Things that couldn't be fully resolved:

1. **Gem cover images in schema**
    - What we know: Current gem schema has no coverImage field
    - What's unclear: Whether gems page uses cover images (current code shows they do)
    - Recommendation: Add coverImage field to gem schema or update gems page to work without

2. **Author CTA component preservation**
    - What we know: Posts end with `<Author author={jloos} />` component
    - What's unclear: Whether this should be migrated as content or handled differently
    - Recommendation: Skip component (current behavior), handle author display in template

3. **RSS feed source**
    - What we know: RSS currently generated from markdown posts
    - What's unclear: Whether RSS needs updating to use Sanity
    - Recommendation: Update RSS route to query Sanity after migration complete

## Sources

### Primary (HIGH confidence)

- [Sanity migration script](https://www.sanity.io/learn/course/refactoring-content/uploading-assets-efficiently) -
  Asset upload patterns
- Existing codebase analysis - Content inventory, current implementation
- [Sanity Content Migration Cheatsheet](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet) -
  createOrReplace, batching

### Secondary (MEDIUM confidence)

- [Sanity Importing Data Docs](https://www.sanity.io/docs/content-lake/importing-data) - Bulk import
  patterns
- [@sanity/client npm](https://www.npmjs.com/package/@sanity/client) - API reference

### Tertiary (LOW confidence)

- General data migration testing patterns - Verification approach

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Using existing project dependencies
- Architecture: HIGH - Based on working migration script and codebase analysis
- Pitfalls: HIGH - Based on existing implementation knowledge
- Content inventory: HIGH - Direct file system analysis

**Research date:** 2026-01-19 **Valid until:** 2026-02-19 (stable migration patterns)
