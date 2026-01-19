---
phase: 02-vertical-slice
plan: 03
subsystem: routing
tags: [sveltekit, routing, sanity, dual-source, blog, portable-text, typescript]

# Dependency graph
requires:
    - phase: 02-01
      provides: Sanity client, queries, and image utilities
    - phase: 02-02
      provides: Portable Text component map for rendering Sanity content
provides:
    - Dual-source routing with Sanity-first, markdown-fallback
    - PostData discriminated union for type-safe source handling
    - Merged blog listing with deduplication
    - BlogPostCard supporting both Sanity and markdown cover images
affects: [02-04, 03-gem-migration, content-migration]

# Tech tracking
tech-stack:
    added: []
    patterns: [dual-source-routing, discriminated-union-types, source-deduplication]

key-files:
    created: []
    modified:
        - src/routes/[slug]/+page.server.ts
        - src/routes/[slug]/+page.ts
        - src/routes/[slug]/+page.svelte
        - src/routes/blog/+page.server.ts
        - src/routes/blog/+page.svelte
        - src/lib/utils/types.ts
        - src/lib/components/molecules/BlogPostCard.svelte
        - .env.example

key-decisions:
    - 'SanityPost type matches GROQ query projection exactly for type safety'
    - 'PostData discriminated union uses source field for rendering path'
    - 'API failure throws 503 (per CONTEXT.md: show error, not silent fallback)'
    - 'Preview mode uses SANITY_PREVIEW_SECRET env var'
    - 'Listing deduplication: Sanity wins for matching slugs'
    - 'Related posts skipped for Sanity (same-source only per CONTEXT.md)'

patterns-established:
    - 'Dual-source routing: Try Sanity first, catch error and throw 503, fallback to markdown if not
      found'
    - 'Discriminated union: { source: "sanity" | "markdown", post: SanityPost | BlogPost }'
    - 'Normalized listing type: ListingPost with common fields for both sources'
    - 'BlogPostCard dual image: isSanityWithCover check for image snippet selection'

# Metrics
duration: 4min
completed: 2026-01-19
---

# Phase 02 Plan 03: Dual-Source Routing Summary

**SvelteKit routing that queries Sanity first with markdown fallback, merged blog listing with
deduplication, and BlogPostCard supporting both image sources**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-19T04:15:00Z
- **Completed:** 2026-01-19T04:21:29Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Implemented Sanity-first routing with markdown fallback for [slug] route
- Added SanityPost and PostData discriminated union types for type safety
- Updated [slug] page to conditionally render Portable Text or markdown component
- Created merged blog listing that deduplicates by slug (Sanity wins)
- Extended BlogPostCard to handle both Sanity CDN and local asset cover images

## Task Commits

Each task was committed atomically:

1. **Task 1: Create dual-source loading in [slug] route** - `b3f99f6` (feat)
2. **Task 2: Update [slug] page to render both sources** - `4b54eec` (feat)
3. **Task 3: Create merged blog listing** - `a8ec638` (feat)

## Files Created/Modified

- `src/lib/utils/types.ts` - Added SanityPost type and PostData discriminated union
- `src/routes/[slug]/+page.server.ts` - Sanity-first loader with markdown fallback
- `src/routes/[slug]/+page.ts` - Client-side load handling both source types
- `src/routes/[slug]/+page.svelte` - Conditional rendering for Sanity vs markdown
- `src/routes/blog/+page.server.ts` - Merged listing with ListingPost type
- `src/routes/blog/+page.svelte` - Updated to use ListingPost type
- `src/lib/components/molecules/BlogPostCard.svelte` - Dual image source support
- `.env.example` - Added SANITY_PREVIEW_SECRET for preview mode

## Decisions Made

1. **SanityPost type structure:** Matched exactly to GROQ query projection for type safety without
   runtime transformation
2. **API error handling:** Throw 503 on Sanity fetch failure per CONTEXT.md (show error, not silent
   fallback)
3. **Preview secret from env:** Used dynamic import for SANITY_PREVIEW_SECRET to keep it server-side
4. **Listing deduplication:** Sanity posts win when slugs match (migration path - old markdown can
   be removed later)
5. **Related posts:** Skipped for Sanity posts in this phase (same-source only per CONTEXT.md)
6. **BlogPostCard refactor:** Used source field check with separate image snippets rather than
   unified approach

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated +page.ts client load to handle both sources**

- **Found during:** Task 1 (after updating +page.server.ts)
- **Issue:** +page.ts was spreading BlogPost directly but now receives PostData union
- **Fix:** Added conditional handling for Sanity vs markdown sources with appropriate meta tag
  generation
- **Files modified:** src/routes/[slug]/+page.ts
- **Verification:** npm run check passes for route files
- **Committed in:** b3f99f6 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking) **Impact on plan:** Auto-fix was necessary to
complete the routing changes. The +page.ts file needed updating alongside +page.server.ts for the
type changes to work end-to-end.

## Issues Encountered

- Pre-existing type errors in codebase (12 total, none from this plan) - documented and ignored as
  they were not introduced by these changes

## User Setup Required

None - SANITY_PREVIEW_SECRET is optional and only needed for preview mode functionality.

## Next Phase Readiness

- Dual-source routing complete, ready for 02-04 (Vertical Slice Post)
- Blog listing shows both sources merged
- [slug] route renders Sanity posts with Portable Text
- Existing markdown posts continue to work unchanged
- No blockers

---

_Phase: 02-vertical-slice_ _Completed: 2026-01-19_
