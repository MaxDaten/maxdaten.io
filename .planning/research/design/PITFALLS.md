# Design Pitfalls: Technical Blog Design Refinement

**Domain:** Personal technical blog design **Project:** maxdaten.io v2.0 Design Refinement
**Researched:** 2026-01-20 **Confidence:** HIGH (verified with design system documentation, UX
research, and industry best practices)

---

## Critical Pitfalls

Design mistakes that make sites look amateur and require significant rework to fix.

### DP-1: Inconsistent Spacing System (Ad-Hoc Values)

**What it looks like:**

- Different margin values throughout: 10px here, 12px there, 48px elsewhere
- Padding that "feels right" but follows no pattern
- Visual rhythm that feels "off" without obvious cause

**Why it happens:** Developers adjust spacing values on a per-component basis to "make it look
right" rather than using a systematic scale. Each decision is made in isolation.

**Current site symptoms (from DESIGN_REVIEW.md):**

- Blog section header has asymmetric alignment
- Gap between bio and blog cards section is inconsistent (~48px+)
- Tag pills have different internal padding than CTA buttons

**Consequences:**

- The site feels "unpolished" even if individual components look fine
- Users subconsciously perceive lower quality
- Maintenance becomes harder as there's no source of truth

**How to avoid:**

1. Define a spacing scale based on a base unit (typically 4px or 8px)
2. Common scales: `4, 8, 12, 16, 24, 32, 48, 64, 96` (4px base)
3. Use CSS custom properties: `--space-1: 4px; --space-2: 8px; ...`
4. ONLY use scale values - no magic numbers like `10px` or `38px`
5. Establish rhythm: use consistent spacing between similar elements

**Implementation guidance:**

```scss
// Define scale
:root {
    --space-1: 0.25rem; // 4px
    --space-2: 0.5rem; // 8px
    --space-3: 0.75rem; // 12px
    --space-4: 1rem; // 16px
    --space-6: 1.5rem; // 24px
    --space-8: 2rem; // 32px
    --space-12: 3rem; // 48px
    --space-16: 4rem; // 64px
}
```

**Which phase should address:** Foundation phase - establish design tokens FIRST.

---

### DP-2: Multiple Competing Accent Colors

**What it looks like:**

- Orange for reading time, teal for tags, blue for links
- User can't identify "what's clickable" at a glance
- Visual hierarchy becomes muddy

**Why it happens:** Different accent colors get added incrementally for different features. Each
seems reasonable in isolation, but together they compete.

**Current site symptoms:**

- Orange accent (`#f77f00`) for reading time and CTAs
- Teal/cyan (`#00b4d8`) for tags
- Creates two accent colors competing for attention

**Consequences:**

- Dilutes the brand identity
- Reduces scannability - users must learn multiple color meanings
- Makes the design feel "designed by committee"

**How to avoid:**

1. Define ONE primary accent color
2. Use semantic colors sparingly: success (green), error (red), warning (yellow)
3. Tags should use neutral colors (grays) or the single accent
4. Test: remove all color - does hierarchy still work with just size/weight?

**Decision framework:**

- Accent color = interactive elements (links, buttons, focus states)
- Neutral tones = categorization (tags, metadata)
- Semantic colors = meaning (errors, success, warnings)

**Which phase should address:** Foundation phase - color token definition.

---

### DP-3: Bolted-On Code Blocks

**What it looks like:**

- Code blocks feel like a foreign element dropped into the page
- Different visual language (border radius, shadows, spacing) than rest of site
- Jarring transition between prose and code

**Why it happens:** Code highlighting libraries provide default styling that designers accept
without customization. The styling comes from the library, not the design system.

**Current site status:** Code blocks are actually well-crafted with filename headers, language
badges, and copy buttons. This is a strength to maintain.

**Anti-pattern symptoms to avoid:**

- Generic dark theme that doesn't match site colors
- Different border-radius than other components
- No filename/language context
- Copy button that looks different than site buttons

**How to maintain quality:**

1. Ensure code block colors derive from site color tokens
2. Match border-radius to other rounded components
3. Keep filename headers and language badges
4. Style copy button consistent with site button patterns
5. Ensure proper spacing above/below code blocks matches prose rhythm

**Which phase should address:** Typography/content styling phase.

---

### DP-4: Monotonous Card Layouts

**What it looks like:**

- All cards (featured, regular, small) have identical internal structure
- Featured content doesn't feel featured
- Grid feels like a wall of sameness

**Why it happens:** Creating one card component and reusing it everywhere is efficient. But it's
lazy design that ignores content hierarchy.

**Current site symptoms:**

- Featured card (full-width) and grid cards are visually identical
- Same text layout, same tag placement regardless of context
- No visual distinction for importance

**Consequences:**

- Users can't quickly identify most important content
- Reduces engagement with featured content
- Site feels template-like rather than crafted

**How to avoid:**

1. Featured cards should have unique treatment:
    - Larger title typography
    - Different tag position
    - Possibly a pull-quote or excerpt
    - More generous spacing
2. Create 2-3 card variants with intentional differences
3. Design each variant for its specific context and content

**Which phase should address:** Component design phase - card variants.

---

### DP-5: Amateur Meta Element Styling

**What it looks like:**

- Date, author, reading time crammed together without hierarchy
- Metadata competes visually with actual content
- Inconsistent formatting (some italic, some small, some colored)

**Why it happens:** Meta elements get added incrementally without design consideration. Each gets
styled to "fit" rather than designed as a system.

**Anti-pattern examples:**

- Date in one format, reading time in another
- Author name in body font, date in different font
- Random icons with inconsistent sizing
- Everything at same visual weight

**How to avoid:**

1. Design meta elements as a cohesive unit
2. Establish hierarchy: most to least important
3. Use consistent typography (size, weight, color) for all meta
4. Space meta elements consistently
5. For single-author blogs: consider removing author display entirely

**Recommended pattern:**

```
[Date] [Separator] [Reading Time]
January 20, 2026  ·  5 min read
```

- Use muted color for all meta
- Consistent separator character
- No icons unless they add meaning

**Which phase should address:** Typography/content styling phase.

---

## Moderate Pitfalls

Mistakes that make the site feel less polished but don't require architectural changes.

### DP-6: Inconsistent Depth Strategy

**What it looks like:**

- Some cards have borders, others have shadows
- Some sections have background colors, others just spacing
- Hover states add shadows in some places, borders in others

**Why it happens:** Different depth approaches are added without a system. Borders feel right here,
shadows feel right there.

**Current site symptoms:**

- Blog cards use borders only (flat)
- "Specializing in" box has left border accent (different treatment)
- Hero CTA buttons have no visible container
- Footer has no visual separation

**How to avoid:**

1. Commit to ONE depth approach:
    - **Borders-only** (flat design, good for dark themes)
    - **Subtle shadows** (adds depth, good for light themes)
    - **Surface colors** (background tints for elevation)
2. Apply consistently across ALL components
3. Create depth levels: `elevation-0, elevation-1, elevation-2`
4. Dark themes generally work better with borders + surface colors, not shadows

**Recommended for dark theme:**

- Use subtle border (1px with low-opacity color)
- Use slight background tint for elevation
- Reserve shadows for popovers/modals only

**Which phase should address:** Foundation phase - elevation tokens.

---

### DP-7: Missing Navigation Context

**What it looks like:**

- User can't tell what page they're on from nav
- All nav items look the same regardless of current route
- Clicking around feels disorienting

**Why it happens:** Navigation styling focuses on hover states but forgets about active/current
states.

**Current site symptoms:**

- No active state indicator in navigation
- "Blog" should be highlighted when on blog pages
- User loses location context

**How to avoid:**

1. Define clear active state styling:
    - Underline, background tint, or color change
    - Must be visually distinct from hover state
2. Apply active state based on current route
3. Consider breadcrumbs for deep navigation

**Implementation pattern:**

```svelte
<a href="/blog" class:active={$page.url.pathname.startsWith('/blog')}> Blog </a>
```

**Which phase should address:** Navigation component phase.

---

### DP-8: Poor Typography Scaling for Mobile

**What it looks like:**

- Headlines too large on mobile (one word per line)
- Body text too small to read comfortably
- Line lengths either too short or too long

**Why it happens:** Desktop typography is designed first, mobile gets whatever fits. No responsive
type scale defined.

**Anti-pattern symptoms:**

- Using fixed `px` values that don't scale
- Same `font-size` on all breakpoints
- No `clamp()` for fluid typography

**How to avoid:**

1. Use fluid typography with `clamp()`:
    ```css
    font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
    ```
2. Test on actual mobile devices, not just browser resize
3. Ensure body text is minimum 16px on mobile (prevents iOS zoom)
4. Limit line length: 45-75 characters

**Mobile-first guidelines:**

- Minimum body text: 16px
- Minimum touch targets: 44px
- Line-height: 1.5 for body, 1.2 for headings
- Max-width for prose: ~65ch

**Which phase should address:** Typography phase - responsive type scale.

---

### DP-9: Oversized/Intrusive Sticky Header

**What it looks like:**

- Header takes up 25%+ of mobile viewport
- Content scrolls but feels cramped
- Header animation is distracting

**Why it happens:** Headers grow as features are added (logo + nav + search + social + CTA). Nobody
notices the accumulation.

**Research insight:** User satisfaction drops when sticky headers exceed 20-30% of screen height on
mobile.

**How to avoid:**

1. Keep sticky header under 120px on desktop
2. On mobile: consider partially-persistent header (appears on scroll up)
3. Avoid animation - just keep it in place or use simple fade
4. Test on actual devices with varied screen sizes

**Alternative: Partially persistent header**

- Scrolling down: header disappears
- Scrolling up: header reappears
- Reduces content obstruction while maintaining access

**Which phase should address:** Header component phase.

---

### DP-10: Sparse/Ignored Footer

**What it looks like:**

- Just a copyright line
- Excessive empty space
- Social links go to 404 or placeholder pages

**Why it happens:** Footer is designed last when energy is depleted. "Just make it minimal" becomes
the approach.

**Current site symptoms:**

- Footer is sparse with excessive negative space
- Feels like afterthought rather than crafted element

**Consequences:**

- Missed opportunity for CTAs
- Users who scroll to bottom find nothing useful
- Signals lack of attention to detail

**How to avoid:**

1. Design footer as destination, not afterthought
2. Include:
    - Brief CTA for single-author blog ("Let's connect")
    - Primary contact method
    - Navigation backup links
    - Social links (to actual profiles)
    - Legal links (privacy, terms)
3. Test all links - no broken links or placeholders

**Which phase should address:** Footer component phase.

---

### DP-11: Dark Mode Weight Perception Issues

**What it looks like:**

- Text looks heavier/bolder in dark mode
- Font weights that look good in light mode feel "chunky" in dark mode
- Overall feel is different between modes

**Why it happens:** Light text on dark backgrounds appears visually heavier due to halation effect.
Using same font-weight in both modes creates inconsistency.

**How to avoid:**

1. Reduce font-weight in dark mode (approximately 15% lighter)
2. Avoid pure white (#FFFFFF) - use softer tones like #F5F5F5
3. Avoid pure black (#000000) - use soft dark like #121212
4. Test both modes side-by-side for weight parity

**Implementation:**

```css
/* If using variable font with weight axis */
:root {
    --font-weight-body: 400;
}
[data-theme='dark'] {
    --font-weight-body: 350;
}
```

**Which phase should address:** Dark mode theme refinement.

---

## Minor Pitfalls

Annoyances that reduce polish but are quick to fix.

### DP-12: Inconsistent Border Radius

**What it looks like:**

- Buttons: 4px, cards: 8px, avatars: 50%, code blocks: 12px
- No pattern to the values

**How to avoid:**

1. Define border-radius scale: `sm: 4px, md: 8px, lg: 16px, full: 9999px`
2. Apply consistently: buttons=md, cards=md, avatars=full, code=md
3. Only `full` should be used for circles/pills

**Which phase should address:** Foundation phase - radius tokens.

---

### DP-13: Hover Effects Without Purpose

**What it looks like:**

- Everything has a hover effect
- Hover changes are jarring or distracting
- Non-interactive elements have hover states

**How to avoid:**

1. Only interactive elements get hover states
2. Use subtle transitions (0.15s-0.3s)
3. Prefer `opacity` and `transform` for performance
4. Test on touch devices - hover states shouldn't convey critical info

**Performance tip:**

```css
/* Bad: triggers repaint */
.card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Better: use pseudo-element with opacity */
.card::after {
    opacity: 0;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.card:hover::after {
    opacity: 1;
}
```

**Which phase should address:** Interactive states phase.

---

### DP-14: Image Aspect Ratio Inconsistency

**What it looks like:**

- Cover images in blog listing have different proportions
- Grid looks ragged
- Some images appear cropped awkwardly

**Current site symptoms:**

- Cover images have inconsistent aspect ratios
- Some 16:9-ish, others nearly square

**How to avoid:**

1. Define standard aspect ratios: 16:9 for blog covers, 1:1 for avatars
2. Use CSS `aspect-ratio` property
3. Set consistent crop rules in Sanity/CMS
4. Use `object-fit: cover` with defined dimensions

**Implementation:**

```css
.blog-cover {
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

**Which phase should address:** Image/media component phase.

---

### DP-15: Too Many Font Families

**What it looks like:**

- Title font, body font, logo font, code font = 4+ families
- Page feels disjointed
- Load times suffer

**Current site status:**

- Inter (body)
- Merriweather (titles)
- Baloo-2 (logo)
- Ubuntu Mono (code)
- 4 families is at the high end

**How to avoid:**

1. Limit to 2-3 font families maximum
2. Typical pattern: 1 for body/headings, 1 for code
3. Use weight/size variations rather than multiple families
4. Consider: does the title really need a different family?

**Which phase should address:** Typography phase - font audit.

---

### DP-16: Theme Toggle UX Issues

**What it looks like:**

- Toggle shows sun when in light mode (but you click it to GET dark)
- User can't tell current state
- No system preference option

**Why it happens:** Icon represents what you'll switch TO rather than what you ARE. Common confusion
pattern.

**How to avoid:**

1. Icon should represent CURRENT state (sun = you're in light mode)
2. Use `aria-pressed` for accessibility
3. Offer three options: light, dark, system
4. Respect system preference on first visit

**Which phase should address:** Theme toggle component phase.

---

## Phase-Specific Warning Summary

| Phase                      | Likely Pitfalls                                                    | Prevention                                         |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| Foundation (Design Tokens) | DP-1 (spacing), DP-2 (colors), DP-6 (depth), DP-12 (radius)        | Define complete token system BEFORE any components |
| Typography                 | DP-8 (mobile scaling), DP-15 (font families), DP-5 (meta elements) | Establish responsive type scale, audit fonts       |
| Components                 | DP-4 (cards), DP-7 (nav), DP-9 (header), DP-10 (footer)            | Design variants, add active states                 |
| Content Styling            | DP-3 (code blocks), DP-14 (images)                                 | Ensure code styling derives from design system     |
| Interactive States         | DP-13 (hover), DP-16 (theme toggle)                                | Purpose-driven interactions only                   |
| Dark Mode                  | DP-11 (weight perception), DP-2 (colors)                           | Test both modes, adjust weights                    |

---

## Prevention Checklist

Before starting design implementation:

### Pre-Foundation:

- [ ] Spacing scale defined (4px or 8px base)
- [ ] Color palette defined with ONE accent color
- [ ] Depth strategy chosen (borders vs shadows vs surfaces)
- [ ] Border radius scale defined

### Pre-Component Design:

- [ ] Card variants designed (featured vs regular)
- [ ] Navigation active states designed
- [ ] Footer content planned
- [ ] Meta element hierarchy defined

### Pre-Implementation:

- [ ] All tokens defined as CSS custom properties
- [ ] Responsive type scale with `clamp()` ready
- [ ] Dark mode weight adjustments planned
- [ ] Mobile breakpoints defined

### Pre-Launch:

- [ ] All hover states tested on touch devices
- [ ] Theme toggle tested for clarity
- [ ] All footer links verified
- [ ] Both light/dark modes reviewed side-by-side

---

## Sources

**Typography and Spacing:**

- [20 Common Typography Mistakes in UI Design](https://supercharge.design/blog/20-common-typography-mistakes-in-ui-design) -
  Font sizes, spacing scales
- [Spacing Your Typography and Components](https://iknowdavehouse.medium.com/the-spacing-is-all-wrong-f5b7d165ae66) -
  Rhythmic spacing principles
- [Most Common Typography Spacing Mistakes](https://www.pumpkinwebdesign.com/web-design-manchester/most-common-typography-spacing-mistakes/) -
  Line height, margins

**White Space and Layout:**

- [The Power of White Space](https://attentioninsight.com/the-power-of-white-space-why-less-is-more-in-web-design/) -
  Professional vs amateur use
- [White Space in Web Design](https://www.wix.com/blog/white-space-design) - Micro vs macro spacing
- [Using White Space in Design](https://venngage.com/blog/white-space-design/) - Visual hierarchy

**Navigation and Headers:**

- [Sticky Headers: 5 Ways to Make Them Better](https://www.nngroup.com/articles/sticky-headers/) -
  NN/G research
- [Designing Sticky Menus UX Guidelines](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/) -
  Size constraints
- [Sticky Headers: A Solution with UX Pitfalls](https://utilitybend.com/blog/sticky-headers-a-solution-with-ux-pitfalls/) -
  Mobile considerations

**Dark Mode:**

- [Inclusive Dark Mode: Designing Accessible Dark Themes](https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/) -
  Accessibility
- [Dark Mode Accessibility Myth](https://stephaniewalter.design/blog/dark-mode-accessibility-myth-debunked/) -
  Weight perception
- [Dark/Light Mode Toggle: A Usability Issue](https://dev.to/zetareticoli/dark-light-mode-toggle-a-usability-issue-1gg2) -
  Toggle UX

**Card and Hover Effects:**

- [CSS Card Hover Effect Examples](https://www.subframe.com/tips/css-card-hover-effect-examples) -
  Performance
- [How to Animate Box-Shadow](https://tobiasahlin.com/blog/how-to-animate-box-shadow/) - Performance
  optimization

**Code Blocks:**

- [Code Blocks: Definition, Examples & Best Practices](https://www.docsie.io/blog/glossary/code-blocks/) -
  Technical blog standards
- [The Role of Good Code Blocks in Documentation](https://www.mintlify.com/blog/code-block-documentation) -
  Shiki best practices

**Footer Design:**

- [Website Footer Design Best Practices](https://blog.logrocket.com/ux-design/website-footer-design-practices/) -
  LogRocket
- [27 Things to Put at the Bottom](https://www.orbitmedia.com/blog/website-footer-design-best-practices/) -
  Orbit Media

**Design Systems:**

- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines) - Professional reference
- [Vercel Geist Typography](https://vercel.com/geist/typography) - Type system example
