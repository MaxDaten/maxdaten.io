# Phase 4: Finalization - Research

**Researched:** 2026-01-20 **Domain:** RSS/Sitemap generation, content cleanup **Confidence:** HIGH

## Summary

Phase 4 involves finalizing the Sanity migration by completing RSS feed generation, sitemap
configuration, and cleaning up any remaining migration artifacts. Research reveals that both RSS and
sitemap routes already exist and are functional with Sanity, but have specific issues that need
addressing.

The RSS feed currently uses `toPlainText` for body content instead of rendering full HTML as
specified in the CONTEXT.md decisions. The sitemap works correctly in production (via Vercel's
`VERCEL_PROJECT_PRODUCTION_URL` environment variable) but shows a placeholder origin in local
builds.

**Primary recommendation:** Install `@portabletext/to-html` to render Portable Text as HTML for RSS
content, and verify the existing sitemap configuration meets all requirements from CONTEXT.md.

## Standard Stack

### Core (Already Installed)

| Library              | Version | Purpose                        | Why Standard                          |
| -------------------- | ------- | ------------------------------ | ------------------------------------- |
| super-sitemap        | ^1.0.5  | Sitemap generation             | Already in use, auto-discovers routes |
| @portabletext/svelte | ^3.0.1  | Svelte Portable Text rendering | For page rendering (already used)     |
| html-entities        | ^2.6.0  | XML/HTML entity encoding       | Already used in RSS route             |

### Required Addition

| Library               | Version | Purpose                      | When to Use           |
| --------------------- | ------- | ---------------------------- | --------------------- |
| @portabletext/to-html | 5.0.1   | Render Portable Text to HTML | RSS feed body content |

**Installation:**

```bash
npm install @portabletext/to-html
```

## Architecture Patterns

### Current RSS Route Structure

```
src/routes/rss.xml/+server.ts
  - Fetches posts via allPostsQuery
  - Renders XML with media:content tags
  - Uses toPlainText (needs to be toHTML)
```

### Current Sitemap Route Structure

```
src/routes/sitemap.xml/+server.ts
  - Uses super-sitemap library
  - Fetches paramValues from Sanity
  - Provides lastmod from post dates
```

### Pattern 1: Portable Text to HTML for RSS

**What:** Use @portabletext/to-html to render Portable Text blocks as HTML for RSS feeds **When to
use:** Server-side rendering where Svelte components are not available **Example:**

```typescript
// Source: https://github.com/portabletext/to-html
import { toHTML } from '@portabletext/to-html';

const htmlBody = toHTML(post.body, {
    components: {
        types: {
            codeBlock: ({ value }) =>
                `<pre><code class="${value.language || ''}">${escapeXml(value.code)}</code></pre>`,
            portableImage: ({ value }) =>
                value.url ? `<img src="${value.url}" alt="${value.alt || ''}" />` : '',
            callout: ({ value }) =>
                `<blockquote class="${value.type || 'note'}">${value.text || ''}</blockquote>`,
        },
        marks: {
            internalLink: ({ children, value }) =>
                `<a href="${siteBaseUrl}/${value.reference?.slug?.current || ''}">${children}</a>`,
            link: ({ children, value }) => `<a href="${value.href || ''}">${children}</a>`,
        },
    },
});
```

### Pattern 2: RSS Query with Body Field

**What:** Dedicated GROQ query that includes body field for RSS **When to use:** RSS feed generation
needs full content **Example:**

```typescript
// Source: Sanity GROQ patterns
export const rssPostsQuery = defineQuery(`
  *[_type == "post" && !hidden] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    date,
    body,
    tags[]-> { name },
    author-> { name },
    coverImage { "url": asset->url }
  }
`);
```

### Anti-Patterns to Avoid

- **Mixing toPlainText and toHTML:** Current RSS uses toPlainText which loses formatting; use toHTML
  for full content
- **Local origin in sitemap:** Don't hardcode origin; use kit.prerender.origin config

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem               | Don't Build         | Use Instead           | Why                                      |
| --------------------- | ------------------- | --------------------- | ---------------------------------------- |
| Portable Text to HTML | Custom serializer   | @portabletext/to-html | Handles edge cases, marks, nested blocks |
| Sitemap generation    | Manual XML building | super-sitemap         | Route discovery, lastmod, excludes       |
| XML entity encoding   | Custom regex        | html-entities         | Complete coverage, security              |

**Key insight:** The @portabletext/to-html package uses the same component model as
@portabletext/svelte, making it easy to maintain consistency between page rendering and RSS
rendering.

## Common Pitfalls

### Pitfall 1: RSS Body Field Missing from Query

**What goes wrong:** RSS route uses allPostsQuery which excludes body field **Why it happens:**
allPostsQuery was designed for listing pages, not full content **How to avoid:** Create dedicated
RSS query or modify allPostsQuery **Warning signs:** RSS content:encoded element contains only
excerpt or empty content

### Pitfall 2: Sitemap Origin in Local Builds

**What goes wrong:** Sitemap shows `http://sveltekit-prerender/` URLs **Why it happens:**
`kit.prerender.origin` uses `VERCEL_PROJECT_PRODUCTION_URL` which is undefined locally **How to
avoid:** This is expected behavior; production builds will have correct URL **Warning signs:** Local
build sitemap has wrong origin (acceptable during development)

### Pitfall 3: RSS Custom Block Types Not Rendered

**What goes wrong:** Code blocks, images, callouts appear as empty or [object Object] **Why it
happens:** toHTML needs custom component definitions for non-standard block types **How to avoid:**
Define all custom types (codeBlock, portableImage, callout) in components config **Warning signs:**
Missing content in RSS feed items

### Pitfall 4: Unescaped Content in RSS CDATA

**What goes wrong:** CDATA sections break if content contains `]]>` **Why it happens:** CDATA end
sequence not escaped **How to avoid:** Replace `]]>` with `]]]]><![CDATA[>` or use proper escaping
**Warning signs:** XML parsing errors in feed readers

## Code Examples

### RSS Feed with Portable Text HTML Rendering

```typescript
// Source: @portabletext/to-html documentation
import { toHTML } from '@portabletext/to-html';
import { encode } from 'html-entities';

// Define components for custom block types
const rssComponents = {
    types: {
        codeBlock: ({ value }) => {
            const code = encode(value.code || '');
            return `<pre><code>${code}</code></pre>`;
        },
        portableImage: ({ value }) => {
            if (!value.url) return '';
            const alt = encode(value.alt || '');
            return `<figure><img src="${value.url}" alt="${alt}" /></figure>`;
        },
        callout: ({ value }) => {
            const text = encode(value.text || '');
            return `<blockquote><p>${text}</p></blockquote>`;
        },
    },
    marks: {
        internalLink: ({ children, value }) => {
            const href = value.reference?.slug?.current
                ? `${siteBaseUrl}/${value.reference.slug.current}`
                : '#';
            return `<a href="${href}">${children}</a>`;
        },
        link: ({ children, value }) => {
            const href = value.href || '#';
            return `<a href="${href}">${children}</a>`;
        },
    },
};

// In renderPost function:
const htmlContent = toHTML(post.body, { components: rssComponents });
```

### Sitemap with Correct Configuration

```typescript
// Source: super-sitemap documentation (https://github.com/jasongitmail/super-sitemap)
import * as sitemap from 'super-sitemap';

export async function GET({ url }) {
    const sanityPosts = await client.fetch(allPostsQuery);

    const blogPostParams = sanityPosts.map((post) => ({
        values: [post.slug],
        lastmod: post.lastModified || post.date,
    }));

    return await sitemap.response({
        origin: url.origin, // Uses kit.prerender.origin in production
        excludeRoutePatterns: [
            '.*\\/preview.*',
            '.*\\/og-preview.*',
            '.*\\/og\\.jpg\\/preview.*',
            '.*\\/about\\/.*',
            '.*\\/404.*', // Should exclude 404 page
        ],
        paramValues: {
            '/[slug]': blogPostParams,
        },
        sort: 'alpha',
    });
}
```

## State of the Art

| Old Approach        | Current Approach | When Changed | Impact                     |
| ------------------- | ---------------- | ------------ | -------------------------- |
| toPlainText for RSS | toHTML for RSS   | Now          | Full HTML content in feeds |
| Manual sitemap XML  | super-sitemap    | Already done | Auto route discovery       |
| Local images        | Sanity CDN URLs  | Phase 3      | Simplified image handling  |

**Current state of implementation:**

- RSS route exists at `/src/routes/rss.xml/+server.ts` - needs body rendering fix
- Sitemap route exists at `/src/routes/sitemap.xml/+server.ts` - mostly complete
- Old content directories already removed in Phase 3

## Cleanup Status

### Already Removed (Phase 3)

- `src/content/blog/` - markdown content files
- `src/lib/assets/images/posts/` - post images
- `src/lib/assets/images/gems/` - gem images
- `src/lib/data/blog-posts/` - blog data module
- `src/lib/data/gems/` - gems data module

### Remaining Cleanup Candidates

| File                                                | Status         | Recommendation                       |
| --------------------------------------------------- | -------------- | ------------------------------------ |
| `src/content/.DS_Store`                             | Orphaned       | Remove                               |
| `src/lib/utils/image-loader.ts`                     | Partially used | Keep - still used for author avatars |
| `src/lib/components/atoms/MarkdownImage.svelte`     | Legacy MDsveX  | Remove if not used                   |
| `src/lib/components/organisms/MdsvexWrapper.svelte` | Legacy MDsveX  | Remove if not used                   |
| `mdsvex.config.js`                                  | Legacy MDsveX  | Check if still needed                |

### Files Still Needed

| File                            | Reason                             |
| ------------------------------- | ---------------------------------- |
| `src/lib/data/authors.ts`       | Static author data (not in Sanity) |
| `src/lib/data/meta.ts`          | Site metadata, schema.org          |
| `src/lib/utils/image-loader.ts` | Author avatar loading              |

## Open Questions

### Q1: MDsveX Configuration

**What we know:** mdsvex.config.js and related components still exist **What's unclear:** Are they
still used for anything after Sanity migration? **Recommendation:** Check if any pages still use
MDsveX rendering (impressum page?)

### Q2: Author Avatar Images

**What we know:** `src/lib/assets/images/authors/jloos.png` still exists and is used **What's
unclear:** Should author avatars move to Sanity or stay local? **Recommendation:** Keep as-is for
now (out of phase scope per CONTEXT.md)

### Q3: 404 Page in Sitemap

**What we know:** Sitemap currently includes `/404` route **What's unclear:** Per CONTEXT.md, should
we exclude 404? **Recommendation:** Add 404 to excludeRoutePatterns per best practice

## Sources

### Primary (HIGH confidence)

- super-sitemap v1.0.5 - [GitHub](https://github.com/jasongitmail/super-sitemap) - Configuration
  options, paramValues, excludeRoutePatterns
- @portabletext/to-html v5.0.1 - [GitHub](https://github.com/portabletext/to-html) - toHTML
  function, components API
- Codebase inspection - Existing RSS and sitemap implementations

### Secondary (MEDIUM confidence)

- SvelteKit docs - kit.prerender.origin configuration
- Sanity GROQ - Query patterns for RSS data

### Tertiary (LOW confidence)

- None - all findings verified with primary sources

## Metadata

**Confidence breakdown:**

- RSS implementation: HIGH - @portabletext/to-html docs verified
- Sitemap configuration: HIGH - super-sitemap docs verified, codebase inspected
- Cleanup status: HIGH - direct file system inspection

**Research date:** 2026-01-20 **Valid until:** 2026-02-20 (stable libraries, 30 days)
