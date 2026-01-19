---
phase: 03-migration
plan: 03
status: complete
completed_at: 2026-01-19
---

# Summary: Remove Dual-Source Routing

## Objective

Remove dual-source routing and delete old markdown content system, making Sanity the sole content
source.

## Tasks Completed

### Task 1: Simplify routing to Sanity-only ✓

- Updated `src/routes/[slug]/+page.server.ts` - Sanity-only post loading
- Updated `src/routes/blog/+page.server.ts` - Sanity-only listing
- Removed all markdown fallback logic

### Task 2: Remove old content system files ✓

- Deleted `src/lib/server/posts.ts`
- Deleted `src/lib/data/posts.ts`
- Deleted `src/lib/data/gems/` directory
- Deleted `src/content/blog/` directory
- Deleted `src/lib/assets/images/posts/` directory
- Deleted `src/lib/assets/images/gems/` directory

### Task 3: Human verification checkpoint ✓

- Blog listing works at /blog
- Individual posts render correctly
- Gems page works at /gems
- Code blocks with syntax highlighting
- Images from Sanity CDN

## Issues Found During Verification

Several content fidelity issues were discovered and fixed:

1. **Ordered lists rendering inline** - Migration script didn't handle numbered lists
    - Fix: Added ordered list support (commit `bcdec8c`)

2. **Mixed bold+italic `\_**text**\_`** - Pattern not recognized
    - Fix: Added inline pattern (commit `0b98371`)

3. **Nested lists not nested** - No level 2 support
    - Fix: Added nested list handling (commit `feadb1e`)

4. **Internal links 500 error** - References not dereferenced in GROQ query
    - Fix: Updated postBySlugQuery to resolve internalLink references (commit `d53dcd6`)

## Commits

- `bcdec8c` - fix(03): add ordered list support to migration and list styles
- `0b98371` - fix(03): add mixed bold+italic pattern _**text**_ to migration
- `feadb1e` - fix(03): add nested list support to migration script
- `d53dcd6` - fix(03): dereference internal links in body markDefs

## Verification Results

- [x] No imports of `$lib/server/posts` in codebase
- [x] No imports of `$lib/data/posts` in codebase
- [x] No imports of `$lib/data/gems` in codebase
- [x] `src/content/blog/` directory deleted
- [x] `src/lib/assets/images/posts/` directory deleted
- [x] All URLs return correct content
- [x] Human verification approved

## Outcome

Sanity is now the sole content source. Old markdown system completely removed.
