# Pitfalls Research: Sanity.io + SvelteKit Migration

**Domain:** Headless CMS migration (Markdown to Sanity.io) **Project:** maxdaten.io blog
**Researched:** 2026-01-18 **Confidence:** HIGH (verified with official Sanity documentation and
community sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, data loss, or major architectural issues.

### CP-1: Svelte 5 Compatibility with Sanity Packages

**What goes wrong:** After migrating to Svelte 5, `@sanity/svelte-loader` and
`@sanity/visual-editing` packages may fail to work. The `previewStore.js` in `@sanity/svelte-loader`
references `@sanity/visual-editing`, creating a dependency chain that breaks.

**Why it happens:** Sanity's SvelteKit packages historically lagged behind Svelte major versions. As
of late 2025, Svelte 5 support was added but may still have edge cases.

**Warning signs:**

- Build errors mentioning "Could not resolve 'react-dom'" after installing Sanity packages
- `--legacy-peer-deps` required during npm install
- Visual editing overlay not appearing

**Consequences:**

- Cannot use preview mode / visual editing
- May need to downgrade Svelte or wait for package updates
- Live editing features unavailable

**Prevention:**

1. Verify `@sanity/svelte-loader` version 2.0.9+ before starting
2. Check [GitHub issue #2242](https://github.com/sanity-io/visual-editing/issues/2242) for current
   status
3. Test visual editing setup on a branch before committing to migration
4. Have fallback plan: basic data fetching works without `@sanity/svelte-loader`

**Detection:** Test visual editing early in Phase 1 before building dependent features.

**Phase mapping:** Address in Phase 1 (Schema & Studio Setup) - validate tooling compatibility
first.

---

### CP-2: Image Asset Reference Loss During Import

**What goes wrong:** Images in markdown files get uploaded to Sanity, but the references in Portable
Text documents fail to connect. URLs contain `undefined/undefined` or images simply don't render.

**Why it happens:** Image assets in Sanity are uploaded separately and referenced by a generated
`_id`. Unlike content-to-content references where you can control the ID, asset IDs are determined
by Sanity based on the file hash. You must capture the returned asset document ID after upload and
use it in your content references.

**Warning signs:**

- Image URLs like `https://cdn.sanity.io/images/undefined/undefined/...`
- Images showing in Sanity Studio media library but not rendering on frontend
- Migration script doesn't wait for asset upload promises to resolve

**Consequences:**

- Blog posts missing all inline images
- Need to re-migrate all content with proper reference handling
- Broken visual content for readers

**Prevention:**

1. Upload all assets FIRST and maintain a mapping: `originalPath -> sanityAssetId`
2. Use `client.assets.upload()` and await the response to get the `_id`
3. Process content SECOND, looking up asset IDs from the mapping
4. Sanity assigns deterministic IDs based on file content - uploading same file twice returns same
   ID

**Example migration flow:**

```javascript
// Step 1: Upload asset and capture ID
const asset = await client.assets.upload('image', readStream, {
  filename: 'my-image.png'
});
assetMap.set('/src/lib/assets/images/posts/my-image.png', asset._id);

// Step 2: Reference in Portable Text
{
  _type: 'image',
  asset: {
    _type: 'reference',
    _ref: assetMap.get('/src/lib/assets/images/posts/my-image.png')
  }
}
```

**Phase mapping:** Address in Phase 2 (Content Migration) - asset migration must complete before
content migration.

---

### CP-3: Slug Uniqueness Scope Misunderstanding

**What goes wrong:** Slugs that were unique in the markdown system collide in Sanity, or slugs are
unique within type but you needed global uniqueness for URL routing.

**Why it happens:** By default, Sanity's slug field validates uniqueness only within the same
document type. A blog post and a "gem" could share the same slug - both valid in Sanity, but
breaking your frontend routing.

**Warning signs:**

- Migration imports both documents successfully (no error)
- Frontend route `/[slug]` returns wrong content type
- 404 errors for content that exists

**Consequences:**

- URL collision breaks site navigation
- Incorrect content served to users
- SEO damage if Google indexes wrong content

**Prevention:**

1. Define custom `isUnique` function checking across ALL document types
2. Add document type prefix to slugs if types share URL space
3. Verify current slug patterns before migration - check for conflicts

**Custom isUnique implementation:**

```javascript
// In slug field options
{
  name: 'slug',
  type: 'slug',
  options: {
    source: 'title',
    isUnique: async (slug, context) => {
      const { document, getClient } = context;
      const client = getClient({ apiVersion: '2024-01-01' });
      const id = document._id.replace(/^drafts\./, '');
      const query = `!defined(*[!(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
      return client.fetch(query, {
        slug,
        draft: `drafts.${id}`,
        published: id
      });
    }
  }
}
```

**Phase mapping:** Address in Phase 1 (Schema Design) - define slug validation before any content
import.

---

### CP-4: Portable Text Code Block Data Loss

**What goes wrong:** Code blocks in markdown lose their language annotation, syntax highlighting
metadata, or filename indicators during conversion to Portable Text.

**Why it happens:** Standard markdown-to-HTML-to-Portable Text conversion doesn't automatically map
fenced code block metadata. Your current posts use Shiki with custom transformers (`filename=`,
`showLineNumbers`). These are not standard markdown and need explicit handling.

**Warning signs:**

- Code blocks render as plain `<pre><code>` without highlighting
- Filename annotations (`filename=root.hcl`) lost
- All code blocks show as "text" or no language

**Consequences:**

- Degraded reading experience for technical blog
- Loss of valuable context (filenames, line numbers)
- May need to re-edit all code blocks manually in Sanity Studio

**Prevention:**

1. Use `@sanity/code-input` plugin for code blocks in schema
2. Parse markdown code fences BEFORE HTML conversion to extract metadata:
    - Language identifier
    - Filename (from `filename=` annotation)
    - Line numbers flag
3. Create Portable Text code block with all metadata fields
4. Test with your most complex code-heavy post first

**Current content analysis:** Your blog posts use:

- Multiple languages: `hcl`, `bash`, `terraform`
- Custom annotations: `filename=root.hcl showLineNumbers`
- These MUST be preserved in migration

**Phase mapping:** Address in Phase 1 (Schema) for code-input plugin setup, Phase 2 (Migration) for
extraction logic.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require non-trivial fixes.

### MP-1: Non-Idempotent Migration Scripts

**What goes wrong:** Running migration script twice creates duplicate documents, corrupts existing
data, or fails unpredictably.

**Why it happens:** Using `create` instead of `createOrReplace`, or using `insert()` without
preconditions, or not tracking which documents have been migrated.

**Warning signs:**

- Second run of migration throws "document exists" errors
- Duplicate blog posts appearing in Studio
- Migration works on fresh dataset but fails on partial dataset

**Prevention:**

1. Use `createOrReplace` for document creation (allows re-running)
2. Use deterministic document IDs derived from source data (e.g., existing slug)
3. Add idempotency markers: `_migrations: ['initial-import-2026-01']`
4. Always test migration on copy of production data

**Example pattern:**

```javascript
// Deterministic ID from slug
const documentId = `blogPost-${post.slug}`;

await client.createOrReplace({
    _id: documentId,
    _type: 'blogPost',
    // ... fields
    _migrations: ['markdown-import-2026-01'],
});
```

**Phase mapping:** Address in Phase 2 (Migration Scripts) - design for re-runnability from start.

---

### MP-2: GROQ Query Performance Anti-Patterns

**What goes wrong:** Frontend becomes slow as content grows because queries weren't designed for
performance.

**Why it happens:** Common anti-patterns:

- Using projection before filter (can't optimize)
- Resolving asset references unnecessarily (bloats response)
- Making multiple queries instead of one (latency multiplication)
- Using offset-based pagination (`[100...200]`) instead of cursor-based

**Warning signs:**

- Page load times increase as blog post count grows
- API responses contain large amounts of unused data
- Multiple network requests for single page

**Prevention:**

1. Filter first, project second in GROQ queries
2. Don't resolve full asset documents - use deterministic URL construction
3. Batch related queries into single GROQ query with projections
4. Use cursor pagination: `*[_id > $lastId] | order(_id) [0...20]`

**Example - Asset URL without reference resolution:**

```javascript
// BAD: Resolves entire asset document
*[_type == "blogPost"]{ ..., "imageUrl": coverImage.asset->url }

// GOOD: Construct URL from ID (deterministic)
*[_type == "blogPost"]{ ..., "imageRef": coverImage.asset._ref }
// Then construct: https://cdn.sanity.io/images/{projectId}/{dataset}/{ref}
```

**Phase mapping:** Address in Phase 3 (SvelteKit Integration) - design queries correctly from start.

---

### MP-3: Draft/Published Content Confusion

**What goes wrong:** Site shows draft content to users, or preview mode shows published content
instead of drafts.

**Why it happens:** Sanity stores drafts with `drafts.` prefix on document ID. Queries without
proper filtering return both, or the wrong one.

**Warning signs:**

- Unpublished content appearing on production site
- Preview mode not showing recent edits
- "Published" button in Studio doesn't seem to affect frontend

**Prevention:**

1. Production queries: explicitly filter `!(_id in path("drafts.**"))`
2. Preview queries: use perspective parameter or filter for drafts
3. Use `@sanity/svelte-loader` which handles this automatically
4. Test both modes before launch

**Query patterns:**

```groq
// Production - published only
*[_type == "blogPost" && !(_id in path("drafts.**"))]

// Preview - prefer draft, fallback to published
// Use @sanity/client with perspective: 'previewDrafts'
```

**Phase mapping:** Address in Phase 3 (SvelteKit Integration) - configure preview mode correctly.

---

### MP-4: Schema Changes Breaking Existing Content

**What goes wrong:** Schema change in Studio causes existing content to show validation errors or
break frontend rendering.

**Why it happens:** Sanity schema changes DON'T automatically migrate existing content. If you
rename a field, add a required field, or change a field type, existing documents become invalid.

**Warning signs:**

- Red validation errors appearing in Studio after schema update
- Frontend crashes on certain documents
- "Unknown type" warnings in console

**Prevention:**

1. Use `deprecated` property (Sanity 3.26+) instead of removing fields immediately
2. Add new required fields with `initialValue` to provide default
3. Write content migration before deploying schema change
4. Use `sanity documents validate` to check content against schema
5. Deploy frontend changes supporting both old and new schema temporarily

**Deprecation pattern:**

```javascript
{
  name: 'oldField',
  type: 'string',
  deprecated: {
    reason: 'Use newField instead. Will be removed 2026-03-01.'
  }
}
```

**Phase mapping:** Ongoing concern - establish pattern in Phase 1, enforce throughout.

---

### MP-5: Webhook/Build Timing Issues

**What goes wrong:** Content is published in Sanity but doesn't appear on the live site, requiring
manual rebuild or multiple saves.

**Why it happens:** Sanity webhook fires immediately on publish, but CDN cache hasn't updated yet.
Static build queries the CDN and gets stale content.

**Warning signs:**

- Content appears in Studio but not on live site
- Manual deploy fixes it
- "Save twice" workaround discovered by editors

**Prevention:**

1. Add 2-5 second delay in webhook handler before triggering rebuild
2. Use Sanity's Live Content API instead of webhook + rebuild pattern
3. For ISR: configure `x-prerender-revalidate` header properly
4. Consider hybrid: static pages + client-side refresh for latest

**Vercel ISR pattern for SvelteKit:**

```javascript
// +page.server.js
export const config = {
    isr: {
        expiration: 60, // revalidate every 60s
    },
};
```

**Phase mapping:** Address in Phase 4 (Deployment) - test content publishing flow.

---

## Minor Pitfalls

Mistakes that cause annoyance but are recoverable.

### mP-1: Frontmatter Field Mapping Inconsistencies

**What goes wrong:** Some frontmatter fields don't map cleanly to Sanity schema, causing data loss
or requiring manual cleanup.

**Why it happens:** Markdown frontmatter is flexible (any YAML), Sanity schema is strict (defined
types). Fields like `tags` (array) vs `keywords` (also array) vs `authorId` (reference) need
different handling.

**Current frontmatter fields to map:**

- `title` -> string (direct)
- `slug` -> slug (direct)
- `excerpt` -> text (direct)
- `date` -> datetime (parse ISO string)
- `updated` -> datetime (nullable, parse ISO string)
- `authorId` -> reference (requires author document lookup)
- `hidden` -> boolean (direct)
- `tags` -> array of strings or references to tag documents
- `keywords` -> array of strings (SEO metadata)
- `coverImage` -> image reference (needs asset upload)

**Prevention:**

1. Map ALL frontmatter fields before writing migration script
2. Decide: tags as strings vs tag documents (affects future features)
3. Handle null/missing fields gracefully
4. Create author documents before blog post migration

**Phase mapping:** Address in Phase 1 (Schema) - define schema to match all existing fields.

---

### mP-2: Svelte Component Embeds in Markdown

**What goes wrong:** MDsveX allows Svelte components in markdown. These won't transfer to Sanity's
Portable Text.

**Warning signs (from your codebase):**

```markdown
<script>
    import { authors } from '$lib/data/authors';
    import Author from '$lib/components/molecules/Author.svelte';
</script>
```

**Consequences:**

- Component imports don't work in Portable Text
- Need custom block types to replicate functionality
- Some posts may need restructuring

**Prevention:**

1. Audit all posts for Svelte component usage
2. Create equivalent Sanity custom block types
3. Convert component embeds to custom blocks during migration
4. Consider if component functionality is needed (e.g., Author block)

**Your specific case:** The `Author` component embed can become a reference to an author document
that the frontend renders.

**Phase mapping:** Address in Phase 1 (Schema) for custom block types, Phase 2 (Migration) for
conversion.

---

### mP-3: Alt Text and Image Metadata Loss

**What goes wrong:** Images in markdown may have alt text that gets lost during migration, or
Sanity's asset metadata (hotspot, crop) isn't utilized.

**Why it happens:** Markdown images: `![alt text](path.png)` - the alt text needs explicit
extraction. Sanity stores alt text per-use, not on the asset itself.

**Prevention:**

1. Extract alt text during markdown parsing
2. Store in image block's `alt` field, not relying on asset metadata
3. Set up schema to require alt text for accessibility
4. Plan for hotspot/crop to be set post-migration in Studio

**Phase mapping:** Address in Phase 2 (Migration) - extract all image metadata.

---

### mP-4: Gems Content Type Structure

**What goes wrong:** Gems (curated links) are currently TypeScript objects, not markdown. Different
migration path needed.

**Current structure (from `src/lib/data/gems/index.ts`):**

```typescript
{
  title: 'YouTube Channel: LifeHack Automations',
  description: '...',
  tags: ['youtube', 'automation'],
  link: 'https://youtube.com/@LifeHackAutomations-dp9kb',
  coverImage: '$assets/images/gems/lifehack-automations01.png',
}
```

**Prevention:**

1. Create separate `gem` schema type in Sanity
2. Migration script reads from TypeScript/JSON, not markdown
3. Handle `$assets` path resolution for cover images
4. Maintain same URL structure: `/gems`

**Phase mapping:** Phase 1 (Schema) - create gem type, Phase 2 (Migration) - separate migration
script.

---

## SEO/URL Preservation Pitfalls

Critical for maintaining search rankings during migration.

### SEO-1: Slug Format Changes

**What goes wrong:** Slugs get reformatted during migration (lowercase, special char removal),
breaking all existing URLs.

**Your current slugs (must preserve EXACTLY):**

- `2025-09-03-tdd-infrastructure-terragrunt`
- `00-consulting`
- `00-uses`

**Prevention:**

1. Use existing slug as-is, no auto-generation
2. Disable slugify transformation in schema: `slugify: (input) => input`
3. Validate post-migration that all slugs match exactly
4. Add redirect map for any unavoidable changes

**Schema configuration:**

```javascript
{
  name: 'slug',
  type: 'slug',
  options: {
    source: 'title',
    slugify: (input) => input, // NO transformation
    isUnique: customIsUnique
  }
}
```

**Phase mapping:** Address in Phase 1 (Schema) - configure slug field, Phase 2 (Migration) - verify.

---

### SEO-2: Missing or Changed Meta Tags

**What goes wrong:** SEO metadata (title, description, keywords, open graph) changes or disappears
after migration.

**Prevention:**

1. Map all SEO-relevant frontmatter fields to Sanity schema
2. Verify meta tag generation in SvelteKit uses Sanity data correctly
3. Test with social media preview tools before launch
4. Keep old site running temporarily for comparison

**Fields to preserve:**

- `title` -> og:title, twitter:title
- `excerpt` -> og:description, meta description
- `coverImage` -> og:image
- `keywords` -> meta keywords
- `date` -> article:published_time

**Phase mapping:** Address in Phase 3 (SvelteKit Integration) - verify meta tag generation.

---

### SEO-3: RSS Feed Breakage

**What goes wrong:** RSS feed at `/rss.xml` returns errors or different content structure, breaking
subscriber feeds.

**Prevention:**

1. Generate RSS from Sanity data, not markdown
2. Keep feed URL identical: `/rss.xml`
3. Verify feed validates after migration
4. Maintain same item structure (title, link, description, pubDate)

**Phase mapping:** Address in Phase 3 (SvelteKit Integration) - update RSS route.

---

### SEO-4: Image URL Changes Breaking Backlinks

**What goes wrong:** Images currently in git (`/src/lib/assets/images/...`) move to Sanity CDN,
breaking any external links to images.

**Prevention:**

1. If images are hotlinked externally, set up redirects
2. Sanity CDN URLs are different domain: `cdn.sanity.io`
3. Consider keeping static images for og:image if URLs are widely shared
4. Document URL change for any known external references

**Phase mapping:** Address in Phase 4 (Deployment) - set up any needed redirects.

---

## Phase-Specific Warnings Summary

| Phase                 | Likely Pitfall                                                     | Mitigation                                                          |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Phase 1: Schema Setup | CP-1 (Svelte 5 compat), CP-3 (slug uniqueness), CP-4 (code blocks) | Test packages first, define custom isUnique, add @sanity/code-input |
| Phase 2: Migration    | CP-2 (image refs), MP-1 (idempotency), mP-1 (frontmatter mapping)  | Asset-first migration, use createOrReplace, map all fields          |
| Phase 3: Integration  | MP-2 (GROQ perf), MP-3 (draft/publish), SEO-2 (meta tags)          | Design queries carefully, test preview mode, verify SEO             |
| Phase 4: Deployment   | MP-5 (webhook timing), SEO-4 (image URLs)                          | Add webhook delay, set up redirects                                 |

---

## Prevention Checklist

Before starting each phase, verify:

### Pre-Phase 1:

- [ ] Sanity packages compatible with Svelte 5 (check latest versions)
- [ ] All frontmatter fields mapped to schema design
- [ ] Slug uniqueness requirements understood
- [ ] Code block metadata extraction planned

### Pre-Phase 2:

- [ ] Asset upload script tested separately
- [ ] Migration script uses `createOrReplace`
- [ ] Deterministic document IDs defined
- [ ] Svelte component embeds audited

### Pre-Phase 3:

- [ ] GROQ queries reviewed for performance
- [ ] Preview mode tested end-to-end
- [ ] Meta tags verified with Sanity data
- [ ] RSS feed updated and validated

### Pre-Phase 4:

- [ ] Webhook timing tested
- [ ] Redirect map created (if any URL changes)
- [ ] CDN caching understood
- [ ] Rollback plan documented

---

## Sources

**Official Sanity Documentation:**

- [Schema and Content Migrations](https://www.sanity.io/docs/content-lake/schema-and-content-migrations)
- [Important Considerations for Migrations](https://www.sanity.io/docs/content-lake/important-considerations-for-schema-and-content-migrations)
- [High Performance GROQ](https://www.sanity.io/docs/developer-guides/high-performance-groq)
- [Visual Editing with SvelteKit](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit)
- [Slug Type](https://www.sanity.io/docs/studio/slug-type)
- [Presenting Images](https://www.sanity.io/docs/apis-and-sdks/presenting-images)
- [Asset CDN](https://www.sanity.io/docs/asset-cdn)

**Community Resources:**

- [Importing Data Into Sanity: Gotchas](https://createtoday.io/posts/sanity-import-data)
- [Svelte 5 Compatibility Issue #2075](https://github.com/sanity-io/visual-editing/issues/2075)
- [Programmatic Markdown Import to Sanity](https://www.buildwithmatija.com/blog/programmatic-markdown-import-sanity)
- [On-Demand Revalidation with SvelteKit and Sanity](https://www.megamashmedia.com/blog/how-to-setup-on-demand-revalidation-with-sveltekit-sanity-and-vercel)
- [Sanity SvelteKit Live Preview Guide](https://chrisjayden.com/articles/sveltekit-sanity-content-preview)

**GitHub Repositories:**

- [sanity-io/visual-editing](https://github.com/sanity-io/visual-editing)
- [kmelve/markdown-to-sanity](https://github.com/kmelve/markdown-to-sanity)
- [flayks/sanity-plugin-webhooks-trigger](https://github.com/flayks/sanity-plugin-webhooks-trigger)
