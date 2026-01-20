# Component Design Research

**Project:** maxdaten.io v2.0 Design Refinement **Researched:** 2026-01-20 **Overall Confidence:**
HIGH

## Executive Summary

This research analyzes component design patterns from leading engineering blogs (Josh Comeau, Dan
Abramov's Overreacted, Lee Robinson, Kent C. Dodds, Vercel/Geist, Stripe) to inform the design
refinement of maxdaten.io. The focus is on five key components: code blocks, post meta, hero images,
navigation, and footer.

The current implementation has solid foundations but several areas where "bolted on" aesthetics can
be elevated to integrated, professional design through specific styling refinements detailed below.

---

## 1. Code Blocks

### Current State Analysis

The existing implementation uses:

- Shiki with TextMate grammars (same as VS Code) - excellent choice
- Custom transformer for filename/line numbers
- CodeBlock.svelte wrapper component
- Copy-to-clipboard functionality
- 8px border radius, monospace font

**Issues identified:**

- Filename header uses DiagonalStrip background pattern (potentially busy)
- Copy button appears on hover only - may not be discoverable
- No visual differentiation for line highlighting
- Border is subtle (0.5px) which may feel unfinished

### Best Practices from Reference Sites

**Josh Comeau (joshwcomeau.com)**

- Custom syntax theme with brand-aligned colors
- Line highlighting with "little bump on the left" for visual emphasis
- Copy button visible on hover with smooth opacity transitions
- Uses Shiki for compile-time highlighting (no JS bundle bloat)
- Generous padding, readable font size
- Source: [How I Built My Blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/)

**Vercel Geist Design System**

- Line numbers displayed by default (can be hidden)
- Optional filename header
- Line linking (click line numbers to reference)
- Added/removed line indicators for diff views
- Language switcher for multi-language examples
- Source: [Geist Code Block](https://vercel.com/geist/code-block)

**Mintlify Documentation**

- Shiki with full theme library support
- Twoslash for hover type information
- Line focusing to direct attention
- Visual diff features
- Custom icons beside titles
- Source: [Code Block Documentation](https://www.mintlify.com/blog/code-block-documentation)

### Specific Recommendations

#### Container Styling

```css
/* Recommended code block container */
.code-block {
    --code-bg: var(--color-code-background);
    --code-border: rgba(var(--color-secondary-rgb), 0.15);

    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-radius: 12px; /* Slightly larger radius for modern feel */
    overflow: hidden;
    margin: 1.5em 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

#### Filename Header

```css
/* Refined filename header - simpler, cleaner */
.filename-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--code-header-bg);
    border-bottom: 1px solid var(--code-border);
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--color-text-muted);
}

/* Remove busy diagonal strip pattern - use subtle gradient instead */
.filename-header::before {
    content: none; /* Remove DiagonalStrip */
}
```

#### Copy Button

```css
/* Always-visible but subtle copy button */
.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0.5; /* Visible but not distracting */
    transition: opacity 0.15s ease;
}

.code-block:hover .copy-button {
    opacity: 0.8;
}

.copy-button:hover {
    opacity: 1 !important;
}

/* When filename header present, position below it */
.code-block:has(.filename-header) .copy-button {
    top: 48px;
}
```

#### Line Highlighting

```css
/* Add visual emphasis for highlighted lines */
.line.highlighted {
    background: rgba(var(--color-primary-rgb), 0.1);
    border-left: 3px solid var(--color-primary);
    margin-left: -3px;
}

/* Diff-style additions/removals */
.line.added {
    background: rgba(34, 197, 94, 0.15);
    border-left: 3px solid rgb(34, 197, 94);
}

.line.removed {
    background: rgba(239, 68, 68, 0.15);
    border-left: 3px solid rgb(239, 68, 68);
}
```

#### Typography

- **Font size:** 14px (desktop), 12px (mobile) - current 10px mobile is too small
- **Line height:** 1.6 (current is good)
- **Font family:** Consider a dedicated coding font like Fira Code, JetBrains Mono, or stick with
  system monospace

### Integration Approach

1. **Simplify filename header** - Remove DiagonalStrip, use solid subtle background
2. **Increase border weight** - From 0.5px to 1px for more defined edges
3. **Larger border radius** - From 8px to 12px for modern feel
4. **Subtle shadow** - Add depth without being heavy
5. **Improve mobile font size** - From 10px to 12px minimum
6. **Add line highlighting support** - Extend transformer for `{1,3-5}` syntax

### Variations

| Variant               | When to Use                               |
| --------------------- | ----------------------------------------- |
| **Basic**             | Short inline examples, single expression  |
| **With filename**     | File-based examples, configuration files  |
| **With line numbers** | Longer code (>10 lines), tutorial steps   |
| **Diff view**         | Showing changes, before/after comparisons |
| **Full-bleed**        | Wide code that needs horizontal space     |

---

## 2. Post Meta (Author, Date, Reading Time)

### Current State Analysis

The existing implementation:

- Author component with avatar (44px), name, social links
- Date in `mmm dd, yyyy` format with "Updated" timestamp
- Reading time as "X min read"
- All centered, stacked vertically on mobile

**Issues identified:**

- Meta section feels disconnected from title (gap is large)
- Social links in author byline may be distracting for quick scanning
- Reading time and date in separate divs - could be consolidated
- "note" class styling is generic

### Best Practices from Reference Sites

**Dan Abramov (overreacted.io)**

- Minimal approach: date only (no reading time, no author for single-author blog)
- Small gray text (13px) beneath title
- Clean visual hierarchy: Title > Date > Content
- Source: [Overreacted](https://overreacted.io/)

**Kent C. Dodds (kentcdodds.com)**

- Reading time prominent: "34 min read"
- Date clearly stated
- Author byline at bottom, not top
- Source:
  [How I Built a Modern Website](https://kentcdodds.com/blog/how-i-built-a-modern-website-in-2021)

**Medium-style approach**

- Author avatar + name inline
- "Published in [Publication]" (if applicable)
- Date + reading time on same line with separator
- Example: "John Doe - Nov 15 - 5 min read"

### Specific Recommendations

#### Consolidated Meta Line

```html
<!-- Recommended structure -->
<div class="post-meta">
    <div class="author-byline">
        <img class="avatar" src="..." alt="..." />
        <span class="author-name">Jan-Philip Loos</span>
    </div>
    <span class="meta-separator" aria-hidden="true">·</span>
    <time class="publish-date" datetime="2024-01-15">Jan 15, 2024</time>
    <span class="meta-separator" aria-hidden="true">·</span>
    <span class="reading-time">5 min read</span>
</div>
```

#### Styling

```css
.post-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 14px;
    color: var(--color-text-muted);
}

.author-byline {
    display: flex;
    align-items: center;
    gap: 8px;
}

.avatar {
    width: 32px; /* Smaller for inline use */
    height: 32px;
    border-radius: 50%; /* Circular for personal touch */
    border: 1.5px solid var(--color-border);
}

.author-name {
    font-weight: 500;
    color: var(--color-text); /* Slightly more prominent */
}

.meta-separator {
    color: var(--color-text-muted);
    opacity: 0.5;
}

.reading-time {
    /* Same muted styling as date */
}

/* Mobile: stack if needed */
@media (max-width: 480px) {
    .post-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }

    .meta-separator {
        display: none;
    }
}
```

#### Updated Date Handling

```html
<!-- Only show if significantly different from publish date -->
{#if updated && daysDiff(date, updated) > 30}
<span class="updated-badge">Updated {formatDate(updated)}</span>
{/if}
```

```css
.updated-badge {
    font-size: 12px;
    padding: 2px 8px;
    background: var(--color-surface);
    border-radius: 4px;
    color: var(--color-text-muted);
}
```

### Integration Approach

1. **Consolidate into single line** - Author, date, reading time on one row
2. **Use middle dots as separators** - Clean, professional look
3. **Smaller avatar for byline** - 32px instead of 44px (save larger for author card at bottom)
4. **Move social links** - Remove from top byline, keep only in author card at article end
5. **Simplify "Updated" display** - Only show if >30 days different, use badge style

### Variations

| Variant      | When to Use                                   |
| ------------ | --------------------------------------------- |
| **Minimal**  | Single-author blog - just date + reading time |
| **Standard** | Avatar + name + date + reading time           |
| **Extended** | Standard + tags inline (for list views)       |

---

## 3. Hero Images (Cover Images)

### Current State Analysis

The existing implementation:

- Fixed 400px height container
- Border-radius: 12px
- Full-bleed on narrow viewports
- Uses Sanity image with srcset and LQIP placeholder

**Issues identified:**

- Fixed height can crop images awkwardly
- No caption/credit support visible
- May compete with title for attention
- Large LCP element - needs optimization focus

### Best Practices from Reference Sites

**LogRocket UX Research**

- For blogs: "Avoid traditional hero sections" on article pages
- Hero images should support content, not overshadow it
- If used, keep minimal - don't obstruct content browsing
- Source:
  [Hero Section Examples](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)

**Elegant Themes Guidelines**

- Visual weight balance: headline should hit first, then image
- Never let hero compete with headline/CTA
- Use leading lines to guide eye through design
- Source:
  [How to Design a Hero Section](https://www.elegantthemes.com/blog/design/how-to-design-a-hero-section)

**Performance Best Practices**

- Serve AVIF/WebP with JPEG fallback
- Preload hero if it's LCP element
- Use responsive `srcset` with appropriate sizes
- Reserve space to prevent CLS
- Source:
  [Door to Online Hero Patterns](https://doortoonline.com/blog/website-hero-section-designs-2025)

### Specific Recommendations

#### Aspect Ratio Approach

```css
/* Use aspect-ratio instead of fixed height */
.cover-image-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    aspect-ratio: 16 / 9; /* Or 2 / 1 for wider */
    border-radius: 12px;
    overflow: hidden;

    /* Prevent CLS */
    background-color: var(--color-surface);
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

#### Caption Support

```html
<figure class="cover-image-container">
    <img class="cover-image" ... />
    {#if caption || credit}
    <figcaption class="cover-caption">
        {#if caption}{caption}{/if} {#if credit}<span class="credit">Photo: {credit}</span>{/if}
    </figcaption>
    {/if}
</figure>
```

```css
.cover-caption {
    font-size: 13px;
    color: var(--color-text-muted);
    text-align: center;
    padding: 8px 16px;

    .credit {
        font-style: italic;
        opacity: 0.8;
    }
}
```

#### Subtle Treatment Option

```css
/* For posts where image should be secondary */
.cover-image-container.subtle {
    opacity: 0.9;
    filter: saturate(0.8);
}

.cover-image-container.subtle:hover {
    opacity: 1;
    filter: saturate(1);
}
```

### Integration Approach

1. **Switch to aspect-ratio** - From fixed 400px to 16:9 or 2:1 ratio
2. **Add caption support** - Extend Sanity schema for image credits
3. **Consider optional hero** - Some posts may not need cover images
4. **Optimize loading** - Ensure LQIP placeholder is always visible during load
5. **Add subtle animation** - Fade in on load for polish

### Variations

| Variant                | When to Use                                   |
| ---------------------- | --------------------------------------------- |
| **Full-width**         | Visually striking posts, tutorials            |
| **Contained**          | Standard blog posts                           |
| **None**               | Quick notes, code-heavy posts                 |
| **Blurred background** | Use image as page background, not focal point |

---

## 4. Navigation

### Current State Analysis

The existing implementation:

- Simple horizontal nav: Logo | Blog | Gems | RSS
- Minimal styling with hover glow effect
- Optional background gradient
- Responsive with reduced gap on mobile

**Assessment:** Current navigation is clean and functional. Minor refinements only.

### Best Practices from Reference Sites

**Lee Robinson (leerob.com)**

- Ultra-minimal: inline hyperlinks rather than traditional nav
- Flat, content-first approach
- Source: [Lee Robinson](https://leerob.com)

**Minimalist Blog Navigation**

- Limit to 4-5 primary links (current: 3 + RSS)
- Thumb-friendly zones for mobile
- Simple is better for personal blogs
- Source:
  [Original Box Navigation Guide](https://originalbox.co/blog/primary-navigation-minimalist-design)

**Kent C. Dodds (kentcdodds.com)**

- Primary nav: Blog, Courses, Discord, Chats, Calls, Workshops, About
- Dark mode toggle visible
- Profile/login area for courses
- Source: [Kent C. Dodds](https://kentcdodds.com/)

### Specific Recommendations

#### Minor Refinements

```css
.nav-links a {
    font-weight: 500;
    letter-spacing: 0.2px;
    padding: 8px 4px; /* Larger tap target */
    border-radius: 4px;
    transition: background-color 0.15s ease;
}

.nav-links a:hover {
    background-color: rgba(var(--color-primary-rgb), 0.1);
    color: var(--color-primary);
    /* Keep glow effect but make it subtle */
    filter: drop-shadow(0 0 2px var(--color-primary));
}

.nav-links a.active {
    color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.08);
}
```

#### Active State

```html
<!-- Add active indicator for current page -->
<a href="/blog" class:active={$page.url.pathname.startsWith('/blog')}>Blog</a>
```

#### Consider Adding

- **Theme toggle** - If dark/light mode is supported
- **Search** - If content library grows large

### Integration Approach

1. **Add active state** - Highlight current section
2. **Increase tap targets** - Add padding to links
3. **Consider sticky on scroll** - For long articles (optional)
4. **Keep it minimal** - Don't add unnecessary links

---

## 5. Footer

### Current State Analysis

The existing implementation:

- Gradient background matching header
- Socials + RSS + Impressum link
- 120px grid row (empty space above content)
- Centered layout

**Issues identified:**

- Empty 120px space above content feels unintentional
- Very minimal - may miss opportunities
- No newsletter signup (if desired)
- No secondary navigation

### Best Practices from Reference Sites

**LogRocket Footer Guide**

- Organize links into labeled columns
- Include: contact, navigation, legal, CTA
- Use white space to separate sections
- Stack vertically on mobile with accordions
- Source:
  [Website Footer Design Practices](https://blog.logrocket.com/ux-design/website-footer-design-practices/)

**Orbit Media Best Practices**

- "Fat footer" with navigation links
- Acts as "safety net" for users who scroll to bottom
- Include internal links for SEO crawlability
- Use descriptive anchor text
- Source:
  [Footer Design Best Practices](https://www.orbitmedia.com/blog/website-footer-design-best-practices/)

**Performance Considerations**

- Avoid embedded social feeds (performance trap)
- Lazy-load if using icon sprites
- Reserve space to prevent CLS
- Source: [Eleken Footer Patterns](https://www.eleken.co/blog-posts/footer-ux)

### Specific Recommendations

#### Expanded Footer Structure

```html
<footer>
    <div class="footer-content">
        <div class="footer-main">
            <!-- Column 1: About/Newsletter -->
            <div class="footer-section">
                <h4>About</h4>
                <p class="footer-tagline">
                    Tech insights from a functional programming enthusiast.
                </p>
                <!-- Optional newsletter signup -->
            </div>

            <!-- Column 2: Navigation -->
            <div class="footer-section">
                <h4>Explore</h4>
                <nav class="footer-nav">
                    <a href="/blog">Blog</a>
                    <a href="/gems">Gems</a>
                    <a href="/about/jloos">About Me</a>
                </nav>
            </div>

            <!-- Column 3: Connect -->
            <div class="footer-section">
                <h4>Connect</h4>
                <Socials />
            </div>
        </div>

        <div class="footer-bottom">
            <span class="copyright">&copy; {year} Jan-Philip Loos</span>
            <div class="legal-links">
                <a href="/impressum">Impressum</a>
                <a href="/rss.xml">RSS</a>
            </div>
        </div>
    </div>
</footer>
```

#### Styling

```css
.footer-content {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 48px 24px 24px;
}

.footer-main {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 48px;
}

@media (max-width: 768px) {
    .footer-main {
        grid-template-columns: 1fr;
        gap: 32px;
    }
}

.footer-section h4 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    color: var(--color-text-muted);
}

.footer-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.footer-nav a {
    color: var(--color-text);
    text-decoration: none;
    transition: color 0.15s ease;
}

.footer-nav a:hover {
    color: var(--color-primary);
}

.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    font-size: 14px;
    color: var(--color-text-muted);
}

.legal-links {
    display: flex;
    gap: 16px;
}
```

### Integration Approach

1. **Remove empty grid row** - Eliminate 120px empty space
2. **Add structure** - Use columns for organization
3. **Include secondary nav** - Help users discover content
4. **Keep it proportional** - Footer shouldn't dominate
5. **Consider newsletter** - If building audience is a goal

### Variations

| Variant      | When to Use                                         |
| ------------ | --------------------------------------------------- |
| **Minimal**  | Current simple layout - appropriate for small sites |
| **Standard** | 2-3 columns with nav + socials + legal              |
| **Extended** | Newsletter signup + featured posts + full nav       |

---

## Summary: Priority Recommendations

### High Impact (Do First)

| Component       | Change                                         | Rationale                      |
| --------------- | ---------------------------------------------- | ------------------------------ |
| **Code blocks** | Simplify filename header, remove DiagonalStrip | Cleaner, more professional     |
| **Code blocks** | Increase mobile font size to 12px              | Current 10px hurts readability |
| **Post meta**   | Consolidate into single line with separators   | More scannable                 |
| **Post meta**   | Move social links to bottom author card only   | Reduce visual clutter          |

### Medium Impact

| Component       | Change                                   | Rationale             |
| --------------- | ---------------------------------------- | --------------------- |
| **Hero image**  | Switch to aspect-ratio from fixed height | Better image handling |
| **Footer**      | Remove empty 120px space                 | Unintentional feeling |
| **Navigation**  | Add active state indicator               | Better wayfinding     |
| **Code blocks** | Add line highlighting support            | Useful for tutorials  |

### Low Impact (Nice to Have)

| Component       | Change                                | Rationale           |
| --------------- | ------------------------------------- | ------------------- |
| **Footer**      | Expand with columns and secondary nav | More discoverable   |
| **Hero image**  | Add caption/credit support            | Professional polish |
| **Code blocks** | Consider paid coding font             | Visual distinction  |

---

## Sources

### Code Blocks

- [Mintlify - Code Block Documentation](https://www.mintlify.com/blog/code-block-documentation)
- [Josh Comeau - How I Built My Blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/)
- [Vercel Geist - Code Block](https://vercel.com/geist/code-block)
- [Docsie - Code Blocks Best Practices](https://www.docsie.io/blog/glossary/code-blocks/)

### Post Meta

- [Overreacted](https://overreacted.io/)
- [Lee Robinson](https://leerob.com)
- [Kent C. Dodds - How I Built a Modern Website](https://kentcdodds.com/blog/how-i-built-a-modern-website-in-2021)
- [Problogger - Using Bylines on Blogs](https://problogger.com/using-bylines-on-blogs/)
- [Linnworks - Blog Layout Best Practices](https://www.linnworks.com/blog/blog-layout-best-practices/)

### Hero Images

- [LogRocket - Hero Section Examples](https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/)
- [Elegant Themes - How to Design a Hero Section](https://www.elegantthemes.com/blog/design/how-to-design-a-hero-section)
- [Door to Online - Hero Section Designs 2025](https://doortoonline.com/blog/website-hero-section-designs-2025)
- [Crazy Egg - Hero Image Best Practices](https://www.crazyegg.com/blog/hero-image-best-practices/)

### Navigation

- [Original Box - Navigation in Minimalist Design](https://originalbox.co/blog/primary-navigation-minimalist-design)
- [We Are Tenet - Website Navigation Best Practices 2025](https://www.wearetenet.com/blog/website-navigation-best-practices)
- [HTMLBurger - Minimal Design Websites](https://htmlburger.com/blog/minimal-design-website/)

### Footer

- [LogRocket - Website Footer Design Practices](https://blog.logrocket.com/ux-design/website-footer-design-practices/)
- [Orbit Media - Footer Design Best Practices](https://www.orbitmedia.com/blog/website-footer-design-best-practices/)
- [Eleken - Footer UX Patterns 2025](https://www.eleken.co/blog-posts/footer-ux)
- [HubSpot - Website Footer Examples](https://blog.hubspot.com/website/website-footer)
