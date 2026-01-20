# Requirements: maxdaten.io v2.0 Design Refinement

**Defined:** 2026-01-20 **Core Value:** Evolve from "looks good" to precision-engineered minimalism
— unified, tight, professional

## v2.0 Requirements

### Design Tokens

- [x] **TOKEN-01**: Spacing scale CSS custom properties (8px base: 4, 8, 12, 16, 24, 32, 48, 64,
      80px)
- [x] **TOKEN-02**: Typography scale CSS custom properties (Major Third 1.25: 12, 14, 16, 18, 20,
      25, 31, 39px)
- [x] **TOKEN-03**: Color system tokens with single accent color (consolidate orange + teal)
- [x] **TOKEN-04**: Semantic tokens (spacing-block, spacing-section, text-body, text-heading)

### Typography

- [x] **TYPO-01**: Body text line-height increased to 1.6-1.7 (from 1.3)
- [x] **TYPO-02**: Heading line-height set to 1.1-1.2
- [x] **TYPO-03**: Prose content max-width 680px for optimal reading (60-80 chars)
- [x] **TYPO-04**: Monospace font for dates and meta elements
- [x] **TYPO-05**: Font audit — reduce to minimal font families

### Code Blocks

- [ ] **CODE-01**: Dark background always (independent of page theme)
- [ ] **CODE-02**: 12px border-radius on code block containers
- [ ] **CODE-03**: Simplified filename header (remove diagonal strip pattern)
- [ ] **CODE-04**: Language label displayed in code block header
- [ ] **CODE-05**: Copy button for code blocks
- [ ] **CODE-06**: Line highlighting support for tutorials
- [ ] **CODE-07**: Mobile font size minimum 12px (up from 10px)

### Post Meta

- [ ] **META-01**: Date positioned above title (not below)
- [ ] **META-02**: Monospace uppercase date with wide letter-spacing
- [ ] **META-03**: Single-line meta consolidation (Author · Date · Reading Time)
- [ ] **META-04**: Smaller avatar size (32-36px)
- [ ] **META-05**: Social links moved to bottom author card only
- [ ] **META-06**: Muted colors for all meta text

### Navigation & Layout

- [ ] **LAYOUT-01**: Navigation active state indicator for current page
- [ ] **LAYOUT-02**: Increased tap targets with proper padding
- [ ] **LAYOUT-03**: Footer refinement — remove 120px empty space, add value
- [ ] **LAYOUT-04**: Hero image aspect-ratio (16:9 or 2:1) instead of fixed height

## v2.1+ Requirements

Deferred to future release:

### Enhanced Features

- **ENHANCE-01**: Variable font implementation for performance
- **ENHANCE-02**: Dark mode font weight adjustment (-15% visual weight)
- **ENHANCE-03**: Reading time calculation displayed in post meta
- **ENHANCE-04**: Related posts algorithm
- **ENHANCE-05**: Scheduled publishing
- **ENHANCE-06**: Live preview in Studio

## Out of Scope

| Feature                              | Reason                                                |
| ------------------------------------ | ----------------------------------------------------- |
| Complete visual redesign             | Evolution not revolution — keep current as foundation |
| New color palette                    | Refine existing, don't replace                        |
| Newsletter signup                    | Scope creep, separate milestone                       |
| Custom coding font (Fira Code, etc.) | Performance cost, existing font sufficient            |
| Animation/motion system              | Polish, defer to v2.1                                 |
| Comments system                      | Not part of current site concept                      |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| TOKEN-01    | Phase 5 | Complete |
| TOKEN-02    | Phase 5 | Complete |
| TOKEN-03    | Phase 5 | Complete |
| TOKEN-04    | Phase 5 | Complete |
| TYPO-01     | Phase 6 | Complete |
| TYPO-02     | Phase 6 | Complete |
| TYPO-03     | Phase 6 | Complete |
| TYPO-04     | Phase 6 | Complete |
| TYPO-05     | Phase 6 | Complete |
| CODE-01     | Phase 7 | Pending  |
| CODE-02     | Phase 7 | Pending  |
| CODE-03     | Phase 7 | Pending  |
| CODE-04     | Phase 7 | Pending  |
| CODE-05     | Phase 7 | Pending  |
| CODE-06     | Phase 7 | Pending  |
| CODE-07     | Phase 7 | Pending  |
| META-01     | Phase 8 | Pending  |
| META-02     | Phase 8 | Pending  |
| META-03     | Phase 8 | Pending  |
| META-04     | Phase 8 | Pending  |
| META-05     | Phase 8 | Pending  |
| META-06     | Phase 8 | Pending  |
| LAYOUT-01   | Phase 9 | Pending  |
| LAYOUT-02   | Phase 9 | Pending  |
| LAYOUT-03   | Phase 9 | Pending  |
| LAYOUT-04   | Phase 9 | Pending  |

**Coverage:**

- v2.0 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---

_Requirements defined: 2026-01-20_ _Last updated: 2026-01-20 after roadmap creation_
