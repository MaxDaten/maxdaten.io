---
phase: 06-typography
plan: 01
subsystem: ui
tags: [fonts, typography, inter, jetbrains-mono, scss]

# Dependency graph
requires:
    - phase: 05-design-tokens
      provides: token architecture and SCSS import order
provides:
    - Font families consolidated from 4 to 3 (Inter, JetBrains Mono, Baloo-2)
    - Headings use geometric sans (Inter) matching body text
    - Code/meta elements use JetBrains Mono
affects: [06-typography remaining plans, OG image generation]

# Tech tracking
tech-stack:
    added: ['@fontsource/jetbrains-mono']
    removed: ['@fontsource-variable/merriweather', '@fontsource/ubuntu-mono']
    patterns: [font variable aliasing for backward compatibility]

key-files:
    created: []
    modified:
        - src/lib/scss/_variables.scss
        - src/lib/scss/global.scss
        - src/lib/scss/_typography.scss
        - src/lib/server/og-generation.ts
        - src/routes/[slug]/og.jpg/OgCard.svelte
        - src/routes/og.jpg/ProfileOgCard.svelte
        - package.json

key-decisions:
    - 'Font title variable aliases to default (--font--title: var(--font--default)) for backward
      compatibility'
    - 'JetBrains Mono 400 weight only (single weight sufficient for code/meta)'
    - 'OG image generation updated to use Inter 700 for titles'

patterns-established:
    - 'Font variable aliasing: Use var() references between CSS custom properties for
      maintainability'

# Metrics
duration: 5min
completed: 2026-01-20
---

# Phase 6 Plan 1: Font Family Consolidation Summary

**Consolidated custom fonts from 4 to 3: Inter for all text, JetBrains Mono for code, Baloo-2 for
logo**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-20T04:59:47Z
- **Completed:** 2026-01-20T05:04:23Z
- **Tasks:** 3 + 1 deviation fix
- **Files modified:** 8

## Accomplishments

- Removed Merriweather (serif) - headings now use Inter (geometric sans)
- Replaced Ubuntu Mono with JetBrains Mono for better code readability
- Updated OG image generation to use consolidated fonts
- Maintained backward compatibility via font variable aliasing

## Task Commits

Each task was committed atomically:

1. **Task 1: Install JetBrains Mono and remove obsolete font packages** - `97607e1` (chore)
2. **Task 2: Update font imports in global.scss** - `ef7d899` (feat)
3. **Task 3: Update font variable definitions** - `3652f5b` (feat)
4. **Deviation fix: Update OG image generation** - `af04ab8` (fix)

## Files Created/Modified

- `package.json` - Added @fontsource/jetbrains-mono, removed merriweather and ubuntu-mono
- `src/lib/scss/global.scss` - Updated font imports and face configurations
- `src/lib/scss/_variables.scss` - Updated --font--title and --font--mono definitions
- `src/lib/scss/_typography.scss` - Headings now use --font--default explicitly
- `src/lib/server/og-generation.ts` - Load Inter 700 instead of Merriweather for OG images
- `src/routes/[slug]/og.jpg/OgCard.svelte` - Title font updated to Inter
- `src/routes/og.jpg/ProfileOgCard.svelte` - Title font updated to Inter

## Decisions Made

- **Font variable aliasing:** `--font--title: var(--font--default)` instead of just removing the
  variable. This maintains backward compatibility if any component references --font--title
  directly.
- **Static font package:** Used @fontsource/jetbrains-mono (static) instead of variable font since
  only 400 weight is needed for code/meta elements.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] OG image generation would fail without Merriweather**

- **Found during:** Final verification (grepping for remaining references)
- **Issue:** OG image generation (Satori) imports Merriweather font file directly and OgCard
  components reference Merriweather in SCSS. Build would fail with missing module error.
- **Fix:** Updated og-generation.ts to load Inter 700 weight instead of Merriweather. Updated
  OgCard.svelte and ProfileOgCard.svelte $font-title to use Inter.
- **Files modified:** src/lib/server/og-generation.ts, src/routes/[slug]/og.jpg/OgCard.svelte,
  src/routes/og.jpg/ProfileOgCard.svelte
- **Verification:** npm run build passes, no Merriweather references remain in codebase
- **Committed in:** af04ab8

---

**Total deviations:** 1 auto-fixed (blocking issue) **Impact on plan:** Essential fix - OG image
generation is part of the build and would fail without this change. No scope creep.

## Issues Encountered

None - plan executed smoothly with one blocking deviation requiring fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Font consolidation complete, ready for typography refinements (line-height, spacing)
- TYPO-05 partially complete (font families consolidated)
- Site renders with unified font family for body and headings
- Code blocks display in JetBrains Mono

---

_Phase: 06-typography_ _Plan: 01_ _Completed: 2026-01-20_
