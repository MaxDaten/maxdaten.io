# Design References: Engineering Blog Best Practices

**Project:** maxdaten.io v2.0 Design Refinement **Researched:** 2026-01-20 **Confidence:** HIGH
(direct analysis of production sites)

## Executive Summary

After analyzing 8 leading engineering blogs, clear patterns emerge for precision-engineered
minimalism:

1. **Typography**: System fonts or custom variable fonts with strict hierarchy (4-5 sizes max)
2. **Spacing**: 8px base grid, consistent vertical rhythm, generous whitespace
3. **Code blocks**: Dark backgrounds, language labels, line numbers optional, copy button standard
4. **Meta**: Subdued, monospace dates, small avatars, clear hierarchy below title
5. **Navigation**: Minimal, sticky header, category filters, no visual clutter

---

## Reference 1: Vercel Blog

**URL:** vercel.com/blog **Why it feels polished:** Monospace font pairing creates technical
authority. Extreme whitespace discipline. Every element has purpose.

### Typography

| Element     | Specification                   | Notes                                      |
| ----------- | ------------------------------- | ------------------------------------------ |
| Font family | Geist Sans + Geist Mono         | Custom variable fonts                      |
| Headings    | 72px down to 14px scale         | Supports "Subtle" modifiers                |
| Body text   | 16px base, 1.5 line-height      | "Copy" category with higher line-height    |
| Code        | Geist Mono                      | Designed specifically for code readability |
| Labels      | 12-20px with monospace variants | Tabular numerals for dates                 |

**Key insight:** Geist typography system separates "Labels" (single-line, generous line-height) from
"Copy" (multi-line, tighter) - different tools for different jobs.

### Spacing

- **Grid**: Responsive with defined columns per breakpoint
- **Stack padding**: 16px (sm), 32px (md), 90px (lg/xl)
- **Consistent gaps**: CSS variables (`--stack-gap`)
- **Content max-width**: Constrained grid with visual guides

### Code Blocks (Geist Design System)

```
Features:
- Dark theme default, light/dark adaptive
- Line numbers (hideable via hideLineNumbers)
- Filename display at top
- Copy button standard
- Language switcher for multi-language examples
- Highlighted lines (highlightedLinesNumbers)
- Added/removed line indicators (diff support)
- Shiki syntax highlighting (VS Code engine)
```

**Color approach:** Syntax-aware coloring adapts between themes. Monospace ensures alignment.

### Post Meta

- **Date**: Abbreviated month format ("Dec 5", "Oct 23")
- **Author**: Name + avatar from Contentful
- **Category tags**: Engineering, Community, Company News
- **Position**: Below title, subdued styling

### Navigation

- Header with logo (light/dark variants)
- Mega menu: Products, Resources, Solutions
- Category filtering: "All Posts," "Engineering," etc.
- Search integrated

**Actionable takeaway:** Invest in a proper type scale system. Separate label typography from body
copy. Use monospace for dates and technical metadata.

---

## Reference 2: Sanity.io Blog

**URL:** sanity.io/blog **Why it feels polished:** Consistent 8px grid spacing tokens. Featured post
prominence. Subtle hover states.

### Typography

| Element       | Specification           | Notes                     |
| ------------- | ----------------------- | ------------------------- |
| Page headings | `page-heading-md` class | Large, bold               |
| Post titles   | `component-heading-lg`  | Scales well               |
| Body          | `text-interactive-md`   | Standard interactive size |
| Metadata      | `label-sm`, `label-md`  | Condensed sizing          |

### Spacing (Design Tokens)

```
p-24    = 24px padding (card internals)
mb-96   = 96px margin-bottom (post cards)
gap-y-48 = 48px vertical spacing (sections)
container-x = responsive container padding
```

**Pattern:** Multiples of 8px throughout. Creates unconscious rhythm.

### Post Meta Display

- **Author avatars**: 32px, stacked with overlap on mobile (CSS mask)
- **Dates**: Abbreviated ("Jan 13")
- **Category tags**: Prominent, clickable
- **Position**: Within card, below title

### Code Blocks

- Not prominently featured on blog index
- Article pages use standard syntax highlighting
- Multiple CSS files suggest sophisticated highlighting

### Navigation

- Mobile: Category dropdown (`CategorySelect`)
- Desktop: Horizontal nav (`NavLink`)
- Filters: "All posts," "Product," "Community," "Engineering"
- Active states: `aria-[current=page]` with `bg-bg-dim`

### Color Scheme

```css
--dark: #13141b --light: #f6f6f8 border-border-subtle (tokens) hover: bg-bg-strong (interaction);
```

**Actionable takeaway:** Use spacing tokens religiously. Author avatars with overlap create visual
interest. Featured post should be visually distinct (50/50 split).

---

## Reference 3: Stripe Blog

**URL:** stripe.com/blog **Why it feels polished:** Sohne variable font is beautiful. Author
credibility emphasized. Extreme attention to typographic detail.

### Typography (Sohne Variable Font)

| Element      | Specification          | Notes                                 |
| ------------ | ---------------------- | ------------------------------------- |
| Font family  | Sohne-var              | Fallbacks: Helvetica Neue, Arial      |
| Font weights | 200-500 range          | Normal: 300, Semibold: 425, Bold: 500 |
| Post titles  | 34px, 1.29 line-height | `CopyTitle--variantSection`           |
| Body         | Default weight 300     | Light, elegant                        |

**Key insight:** Variable font with unusual weights (425 semibold!) creates subtle distinctions.

### Spacing

```css
--columnPaddingNormal: 16px --columnPaddingXLarge: 112px (desktop) --layoutWidth: 1080px
    (max content width);
```

- 4-column grid at larger viewports
- Responsive breakpoints: 600px, 900px, 1112px
- Fluid calculations for section padding

### Post Meta Display

- **Author avatars**: 96x96px circular
- **Date format**: "Month Day, Year" (full format)
- **Author attribution**: LinkedIn links, team affiliations
- **Position**: Prominent, below title with team/role info

**Pattern:** Stripe emphasizes WHO wrote it. Engineering credibility through named authors with
credentials.

### Color Scheme (Theme Variants)

```css
/* Light theme */
--textColor: #425466 --titleColor: #0a2540 --backgroundColor: #fff /* Multiple themes */
    .theme--White (primary) .theme--Light .theme--Dark --accentColor for highlights;
```

### Layout Pattern

```
Container + Layout + Section
.Section__container centers within --layoutWidth: 1080px
.BlogIndexPost--variantNormal vs --variantFeatured
```

**Actionable takeaway:** Consider a variable font for subtle weight distinctions. 1080px max-width
is comfortable. Author credentials add credibility to technical posts.

---

## Reference 4: Tailwind CSS Blog

**URL:** tailwindcss.com/blog **Why it feels polished:** Extreme typographic discipline. Code blocks
are first-class citizens. Decorative elements add sophistication without clutter.

### Typography

| Element               | Specification                         | Notes                       |
| --------------------- | ------------------------------------- | --------------------------- |
| Title                 | 2.5rem/10 (40px), tracking-tight      | Scales to 6xl on lg         |
| Section headings (h2) | 3xl (30px), medium weight             | Anchor links for navigation |
| Date                  | Monospace, uppercase, tracking-widest | `text-sm/7 text-gray-500`   |
| Body                  | `prose prose-blog` classes            | Semantic styling            |

**Key insight:** Date in monospace uppercase with wide letter-spacing creates elegant technical
feel.

### Post Header Pattern

```html
<!-- Date: monospace, uppercase, small -->
<div class="font-mono text-sm/7 font-medium tracking-widest text-gray-500 uppercase">
    <time>January 22, 2025</time>
</div>

<!-- Title: large, tight tracking -->
<h1 class="text-[2.5rem]/10 tracking-tight text-pretty text-gray-950">Tailwind CSS v4.0</h1>

<!-- Author: separate section, 36x36 avatar -->
```

### Code Block Styling

```css
/* Container */
rounded-xl bg-gray-950 /* Dark, rounded */

/* Header */
text-xs/5 text-gray-400 /* Language label */

/* Content */
bg-white/10 /* Subtle inner background */

/* Highlighted words */
.highlighted-word before:bg-[lab(19.93_-1.66_-9.7)]

/* Stack-aware */
in-data-stack:rounded-none /* Context-dependent corners */
```

**Features:**

- Dark background (`bg-gray-950`)
- Language labels (12px, gray)
- Shiki syntax highlighting
- Highlighted word support
- Stack-aware styling (no rounded corners when stacked)

### Spacing & Decorative Elements

```css
/* Full-width divider lines */
before:absolute before:h-px before:w-[200vw]
before:bg-gray-950/5 before:-left-[100vw]

/* Post content margin */
mt-16 px-4

/* Responsive max-width */
max-xl:max-w-(--breakpoint-md)
```

**Pattern:** Decorative lines that extend beyond container add sophistication.

### Responsive Layout

- Mobile-first with `max-*` utilities
- XL breakpoint: Three-column (TOC sidebar, border, content)
- CSS variable for gutter: `[--gutter-width:2.5rem]`

### Color Palette

| Mode  | Text     | Background | Accents       |
| ----- | -------- | ---------- | ------------- |
| Light | gray-950 | white      | sky-500 links |
| Dark  | white    | gray-950   | sky-600 hover |

**Actionable takeaway:** Monospace uppercase dates with tracking-widest. Full-width decorative
lines. Code blocks should be dark by default with language labels.

---

## Reference 5: GitHub Blog

**URL:** github.blog **Why it feels polished:** Clear hierarchy through preset typography styles.
Category organization for easy navigation. Developer-focused content treatment.

### Typography System (Presets)

```
Display     - Hero headlines
Title Large - Major sections
Title Medium
Title Small
Body Large  - Primary content
Body Medium - Standard
Body Small  - Captions
```

- Headers: Bold (700), 1.25 line-height
- Sans-serif primary
- Clear visual distinction between levels

### Spacing

```css
--wp--style--block-gap: 24px /* Consistent block spacing */;
```

- 16px, 24px, 32px, 48px scale
- 24px margin for block-level elements

### Navigation

7 main categories with subcategories:

- AI & ML
- Developer Skills
- Engineering
- Enterprise Software
- News & Insights
- Open Source
- Security

Each expands with featured article previews.

### Post Meta

- Author profile images
- Publication dates
- Category tags
- Card-based grids with thumbnails

### Colors

```css
Primary interactive: #32373c (dark)
Supports emoji
Responsive imagery
```

**Actionable takeaway:** 24px as standard block gap. Category organization helps readers find
relevant content. Featured article previews in navigation.

---

## Reference 6: Cloudflare Blog

**URL:** blog.cloudflare.com **Why it feels polished:** Clean, minimal. Consistent card structure.
Multi-tier navigation.

### Typography

- Stacked logo, clear hierarchy
- Post titles as primary focal points
- Author bylines as compact profile cards

### Spacing

- Effective whitespace between sections
- Consistent padding in navigation tags
- Adequate vertical breathing room in post cards

### Navigation Structure

- Primary categories: AI, Developers, Radar, Product News, Security
- Breadcrumb-style tag system
- Pagination: "1, 2... 170" with "Older Posts" link

### Post Meta

- Publication date: ISO format (2026-01-19)
- Author profiles with images and linked names
- Multiple category tags
- Featured image thumbnails

### Tech Stack

- Built with Astro (`<astro-island>` elements)
- Custom component hydration

**Actionable takeaway:** ISO date format for technical audience. Multiple category tags per post.
Simple pagination pattern.

---

## Reference 7: Lee Robinson's Blog (leerob.com)

**URL:** leerob.com **Why it feels polished:** Extreme minimalism. Personal voice. Dark mode done
right.

### Typography

| Element     | Specification                                       |
| ----------- | --------------------------------------------------- |
| Font family | System stack + "Stix Two Text" variable             |
| Links       | 1px underline, offset 2.5px, decoration-neutral-500 |
| Body        | my-5 margins for paragraphs                         |

### Spacing

- `mt-16` on desktop, `mt-0` mobile
- `pl-0 space-y-1` for tight lists
- Mobile-first responsive

### Navigation

Minimal internal links:

- /beliefs
- /agents
- /compression
- External: GitHub, Twitter, YouTube

### Color Scheme

```css
dark:hover:decoration-neutral-600
prefers-color-scheme: dark
```

Neutral palette, no distracting colors.

### Tech Stack

- Next.js with streaming
- Tailwind CSS
- Open Graph + Twitter Cards

**Actionable takeaway:** Link underlines with offset (2.5px) feel refined. Extreme minimalism can
work for personal blogs. Curated navigation to key content only.

---

## Reference 8: Linear Design Style

**Source:** LogRocket analysis, Figma community resources **Why it matters:** Linear has defined a
design movement for SaaS products.

### Core Principles

1. **No zig-zagging content** - Linear flow
2. **One-dimensional scrolling** - Vertical only
3. **Consistently aligned text** - Grid discipline
4. **Minimal CTAs** - One clear path forward

### Visual Elements

| Element    | 2024 Style      | 2025 Evolution                 |
| ---------- | --------------- | ------------------------------ |
| Colors     | Monochrome blue | Monochrome black/white         |
| Gradients  | Complex         | Selective, bolder              |
| Typography | Bold            | Bolder, more individuality     |
| Dark mode  | Default         | Still default, higher contrast |

### Glassmorphism

- Glass effect "infuses detail with readability"
- Risk: Can appear generic if overused
- Use sparingly for accents

### Design Philosophy

```
Clean layouts + ample whitespace = reduced cognitive load
Clutter-free + high-contrast = accessible
Fewer bugs + increased performance = faster development
```

**Actionable takeaway:** Reduce color usage. Black/white with selective accents. Consistent
alignment creates unconscious quality perception.

---

## Synthesis: Design Patterns for maxdaten.io

### Typography Recommendations

| Element    | Recommendation                      | Rationale                        |
| ---------- | ----------------------------------- | -------------------------------- |
| Body font  | System stack or Inter/Geist         | Fast loading, proven readability |
| Code font  | JetBrains Mono or Fira Code         | Ligatures, purpose-built         |
| Title size | 2.5rem (40px) base                  | Tailwind/Vercel pattern          |
| Body size  | 16px, 1.6 line-height               | Optimal for long-form            |
| Meta/dates | Monospace, uppercase, tracking-wide | Tailwind pattern                 |

### Spacing System

```scss
// 8px base grid
$space-1: 8px;
$space-2: 16px;
$space-3: 24px; // Standard block gap
$space-4: 32px;
$space-6: 48px;
$space-8: 64px;
$space-12: 96px; // Section spacing

// Max content width
$content-width: 680px; // Optimal line length
$layout-width: 1080px; // Full layout
```

### Code Block Specification

```scss
.code-block {
  // Container
  background: #1a1b26;  // Dark, not pure black
  border-radius: 12px;  // Rounded corners
  overflow: hidden;

  // Header
  .language-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    padding: 8px 16px;
    font-family: monospace;
  }

  // Content
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;

  // Features
  - Line numbers (optional)
  - Copy button (required)
  - Language label (required)
  - Syntax highlighting via Shiki
}
```

### Post Meta Pattern

```html
<!-- Order: Date, then title, then author -->
<div class="post-header">
    <time class="meta-date">JANUARY 20, 2026</time>
    <h1 class="post-title">Article Title Here</h1>
    <div class="meta-author">
        <img src="avatar.jpg" class="avatar" />
        <!-- 32-36px -->
        <span class="author-name">Author Name</span>
    </div>
</div>
```

```scss
.meta-date {
    font-family: monospace;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
}

.post-title {
    font-size: 2.5rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 16px 0 24px;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
```

### Navigation Pattern

```
Desktop: Logo | [spacer] | Blog | About | [theme toggle]
Mobile: Logo | [hamburger]

- Sticky header (subtle shadow on scroll)
- Category filters on blog index
- Minimal links (5-7 max)
```

### Color System

```scss
// Light mode
--bg: #ffffff;
--bg-subtle: #f6f6f8;
--text: #0a2540;
--text-muted: #425466;
--border: rgba(0, 0, 0, 0.05);
--accent: #0070f3;

// Dark mode
--bg: #13141b;
--bg-subtle: #1a1b26;
--text: #ffffff;
--text-muted: rgba(255, 255, 255, 0.6);
--border: rgba(255, 255, 255, 0.1);
--accent: #0070f3;

// Code blocks (always dark)
--code-bg: #1a1b26;
```

---

## Priority Fixes for maxdaten.io

Based on the stated issues (code blocks feel bolted on, meta elements look amateurish, inconsistent
spacing):

### 1. Code Blocks (HIGH PRIORITY)

**Current issue:** "Feel bolted on"

**Fix:**

- Remove any borders, add rounded corners (12px)
- Dark background always (don't match page theme)
- Add language label in header
- Add copy button
- Ensure consistent padding (16px)
- Use Shiki with appropriate theme (tokyo-night or similar)

### 2. Post Meta (HIGH PRIORITY)

**Current issue:** "Look amateurish"

**Fix:**

- Move date above title in monospace uppercase
- Reduce date size to 12px
- Add letter-spacing: 0.1em to date
- Smaller avatar (32-36px)
- Position author below title
- Muted colors for all meta

### 3. Spacing (MEDIUM PRIORITY)

**Current issue:** "Inconsistent"

**Fix:**

- Implement 8px grid system
- Use 24px as standard block gap
- 96px between major sections
- 680px max content width for body text
- Document spacing tokens and use consistently

### 4. Typography (MEDIUM PRIORITY)

**Fix:**

- Audit current font sizes, reduce to 4-5 levels
- Ensure proper hierarchy (display > title > body > caption)
- Add negative letter-spacing to large headings (-0.02em)
- Increase line-height for body text (1.6)

---

## Sources

### Primary Analysis

- [Vercel Blog](https://vercel.com/blog) - Direct site analysis
- [Vercel Geist Code Block](https://vercel.com/geist/code-block) - Component documentation
- [Vercel Geist Typography](https://vercel.com/geist/typography) - Type system
- [Sanity.io Blog](https://sanity.io/blog) - Direct site analysis
- [Stripe Blog](https://stripe.com/blog) - Direct site analysis
- [GitHub Blog](https://github.blog) - Direct site analysis
- [Cloudflare Blog](https://blog.cloudflare.com) - Direct site analysis
- [Lee Robinson's Blog](https://leerob.com) - Direct site analysis
- [Tailwind CSS Blog](https://tailwindcss.com/blog) - Direct site analysis

### Design Trend Research

- [Linear Design Trend Analysis - LogRocket](https://blog.logrocket.com/ux-design/linear-design/)
- [Best Engineering Blogs - Draft.dev](https://draft.dev/learn/engineering-blogs)
- [Geist Font - Vercel](https://vercel.com/font)
- [Best Programming Fonts - WPShout](https://wpshout.com/best-programming-fonts/)

### Font Recommendations

- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- [Fira Code](https://github.com/tonsky/FiraCode)
- [Monaspace by GitHub](https://monaspace.githubnext.com/)
