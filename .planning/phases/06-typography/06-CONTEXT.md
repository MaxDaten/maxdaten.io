# Phase 6: Typography - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Apply typography improvements for comfortable reading across all content. This includes line-height
refinements, prose width constraints, monospace treatment for meta elements, and font family
consolidation. Component styling and spacing changes beyond typography are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Line-height application

- Body paragraphs: 1.6 line-height (modern, efficient feel)
- Blockquotes: 1.5 line-height (tighter, visually distinct from prose)
- Lists (bullet and numbered): 1.4-1.5 line-height (scannable, items grouped)
- Headings: Vary by level — H1-H2 at 1.1 (tighter), H3-H4 at 1.2 (slightly looser)

### Content width & rhythm

- Prose constrains to 680px max-width (60-80 characters per line)
- Code blocks break out wider to ~800px (moderate breakout, not edge-to-edge)
- Images match code blocks at ~800px (consistent breakout for all media)
- Vertical spacing: Relative to font (1em) — spacing scales with text size

### Monospace elements

- Dates: Monospace, uppercase, with letter-spacing (e.g., JAN 20, 2026)
- Reading time: Monospace, normal case (e.g., 5 min read)
- Tags: Monospace (technical label aesthetic)
- Author name: Monospace (consistent with other meta elements)

### Font family consolidation

- Body/headings: One custom geometric sans (Inter or Plus Jakarta Sans) + system fallback
- Monospace: JetBrains Mono for code and meta elements
- Loading strategy: font-display: swap (show text immediately, swap when loaded)

### Claude's Discretion

- Exact font choice between Inter and Plus Jakarta Sans
- Specific letter-spacing values for uppercase dates
- Caption and small text line-height
- Font weight distribution across headings

</decisions>

<specifics>
## Specific Ideas

- Strong typographic statement for dates — uppercase + letter-spacing creates a design system feel
- Code blocks and images should feel like they "break out" of the prose column without going
  full-width
- Consistent monospace treatment across all metadata creates cohesive technical aesthetic
- Geometric sans chosen over humanist for clean, modern feel matching site direction

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 06-typography_ _Context gathered: 2026-01-20_
