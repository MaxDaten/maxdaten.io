# Phase 8: Post Meta - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Present blog post metadata as cohesive, professional design element. Repositions date above title,
consolidates meta line format, reduces author avatar size, and moves social links to bottom author
card only.

</domain>

<decisions>
## Implementation Decisions

### Meta line layout

- Stack on mobile: Author (with avatar) on own line, Date • Reading Time below
- Single line on desktop: Author • Date • Reading Time
- Separator character: bullet (•) not middle dot
- Include small avatar (16-20px) inline with author name in meta line

### Author card design

- Full card content: Avatar + Name + Bio + Social links
- Visual separation: Subtle background panel (light gray/tinted)
- Social links: Icons only, no text labels
- Maximum 3 social platforms shown (most relevant)
- Avatar size: 32-36px as specified in requirements

### Date presentation

- Format: JAN 20, 2026 (abbreviated month uppercase, day, full year)
- Position: Above title only (not duplicated in meta line)
- Updated dates: Show "Updated: JAN 25, 2026" below original when applicable
- Relative dates: Use "2 days ago" style for posts within last week, then absolute

### Visual hierarchy

- Date above title: Subtle/muted styling (lighter color, smaller size)
- Author name: Use orange accent color to highlight
- Meta line text: Noticeably smaller (~12-13px) than body text
- Spacing: Comfortable 16-24px between meta line and post title

### Claude's Discretion

- Exact pixel values within specified ranges
- Tint/shade of subtle background for author card
- Mobile breakpoint for stack vs single line
- Animation/transition on hover states

</decisions>

<specifics>
## Specific Ideas

- Meta line should feel cohesive with the design system established in previous phases
- Author accent color connects to the site's orange accent established in Phase 5
- Monospace uppercase styling for dates already established in Phase 6 (06-03)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 08-post-meta_ _Context gathered: 2026-01-20_
