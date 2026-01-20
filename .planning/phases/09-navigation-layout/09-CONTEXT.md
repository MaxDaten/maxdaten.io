# Phase 9: Navigation & Layout - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Complete the design system with polished navigation and layout elements. Navigation shows active
state, links have proper tap targets, footer removes empty space, hero images use aspect-ratio.

</domain>

<decisions>
## Implementation Decisions

### Active State Indicator

- Orange underline on active navigation item (accent color consistency)
- Thin 1-2px underline, close to text (tight, precise feel)
- Hover state uses different treatment (opacity/color change, not underline)
- Active underline distinguishes from hover state

### Tap Target Sizing

- 44px minimum tap target on mobile (Apple guideline)
- More compact padding on desktop (traditional feel)
- Tight spacing between navigation items (16-24px gap)
- Logo/home link sized by its own design needs (not constrained to 44px)

### Footer Structure

- Minimal content: copyright + social icons only
- Social links displayed as icons only (no labels)
- Subtle top border for visual separation
- Horizontal layout: copyright left, social icons right

### Hero Images

- 2:1 aspect ratio (ultra-wide) on desktop
- Taller on mobile (16:9 or 4:3) for better vertical proportion
- Center crop for image fitting (object-position: center)
- 12px border-radius matching cards and code blocks

### Claude's Discretion

- Exact underline offset/animation
- Specific hover opacity value
- Border color for footer separator
- Responsive breakpoint for hero ratio change
- Social icon sizing and spacing

</decisions>

<specifics>
## Specific Ideas

No specific references — decisions based on established design patterns from earlier phases.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 09-navigation-layout_ _Context gathered: 2026-01-20_
