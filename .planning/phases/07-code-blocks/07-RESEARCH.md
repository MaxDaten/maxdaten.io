# Phase 7: Code Blocks - Research

**Researched:** 2026-01-20 **Domain:** Syntax highlighting, code block styling, Shiki transformers
**Confidence:** HIGH

## Summary

Code blocks in this project are rendered through two paths: (1) Sanity Portable Text using the
`CodeBlock.svelte` wrapper component with Shiki highlighting, and (2) static Shiki-rendered `<pre>`
elements with `.shiki` class. Both paths share styling through `_markdown.scss` and the
`CodeBlock.svelte` UI component.

The current implementation already has infrastructure for filename headers (with DiagonalStrip
pattern to remove), language labels (currently hidden via CSS), copy button (positioned top-right,
needs repositioning), and line numbers (CSS counter-based). The styling modernization requires
updates to existing files rather than architectural changes.

**Primary recommendation:** Update CSS styling in `CodeBlock.svelte` and `_markdown.scss` for visual
changes. Extend the existing Shiki transformer for line highlighting support. No new dependencies
required.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library               | Version | Purpose             | Why Standard                                      |
| --------------------- | ------- | ------------------- | ------------------------------------------------- |
| shiki                 | 3.7.0   | Syntax highlighting | Already installed, powers all code rendering      |
| @shikijs/transformers | 3.7.0   | Line highlighting   | Already installed, provides built-in transformers |

### Supporting

| Library              | Version | Purpose         | When to Use                            |
| -------------------- | ------- | --------------- | -------------------------------------- |
| catppuccin-vsc-icons | github  | File type icons | Already integrated via FileIcon.svelte |

### Alternatives Considered

| Instead of   | Could Use          | Tradeoff                                     |
| ------------ | ------------------ | -------------------------------------------- |
| Shiki        | Prism              | Shiki already integrated, theme-consistent   |
| CSS counters | Shiki line numbers | CSS approach already works, keeps HTML clean |

**Installation:**

```bash
# No new dependencies required - all packages already installed
```

## Architecture Patterns

### Current Code Block Rendering Paths

```
Path 1: Sanity Portable Text
┌─────────────────────────────┐
│ src/lib/sanity/portable-text/CodeBlock.svelte │
│ - Calls codeToHtml() with Shiki              │
│ - Wraps result in CodeBlockUI                │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────┐
│ src/lib/components/molecules/CodeBlock.svelte │
│ - Header with filename, lang, file icon       │
│ - DiagonalStrip pattern (TO REMOVE)           │
│ - Copy button (TO REPOSITION)                 │
│ - Children slot receives <pre class="shiki">  │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────┐
│ src/lib/scss/_markdown.scss │
│ - pre.shiki styles          │
│ - Line numbers via CSS counter │
│ - Font sizes and spacing    │
└─────────────────────────────┘

Path 2: Static Pre-rendered (direct Shiki output)
┌─────────────────────────────┐
│ <pre class="shiki">         │
│ - Styled by _markdown.scss  │
│ - Breakout via [slug]/+page.svelte │
└─────────────────────────────┘
```

### Key File Locations

| File                                            | Purpose                 | Modifications Needed                                                      |
| ----------------------------------------------- | ----------------------- | ------------------------------------------------------------------------- |
| `src/lib/components/molecules/CodeBlock.svelte` | UI wrapper component    | Header styling, copy button position, border-radius, remove DiagonalStrip |
| `src/lib/scss/_markdown.scss`                   | Base `pre.shiki` styles | Background color, font sizes, padding                                     |
| `src/lib/scss/_themes.scss`                     | Color definitions       | Add code block semantic colors                                            |
| `src/lib/shiki/transformerCodeBlock.js`         | Shiki transformer       | Add line highlight support                                                |
| `src/routes/[slug]/+page.svelte`                | Breakout rules          | Already configured (800px max-width)                                      |

### Pattern: CSS Grid Breakout (From Phase 6)

Code blocks already break out of prose width:

```scss
// In src/routes/[slug]/+page.svelte
.content {
    display: grid;
    grid-template-columns:
        1fr
        min(var(--main-column-width), 100%)
        1fr;

    :global(> *) {
        grid-column: 2; // Prose column (680px)
    }

    // Breakout elements - wider than prose column
    :global(.code-block),
    :global(pre.shiki) {
        grid-column: 1 / -1; // Full width
        max-width: 800px; // But capped
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }
}
```

### Pattern: Line Highlighting via Shiki Transformers

The `@shikijs/transformers` package provides `transformerMetaHighlight` for meta-string syntax:

````js
// Usage in markdown:
// ```js {1,3-5}
// console.log('line 1 highlighted');
// console.log('line 2 not highlighted');
// console.log('line 3 highlighted');
// ```

import { transformerMetaHighlight } from '@shikijs/transformers';

codeToHtml(code, {
    lang,
    theme: 'ayu-dark',
    transformers: [
        transformerMetaHighlight({
            className: 'highlighted', // Applied to .line elements
        }),
    ],
});
````

### Anti-Patterns to Avoid

- **Mixing structural and behavioral CSS changes:** Keep component styling separate from theme
  colors
- **Hard-coded colors in component styles:** Use CSS custom properties for theming
- **Inline styles for dynamic values:** Keep in CSS where possible, use CSS custom properties for
  variations

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem             | Don't Build           | Use Instead                                           | Why                               |
| ------------------- | --------------------- | ----------------------------------------------------- | --------------------------------- |
| Line highlighting   | Custom regex parsing  | `transformerMetaHighlight` from @shikijs/transformers | Handles edge cases, range syntax  |
| Syntax highlighting | Custom tokenization   | Shiki (already integrated)                            | Grammar files, theme consistency  |
| File type icons     | Custom icon mapping   | catppuccin-vsc-icons (already integrated)             | Comprehensive coverage            |
| Copy to clipboard   | Custom implementation | navigator.clipboard API (already implemented)         | Already works in CodeBlock.svelte |

**Key insight:** All core functionality exists. This phase is primarily CSS/styling changes with
minor transformer extension.

## Common Pitfalls

### Pitfall 1: Breakout Width Conflicts

**What goes wrong:** Code blocks don't break out properly or overflow the viewport on mobile **Why
it happens:** Multiple CSS rules compete for width control **How to avoid:** Use the existing
breakout pattern from Phase 6. The `.code-block` wrapper and `pre.shiki` are already configured in
`[slug]/+page.svelte` with `grid-column: 1 / -1` and `max-width: 800px` **Warning signs:** Code
blocks not centered, horizontal scrollbar on page

### Pitfall 2: Border-Radius Clipping with Header

**What goes wrong:** Border-radius on container doesn't clip the header properly **Why it happens:**
Header and pre are separate elements with their own border-radius **How to avoid:** Apply
border-radius to figure container with `overflow: hidden`, or coordinate `border-radius` on header
(top corners) and pre (bottom corners) **Warning signs:** Square corners visible at header/code
junction

### Pitfall 3: Copy Button Visibility on Mobile

**What goes wrong:** Copy button invisible or hard to tap on mobile **Why it happens:** Hover-based
opacity doesn't work on touch devices **How to avoid:** Use media query for touch devices or
viewport width to show button at full opacity **Warning signs:** Users report they can't find or use
copy button on phones

### Pitfall 4: Line Number Alignment with Font Size Changes

**What goes wrong:** Line numbers misalign when font size changes between desktop and mobile **Why
it happens:** Line number positioning uses fixed values **How to avoid:** Use relative units (em)
for line number positioning, or adjust in same media query as font size **Warning signs:** Line
numbers overlap code or have inconsistent spacing

### Pitfall 5: Theme-Independent Dark Background

**What goes wrong:** Code block background changes with page theme **Why it happens:** Using
theme-aware color variables **How to avoid:** Use raw/primitive color value (like
`--raw-color-gray-900: #1c1e26` or explicit `#1a1a1a`) for code block background **Warning signs:**
Code blocks look different in light mode (if added later)

## Code Examples

### Current DiagonalStrip Usage (To Remove)

```svelte
// Source: src/lib/components/molecules/CodeBlock.svelte lines 55-67
{#if filename}
    <figcaption class="filename-container">
        <div class="caption-background">
            <DiagonalStrip />
            <!-- REMOVE THIS -->
        </div>
        <div class="filename-content">
            <FileIcon {lang} size={16} class="file-icon" />
            <div data-testid="code-filename" class="filename">
                {filename}
            </div>
        </div>
        <div data-testid="code-lang" class="lang">{lang}</div>
        <!-- Currently display: none -->
    </figcaption>
{/if}
```

### Current Copy Button Position (Top-Right)

```scss
// Source: src/lib/components/molecules/CodeBlock.svelte styles
:global(.copy-button) {
    position: absolute;
    top: 8px; // Currently top-right
    right: 8px;
    z-index: 2;
    opacity: 0; // Hidden by default
    // ...
}
```

### Current Mobile Font Size (10px - needs increase to 12px)

```scss
// Source: src/lib/scss/_markdown.scss lines 138-140
@include breakpoints.for-phone-only {
    font-size: 10px; // Needs to be 12px per requirements
}
```

### Shiki Transformer Extension Pattern

```js
// Source: src/lib/shiki/transformerCodeBlock.js - shows existing pattern
export function transformerCodeBlock() {
    return {
        name: 'transformer-code-block',
        preprocess() {
            // Parse meta string from markdown fence
            const rawMeta = this.options.meta?.__raw ?? '';
            const filenameMatch = rawMeta.match(/filename="([^"]+)"/);

            this.options.meta = {
                ...this.options.meta,
                'data-language': this.options.lang,
                ...(filenameMatch?.[1] && {
                    'data-filename': filenameMatch[1],
                }),
            };
        },
        pre(hast) {
            // Modify the <pre> element HAST
            const showLineNumbers = this.options.meta?.__raw?.includes('showLineNumbers');
            if (showLineNumbers) {
                this.addClassToHast(hast, 'show-line-numbers');
            }
        },
    };
}
```

### Line Highlight Integration Pattern

```js
// Adding transformerMetaHighlight to existing setup
import { transformerMetaHighlight } from '@shikijs/transformers';

// In codeToHtml call (src/lib/sanity/portable-text/CodeBlock.svelte)
codeToHtml(code, {
    lang,
    theme: 'ayu-dark',
    transformers: [
        transformerCodeBlock(),
        transformerMetaHighlight({
            className: 'line-highlighted',
        }),
    ],
});
```

### Line Highlight CSS Pattern

```scss
// Add to _markdown.scss or CodeBlock.svelte
pre.shiki {
    .line.highlighted {
        background-color: rgba(255, 128, 0, 0.15); // Orange tint matching accent
        display: block;
        margin: 0 -1em;
        padding: 0 1em;
    }
}
```

## State of the Art

| Old Approach      | Current Approach    | When Changed | Impact                                 |
| ----------------- | ------------------- | ------------ | -------------------------------------- |
| Prism.js          | Shiki               | Pre-existing | Better theme support, VS Code grammars |
| JS line numbers   | CSS counters        | Pre-existing | Cleaner HTML, no JS needed             |
| Custom copy logic | navigator.clipboard | Pre-existing | Modern API, permission-based           |

**Deprecated/outdated:**

- `_code-highlights.scss`: Contains old Prism token classes (`.token.*`), likely legacy from before
  Shiki migration. Shiki uses inline styles for syntax colors via themes.

## Open Questions

Things that couldn't be fully resolved:

1. **Header background color value**
    - What we know: Should be "distinct color band (darker than code area background)"
    - What's unclear: Exact hex value
    - Recommendation: Use `#141414` or `#121212` (slightly darker than `#1a1a1a`)

2. **Line highlight background color**
    - What we know: Marked as Claude's discretion in CONTEXT.md
    - What's unclear: Preferred color
    - Recommendation: Use accent-tinted transparent (`rgba(255, 128, 0, 0.1)`) for brand consistency

3. **Checkmark display duration**
    - What we know: Current implementation uses 2000ms (2 seconds)
    - What's unclear: If this should change
    - Recommendation: Keep 2000ms (reasonable feedback duration)

## Sources

### Primary (HIGH confidence)

- `src/lib/components/molecules/CodeBlock.svelte` - Current implementation examined
- `src/lib/scss/_markdown.scss` - Current styling examined
- `src/lib/shiki/transformerCodeBlock.js` - Current transformer pattern examined
- `src/routes/[slug]/+page.svelte` - Breakout pattern confirmed (lines 242-251)
- `@shikijs/transformers` types - `transformerMetaHighlight` API verified

### Secondary (MEDIUM confidence)

- Shiki official documentation (https://shiki.style/packages/transformers) - Transformer usage

### Tertiary (LOW confidence)

- None - all findings verified with codebase or official docs

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All packages already installed and configured
- Architecture: HIGH - Current implementation thoroughly examined
- Pitfalls: MEDIUM - Based on CSS patterns, not runtime testing

**Research date:** 2026-01-20 **Valid until:** 2026-02-20 (stable domain, 30 days)

---

_Phase: 07-code-blocks_ _Research completed: 2026-01-20_
