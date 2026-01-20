# Phase 9: Navigation & Layout - Research

**Researched:** 2026-01-20 **Domain:** Navigation, Footer, Hero Images, CSS Accessibility
**Confidence:** HIGH

## Summary

This research investigates the four requirements for Phase 9: navigation active state, tap targets,
footer refinement, and hero image aspect-ratio. The codebase already uses SvelteKit's `$app/state`
for page detection (seen in `+layout.svelte`), making active state implementation straightforward.
The existing SCSS design token system provides the foundation for consistent styling.

Key findings:

- Navigation uses `Header.svelte` with hardcoded links to `/blog` and `/gems`
- Footer has a 120px empty row explicitly in the grid (`grid-template-rows: 120px 1fr`)
- Cover images use fixed height (400px in blog posts, 350px in cards) rather than aspect-ratio
- The design token system already has `--color--primary` (#ff8000) for the orange accent

**Primary recommendation:** Implement active state using `page.url.pathname` from `$app/state`,
convert fixed image heights to `aspect-ratio` CSS property, and restructure footer to horizontal
copyright/socials layout.

## Standard Stack

### Core (Already in Codebase)

| Library   | Version | Purpose                     | Why Standard                        |
| --------- | ------- | --------------------------- | ----------------------------------- |
| SvelteKit | 2.0+    | `$app/state` page detection | Built-in, reactive, no dependencies |
| SCSS      | -       | Breakpoints, mixins, tokens | Already used throughout             |

### No Additional Libraries Needed

This phase is pure CSS/Svelte work using existing patterns. No new dependencies required.

## Architecture Patterns

### Current Navigation Structure

```
src/lib/components/organisms/Header.svelte
├── Logo link (/)
└── .links div
    ├── /blog link
    ├── /gems link
    └── RssLink component
```

### Recommended Active State Pattern

**What:** Pass current pathname to Header, apply active class based on match **When to use:** For
top-level navigation showing current section

```svelte
<script lang="ts">
    import { page } from '$app/state';
    // Use startsWith for section matching (e.g., /blog/my-post matches /blog)
    const isActive = (href: string) =>
        page.url.pathname === href || page.url.pathname.startsWith(href + '/');
</script>

// Source: SvelteKit docs - $app/state
<a href="/blog" class:active={isActive('/blog')}>Blog</a>

<style>
    a.active {
        position: relative;
    }
    a.active::after {
        content: '';
        position: absolute;
        bottom: -4px; /* Close to text per CONTEXT.md */
        left: 0;
        right: 0;
        height: 2px; /* Thin underline per CONTEXT.md */
        background: var(--color--primary);
    }
</style>
```

### Recommended Aspect-Ratio Pattern

**What:** Replace fixed height with aspect-ratio for responsive hero images **When to use:** Cover
images in blog posts and cards

```css
/* Source: CSS aspect-ratio best practices */
.cover-image-container {
    /* Replace: height: 400px; */
    aspect-ratio: 2 / 1; /* Desktop: ultra-wide per CONTEXT.md */
    border-radius: 12px; /* Matching cards per CONTEXT.md */
    overflow: hidden;
}

.cover-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center; /* Center crop per CONTEXT.md */
}

@media (max-width: 767px) {
    .cover-image-container {
        aspect-ratio: 16 / 9; /* Mobile: taller per CONTEXT.md */
    }
}
```

### Recommended Tap Target Pattern

**What:** Increase clickable area without changing visual appearance **When to use:** Navigation
links, especially on mobile

```css
/* Source: WCAG 2.5.5 AAA / Apple HIG */
.links a {
    /* Visual padding for spacing */
    padding: 8px 0;

    /* Mobile: ensure 44px touch target */
    @include breakpoints.for-phone-only {
        min-height: 44px;
        display: flex;
        align-items: center;
    }
}
```

### Anti-Patterns to Avoid

- **Using :active for active page:** `:active` is for click/tap state, not current page
- **Fixed heights for responsive images:** Causes letterboxing or cut-off on different screen sizes
- **Tiny tap targets on mobile:** WCAG 2.5.5 AAA requires 44x44px minimum

## Don't Hand-Roll

| Problem             | Don't Build                  | Use Instead                            | Why                                            |
| ------------------- | ---------------------------- | -------------------------------------- | ---------------------------------------------- |
| Page detection      | Custom routing logic         | `page.url.pathname` from `$app/state`  | SvelteKit provides reactive, SSR-safe solution |
| Responsive images   | JavaScript resize handlers   | CSS `aspect-ratio` property            | Native CSS, no JS, prevents CLS                |
| Touch target sizing | Complex padding calculations | `min-height: 44px` + flexbox centering | Simple, reliable, WCAG compliant               |

## Common Pitfalls

### Pitfall 1: Non-Reactive Page Detection

**What goes wrong:** Using `$: pathname = page.url.pathname` (Svelte 4 syntax) in Svelte 5 **Why it
happens:** Old tutorials use `$:` reactive statements **How to avoid:** Use `$derived` or direct
property access: `page.url.pathname` **Warning signs:** Active state doesn't update on navigation

### Pitfall 2: Hover/Active Visual Conflict

**What goes wrong:** Hover and active state look the same **Why it happens:** Both using underline
or same color **How to avoid:** Per CONTEXT.md - active uses underline, hover uses opacity/color
change only **Warning signs:** Can't tell if link is current page or just hovered

### Pitfall 3: Fixed Image Height Clipping

**What goes wrong:** Important image content cut off at different viewport widths **Why it
happens:** `height: 400px` doesn't adapt to container width **How to avoid:** Use `aspect-ratio` +
`object-fit: cover` **Warning signs:** Images look cropped differently on mobile vs desktop

### Pitfall 4: Footer Empty Space Preserved

**What goes wrong:** Footer still has empty gap after restructure **Why it happens:** Forgetting to
remove `grid-template-rows: 120px 1fr` **How to avoid:** Remove the 120px row, use simpler flexbox
layout **Warning signs:** Large gap still visible above footer content

### Pitfall 5: Tap Target Invisible Extension

**What goes wrong:** Visual link size looks same but touch works further out **Why it happens:**
Adding padding but also adding negative margin to compensate **How to avoid:** Accept slightly
larger visual spacing on mobile, it's intentional **Warning signs:** Links appear to have
inconsistent spacing

## Code Examples

### Active State Implementation (Header.svelte)

```svelte
<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import Logo from '$lib/components/atoms/Logo.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';

    interface Props {
        showBackground?: boolean;
    }

    let { showBackground = false }: Props = $props();

    // Match section (e.g., /blog/my-post matches /blog)
    const isActive = (href: string) => {
        const pathname = page.url.pathname;
        return pathname === href || pathname.startsWith(href + '/');
    };
</script>

// Source: SvelteKit $app/state docs + CONTEXT.md decisions
<header class:has-background={showBackground}>
    <nav class="container">
        <a class="logo" href={resolve('/')} aria-label="Site logo">
            <Logo />
        </a>
        <div class="links">
            <a
                href={resolve('/blog')}
                class:active={isActive('/blog')}
                aria-current={isActive('/blog') ? 'page' : undefined}>Blog</a
            >
            <a
                href={resolve('/gems')}
                class:active={isActive('/gems')}
                aria-current={isActive('/gems') ? 'page' : undefined}>Gems</a
            >
            <RssLink />
        </div>
    </nav>
</header>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .links a {
        position: relative;
        color: var(--color--text);
        text-decoration: none;
        padding: 8px 0; /* Vertical padding for tap target */

        /* Hover: opacity/color change, NOT underline */
        &:hover:not(.active) {
            color: var(--color--primary);
            filter: drop-shadow(0px 0px 3px var(--color--primary));
        }

        /* Active: orange underline */
        &.active::after {
            content: '';
            position: absolute;
            bottom: 4px; /* Close to text */
            left: 0;
            right: 0;
            height: 2px; /* Thin underline */
            background: var(--color--primary);
        }

        @include breakpoints.for-phone-only {
            min-height: 44px;
            display: flex;
            align-items: center;
        }
    }
</style>
```

### Footer Refinement (Footer.svelte)

```svelte
<script>
    import { resolve } from '$app/paths';
    import Socials from '$lib/components/molecules/Socials.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';
    import { authors } from '$lib/data/authors';

    const mainAuthor = authors.jloos;
</script>

// Source: CONTEXT.md - minimal horizontal layout
<footer>
    <div class="content">
        <div class="legal">
            <a href={resolve('/impressum')}>Impressum</a>
            <span class="copyright">© {new Date().getFullYear()}</span>
        </div>
        <div class="socials">
            <Socials {...mainAuthor.socials} size="small" />
            <RssLink />
        </div>
    </div>
</footer>

<style lang="scss">
    footer {
        width: 100%;
        background: linear-gradient(
            60deg,
            var(--color--waves-start) 0%,
            var(--color--waves-end) 100%
        );
        border-top: 1px solid var(--color--waves-start);

        /* Remove: grid-template-rows: 120px 1fr; */
        /* Simple padding instead */
        padding: 24px 0;

        .content {
            display: flex;
            flex-direction: row; /* Horizontal layout */
            align-items: center;
            justify-content: space-between; /* Copyright left, socials right */
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 15px;

            @media (max-width: 767px) {
                flex-direction: column;
                gap: 16px;
            }
        }

        .legal {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.9rem;
        }

        .socials {
            display: flex;
            align-items: center;
            gap: 20px;
        }
    }
</style>
```

### Hero Image Aspect-Ratio (+page.svelte)

```scss
// Source: CSS aspect-ratio best practices + CONTEXT.md
.cover-image-container {
    width: 1000px;
    margin: 0 auto;
    border-radius: 12px; /* Match cards and code blocks */
    overflow: hidden;

    /* Replace fixed height with aspect-ratio */
    aspect-ratio: 2 / 1; /* Desktop: ultra-wide */

    @media (max-width: 1060px) {
        transform: translateX(calc((1100px - 100vw) / -2));
        width: 1100px;
    }

    @media (max-width: 767px) {
        aspect-ratio: 16 / 9; /* Mobile: taller */
        width: 100%;
        transform: none;
    }

    .sanity-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center; /* Center crop */
    }
}
```

## State of the Art

| Old Approach                  | Current Approach            | When Changed   | Impact                                        |
| ----------------------------- | --------------------------- | -------------- | --------------------------------------------- |
| `$app/stores` with `$page`    | `$app/state` with `page`    | SvelteKit 2.12 | Direct property access, no store subscription |
| Padding-box aspect ratio hack | CSS `aspect-ratio` property | Baseline 2021  | Native CSS, no JS, cleaner code               |
| `$:` reactive statements      | `$derived()` runes          | Svelte 5       | More explicit reactivity                      |

**Deprecated/outdated:**

- `$app/stores`: Still works but `$app/state` is preferred in SvelteKit 2.12+
- Padding-bottom aspect ratio hack: `aspect-ratio` property has full browser support now

## Open Questions

1. **RssLink Active State**
    - What we know: RssLink is in the nav but links to `/rss.xml` (external)
    - What's unclear: Should it also have active state styling?
    - Recommendation: No - it's an external resource link, not a page

2. **Home Page Active State**
    - What we know: Logo links to `/` but isn't in the nav links area
    - What's unclear: Should home have any active indicator?
    - Recommendation: No per CONTEXT.md - "Logo sized by its own design needs"

3. **Card Image Aspect Ratio**
    - What we know: BlogPostCard uses `max-height: 350px` on cover images
    - What's unclear: Should cards also switch to aspect-ratio?
    - Recommendation: Consider in scope - consistent with hero images

## Codebase Inventory

### Files to Modify

| File                                         | Current State                         | Required Change                        |
| -------------------------------------------- | ------------------------------------- | -------------------------------------- |
| `src/lib/components/organisms/Header.svelte` | No active state, small tap targets    | Add active state, increase tap targets |
| `src/lib/components/organisms/Footer.svelte` | 120px empty grid row, vertical layout | Remove empty space, horizontal layout  |
| `src/routes/[slug]/+page.svelte`             | `height: 400px` on cover image        | Switch to `aspect-ratio: 2/1`          |
| `src/lib/components/atoms/Card.svelte`       | `height: 350px` on image div          | Consider aspect-ratio (optional)       |

### Existing Design Tokens (from `_tokens-colors.scss`, `_tokens-spacing.scss`)

| Token              | Value   | Usage                              |
| ------------------ | ------- | ---------------------------------- |
| `--color--primary` | #ff8000 | Orange accent for active underline |
| `--color--text`    | #fffcfc | Default text color                 |
| `--raw-space-24`   | 24px    | Footer padding                     |
| `--raw-space-16`   | 16px    | Gap spacing                        |

### Existing Breakpoints (from `_breakpoints.scss`)

| Mixin                    | Breakpoint       | Usage                                 |
| ------------------------ | ---------------- | ------------------------------------- |
| `for-phone-only`         | max-width: 767px | 44px tap targets, taller aspect ratio |
| `for-tablet-portrait-up` | min-width: 768px | Desktop-style compact nav             |

## Sources

### Primary (HIGH confidence)

- SvelteKit `$app/state` docs: https://svelte.dev/docs/kit/$app-state
- Codebase files: Header.svelte, Footer.svelte, +page.svelte, +layout.svelte
- CONTEXT.md decisions from user discussion

### Secondary (MEDIUM confidence)

- CSS aspect-ratio responsive guide:
  https://aspectratiocalculatorpro.com/css-aspect-ratio-responsive-guide/
- WCAG 2.5.5 Target Size: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- Apple HIG Touch Targets: https://developer.apple.com/design/human-interface-guidelines/

### Tertiary (LOW confidence)

- None - all findings verified with official sources or codebase inspection

## Metadata

**Confidence breakdown:**

- Active state implementation: HIGH - SvelteKit docs + codebase patterns clear
- Tap target sizing: HIGH - WCAG spec explicit, Apple HIG confirms 44px
- Footer structure: HIGH - CONTEXT.md decisions clear, current code visible
- Hero aspect-ratio: HIGH - CSS spec stable, CONTEXT.md decisions clear

**Research date:** 2026-01-20 **Valid until:** 2026-02-20 (30 days - stable CSS/SvelteKit patterns)
