---
phase: 01-foundation
plan: 02
subsystem: cms
tags: [sanity, portable-text, schema, typescript]

# Dependency graph
requires:
    - phase: 01-01
      provides: Sanity Studio project, isUniqueAcrossAllDocuments, tag/author/series schemas
provides:
    - Portable Text object types (codeBlock, callout, portableImage, youtubeEmbed)
    - SEO metadata object type
    - Blog post document schema with full field set
    - Gem document schema with manual slug
affects: [01-03, 02-integration, 03-migration]

# Tech tracking
tech-stack:
    added: []
    patterns:
        [
            defineArrayMember for Portable Text blocks,
            custom block types in body array,
            field groups for document organization,
        ]

key-files:
    created:
        - studio/schemas/objects/codeBlock.ts
        - studio/schemas/objects/callout.ts
        - studio/schemas/objects/portableImage.ts
        - studio/schemas/objects/youtubeEmbed.ts
        - studio/schemas/objects/seo.ts
        - studio/schemas/documents/post.ts
        - studio/schemas/documents/gem.ts
    modified:
        - studio/schemas/index.ts

key-decisions:
    - 'Code block language list matches current Shiki setup (19 languages)'
    - 'Callout content uses array of block for rich text support'
    - 'Gem slug has no source option for manual entry per CONTEXT.md'
    - 'Post body includes internal link annotation referencing post/gem'

patterns-established:
    - 'Object types in studio/schemas/objects/ for reusable Portable Text blocks'
    - 'defineArrayMember for Portable Text block and custom type composition'
    - 'Field groups (content, meta, seo) for document organization'

# Metrics
duration: 2min
completed: 2026-01-18
---

# Phase 1 Plan 02: Content Schemas Summary

**Portable Text object types and blog post/gem document schemas with rich body content, metadata,
and SEO fields**

## Performance

- **Duration:** 2 min 19 sec
- **Started:** 2026-01-18T21:30:27Z
- **Completed:** 2026-01-18T21:32:46Z
- **Tasks:** 2
- **Files created:** 7
- **Files modified:** 1

## Accomplishments

- Created codeBlock object with language dropdown (19 languages), filename, line numbers, and
  highlighted lines
- Created callout object with type radio buttons (info/warning/tip) and rich text content
- Created portableImage object with required alt text and optional caption
- Created youtubeEmbed object with YouTube URL validation
- Created SEO object with meta title/description overrides and noIndex
- Built blog post document with Portable Text body, cover image, tags, series, hidden, and SEO
  fields
- Built gem document with manual slug entry and shared tag taxonomy

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Portable Text object types** - `71c1de2` (feat)
2. **Task 2: Create blog post and gem document schemas** - `1763e58` (feat)

## Files Created/Modified

- `studio/schemas/objects/codeBlock.ts` - Code block with language, filename, line numbers
- `studio/schemas/objects/callout.ts` - Callout with type and rich text content
- `studio/schemas/objects/portableImage.ts` - Image with required alt, optional caption
- `studio/schemas/objects/youtubeEmbed.ts` - YouTube embed with URL validation
- `studio/schemas/objects/seo.ts` - SEO metadata object
- `studio/schemas/documents/post.ts` - Blog post document with all fields
- `studio/schemas/documents/gem.ts` - Gem document with manual slug
- `studio/schemas/index.ts` - Updated to export all schema types

## Decisions Made

1. **Code block language list:** Included all 19 languages from current Shiki setup in
   mdsvex.config.js for consistency with existing blog rendering.

2. **Callout rich text:** Used array of block type for callout content instead of plain text,
   allowing formatting inside callouts.

3. **Gem manual slug:** Configured gem slug without source option per CONTEXT.md decision, requiring
   manual entry instead of auto-generation.

4. **Internal link references:** Added internalLink annotation in post body that references both
   post and gem types, enabling cross-linking between content.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all schemas compiled and validated correctly.

## User Setup Required

None - no external service configuration required for this plan.

## Next Phase Readiness

- All content schemas ready for Studio authoring
- Post and gem documents can be created in Sanity Studio
- Plan 03 (Studio structure/views) can build on these schemas
- Future integration phase can query these document types

---

_Phase: 01-foundation_ _Completed: 2026-01-18_
