# Phase 5: Design Tokens - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Establish CSS custom property foundation that all subsequent styling derives from. Includes spacing
scale, typography scale, color tokens, and semantic tokens. This phase creates the design system
infrastructure — actual application of these tokens to components happens in Phases 6-9.

</domain>

<decisions>
## Implementation Decisions

### Spacing Philosophy

- Strict 8px grid — only multiples of 8px (no 4px, 6px exceptions)
- Pixel-based naming: `--raw-space-8`, `--raw-space-16`, `--raw-space-24`, etc.
- Scale extends to 80px: 8, 16, 24, 32, 48, 64, 80
- Semantic spacing layer on top: `--space-block`, `--space-inline`, etc.

### Color Consolidation

- Orange is the primary accent color (teal removed)
- Dark mode: shift toward warmer orange-gold for better contrast
- Semantic color names: `--color-text`, `--color-text-muted`, `--color-surface`, `--color-border`
- Descriptive naming convention: `--color-accent`, `--color-text-primary`,
  `--color-surface-elevated`

### Typography Scale

- 16px base font size (standard browser default)
- Both layers: primitive size scale + semantic aliases
- T-shirt sizes for primitives: `--raw-text-xs`, `--raw-text-sm`, `--raw-text-base`, etc.
- Semantic layer: `--text-body`, `--text-heading-1`, `--text-small`, `--text-caption`
- Line-height bundled with each text size token
- Named font weights: `--font-weight-normal`, `--font-weight-medium`, `--font-weight-bold`

### Token Organization

- Split by category: `_tokens-spacing.scss`, `_tokens-colors.scss`, `_tokens-typography.scss`
- CSS custom properties (not SCSS variables) for runtime flexibility
- Prefix convention: `--raw-*` for primitives, unprefixed semantic names
- Components should prefer semantic tokens; primitives exist for semantic definitions

### Claude's Discretion

- Exact semantic token names beyond the core ones discussed
- Major Third 1.25 ratio implementation details
- Which specific font weights are actually needed (audit first)
- Dark mode color value adjustments (within "warmer orange-gold" direction)

</decisions>

<specifics>
## Specific Ideas

- Strict 8px grid reflects precision-engineered minimalism goal
- Orange accent aligns with existing brand presence
- Prefer semantic tokens in components creates consistency without rigidity

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 05-design-tokens_ _Context gathered: 2026-01-20_
