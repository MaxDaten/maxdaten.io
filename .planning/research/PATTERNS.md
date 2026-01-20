# Design Patterns for Modern Minimalist Blog

**Domain:** Personal tech blog design refinement **Researched:** 2026-01-20 **Confidence:** HIGH
(verified against multiple authoritative sources)

---

## Executive Summary

This document provides prescriptive design patterns for achieving a precision-engineered,
Vercel/Sanity-quality aesthetic. The core issues identified in the current implementation are:

1. **No systematic spacing scale** - ad-hoc pixel values (10px, 15px, 6px, 40px)
2. **Inconsistent typography scale** - font sizes don't follow a mathematical ratio
3. **Low line-height** - 1.3 is too tight for comfortable reading
4. **Mixed spacing patterns** - no unified rhythm across components

The recommendations below establish a cohesive design language.

---

## 1. Spacing System

### Recommended: 4px Base Grid with 8px Primary Scale

Use a **4px base unit** with an **8px primary scale**. This provides flexibility for fine
adjustments while maintaining a consistent visual rhythm.

**Spacing Scale:**

| Token       | Value | Use Cases                                           |
| ----------- | ----- | --------------------------------------------------- |
| `--space-1` | 4px   | Icon gaps, inline element spacing, fine adjustments |
| `--space-2` | 8px   | Tight component padding, related item spacing       |
| `--space-3` | 12px  | Form field spacing, small component gaps            |
| `--space-4` | 16px  | Default padding, paragraph spacing                  |
| `--space-5` | 24px  | Section padding (mobile), card padding              |
| `--space-6` | 32px  | Section gaps, medium breathing room                 |
| `--space-7` | 48px  | Section padding (desktop), major separations        |
| `--space-8` | 64px  | Page sections, hero spacing                         |
| `--space-9` | 80px  | Maximum section spacing (desktop)                   |

**Implementation in SCSS:**

```scss
:root {
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 24px;
    --space-6: 32px;
    --space-7: 48px;
    --space-8: 64px;
    --space-9: 80px;
}
```

### Spacing Rules

1. **Element size dictates spacing** - Small elements need smaller spacers
2. **Consistent rhythm** - Use the same spacing tokens throughout
3. **Responsive reduction** - Reduce spacing by one step on mobile (e.g., `--space-6` becomes
   `--space-5`)
4. **Never use arbitrary values** - All spacing must come from the scale

### Current Issues to Fix

| Current                    | Problem               | Replace With                                             |
| -------------------------- | --------------------- | -------------------------------------------------------- |
| `margin: 10px 0 10px 40px` | Non-systematic values | `margin: var(--space-3) 0 var(--space-3) var(--space-7)` |
| `margin: 6px 0`            | Not on grid           | `margin: var(--space-2) 0`                               |
| `padding: 15px`            | Not on grid           | `padding: var(--space-4)`                                |
| `padding: 20px` / `30px`   | Arbitrary responsive  | `padding: var(--space-5)` / `var(--space-6)`             |

---

## 2. Typography System

### Recommended: Major Third Scale (1.25 ratio)

The **Major Third (1.25)** ratio provides balanced, moderate contrast ideal for content-focused
blogs. It creates clear hierarchy without excessive jumps.

**Typography Scale:**

| Token         | Size (px) | Size (rem) | Use Case                           |
| ------------- | --------- | ---------- | ---------------------------------- |
| `--text-xs`   | 12px      | 0.75rem    | Captions, timestamps, metadata     |
| `--text-sm`   | 14px      | 0.875rem   | Secondary text, labels             |
| `--text-base` | 16px      | 1rem       | Body text (mobile)                 |
| `--text-md`   | 18px      | 1.125rem   | Body text (desktop) - current base |
| `--text-lg`   | 20px      | 1.25rem    | Lead paragraphs, h4                |
| `--text-xl`   | 25px      | 1.5625rem  | h3                                 |
| `--text-2xl`  | 31px      | 1.9375rem  | h2                                 |
| `--text-3xl`  | 39px      | 2.4375rem  | h1 (mobile)                        |
| `--text-4xl`  | 49px      | 3.0625rem  | h1 (desktop), hero                 |

### Line Height Guidelines

| Content Type                      | Line Height | Rationale                     |
| --------------------------------- | ----------- | ----------------------------- |
| **Body text**                     | 1.6 - 1.7   | Optimal for sustained reading |
| **Large headings** (h1, h2)       | 1.1 - 1.2   | Tight for visual impact       |
| **Small headings** (h3, h4)       | 1.3 - 1.4   | Balanced hierarchy            |
| **UI elements** (buttons, labels) | 1.2 - 1.3   | Compact but readable          |

**Critical Fix:** Current `line-height: 1.3` on body is too tight. Increase to `1.6` minimum.

### Font Weight Guidelines

| Purpose          | Weight  | Notes                          |
| ---------------- | ------- | ------------------------------ |
| Body text        | 400-500 | Regular weight for readability |
| Emphasized body  | 600     | Semi-bold for inline emphasis  |
| Headings (serif) | 700-900 | Bold for clear hierarchy       |
| UI labels        | 500-600 | Medium-weight for clarity      |

### Implementation

```scss
:root {
    // Type scale (Major Third - 1.25 ratio)
    --text-xs: 0.75rem; // 12px
    --text-sm: 0.875rem; // 14px
    --text-base: 1rem; // 16px
    --text-md: 1.125rem; // 18px (desktop body)
    --text-lg: 1.25rem; // 20px
    --text-xl: 1.5625rem; // 25px
    --text-2xl: 1.9375rem; // 31px
    --text-3xl: 2.4375rem; // 39px
    --text-4xl: 3.0625rem; // 49px

    // Line heights
    --leading-tight: 1.2;
    --leading-snug: 1.4;
    --leading-normal: 1.6;
    --leading-relaxed: 1.7;
}

// Heading styles
h1 {
    font-size: var(--text-3xl);
    line-height: var(--leading-tight);
    font-weight: 700;

    @include breakpoints.for-desktop-up {
        font-size: var(--text-4xl);
    }
}

h2 {
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
    font-weight: 600;
}

h3 {
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    font-weight: 600;
}

h4 {
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    font-weight: 600;
}

// Body text
body {
    font-size: var(--text-base);
    line-height: var(--leading-normal);

    @include breakpoints.for-tablet-portrait-up {
        font-size: var(--text-md);
    }
}
```

### Current Issues to Fix

| Element          | Current | Issue                | Recommended                           |
| ---------------- | ------- | -------------------- | ------------------------------------- |
| h1               | 2.5rem  | Arbitrary, too large | `var(--text-3xl)` / `var(--text-4xl)` |
| h2               | 1.8rem  | Arbitrary            | `var(--text-2xl)`                     |
| h3               | 1.5rem  | Close to scale       | `var(--text-xl)`                      |
| h4               | 1.2rem  | Arbitrary            | `var(--text-lg)`                      |
| body line-height | 1.3     | Too tight            | 1.6                                   |

---

## 3. Visual Hierarchy Principles

### Hierarchy Through Contrast

Create clear visual hierarchy using these methods in order of impact:

1. **Size** - Larger elements draw attention first
2. **Weight** - Bolder text stands out
3. **Color** - Use accent color sparingly for emphasis
4. **Space** - More whitespace around important elements

### Spacing for Hierarchy

| Relationship           | Spacing                    | Example                    |
| ---------------------- | -------------------------- | -------------------------- |
| Heading to body        | `--space-4` (16px)         | h2 to paragraph            |
| Paragraph to paragraph | `--space-4` (16px)         | Between <p> tags           |
| Section to section     | `--space-7` to `--space-8` | Major content blocks       |
| Related items          | `--space-2` to `--space-3` | List items, card elements  |
| Card internal padding  | `--space-5` to `--space-6` | Comfortable breathing room |

### The Proximity Principle

Elements that are related should be closer together than unrelated elements:

```
[Heading]           <- --space-4 (16px) - close to its content
[Paragraph text]
                    <- --space-6 (32px) - separation from next section
[Next Heading]
```

---

## 4. Information Density Guidelines

### For a Tech Blog

A personal tech blog serves **readers who want to learn**, not power users scanning dashboards.
Optimize for:

- **Comfortable reading** over maximum density
- **Progressive disclosure** for code examples and details
- **Generous whitespace** to reduce cognitive load

### Density Recommendations

| Element               | Recommendation                      |
| --------------------- | ----------------------------------- |
| **Line length**       | 60-80 characters (optimal reading)  |
| **Max content width** | 720-800px for prose                 |
| **Card density**      | Medium - prioritize scannability    |
| **Code blocks**       | Full width with comfortable padding |

### Max-Width for Readability

```scss
.prose-content {
    max-width: 42rem; // ~672px at 16px base = ~65-70 characters
}

.full-width-content {
    max-width: var(--container-max); // 1080px for cards, grids
}
```

---

## 5. Mobile vs Desktop Considerations

### Responsive Typography

| Breakpoint          | Base Font | Heading Scale      |
| ------------------- | --------- | ------------------ |
| Mobile (<768px)     | 16px      | Reduce by one step |
| Tablet (768-1200px) | 17px      | Full scale         |
| Desktop (>1200px)   | 18px      | Full scale         |

### Responsive Spacing

| Breakpoint | Section Padding    | Card Padding       |
| ---------- | ------------------ | ------------------ |
| Mobile     | `--space-5` (24px) | `--space-4` (16px) |
| Tablet     | `--space-6` (32px) | `--space-5` (24px) |
| Desktop    | `--space-7` (48px) | `--space-6` (32px) |

### Touch Targets

- **Minimum touch target:** 44px x 44px on mobile
- **Clickable elements:** Ensure adequate padding
- **Spacing between targets:** Minimum 8px

### Implementation Pattern

```scss
.section {
    padding: var(--space-5) 0;

    @include breakpoints.for-tablet-portrait-up {
        padding: var(--space-6) 0;
    }

    @include breakpoints.for-desktop-up {
        padding: var(--space-7) 0;
    }
}
```

---

## 6. Dark Mode Considerations

### Current State

The site is dark-mode only (`$color-page-background: #1c1e26`). This simplifies implementation but
requires attention to:

### Contrast Requirements (WCAG 2.1 AA)

| Element            | Minimum Ratio | Recommended |
| ------------------ | ------------- | ----------- |
| Body text          | 4.5:1         | 7:1 (AAA)   |
| Large text (18px+) | 3:1           | 4.5:1       |
| UI components      | 3:1           | 4.5:1       |

### Dark Mode Typography Adjustments

1. **Avoid pure white on pure black** - Current `#fffcfc` on `#1c1e26` is good
2. **Consider slightly heavier weights** - Thin fonts can be hard to read on dark backgrounds
3. **Increase letter-spacing slightly** - Helps legibility in dark mode

### Color Recommendations

| Purpose         | Current   | Assessment                       |
| --------------- | --------- | -------------------------------- |
| Background      | `#1c1e26` | Good - not pure black            |
| Text            | `#fffcfc` | Good - not pure white            |
| Post background | `#141519` | Darker variant provides layering |

**Recommendation:** The current color choices are sound. No changes needed for dark mode colors.

---

## 7. Component-Specific Patterns

### Blog Post Cards

```scss
.blog-card {
    padding: var(--space-5);
    gap: var(--space-3);

    .card-title {
        font-size: var(--text-lg);
        line-height: var(--leading-snug);
        margin-bottom: var(--space-2);
    }

    .card-excerpt {
        font-size: var(--text-sm);
        line-height: var(--leading-normal);
    }

    .card-meta {
        font-size: var(--text-xs);
        margin-top: var(--space-3);
    }
}
```

### Article Content

```scss
.article-content {
    max-width: 42rem;

    p {
        margin-bottom: var(--space-4);
        line-height: var(--leading-relaxed);
    }

    h2 {
        margin-top: var(--space-7);
        margin-bottom: var(--space-4);
    }

    h3 {
        margin-top: var(--space-6);
        margin-bottom: var(--space-3);
    }

    ul,
    ol {
        margin: var(--space-4) 0;
        padding-left: var(--space-5);

        li {
            margin-bottom: var(--space-2);
        }
    }

    pre {
        margin: var(--space-5) 0;
        padding: var(--space-4);
    }
}
```

### Header/Navigation

```scss
.header {
    padding: var(--space-4) 0;

    @include breakpoints.for-tablet-portrait-up {
        padding: var(--space-5) 0;
    }
}

.nav-item {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-weight: 500;
}
```

---

## 8. Implementation Checklist

### Phase 1: Foundation (Must Do First)

- [ ] Add spacing scale CSS custom properties to `:root`
- [ ] Add typography scale CSS custom properties to `:root`
- [ ] Update `body` line-height from 1.3 to 1.6
- [ ] Update heading sizes to use scale tokens

### Phase 2: Global Styles

- [ ] Update `_base.scss` list margins to use spacing tokens
- [ ] Update `_mixins.scss` container padding to use spacing tokens
- [ ] Update `_typography.scss` heading styles

### Phase 3: Components

- [ ] Audit each component for spacing consistency
- [ ] Replace arbitrary pixel values with tokens
- [ ] Ensure consistent heading usage

### Phase 4: Validation

- [ ] Check WCAG contrast ratios
- [ ] Test on actual mobile device
- [ ] Visual review for rhythm and consistency

---

## Sources

### Spacing Systems

- [Spacing, grids, and layouts - designsystems.com](https://www.designsystems.com/space-grids-and-layouts/)
- [Basics: Spacing systems & scales in UI design - Designary](https://blog.designary.com/p/spacing-systems-and-scales-ui-design)
- [8-Point Grid - Spec.fm](https://spec.fm/specifics/8-pt-grid)
- [Red Hat Design System - Spacing](https://ux.redhat.com/foundations/spacing/)

### Typography

- [Vercel Geist Typography](https://vercel.com/geist/typography)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
- [Modern Web Typography Techniques - FrontendTools](https://www.frontendtools.tech/blog/modern-web-typography-techniques-2025-readability-guide)
- [The ideal line length & line height - Pimp my Type](https://pimpmytype.com/line-length-line-height/)
- [Typographic Scales - Spec.fm](https://spec.fm/specifics/type-scale)

### Information Density

- [Balancing information density - LogRocket](https://blog.logrocket.com/balancing-information-density-in-web-development/)
- [Designing for information density - UX Collective](https://uxdesign.cc/designing-for-information-density-69775165a18e)

### Responsive & Dark Mode

- [Font Size Guidelines for Responsive Websites - Learn UI Design](https://www.learnui.design/blog/mobile-desktop-website-font-size-guidelines.html)
- [Dark Mode Design Best Practices 2025 - CUIBIT](https://cuibit.com/dark-mode-design-best-practices-for-2025/)
- [Color Contrast Accessibility WCAG Guide - AllAccessible](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)

### Tailwind/CSS Frameworks

- [Creating a type scale in Tailwind CSS - Subframe](https://www.subframe.com/blog/creating-a-type-scale-in-tailwind-css)
- [Tailwind CSS Typography Plugin - GitHub](https://github.com/tailwindlabs/tailwindcss-typography)
