---
description: |
  Design principles and patterns for maxdaten.io. Use when creating or modifying UI components,
  styling, layouts, or any visual elements. Ensures consistency with the precision-engineered
  minimalist aesthetic established in v2.0.
triggers:
  - design
  - styling
  - css
  - scss
  - layout
  - typography
  - spacing
  - colors
  - component styling
  - UI work
---

# maxdaten.io Design Principles

Precision-engineered minimalism — unified spacing, refined typography, professional code blocks,
and polished post meta. Established in v2.0 Design Refinement milestone.

## Design Token Architecture

**Two-layer system:**

1. **Primitive tokens** (`--raw-*`): Raw values without context
2. **Semantic tokens**: Contextual usage referencing primitives

```scss
// Primitives (in _tokens-*.scss)
--raw-space-8: 8px;
--raw-radius-md: 12px;

// Semantic (component usage)
--radius-card: var(--raw-radius-md);
```

**Rule:** Never use hardcoded values. Always reference tokens.

## Spacing System

**8px base grid with half-steps:**

| Token            | Value | Usage                        |
| ---------------- | ----- | ---------------------------- |
| `--raw-space-4`  | 4px   | Tight gaps, fine adjustments |
| `--raw-space-8`  | 8px   | Default small spacing        |
| `--raw-space-12` | 12px  | Padding, medium gaps         |
| `--raw-space-16` | 16px  | Component internal padding   |
| `--raw-space-24` | 24px  | Section gaps                 |
| `--raw-space-32` | 32px  | Large section spacing        |
| `--raw-space-48` | 48px  | Page sections                |
| `--raw-space-64` | 64px  | Major separations            |
| `--raw-space-80` | 80px  | Hero/header spacing          |

## Typography Scale

**Major Third ratio (1.25):**

| Token              | Size | Usage              |
| ------------------ | ---- | ------------------ |
| `--raw-text-xs`    | 12px | Captions, labels   |
| `--raw-text-sm`    | 14px | Small text, meta   |
| `--raw-text-base`  | 16px | Body text          |
| `--raw-text-md`    | 18px | Lead paragraphs    |
| `--raw-text-lg`    | 20px | H4, subheadings    |
| `--raw-text-xl`    | 25px | H3                 |
| `--raw-text-2xl`   | 31px | H2                 |
| `--raw-text-3xl`   | 39px | H1                 |
| `--raw-text-4xl`   | 49px | Display, hero text |

**Line heights:**

- Body text: `1.6-1.7` (breathing room)
- Headings: `1.1-1.2` (tight, impactful)

**Font families:**

- `--font--default`: System sans-serif stack (Inter preferred)
- `--font--mono`: JetBrains Mono, monospace (400 weight only)
- `--font--title`: Aliases to `--font--default`

## Color System

**Single accent color (orange):**

```scss
--color--primary: #ff8000; // Main accent
--color--secondary: #ff8000; // Aliased to primary (consolidated)
```

**Rule:** No competing colors. Orange is the only accent.

**Muted text:**

- Use reduced opacity or gray tones for meta text
- Author names use accent color (signals actionable)

## Prose Layout

**Optimal reading:**

- Max-width: `680px` (60-80 characters per line)
- Code blocks and images: Break out to full container width
- Use `.breakout` class for elements exceeding prose width

```scss
.prose {
  max-width: 680px;
  margin: 0 auto;
}

.breakout {
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  max-width: 100vw;
}
```

## Code Blocks

**Container styling:**

- Background: `#1a1a1a` (near-black, theme-independent)
- Border-radius: `12px`
- Mobile font-size: minimum `12px`

**Header:**

- Clean header (no diagonal strip pattern)
- Language label visible
- Filename displayed when provided

**Copy button:**

- Position: bottom-right
- Opacity: `0.5` default, `1.0` on hover
- Mobile: Full opacity (no hover)

```scss
@media (hover: none) {
  .copy-button {
    opacity: 1;
  }
}
```

**Line highlighting:**

- Background: `rgba(255, 128, 0, 0.1)` (orange tint)
- Left border: `2px solid rgba(255, 128, 0, 0.5)`
- Extends to block edges via negative margin trick

## Post Meta Patterns

**Date display:**

- Position: Above title
- Font: Monospace, uppercase
- Letter-spacing: `0.05em`
- Format: "JAN 20, 2026"

**Meta line (below title):**

- Single line: `Author · Reading Time`
- Inline author avatar: `18px`
- Bullet separator hidden on mobile

**Author card (article footer):**

- Avatar: `36px` (desktop), `32px` (mobile)
- Social links consolidated here only
- Subtle background tint: `3%`

## Navigation

**Active state:**

- Orange underline indicator
- Position: `2px` underline, `4px` below text
- Uses `::after` pseudo-element

**Route detection (Svelte 5):**

```svelte
<script>
  import { page } from '$app/state';

  function isActive(href: string): boolean {
    return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
  }
</script>
```

**Tap targets:**

- Minimum: `44px` (Apple HIG guideline)
- Achieved via `min-height` + flexbox centering
- `8px` vertical padding on all viewports

## Images

**Aspect ratios (not fixed heights):**

| Context      | Ratio | CSS                   |
| ------------ | ----- | --------------------- |
| Desktop hero | 2:1   | `aspect-ratio: 2 / 1` |
| Mobile hero  | 16:9  | `aspect-ratio: 16/ 9` |
| Card images  | 16:9  | `aspect-ratio: 16/ 9` |

**Object positioning:**

```scss
img {
  object-fit: cover;
  object-position: center;
}
```

## Border Radius Scale

| Token             | Value | Usage                      |
| ----------------- | ----- | -------------------------- |
| `--raw-radius-xs` | 4px   | Tags, small elements       |
| `--raw-radius-sm` | 6px   | Buttons, inputs            |
| `--raw-radius-md` | 12px  | Cards, code blocks         |
| `--raw-radius-lg` | 16px  | Large containers, modals   |
| `--raw-radius-xl` | 24px  | Hero sections, large cards |

## Footer

**Horizontal layout:**

- Copyright: Left-aligned
- Social links: Right-aligned
- Max-width: `1080px` container
- Padding: `24px` (no empty space)
- Mobile breakpoint: `767px` (stack vertically)

## Anti-Patterns

Avoid these common mistakes:

- Hardcoded pixel values (use tokens)
- Competing accent colors (orange only)
- Fixed heights for images (use aspect-ratio)
- Diagonal strip patterns in headers
- Empty space without purpose
- Social links in multiple locations
- Inconsistent border-radius values
- Body line-height below 1.5
- Prose width exceeding 720px

## File Locations

- Spacing tokens: `src/lib/scss/_tokens-spacing.scss`
- Typography tokens: `src/lib/scss/_tokens-typography.scss`
- Color tokens: `src/lib/scss/_tokens-colors.scss`
- Themes: `src/lib/scss/_themes.scss`
- Global styles: `src/lib/scss/global.scss`
- Markdown/prose: `src/lib/scss/_markdown.scss`
- Typography base: `src/lib/scss/_typography.scss`

---

_Established: v2.0 Design Refinement (2026-01-21)_
