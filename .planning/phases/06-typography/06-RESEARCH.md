# Phase 6: Typography - Research

**Researched:** 2026-01-20 **Domain:** CSS Typography, Font Loading, Reading Experience
**Confidence:** HIGH

## Summary

Research into the typography implementation for maxdaten.io reveals a well-structured foundation
from Phase 5 design tokens. The typography token system already defines line-height primitives
(`--raw-leading-tight: 1.1` through `--raw-leading-relaxed: 1.65`) and semantic tokens. The primary
work involves applying these tokens consistently across components and updating font families per
CONTEXT.md decisions.

Current state shows fragmented line-height values (1.3 on body, 1.55 in markdown paragraphs, 1.6 in
lists) that need consolidation. Prose width is defined as `65ch` (~680px equivalent), close to the
target of 680px. Font families are scattered across four custom fonts (Inter, Merriweather, Ubuntu
Mono, Baloo-2) when the decision is to consolidate to two (geometric sans + JetBrains Mono).

**Primary recommendation:** Replace font families first (highest impact), then systematically apply
line-height tokens from the existing foundation, and finally adjust prose width to exact 680px.

## Current State Analysis

### Existing Line-Height Values

| Location                              | Current Value | Target Value | Notes                             |
| ------------------------------------- | ------------- | ------------ | --------------------------------- |
| `body` (global.scss:76)               | 1.3           | 1.6          | Semantic: `--text-body-leading`   |
| `_reset.scss:18`                      | 1.5           | N/A          | Josh's reset, overridden by body  |
| `.content p` (\_markdown.scss:12)     | 1.55em        | 1.6          | Paragraphs in prose               |
| `.content ul/ol` (\_markdown.scss:70) | 1.6           | 1.4-1.5      | Lists slightly looser than target |
| `pre.shiki` (\_markdown.scss:134)     | 1.6           | Keep         | Code blocks fine                  |
| `blockquote`                          | Not set       | 1.5          | Need to add                       |
| Headings h1-h5                        | Not set       | 1.1-1.2      | Need to add                       |

### Typography Token Foundation (from Phase 5)

The `_tokens-typography.scss` already provides:

```scss
// Primitive line-heights - READY TO USE
--raw-leading-tight: 1.1; // For H1-H2
--raw-leading-snug: 1.25; // For H3-H4 (need 1.2, close enough)
--raw-leading-normal: 1.5; // For blockquotes
--raw-leading-relaxed: 1.65; // For body (need 1.6, close enough)

// Semantic tokens - PARTIALLY USED
--text-body-leading: var(--raw-leading-relaxed);
--text-heading-leading: var(--raw-leading-tight);
```

**Gap identified:** No semantic tokens for list or blockquote line-heights. The planner should
decide whether to add these or use primitives directly.

### Current Font Families

| Variable          | Font         | Usage       | Status                      |
| ----------------- | ------------ | ----------- | --------------------------- |
| `--font--default` | Inter        | Body text   | KEEP (matches decision)     |
| `--font--title`   | Merriweather | Headings    | REPLACE with Inter          |
| `--font-logo`     | Baloo-2      | Logo only   | KEEP (special case)         |
| `--font--mono`    | Ubuntu Mono  | Code blocks | REPLACE with JetBrains Mono |

**Loaded fonts in global.scss:**

- Inter (500, 600, 700 weights) - KEEP
- Merriweather (400, 900 weights) - REMOVE
- Ubuntu Mono (400 weight) - REMOVE
- Baloo-2 (400 weight) - KEEP (logo only)

**Decision from CONTEXT.md:** Body/headings use one geometric sans (Inter) + JetBrains Mono for
code/meta elements. This simplifies the font stack from 4 to 3 fonts.

### Prose Width Analysis

Current: `--main-column-width: 65ch` in `[slug]/+page.svelte`

At 16px base with Inter font, 65ch equals approximately 650-680px depending on character mix. The
target is exactly 680px for 60-80 characters per line. The current approach using `ch` units is
semantically correct and responsive. Converting to explicit 680px is a minor change but ensures
consistency with design spec.

**Code block breakout:** CONTEXT.md specifies ~800px for code blocks and images. Currently code
blocks don't break out - they constrain to the prose column. This is a new behavior to implement.

### Meta Elements Requiring Monospace

From the codebase analysis, these elements display date/meta information:

| Component             | Element      | Current Font    | Change Needed |
| --------------------- | ------------ | --------------- | ------------- |
| `[slug]/+page.svelte` | `.note time` | Default (Inter) | Add monospace |
| `[slug]/+page.svelte` | Reading time | Default (Inter) | Add monospace |
| `Author.svelte`       | `.name`      | Default (Inter) | Add monospace |
| `Tag.svelte`          | Tag text     | Default (Inter) | Add monospace |

**CONTEXT.md decisions for monospace:**

- Dates: Monospace, uppercase, with letter-spacing
- Reading time: Monospace, normal case
- Tags: Monospace
- Author name: Monospace

## Files to Modify

### Primary Files (typography changes)

| File                                   | Changes                                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| `src/lib/scss/_variables.scss`         | Update `--font--title` to Inter, `--font--mono` to JetBrains Mono |
| `src/lib/scss/global.scss`             | Update font imports, set body line-height to token                |
| `src/lib/scss/_typography.scss`        | Add heading line-heights, remove Merriweather reference           |
| `src/lib/scss/_markdown.scss`          | Update paragraph/list line-heights to tokens                      |
| `src/lib/scss/_tokens-typography.scss` | Add list/blockquote line-height tokens if needed                  |

### Component Files (monospace treatment)

| File                                         | Changes                                                           |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `src/routes/[slug]/+page.svelte`             | Update `--main-column-width` to 680px, add monospace to date/time |
| `src/lib/components/atoms/Tag.svelte`        | Add monospace font-family                                         |
| `src/lib/components/molecules/Author.svelte` | Add monospace to name                                             |

### Font Package Changes

```bash
# Remove
npm uninstall @fontsource/merriweather @fontsource-variable/merriweather

# Add
npm install @fontsource/jetbrains-mono
# OR for variable font (smaller, better)
npm install @fontsource-variable/jetbrains-mono
```

## Implementation Approach

### Phase Order (recommended)

1. **Font consolidation first** - Highest visual impact, isolated change
    - Add JetBrains Mono package
    - Update `_variables.scss` font variables
    - Update `global.scss` font imports
    - Remove Merriweather imports and package

2. **Line-height application** - Systematic, uses existing tokens
    - Update body line-height to use `--text-body-leading`
    - Add heading line-heights using `--text-heading-leading`
    - Update `_markdown.scss` to use tokens
    - Add blockquote line-height

3. **Prose width adjustment** - Minor, simple change
    - Update `--main-column-width: 680px` in article page
    - Add CSS grid for code block/image breakout to ~800px

4. **Monospace meta treatment** - Component-level styling
    - Add CSS class for monospace meta elements
    - Apply to dates, reading time, author, tags
    - Add uppercase + letter-spacing for dates specifically

### Code Block Breakout Pattern

The article page uses CSS Grid for content layout:

```scss
.content {
    display: grid;
    grid-template-columns: 1fr min(var(--main-column-width), 100%) 1fr;

    > * {
        grid-column: 2;
    }
}
```

For breakout elements, add:

```scss
.content :global(.code-block),
.content :global(.wrap.reveal) {
    grid-column: 1 / -1;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}
```

## Don't Hand-Roll

| Problem               | Don't Build                 | Use Instead                        | Why                               |
| --------------------- | --------------------------- | ---------------------------------- | --------------------------------- |
| Font loading          | Manual @font-face           | Fontsource packages                | Handles formats, weights, subsets |
| Line-height values    | Magic numbers               | Typography tokens from Phase 5     | Consistency, maintainability      |
| Responsive typography | Media queries for font size | `clamp()` or existing scale        | Phase 5 established the scale     |
| Font display strategy | Complex loading JS          | `font-display: swap` in Fontsource | Standard, performant              |

## Common Pitfalls

### Pitfall 1: Cascading Line-Height Issues

**What goes wrong:** Setting line-height on body doesn't affect elements with explicit line-height
**Why it happens:** More specific selectors override inherited values **How to avoid:** Audit all
line-height declarations first, use `inherit` or tokens systematically **Warning signs:**
Inconsistent spacing between paragraphs and lists

### Pitfall 2: Font Loading Flash (FOUT)

**What goes wrong:** Text renders in system font, then jumps when custom font loads **Why it
happens:** Custom fonts load asynchronously **How to avoid:** Use `font-display: swap` (Fontsource
default), test on slow connection **Warning signs:** Text reflow on page load

### Pitfall 3: ch Unit Variance

**What goes wrong:** `65ch` width differs between fonts **Why it happens:** `ch` unit is based on
the "0" character width, varies by font **How to avoid:** Use explicit pixel value (680px) when
precision matters **Warning signs:** Line length varies after font change

### Pitfall 4: Heading Line-Height + Multi-line

**What goes wrong:** 1.1 line-height on multi-line headings looks too tight **Why it happens:**
Line-height works differently for single vs multi-line text **How to avoid:** Test all heading
levels with long titles (2-3 lines) **Warning signs:** Lines overlap or feel cramped on mobile

### Pitfall 5: Monospace Width Inconsistency

**What goes wrong:** Uppercase dates with letter-spacing break layouts **Why it happens:**
Monospace + uppercase + letter-spacing adds significant width **How to avoid:** Test with realistic
date strings, use `white-space: nowrap` **Warning signs:** Date wraps awkwardly or breaks flex
layouts

## Risk Areas

### Breaking Changes

1. **Heading appearance** - Switching from Merriweather (serif) to Inter (sans-serif) is a
   significant visual change. All headings will look different.

2. **Code block width** - Implementing breakout behavior changes the visual flow of articles.
   Existing articles may look different.

3. **Logo font** - Baloo-2 is only used for the logo. Ensure it's not accidentally removed.

### Testing Priorities

1. **Blog post rendering** - Primary content area, most typography changes
2. **Heading hierarchy** - Check all h1-h5 with new line-heights
3. **Code blocks** - Verify breakout works and doesn't break on mobile
4. **Meta elements** - Test date formatting with monospace/uppercase
5. **Font loading** - Test on throttled connection for FOUT

## Code Examples

### Token-Based Line-Height Application

```scss
// Source: _tokens-typography.scss (existing)
body {
    line-height: var(--text-body-leading); // 1.65
}

h1,
h2 {
    line-height: var(--text-heading-leading); // 1.1
}

h3,
h4 {
    line-height: var(--raw-leading-snug); // 1.25
}

blockquote {
    line-height: var(--raw-leading-normal); // 1.5
}
```

### Monospace Meta Element Pattern

```scss
.meta-text {
    font-family: var(--font--mono), monospace;
    font-size: 0.85rem;
    color: rgba(var(--color--secondary-rgb), 0.8);
}

.meta-date {
    @extend .meta-text;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

### JetBrains Mono Integration

```scss
// In global.scss
@use 'pkg:@fontsource/jetbrains-mono/scss' as JetBrains-Mono;

@include fontsource.faces(
    $metadata: JetBrains-Mono.$metadata,
    $family: 'JetBrains Mono',
    $subsets: latin,
    $weights: (
        400,
    ),
    $styles: all
);
```

## State of the Art

| Old Approach                  | Current Approach              | When Changed | Impact                     |
| ----------------------------- | ----------------------------- | ------------ | -------------------------- |
| Serif headings (Merriweather) | Sans-serif throughout (Inter) | This phase   | Cleaner, modern look       |
| Ubuntu Mono                   | JetBrains Mono                | This phase   | Better code readability    |
| Mixed line-heights            | Token-based system            | This phase   | Consistent vertical rhythm |
| `ch` unit for width           | Explicit pixel value          | This phase   | Predictable layout         |

## Open Questions

1. **Should `--raw-leading-snug` be adjusted to 1.2?**
    - Current: 1.25
    - CONTEXT.md specifies: H3-H4 at 1.2
    - Recommendation: Accept 1.25 as "close enough" to avoid token changes

2. **Variable font vs static font for JetBrains Mono?**
    - Variable: Smaller total size, more flexibility
    - Static: Simpler, more predictable
    - Recommendation: Use static (400 weight only needed for code/meta)

3. **Should Inter weights change with heading unification?**
    - Current: 500, 600, 700
    - With headings: May need 400 for body, 600-700 for headings
    - Recommendation: Keep current, Merriweather removal simplifies

## Sources

### Primary (HIGH confidence)

- Codebase analysis: `src/lib/scss/*.scss` files
- `_tokens-typography.scss` - Existing token definitions
- `_variables.scss` - Current font variable definitions
- `global.scss` - Font loading configuration

### Secondary (MEDIUM confidence)

- Fontsource package search - JetBrains Mono v5.2.8 available
- Fontsource package search - Plus Jakarta Sans v5.2.8 available (alternative)

### Tertiary (LOW confidence)

- None - All findings verified with codebase or package registry

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All fonts available via Fontsource
- Architecture: HIGH - Token system already in place from Phase 5
- Pitfalls: MEDIUM - Based on common CSS typography issues

**Research date:** 2026-01-20 **Valid until:** 2026-02-20 (stable domain, 30-day validity)

---

_Phase: 06-typography_ _Research completed: 2026-01-20_
