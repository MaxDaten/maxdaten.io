# Phase 4: Finalization - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Complete RSS feed and sitemap generation from Sanity, verify all content is accessible, and clean up
any remaining migration artifacts. RSS and sitemap routes already exist but have bugs that need
fixing.

</domain>

<decisions>
## Implementation Decisions

### RSS Content Depth

- Full HTML body content in feed (render Portable Text to HTML)
- Preserves formatting for readers that support it
- Code blocks use plain pre/code tags (no syntax highlighting in feed)
- Include "read on site" link for full experience

### RSS Images

- Cover images included as media:content thumbnail tags
- Images served from Sanity CDN URLs
- No images embedded in body HTML

### Feed Metadata

- Include dc:creator author tag per post (from Sanity author reference)
- All post tags rendered as RSS category elements
- TTL set to 10080 minutes (weekly update hint)
- Tags help with filtering in feed readers

### Sitemap Coverage

- Include: Home, Blog, Gems listing page, all blog posts
- Exclude: Individual gem pages, preview routes, about routes
- lastmod for posts from date/lastModified fields
- lastmod for static pages uses build date

### Claude's Discretion

- HTML rendering approach for Portable Text in RSS context
- Exact sitemap exclusion patterns
- Cache-Control headers for feeds
- Error handling for missing content

</decisions>

<specifics>
## Specific Ideas

- RSS already has media:thumbnail and media:content tags — keep that pattern
- Current RSS uses toPlainText but allPostsQuery lacks body field — needs dedicated query
- super-sitemap library already in use — leverage its configuration options

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 04-finalization_ _Context gathered: 2026-01-20_
