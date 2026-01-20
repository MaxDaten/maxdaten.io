# Roadmap: maxdaten.io

## Milestones

- [x] **v1.0 Sanity CMS Migration** - Phases 1-4 (shipped 2026-01-20)
- [ ] **v2.0 Design Refinement** - Phases 5-9 (in progress)

## Phases

<details>
<summary>v1.0 Sanity CMS Migration (Phases 1-4) - SHIPPED 2026-01-20</summary>

Completed milestone. Content migrated from file-based markdown to Sanity CMS. All 9 blog posts, 3
gems, 7 tags, 1 author migrated with preserved URLs.

</details>

### v2.0 Design Refinement (In Progress)

**Milestone Goal:** Evolve the site from "looks good" to precision-engineered minimalism — unified
spacing, refined typography, professional code blocks, and polished post meta.

- [x] **Phase 5: Design Tokens** - Establish spacing, typography, and color token foundation
- [x] **Phase 6: Typography** - Apply typography scale and line-height improvements
- [x] **Phase 7: Code Blocks** - Refine code block styling and functionality
- [x] **Phase 8: Post Meta** - Consolidate and polish blog post metadata display
- [ ] **Phase 9: Navigation & Layout** - Finalize navigation and page layout refinements

## Phase Details

### Phase 5: Design Tokens

**Goal**: Establish CSS custom property foundation that all subsequent styling derives from
**Depends on**: Phase 4 (v1.0 complete) **Requirements**: TOKEN-01, TOKEN-02, TOKEN-03, TOKEN-04

**Success Criteria** (what must be TRUE):

1. Spacing scale CSS properties exist and use 8px base grid (4, 8, 12, 16, 24, 32, 48, 64, 80px)
2. Typography scale CSS properties exist using Major Third 1.25 ratio (12-49px range)
3. Color tokens consolidate to single accent color (no competing orange + teal)
4. Semantic tokens exist for common use cases (spacing-block, text-body, text-heading)

**Plans**: 2 plans

Plans:

- [x] 05-01-PLAN.md — Create spacing, typography, and color token files
- [x] 05-02-PLAN.md — Close verification gaps (spacing scale + color consolidation)

### Phase 6: Typography

**Goal**: Apply typography improvements for comfortable reading across all content **Depends on**:
Phase 5 **Requirements**: TYPO-01, TYPO-02, TYPO-03, TYPO-04, TYPO-05

**Success Criteria** (what must be TRUE):

1. Body text displays with 1.6-1.7 line-height (visible breathing room between lines)
2. Headings display with tight 1.1-1.2 line-height
3. Prose content constrains to 680px max-width (60-80 characters per line)
4. Dates and meta elements display in monospace font
5. Font families reduced to minimal set (audit complete)

**Plans**: 3 plans

Plans:

- [x] 06-01-PLAN.md — Consolidate font families (add JetBrains Mono, remove Merriweather/Ubuntu
      Mono)
- [x] 06-02-PLAN.md — Apply line-height tokens and configure prose width with breakout
- [x] 06-03-PLAN.md — Apply monospace font treatment to meta elements

### Phase 7: Code Blocks

**Goal**: Transform code blocks into first-class design citizens with modern styling **Depends on**:
Phase 6 **Requirements**: CODE-01, CODE-02, CODE-03, CODE-04, CODE-05, CODE-06, CODE-07

**Success Criteria** (what must be TRUE):

1. Code blocks display dark background regardless of page theme
2. Code block containers have 12px border-radius with clean edges
3. Filename header displays cleanly without diagonal strip pattern
4. Language label visible in code block header
5. Copy button appears on code blocks (0.5 opacity, 1.0 on hover)
6. Mobile code font size minimum 12px (readable on small screens)

**Plans**: 3 plans

Plans:

- [x] 07-01-PLAN.md — Container styling (dark background, 12px radius, mobile font size)
- [x] 07-02-PLAN.md — Header and copy button (remove diagonal strip, show language, reposition copy)
- [x] 07-03-PLAN.md — Line highlighting support for tutorials

### Phase 8: Post Meta

**Goal**: Present blog post metadata as cohesive, professional design element **Depends on**: Phase
7 **Requirements**: META-01, META-02, META-03, META-04, META-05

**Success Criteria** (what must be TRUE):

1. Date displays above post title (not below)
2. Date displays in monospace uppercase with wide letter-spacing
3. Post meta consolidates to single line: Author · Reading Time
4. Author avatar displays at 32-36px size (reduced from 44px)
5. Social links appear only in bottom author card (removed from header)

**Plans**: 2 plans

Plans:

- [x] 08-01-PLAN.md — Date formatting utility and header restructure (date above title)
- [x] 08-02-PLAN.md — Meta line consolidation and author component cleanup

### Phase 9: Navigation & Layout

**Goal**: Complete the design system with polished navigation and layout elements **Depends on**:
Phase 8 **Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04

**Success Criteria** (what must be TRUE):

1. Navigation shows active state indicator for current page
2. Navigation links have increased tap targets with proper padding
3. Footer removes empty space and adds value (column structure or useful content)
4. Hero images use aspect-ratio (16:9 or 2:1) instead of fixed height

**Plans**: TBD

Plans:

- [ ] 09-01: TBD

## Progress

**Execution Order:** 5 -> 6 -> 7 -> 8 -> 9

| Phase              | Milestone | Plans Complete | Status      | Completed  |
| ------------------ | --------- | -------------- | ----------- | ---------- |
| 1-4. CMS Migration | v1.0      | -              | Complete    | 2026-01-20 |
| 5. Design Tokens   | v2.0      | 2/2            | Complete    | 2026-01-20 |
| 6. Typography      | v2.0      | 3/3            | Complete    | 2026-01-20 |
| 7. Code Blocks     | v2.0      | 3/3            | Complete    | 2026-01-20 |
| 8. Post Meta       | v2.0      | 2/2            | Complete    | 2026-01-20 |
| 9. Navigation      | v2.0      | 0/TBD          | Not started | -          |

---

_Roadmap created: 2026-01-20_ _Last updated: 2026-01-20_
