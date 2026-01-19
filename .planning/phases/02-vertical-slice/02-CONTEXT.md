# Phase 2: Vertical Slice - Context

**Gathered:** 2026-01-19 **Status:** Ready for planning

<domain>
## Phase Boundary

One complete blog post served from Sanity, live in production alongside existing markdown posts.
Proves the full integration works end-to-end: fetching from Sanity, rendering Portable Text,
handling images, and coexisting with markdown content. Gems switch all-at-once (Phase 3), not
incrementally here.

</domain>

<decisions>
## Implementation Decisions

### Routing Strategy

- **Source priority:** Sanity first, fall back to markdown if not found
- **Blog listing:** Merged list from both sources, deduplicate by slug, sort by date
- **Hidden posts:** Excluded from listings but accessible by direct URL (match current behavior)
- **Gems:** All-or-nothing switch — either all from Sanity or all from current source
- **Draft preview:** Yes, via preview route with secret token in URL (e.g., `?preview=secret123`)
- **API failure:** Show error page, don't silently fall back
- **Related posts:** Same-source only — Sanity posts suggest Sanity posts, markdown suggests
  markdown

### Portable Text Rendering

- **Code blocks:** Can evolve from current MDsveX/Shiki styling if improvements found
- **Callouts:** Design fresh, don't need to match existing (none currently)
- **Internal links:** Resolve at render time (keep reference ID, resolve client-side or via API)
- **Render timing:** Hybrid allowed — mostly server, interactive elements can hydrate
- **External links:** Open in new tab with `target="_blank"` and `rel="noopener"`
- **Heading anchors:** Yes, with hover icon for copying URL
- **Inline code:** Can evolve styling if better approach found

### Image Handling

- **Source:** Sanity CDN direct (not proxied through Vercel)
- **Captions:** Show caption below image when provided
- **Hotspot/crop:** Respect in all contexts (covers, inline, thumbnails)
- **Responsive sizes:** Standard breakpoints (320, 640, 960, 1280, 1920px)
- **Lazy loading:** Yes, with blur-up/LQIP placeholder
- **Lightbox:** No, images display inline only
- **Format:** Auto (WebP/AVIF based on browser support)
- **Cover images:** Served from Sanity CDN in listings

### Content Selection

- **Slice post:** Migrate an existing complex post with code blocks, images, various formatting
- **Publish date:** Keep original date for continuity
- **Validation:** Automated diff comparing rendered HTML structure
- **Gems:** No vertical slice — migrate all at once in Phase 3

### Claude's Discretion

- Table of contents (sidebar vs inline vs none) — decide based on article length
- Exact blur-up placeholder implementation
- Which specific post to migrate (pick one that exercises most features)
- Preview token storage and rotation strategy

</decisions>

<specifics>
## Specific Ideas

- Preview route pattern: query param `?preview=secret` rather than separate route
- Sanity CDN should handle all image transforms — no local processing needed
- Related posts algorithm stays same-source to avoid complexity during dual-source period

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-vertical-slice_ _Context gathered: 2026-01-19_
