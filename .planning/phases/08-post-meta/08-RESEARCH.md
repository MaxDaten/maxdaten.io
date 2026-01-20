# Phase 8: Post Meta - Research

**Researched:** 2026-01-20 **Domain:** Blog Post Metadata Presentation, Date Formatting, Author
Cards **Confidence:** HIGH

## Summary

Research into the post meta presentation for maxdaten.io reveals a well-defined existing component
structure with clear modification paths. The current implementation has date displayed below the
title, author information with social links inline, and a separate `AuthorCard` component at the
bottom. Phase 8 requires repositioning the date above the title, consolidating the meta line,
reducing avatar sizes, and moving social links exclusively to the bottom author card.

The typography and color foundation from Phases 5-6 provides the necessary tokens: `--font--mono`
(JetBrains Mono), muted text colors via `rgba(var(--color--secondary-rgb), 0.8)`, and the orange
accent (`--color--primary: #ff8000`) for author name highlighting. The existing `dateformat` library
(v5.0.3) handles absolute dates well, and the CONTEXT.md decision to use relative dates for posts
within the last week can be implemented using the native `Intl.RelativeTimeFormat` API, avoiding
additional dependencies.

**Primary recommendation:** Refactor the `[slug]/+page.svelte` header section to position date above
title with monospace/uppercase styling, create a unified `PostMeta` component for the meta line,
modify `Author.svelte` to remove social links (keeping them only in `AuthorCard.svelte`), and reduce
avatar sizes per requirements.

## Current State Analysis

### Existing Components

| Component             | Location       | Current Behavior                           | Required Change                    |
| --------------------- | -------------- | ------------------------------------------ | ---------------------------------- |
| `[slug]/+page.svelte` | Header section | Title first, then metadata block           | Move date above title              |
| `Author.svelte`       | Molecules      | 44px avatar, includes Socials              | Reduce avatar, remove socials      |
| `AuthorCard.svelte`   | Molecules      | 56px avatar, includes Socials              | Reduce to 32-36px, keep socials    |
| `Socials.svelte`      | Molecules      | Icons for GitHub, LinkedIn, Email, Twitter | No change, used only in AuthorCard |

### Current Header Structure (`[slug]/+page.svelte`)

```svelte
<div class="header">
    <h1>{title}</h1>
    <div class="metadata">
        {#if author}
            <Author {author} />
        {/if}
        <div class="post-details">
            <div class="note">
                <time datetime={date}>{dateformat(date, 'UTC:mmm dd, yyyy')}</time>
                <!-- updated date if exists -->
            </div>
            {#if readingTimeMinutes}
                <div class="note">{readingTimeMinutes} min read</div>
            {/if}
        </div>
    </div>
    <!-- tags -->
</div>
```

**Gap:** Title (`<h1>`) appears before date. CONTEXT.md requires date above title.

### Typography Foundation (From Phase 6)

Relevant tokens already established:

- `--font--mono: 'JetBrains Mono', monospace` - for dates, reading time, meta elements
- `--text-small: var(--raw-text-sm)` (14px) - for meta text
- `--text-caption: var(--raw-text-xs)` (12px) - for smaller meta text
- Muted text: `rgba(var(--color--secondary-rgb), 0.8)` - current pattern in `.note`

### Current Date Formatting

```javascript
dateformat(date, 'UTC:mmm dd, yyyy'); // Output: "Jan 20, 2026"
```

**CONTEXT.md decision:** Use `JAN 20, 2026` format (abbreviated month uppercase, day, full year).

The `dateformat` library supports uppercase months via custom format strings. The format mask `mmm`
gives abbreviated month; uppercase must be applied via CSS `text-transform: uppercase`.

## Implementation Strategy

### Task 1: Date Above Title Repositioning

Restructure the header in `[slug]/+page.svelte`:

```svelte
<div class="header">
    <!-- Date above title (new position) -->
    <div class="date-header">
        <time datetime={date}>{formatDate(date)}</time>
        {#if updated}
            <span class="updated"
                >Updated: <time datetime={updated}>{formatDate(updated)}</time></span
            >
        {/if}
    </div>

    <h1>{title}</h1>

    <!-- Meta line (author, reading time) -->
    <div class="meta-line">
        {#if author}
            <span class="author-inline">
                <img class="avatar-small" src={author.avatarUrl} alt="" />
                <span class="author-name">{author.name}</span>
            </span>
        {/if}
        <span class="separator">•</span>
        <span class="reading-time">{readingTimeMinutes} min read</span>
    </div>
</div>
```

### Task 2: Date Styling (Monospace + Uppercase)

CONTEXT.md decisions:

- Format: `JAN 20, 2026`
- Font: `--font--mono`
- Text-transform: `uppercase`
- Letter-spacing: `0.05em`
- Color: Muted (lighter, smaller than body)

```scss
.date-header {
    font-family: var(--font--mono), monospace;
    font-size: var(--text-caption); // 12px
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(var(--color--secondary-rgb), 0.6); // More muted than .note
    margin-bottom: 16px; // Comfortable spacing to title
}

.date-header .updated {
    margin-left: 8px;
    opacity: 0.8;
}
```

### Task 3: Relative Date Support

CONTEXT.md decision: Use relative dates ("2 days ago") for posts within the last week, then switch
to absolute.

**Approach:** Use native `Intl.RelativeTimeFormat` API (no additional dependencies).

```typescript
// src/lib/utils/format-date.ts
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatPostDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Within last week: use relative format
    if (diffDays < 7 && diffDays >= 0) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return rtf.format(-diffDays, 'day');
    }

    // Older than a week: use absolute format
    return date
        .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        .toUpperCase(); // "JAN 20, 2026"
}
```

**Note:** The `dateformat` library can be retained for consistency but the formatting function
abstracts the logic.

### Task 4: Meta Line Component

Create unified `PostMeta.svelte` for the meta line:

**Props:**

- `author`: Author object (optional)
- `date`: ISO date string
- `readingTimeMinutes`: number (optional)
- `showAvatar`: boolean (default: true)

**Layout:**

- Mobile: Stack - Author (with small avatar) on line 1, Date/Reading Time on line 2
- Desktop: Single line - Author • Date • Reading Time

```scss
.post-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    font-family: var(--font--mono), monospace;
    font-size: var(--text-small); // 14px
    color: rgba(var(--color--secondary-rgb), 0.7);

    @include breakpoints.for-phone-only {
        flex-direction: column;
        align-items: flex-start;
    }
}

.separator {
    color: rgba(var(--color--secondary-rgb), 0.4);

    @include breakpoints.for-phone-only {
        display: none;
    }
}

.author-name {
    color: var(--color--primary); // Orange accent
    font-weight: 500;
}
```

### Task 5: Inline Avatar Sizing

CONTEXT.md decision: Include small avatar (16-20px) inline with author name in meta line.

```scss
.avatar-inline {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    object-fit: cover;
    vertical-align: middle;
    margin-right: 6px;
}
```

### Task 6: Author.svelte Modification

**Changes:**

1. Remove `Socials` component import and usage
2. Reduce avatar size (decision needed: remove entirely or keep smaller)

Per CONTEXT.md: "Include small avatar (16-20px) inline with author name in meta line" - this
suggests the `Author.svelte` component may be replaced by inline rendering in the meta line, or
simplified significantly.

**Recommendation:** Keep `Author.svelte` for potential reuse but simplify:

- Remove socials (moved to AuthorCard only)
- Reduce avatar to 32px (from 44px) for any standalone usage

### Task 7: AuthorCard.svelte Modification

**Changes:**

1. Reduce avatar size from 56px to 32-36px (requirement META-04)
2. Keep social links (requirement META-05)
3. Add subtle background panel per CONTEXT.md

```scss
.author-card {
    // Existing border approach is fine
    // Add subtle background tint per CONTEXT.md
    background: rgba(var(--color--secondary-rgb), 0.05);
    border-radius: 8px;
    padding: 24px;
}

.avatar-section :global(.avatar) {
    width: 36px; // Reduced from 56px
    height: 36px;
    border-radius: 6px;
}
```

### Task 8: Social Links - Icons Only

CONTEXT.md decision: Social links use icons only, no text labels. Maximum 3 platforms shown.

Current `Socials.svelte` already uses icons only. The "maximum 3 platforms" may need implementation
if author has more than 3.

```typescript
// In AuthorCard.svelte, limit socials
const limitedSocials = $derived.by(() => {
    if (!author.socials) return undefined;
    const entries = Object.entries(author.socials).filter(([, v]) => v);
    // Priority: GitHub, LinkedIn, Twitter, Email
    const priority = ['github', 'linkedin', 'twitter', 'email'];
    const sorted = entries.sort((a, b) => priority.indexOf(a[0]) - priority.indexOf(b[0]));
    return Object.fromEntries(sorted.slice(0, 3));
});
```

## Files to Modify

### Primary Files

| File                                             | Changes                                                   |
| ------------------------------------------------ | --------------------------------------------------------- |
| `src/routes/[slug]/+page.svelte`                 | Restructure header: date above title, meta line component |
| `src/lib/components/molecules/Author.svelte`     | Remove socials, reduce avatar size                        |
| `src/lib/components/molecules/AuthorCard.svelte` | Reduce avatar to 32-36px, add subtle background           |

### New Files

| File                                           | Purpose                                         |
| ---------------------------------------------- | ----------------------------------------------- |
| `src/lib/utils/format-date.ts`                 | Date formatting utilities (relative + absolute) |
| `src/lib/components/molecules/PostMeta.svelte` | (Optional) Unified meta line component          |

### No Changes Needed

| File                      | Reason                                   |
| ------------------------- | ---------------------------------------- |
| `Socials.svelte`          | Already icon-only, works as-is           |
| `BlogPostCard.svelte`     | Listing cards, not individual post pages |
| `_tokens-typography.scss` | Tokens already established in Phase 6    |
| `_tokens-colors.scss`     | Color system established in Phase 5      |

## Don't Hand-Roll

| Problem                  | Don't Build                 | Use Instead                              | Why                                       |
| ------------------------ | --------------------------- | ---------------------------------------- | ----------------------------------------- |
| Relative date formatting | Custom time difference calc | `Intl.RelativeTimeFormat`                | Native API, locale-aware, no dependencies |
| Date parsing             | Manual string parsing       | `new Date()` or `dateformat`             | ISO strings work directly                 |
| Icon-only social links   | Custom icon rendering       | Existing `Socials.svelte`                | Already implemented correctly             |
| Muted text colors        | Hardcoded opacity values    | `rgba(var(--color--secondary-rgb), 0.x)` | Established pattern in codebase           |

## Common Pitfalls

### Pitfall 1: Breaking Date Accessibility

**What goes wrong:** Removing `<time datetime="">` attribute breaks machine readability **Why it
happens:** Focus on visual styling forgets semantic HTML **How to avoid:** Always wrap dates in
`<time>` with ISO datetime attribute **Warning signs:** SEO tools flag missing structured data

### Pitfall 2: Mobile Meta Line Overflow

**What goes wrong:** Single-line meta with avatar + author + date + reading time overflows on mobile
**Why it happens:** Content exceeds viewport width **How to avoid:** Use flex-wrap or stack layout
on mobile breakpoint **Warning signs:** Horizontal scroll on phone viewports

### Pitfall 3: Avatar Size Inconsistency

**What goes wrong:** Multiple avatar sizes across components (18px, 32px, 36px, 44px, 56px) **Why it
happens:** Each component defines own size **How to avoid:** Document size hierarchy: 16-20px
(inline), 32-36px (card), don't create new sizes **Warning signs:** Visual inconsistency between
pages

### Pitfall 4: Uppercase + Letter-Spacing Width

**What goes wrong:** Uppercase text with letter-spacing breaks layouts **Why it happens:** Combined
effect adds significant width **How to avoid:** Test with longest realistic date string, use
`white-space: nowrap` **Warning signs:** Date wraps awkwardly on narrow viewports

### Pitfall 5: Relative Date Staleness

**What goes wrong:** Relative date shows "2 days ago" but was cached yesterday **Why it happens:**
SSG builds at deploy time, dates become stale **How to avoid:** Accept this limitation or compute
relative dates client-side **Warning signs:** "2 days ago" post is actually 4 days old
**Recommendation:** For static site, accept that relative dates are deploy-time accurate, or use
absolute dates only

## Architecture Patterns

### Recommended Component Structure

```
[slug]/+page.svelte (article layout)
├── Date header (inline, not component)
├── <h1> Title
├── Meta line (inline or PostMeta component)
│   ├── Avatar (inline img)
│   ├── Author name (accented)
│   ├── Separator (•)
│   └── Reading time
├── Tags
├── Cover image
├── Content
└── AuthorCard (bottom of post)
    ├── Avatar (32-36px)
    ├── Name + Bio
    └── Socials (icons only, max 3)
```

### CSS Pattern for Muted Meta Text

```scss
// Established pattern in codebase
.meta-element {
    font-family: var(--font--mono), monospace;
    font-size: var(--text-small);
    color: rgba(var(--color--secondary-rgb), 0.7);
}

// Date-specific enhancement per CONTEXT.md
.meta-date {
    @extend .meta-element;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

// Author name accent per CONTEXT.md
.meta-author {
    color: var(--color--primary);
    font-weight: 500;
}
```

### Anti-Patterns to Avoid

- **Hardcoded colors** - Use CSS variables from token system
- **Multiple date format functions** - Centralize in `format-date.ts`
- **Inline social links in meta line** - Keep socials in AuthorCard only
- **Fixed pixel breakpoints** - Use existing breakpoint mixins

## Code Examples

### Date Formatting Utility

```typescript
// src/lib/utils/format-date.ts
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/**
 * Format post date with relative/absolute hybrid approach.
 * - Within 7 days: relative ("Yesterday", "3 days ago")
 * - Older: absolute uppercase ("JAN 20, 2026")
 */
export function formatPostDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return rtf.format(-diffDays, 'day');
    }

    // Absolute format: "JAN 20, 2026"
    return date
        .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        .toUpperCase();
}

/**
 * Format date for datetime attribute (ISO format).
 */
export function formatDateISO(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
}
```

### Muted Date Header

```svelte
<!-- In [slug]/+page.svelte -->
<script lang="ts">
    import { formatPostDate, formatDateISO } from '$lib/utils/format-date';
</script>

<div class="date-header">
    <time datetime={formatDateISO(date)}>{formatPostDate(date)}</time>
    {#if updated}
        <span class="updated-label">
            Updated: <time datetime={formatDateISO(updated)}>{formatPostDate(updated)}</time>
        </span>
    {/if}
</div>

<style lang="scss">
    .date-header {
        font-family: var(--font--mono), monospace;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(var(--color--secondary-rgb), 0.6);
        margin-bottom: 16px;
    }

    .updated-label {
        margin-left: 12px;

        &::before {
            content: '·';
            margin-right: 12px;
            color: rgba(var(--color--secondary-rgb), 0.4);
        }
    }
</style>
```

### Meta Line with Inline Avatar

```svelte
<!-- In [slug]/+page.svelte -->
<div class="meta-line">
    {#if author}
        <span class="author">
            {#if author.avatarUrl}
                <img class="avatar-inline" src={author.avatarUrl} alt="" width="18" height="18" />
            {/if}
            <span class="author-name">{author.name}</span>
        </span>
        <span class="separator">•</span>
    {/if}
    {#if readingTimeMinutes}
        <span class="reading-time">{readingTimeMinutes} min read</span>
    {/if}
</div>

<style lang="scss">
    @use '$styles/breakpoints';

    .meta-line {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font--mono), monospace;
        font-size: 13px;
        color: rgba(var(--color--secondary-rgb), 0.7);

        @include breakpoints.for-phone-only {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
    }

    .avatar-inline {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        object-fit: cover;
        vertical-align: middle;
    }

    .author-name {
        color: var(--color--primary);
        font-weight: 500;
    }

    .separator {
        color: rgba(var(--color--secondary-rgb), 0.4);

        @include breakpoints.for-phone-only {
            display: none;
        }
    }
</style>
```

## State of the Art

| Old Approach               | Current Approach                 | When Changed | Impact                            |
| -------------------------- | -------------------------------- | ------------ | --------------------------------- |
| Date below title           | Date above title                 | This phase   | Better scanability per CONTEXT.md |
| Socials in header + footer | Socials in footer only           | This phase   | Cleaner header, focused CTA       |
| 44-56px avatars            | 32-36px in cards, 16-20px inline | This phase   | More compact, professional look   |
| Absolute dates only        | Relative + absolute hybrid       | This phase   | Better UX for recent posts        |

## Open Questions

1. **Should `Author.svelte` be deprecated entirely?**
    - Current use: Only in `[slug]/+page.svelte` header
    - After changes: Could be replaced by inline meta rendering
    - Recommendation: Keep but simplify, may be useful for future multi-author pages

2. **SSG relative date accuracy**
    - Issue: Relative dates computed at build time become stale
    - Options: (a) Accept staleness, (b) client-side hydration, (c) absolute dates only
    - Recommendation: Accept staleness for simplicity; most visitors see posts within days of deploy

3. **Date format locale**
    - CONTEXT.md specifies "JAN 20, 2026" (English)
    - Should `toLocaleDateString('en-US')` be hardcoded or use browser locale?
    - Recommendation: Hardcode English for consistency with uppercase styling

## Sources

### Primary (HIGH confidence)

- Codebase analysis: `src/routes/[slug]/+page.svelte`, `Author.svelte`, `AuthorCard.svelte`
- CONTEXT.md: User-locked decisions for meta layout, avatar sizes, social link placement
- Phase 6 Research: Typography token foundation (`--font--mono`, text sizes)
- Phase 5 Research: Color token foundation (`--color--secondary-rgb`, `--color--primary`)

### Secondary (MEDIUM confidence)

- [MDN Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) -
  Native relative date API
- [HPE Design System - Date and Time](https://design-system.hpe.design/foundation/date-and-time) -
  Relative vs absolute date UX guidance
- [Builder.io - Relative Time Strings](https://www.builder.io/blog/relative-time) - Implementation
  patterns

### Tertiary (LOW confidence)

- WebSearch results on blog author card design patterns - General best practices, not
  Svelte-specific

## Metadata

**Confidence breakdown:**

- Component structure: HIGH - Direct codebase inspection
- Typography/color tokens: HIGH - Established in Phases 5-6
- Date formatting approach: HIGH - Native API, well-documented
- Relative date UX: MEDIUM - Based on general best practices

**Research date:** 2026-01-20 **Valid until:** 2026-02-20 (30-day validity, stable domain)

---

_Phase: 08-post-meta_ _Research completed: 2026-01-20_
