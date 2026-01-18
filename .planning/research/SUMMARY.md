# Project Research Summary

**Project:** maxdaten.io Sanity.io Migration **Domain:** Headless CMS migration (Markdown to
Sanity.io) **Researched:** 2026-01-18 **Confidence:** HIGH

## Executive Summary

Sanity.io is a mature, well-documented choice for migrating maxdaten.io from git-managed markdown to
a headless CMS. The official `@sanity/sveltekit` package (v1.0.4+) provides first-party Svelte 5
support with all necessary exports (client, GROQ, Visual Editing) in a single package. The
recommended architecture embeds Sanity Studio as a SvelteKit route at `/studio`, preserving the
existing static generation workflow with Vercel while moving content management to Sanity's hosted
Content Lake.

The migration is straightforward for a personal blog. All required features (drafts, image handling,
tags, slug preservation) are table stakes in Sanity. Scheduled publishing requires the Growth plan
($15/month) but is not blocking for launch. The primary complexity lies in the content migration
itself: preserving code block metadata (language, filename annotations), handling image asset
references correctly, and ensuring URL slugs remain unchanged for SEO continuity.

The critical risks are: (1) image asset references getting lost during migration if assets are not
uploaded before content, (2) code block metadata (language, filename) being dropped during
markdown-to-Portable-Text conversion, and (3) slug uniqueness validation not being configured across
document types. All three are preventable with proper migration script design and schema
configuration upfront.

## Key Findings

### Recommended Stack

Sanity's official SvelteKit integration provides everything needed. No need to assemble individual
libraries.

**Core technologies:**

- **@sanity/sveltekit** (^1.0.4): All-in-one package with client, GROQ, Visual Editing components
- **sanity** (^5.4.0): Sanity Studio for content editing (React-based, embeds in SvelteKit)
- **@portabletext/svelte** (^3.0.0): Render rich text as Svelte components (requires Svelte 5)
- **@sanity/image-url** (^2.0.2): Generate optimized CDN image URLs with hotspot/crop support
- **@sanity/code-input**: Studio plugin for code blocks with language selection

**Anti-recommendations:** Do not install `@sanity/client` separately (already in sveltekit package),
do not use GraphQL (GROQ is more powerful), avoid `@sanity/svelte-loader` (older approach).

### Expected Features

**Must have (table stakes):**

- Content modeling with schema-as-code (blog posts, gems, author)
- Draft/publish workflow with perspectives API
- Image asset management with CDN delivery
- Portable Text for rich content body
- Slug field with uniqueness validation
- Tags as array of strings
- Hidden boolean for filtering unpublished posts

**Should have (competitive):**

- Scheduled Drafts for "write now, publish later" workflow (Growth plan required)
- Custom code block type with language/filename metadata
- Image hotspot and crop for responsive images
- Basic validation rules (character limits, required fields)

**Defer (v2+):**

- Live Preview / Visual Editing (high complexity, single author can use standard preview)
- SEO object schema (can start with existing keyword/excerpt approach)
- Document Actions customization (polish, not core workflow)
- AI Assist, Taxonomy Manager, Content Releases (enterprise/team features)

### Architecture Approach

The target architecture maintains SvelteKit's static generation while replacing the data source.
Sanity Studio embeds at `/studio` for single-deployment simplicity. Content is fetched at build time
via GROQ queries. Vercel webhooks trigger rebuilds on content publish. No runtime API calls needed
for the public site.

**Major components:**

1. **Sanity Content Lake** (hosted) - Stores documents and assets, serves GROQ API
2. **Sanity Studio** (embedded at /studio) - React-based editing UI within SvelteKit app
3. **SvelteKit App** - Routing, rendering, static generation via entry generators
4. **Portable Text Renderer** - Maps Sanity rich text to existing Svelte components
5. **Vercel** - Hosting, builds, deploy hooks triggered by Sanity webhooks

### Critical Pitfalls

1. **Image Asset Reference Loss (CP-2)** - Upload all images FIRST and capture asset IDs, then
   create content referencing those IDs. Migration script must await asset upload promises before
   processing content.

2. **Code Block Metadata Loss (CP-4)** - Parse markdown code fences BEFORE HTML conversion to
   extract language, filename annotations, and line number flags. Use `@sanity/code-input` plugin
   for schema. Test with most code-heavy post first.

3. **Slug Uniqueness Scope (CP-3)** - Default slug validation is per-document-type. Blog posts and
   gems could share slugs, breaking routing. Implement custom `isUnique` function checking across
   ALL document types.

4. **Non-Idempotent Migration Scripts (MP-1)** - Use `createOrReplace` with deterministic document
   IDs derived from slugs. Migration must be re-runnable without creating duplicates.

5. **Webhook/Build Timing (MP-5)** - Sanity CDN may not propagate immediately after publish. Add 2-5
   second delay before triggering Vercel rebuild, or use `useCdn: false` during builds.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Schema and Studio Setup

**Rationale:** Schemas must exist before any content can be migrated. Studio validation catches
design issues early. **Delivers:** Sanity project, working embedded Studio at `/studio`, complete
schemas for blog posts, gems, and authors **Addresses:** Content modeling, slug fields, code block
type, image fields with hotspot **Avoids:** CP-3 (slug uniqueness) by implementing custom isUnique
upfront, CP-4 (code blocks) by adding @sanity/code-input **Complexity:** Low-Medium (8-10 hours)

### Phase 2: Content Migration

**Rationale:** Content must exist before frontend can fetch from Sanity. Migration validates schema
design. **Delivers:** All existing blog posts and gems migrated to Sanity with images, code blocks,
and metadata preserved **Uses:** Migration script with asset-first approach, deterministic document
IDs **Implements:** Asset upload pipeline, markdown-to-Portable-Text conversion, frontmatter field
mapping **Avoids:** CP-2 (image refs) by uploading assets first, MP-1 (idempotency) by using
createOrReplace **Complexity:** Medium (8-12 hours for script + validation)

### Phase 3: SvelteKit Integration

**Rationale:** Frontend changes after content exists allows testing against real data. **Delivers:**
Blog and gems routes fetching from Sanity, Portable Text rendering, image URL builder **Uses:**
@sanity/sveltekit client, @portabletext/svelte, @sanity/image-url **Implements:** GROQ queries,
entry generators for prerendering, custom PT components (CodeBlock, Link, Image) **Avoids:** MP-2
(GROQ perf) by designing queries correctly, MP-3 (draft confusion) by filtering drafts
**Complexity:** Medium (6-10 hours)

### Phase 4: Deployment and Cutover

**Rationale:** Final validation and switchover after integration is working. **Delivers:**
Production deployment with webhook-triggered rebuilds, verified SEO parity, removed markdown files
**Uses:** Vercel deploy hooks, Sanity webhooks **Implements:** Webhook configuration with timing
delay, RSS feed from Sanity data, sitemap updates **Avoids:** MP-5 (webhook timing), SEO-1/2/3
(URL/meta/RSS preservation) **Complexity:** Low (4-6 hours)

### Phase Ordering Rationale

- **Schema before content:** Cannot import content without target schemas defined
- **Content before frontend:** Need real data to test frontend integration
- **Frontend before deployment:** Need working site to validate before removing old content system
- **Parallel opportunity:** Phase 1 schema work and Phase 3 Portable Text component development
  could overlap

### Research Flags

**Phases likely needing deeper research during planning:**

- **Phase 2 (Migration):** May need to investigate markdown AST parsing for complex code block
  metadata extraction. Existing posts should be audited for Svelte component embeds (MDsveX feature)
  that need custom handling.

**Phases with standard patterns (skip research-phase):**

- **Phase 1 (Schema):** Well-documented, official Sanity schema docs are comprehensive
- **Phase 3 (Integration):** @sanity/sveltekit has clear examples, sanity-template-sveltekit-clean
  provides reference
- **Phase 4 (Deployment):** Standard webhook patterns, well-documented

## Budget Decision

**Scheduled Drafts requires Growth plan ($15/month).**

Recommendation: Start on free tier. Add Growth plan only if scheduled publishing becomes a real
need. The free tier includes:

- 1 dataset (sufficient)
- 10,000 documents (far more than needed)
- 20 users (more than needed for single author)
- Built-in asset CDN

Scheduled publishing can be worked around with hidden boolean + manual publish timing.

## Confidence Assessment

| Area         | Confidence | Notes                                                                     |
| ------------ | ---------- | ------------------------------------------------------------------------- |
| Stack        | HIGH       | Official packages, npm registry verified, active maintenance              |
| Features     | HIGH       | Official Sanity docs, feature availability confirmed                      |
| Architecture | HIGH       | Official SvelteKit integration, sanity-template-sveltekit-clean reference |
| Pitfalls     | HIGH       | Combination of official docs + community experience reports               |

**Overall confidence:** HIGH

The migration path is well-trodden. Sanity has invested significantly in SvelteKit support. The main
uncertainty is the specifics of content migration (code block parsing, component embeds) which will
require some experimentation.

### Gaps to Address

- **Svelte component embeds in markdown:** Some posts may use MDsveX features like inline Svelte
  components. Need to audit posts and determine if these need custom Portable Text block types or
  can be refactored.
- **Exact code block metadata syntax:** Current posts use `filename=` and `showLineNumbers`
  annotations. Migration script must parse these correctly. Test with sample content before full
  migration.
- **Existing slug collision check:** Before migration, verify no slug collisions exist between blog
  posts and gems. Run audit query on current content.

## Sources

### Primary (HIGH confidence)

- [Sanity Visual Editing with SvelteKit](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit)
- [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [sanity-io/sanity-sveltekit GitHub](https://github.com/sanity-io/sanity-sveltekit)
- [sanity-io/sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean)
- [@portabletext/svelte npm](https://www.npmjs.com/package/@portabletext/svelte)
- [Sanity Schema and Content Migrations](https://www.sanity.io/docs/content-lake/schema-and-content-migrations)

### Secondary (MEDIUM confidence)

- [Embedding Sanity V3 in SvelteKit](https://chrisjayden.com/articles/sveltekit-sanity-v3)
- [On-Demand Revalidation with SvelteKit + Sanity](https://www.megamashmedia.com/blog/how-to-setup-on-demand-revalidation-with-sveltekit-sanity-and-vercel)
- [Importing Data Into Sanity: Gotchas](https://createtoday.io/posts/sanity-import-data)

### Tertiary (LOW confidence)

- Community GitHub issues for edge cases (Svelte 5 compatibility timing)

---

_Research completed: 2026-01-18_ _Ready for roadmap: yes_
