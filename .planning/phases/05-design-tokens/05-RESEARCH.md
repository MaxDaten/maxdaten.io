# Phase 5: Design Tokens - Research

**Researched:** 2026-01-20 **Domain:** CSS Custom Properties / Design Token System **Confidence:**
HIGH

## Summary

This phase establishes the CSS custom property foundation for the design system. Research focused on
understanding the current state of the codebase's styling, identifying gaps against requirements,
and determining the implementation strategy for a two-layer token system (primitive + semantic).

The codebase already has a partial token system: colors are defined via SCSS variables and converted
to CSS custom properties using a mixin. However, there is no spacing or typography token system, and
values are hardcoded throughout components. The color system has dual accent colors (orange primary,
teal secondary) that need consolidation per requirements.

**Primary recommendation:** Create three new SCSS partials (`_tokens-spacing.scss`,
`_tokens-colors.scss`, `_tokens-typography.scss`) that define CSS custom properties in `:root`,
following the established pattern but with the `--raw-*` prefix for primitives and semantic naming
for contextual tokens.

## Current State Analysis

### Existing Token Infrastructure

**Color System (Partial tokens exist):**

- File: `src/lib/scss/_themes.scss`
- SCSS variables define colors, then `define-color` mixin generates CSS custom properties
- Pattern: `--color--{name}` with companion HSL/RGB breakouts for alpha manipulation
- Current accent colors:
    - Primary (orange): `#ff8000` with shades `#7e4611`, `#2d1d10`
    - Secondary (teal): `#0cd7f1` with shades `#147b8c`, `#0d2a30`
- The secondary color is used for: code block scrollbars, borders, waves background

**Typography (No tokens):**

- File: `src/lib/scss/_typography.scss`
- Hardcoded values: h1 `2.5rem`, h2 `1.8rem`, h3 `1.5rem`, h4 `1.2rem`, h5 `1rem`
- Font families in `_variables.scss`: `--font--default`, `--font--title`, `--font--mono`
- Base font size: `18px` (in `global.scss` on `html`)
- Body line-height: `1.3` (hardcoded in `global.scss`)

**Spacing (No tokens):**

- Completely ad-hoc values throughout codebase
- Common patterns found in components: `8px`, `10px`, `12px`, `15px`, `16px`, `20px`, `24px`,
  `30px`, `32px`, `40px`, `48px`, `50px`, `80px`
- Mixins use hardcoded values: `padded-container` uses `15px`, `20px`, `30px` padding

### File Import Order

In `global.scss`:

```scss
@use '_reset.scss';
@use '_variables.scss';
@use '_themes.scss';
@use '_breakpoints.scss';
@use '_functions.scss';
@use '_mixins.scss';
@use '_base.scss';
@use '_typography.scss';
@use '_markdown.scss';
@use '_code-highlights.scss';
@use 'animations.scss';
```

Tokens must be imported early (after reset, before themes) to ensure they cascade properly.

### Naming Convention Analysis

Current patterns:

- `--color--{name}` (double dash after color)
- `--font--{name}` (double dash after font)
- Inconsistent: `--font-logo` vs `--font--mono`

CONTEXT.md decision: `--raw-*` prefix for primitives, unprefixed semantic names.

## Gap Analysis

### TOKEN-01: Spacing Scale (MISSING)

**Required:** 8px base grid with scale: 8, 16, 24, 32, 48, 64, 80px **CONTEXT.md update:** Strict
8px grid (no 4px exception)

**Current state:** No spacing tokens exist. Components use arbitrary values:

- `4px`, `5px`, `6px` (off-grid)
- `10px`, `15px` (off-grid)
- `20px`, `30px`, `40px`, `50px` (mostly near-grid)

**Gap:** Complete implementation needed.

### TOKEN-02: Typography Scale (MISSING)

**Required:** Major Third 1.25 ratio: 12, 14, 16, 18, 20, 25, 31, 39px **CONTEXT.md:** T-shirt sizes
for primitives, semantic layer for usage

**Current state:** Fixed rem values without systematic scale:

- h1: `2.5rem` (45px at 18px base)
- h2: `1.8rem` (32.4px)
- h3: `1.5rem` (27px)
- h4: `1.2rem` (21.6px)
- h5: `1rem` (18px)

**Gap:** Scale doesn't match Major Third. Need complete token system.

### TOKEN-03: Color Consolidation (PARTIAL)

**Required:** Single accent color (consolidate orange + teal) **CONTEXT.md:** Orange is primary,
teal removed; warmer orange-gold for dark mode

**Current state:** Dual accent system:

- `$color-primary: #ff8000` (orange) - used for links, highlights, accents
- `$color-secondary: #0cd7f1` (teal) - used for code block scrollbars, borders, waves

**Gap:** Secondary color removal requires audit of all usages and replacement decisions.

### TOKEN-04: Semantic Tokens (MISSING)

**Required:** `spacing-block`, `spacing-section`, `text-body`, `text-heading` **CONTEXT.md:**
Descriptive naming: `--space-block`, `--space-inline`, `--text-body`, `--text-heading-1`

**Current state:** No semantic abstraction layer exists. Components reference colors directly
(`--color--primary`) but no spacing or typography semantics.

**Gap:** Complete implementation needed after primitives.

## Implementation Strategy

### Architecture: Two-Layer Token System

Following industry best practice, implement a two-layer system:

1. **Primitive Layer (`--raw-*`):** Raw values without context
    - `--raw-space-8`, `--raw-space-16`, etc.
    - `--raw-text-xs`, `--raw-text-sm`, `--raw-text-base`, etc.
    - `--raw-color-orange-500`, etc.

2. **Semantic Layer (unprefixed):** Contextual usage references
    - `--space-block: var(--raw-space-24);`
    - `--text-body: var(--raw-text-base);`
    - `--color-accent: var(--raw-color-orange-500);`

This enables:

- Theme switching by redefining primitives
- Clear documentation of design intent
- Safe refactoring (change semantic, not primitive)

### File Structure

Create three new partials:

```
src/lib/scss/
  _tokens-spacing.scss    # NEW: spacing primitives + semantics
  _tokens-typography.scss # NEW: typography primitives + semantics
  _tokens-colors.scss     # NEW: color primitives + semantics (refactor from _themes.scss)
```

Update `global.scss` import order:

```scss
@use '_reset.scss';
@use '_variables.scss'; // Keep: fonts, easing, z-index
@use '_tokens-spacing.scss'; // NEW
@use '_tokens-typography.scss'; // NEW
@use '_tokens-colors.scss'; // NEW (replaces color portion of _themes.scss)
@use '_themes.scss'; // Keep: theme switching logic (if any)
// ... rest unchanged
```

### Spacing Token Definition

```scss
// _tokens-spacing.scss
:root {
    // Primitive spacing (8px grid)
    --raw-space-8: 8px;
    --raw-space-16: 16px;
    --raw-space-24: 24px;
    --raw-space-32: 32px;
    --raw-space-48: 48px;
    --raw-space-64: 64px;
    --raw-space-80: 80px;

    // Semantic spacing
    --space-inline: var(--raw-space-8); // Between inline elements
    --space-block: var(--raw-space-24); // Between block elements
    --space-section: var(--raw-space-48); // Between sections
    --space-page: var(--raw-space-80); // Page margins
}
```

### Typography Token Definition

```scss
// _tokens-typography.scss
:root {
    // Major Third scale (1.25 ratio from 16px base)
    // 16 * 0.75 = 12, 16 * 0.875 = 14, 16 * 1 = 16, etc.
    --raw-text-xs: 12px; // 0.75rem
    --raw-text-sm: 14px; // 0.875rem
    --raw-text-base: 16px; // 1rem
    --raw-text-md: 18px; // 1.125rem
    --raw-text-lg: 20px; // 1.25rem
    --raw-text-xl: 25px; // 1.5625rem
    --raw-text-2xl: 31px; // 1.9375rem
    --raw-text-3xl: 39px; // 2.4375rem
    --raw-text-4xl: 49px; // 3.0625rem (extended for hero if needed)

    // Line heights bundled
    --raw-leading-tight: 1.1;
    --raw-leading-snug: 1.25;
    --raw-leading-normal: 1.5;
    --raw-leading-relaxed: 1.65;

    // Font weights (after audit)
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    // Semantic typography
    --text-body: var(--raw-text-base);
    --text-body-leading: var(--raw-leading-relaxed);
    --text-small: var(--raw-text-sm);
    --text-caption: var(--raw-text-xs);
    --text-heading-1: var(--raw-text-3xl);
    --text-heading-2: var(--raw-text-2xl);
    --text-heading-3: var(--raw-text-xl);
    --text-heading-4: var(--raw-text-lg);
    --text-heading-leading: var(--raw-leading-tight);
}
```

### Color Token Definition

```scss
// _tokens-colors.scss
:root {
    // Primitive colors (orange accent)
    --raw-color-orange-500: #ff8000;
    --raw-color-orange-600: #e67300; // Darker for hover
    --raw-color-orange-700: #cc6600; // Even darker
    --raw-color-orange-400: #ff9933; // Lighter
    --raw-color-orange-warm: #ffb347; // Warmer for dark mode

    // Primitive grays/backgrounds
    --raw-color-gray-900: #1c1e26; // Page background
    --raw-color-gray-850: #141519; // Post background
    --raw-color-gray-800: #32343e; // Card background
    --raw-color-gray-700: #2b3131; // Code inline background

    // Primitive text colors
    --raw-color-white: #fffcfc;
    --raw-color-white-muted: #d9f9fd;

    // Semantic colors
    --color-accent: var(--raw-color-orange-500);
    --color-accent-hover: var(--raw-color-orange-600);
    --color-text: var(--raw-color-white);
    --color-text-muted: rgba(255, 252, 252, 0.7);
    --color-surface: var(--raw-color-gray-900);
    --color-surface-elevated: var(--raw-color-gray-800);
    --color-border: rgba(255, 128, 0, 0.3);
}
```

## Key Implementation Decisions

### Decision 1: Pixel vs Rem for Tokens

**Recommendation:** Use `px` for token definitions, apply `rem` conversion in usage when needed.

**Rationale:**

- Tokens represent absolute design decisions
- Components can apply rem conversion for accessibility
- Simplifies token math and debugging
- Modern browsers handle px well with zoom

### Decision 2: CSS Custom Properties vs SCSS Variables

**Recommendation:** CSS Custom Properties for all tokens (per CONTEXT.md).

**Rationale:**

- Runtime flexibility for theming
- DevTools inspection and debugging
- Future dark mode support
- Matches existing `--color--*` pattern

### Decision 3: Secondary Color Replacement Strategy

**Recommendation:** Replace teal usages with orange variants or neutral grays.

Specific replacements:

| Current Teal Usage           | Replacement                     |
| ---------------------------- | ------------------------------- |
| Code scrollbar color         | `--color-accent` (orange)       |
| Code block border            | `--color-border` (orange @ 30%) |
| Line number color            | `--color-text-muted`            |
| Waves background             | Remove or use orange gradient   |
| Card border (secondary-tint) | `--color-surface-elevated`      |

### Decision 4: Migration Approach

**Recommendation:** Define tokens first, then migrate usage phase-by-phase.

Phase 5 scope:

1. Create token files with all primitives and semantics
2. Token files are imported and available
3. No component changes (that's Phases 6-9)

This keeps Phase 5 focused on token definition, not refactoring.

## Common Pitfalls

### Pitfall 1: Token Proliferation

**What goes wrong:** Creating too many tokens, making the system hard to maintain. **Prevention:**
Start minimal. Only add tokens that are actually used. The semantic layer should have fewer tokens
than the primitive layer.

### Pitfall 2: Inconsistent Naming

**What goes wrong:** Mix of naming conventions makes tokens hard to discover. **Prevention:** Follow
CONTEXT.md strictly: `--raw-*` for primitives, descriptive names for semantics. Use consistent
separators (single dash within names).

### Pitfall 3: Premature Semantic Tokens

**What goes wrong:** Creating semantic tokens for hypothetical use cases. **Prevention:** Only
create semantic tokens that map to actual current usage patterns. Add more later as components are
migrated.

### Pitfall 4: Breaking Existing Styles

**What goes wrong:** Changing existing `--color--*` variables breaks current site. **Prevention:**
Phase 5 only ADDS tokens. Existing variables remain unchanged. Migration happens in later phases.

## Files to Create

| File                      | Purpose                             |
| ------------------------- | ----------------------------------- |
| `_tokens-spacing.scss`    | Spacing primitives and semantics    |
| `_tokens-typography.scss` | Typography primitives and semantics |
| `_tokens-colors.scss`     | Color primitives and semantics      |

## Files to Modify

| File          | Change                                               |
| ------------- | ---------------------------------------------------- |
| `global.scss` | Add imports for new token files (after \_reset.scss) |

## Files Unchanged (Phase 5)

These files use tokens but are migrated in later phases:

- `_typography.scss` - Phase 6
- `_markdown.scss` - Phase 6, 7
- `_themes.scss` - Kept for now, may merge with `_tokens-colors.scss` later
- `_mixins.scss` - Kept, `define-color` mixin still useful for callout colors
- All component `.svelte` files - Phases 6-9

## Risks & Considerations

### Risk 1: Token File Load Order

**Risk:** Tokens not available where needed due to import order. **Mitigation:** Import token files
immediately after reset in global.scss. Verify with a simple usage test.

### Risk 2: Secondary Color Dependencies

**Risk:** Removing teal breaks visual elements unexpectedly. **Mitigation:** Document all teal
usages (done above). Replacement happens in later phases, not Phase 5.

### Risk 3: Base Font Size Mismatch

**Risk:** Major Third scale assumes 16px base, but current base is 18px. **Mitigation:**
REQUIREMENTS.md specifies Major Third scale values explicitly (12-39px). These are independent of
base font size. Base font size change (if desired) would be a separate consideration.

## Verification Approach

Phase 5 success criteria from ROADMAP.md:

1. **Spacing scale CSS properties exist** - Check DevTools for `--raw-space-*` variables
2. **Typography scale CSS properties exist** - Check DevTools for `--raw-text-*` variables
3. **Color tokens consolidate to single accent** - Orange primitives defined, no new teal tokens
4. **Semantic tokens exist** - Check DevTools for `--space-block`, `--text-body`, etc.

Visual verification: Site should look identical before and after Phase 5 (tokens defined but not yet
used).

## Sources

### Primary (HIGH confidence)

- Codebase analysis: `src/lib/scss/*.scss` - Direct file inspection
- CONTEXT.md decisions - User-locked implementation choices

### Secondary (MEDIUM confidence)

- [Penpot Design Tokens Guide](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) -
  Two-layer token architecture
- [GitLab Design Tokens Usage](https://design.gitlab.com/product-foundations/design-tokens-using/) -
  Primitive/semantic separation
- [KTH Style Design Tokens](https://app.kth.se/style/en/styles/design-tokens) - SCSS + CSS custom
  properties integration

## Metadata

**Confidence breakdown:**

- Current state analysis: HIGH - Direct codebase inspection
- Implementation strategy: HIGH - CONTEXT.md decisions + industry patterns
- Token values: HIGH - REQUIREMENTS.md specifies exact scales
- Migration risks: MEDIUM - Dependencies identified but not exhaustively tested

**Research date:** 2026-01-20 **Valid until:** 60 days (stable domain, no fast-moving dependencies)

---

_Phase: 05-design-tokens_ _Research completed: 2026-01-20_
