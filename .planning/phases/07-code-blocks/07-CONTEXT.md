# Phase 7: Code Blocks - Context

**Gathered:** 2026-01-20 **Status:** Ready for planning

<domain>
## Phase Boundary

Transform code blocks into first-class design citizens with modern styling. Dark background
regardless of theme, clean header with filename/language, copy functionality, and readable
typography. Line highlighting support included.

</domain>

<decisions>
## Implementation Decisions

### Header design

- Filename displays left-aligned with file type icon
- Language label on the right side of header
- Header has distinct color band (darker than code area background)
- Header hidden completely when no filename or language provided

### Container styling

- Near-black background (~#1a1a1a) for high contrast
- 12px border-radius with clean edges
- No shadow or glow effects — flat appearance
- Code blocks break out of prose width for more horizontal space
- Moderate padding (16px) inside code area

### Copy button behavior

- Positioned in bottom-right corner of code area
- Icon changes from copy to checkmark on successful copy
- Always visible at 50% opacity, 100% on hover
- On mobile (no hover): always visible at full opacity

### Typography & readability

- Line numbers always shown
- Long lines use horizontal scroll (no soft wrap)
- Desktop font size: 13px (compact)
- Mobile minimum: 12px (from success criteria)
- Support line highlighting for specific lines

### Claude's Discretion

- Exact header background color value
- Line number styling (color, separator)
- Checkmark display duration after copy
- Horizontal scroll indicator styling
- Line highlight background color

</decisions>

<specifics>
## Specific Ideas

No specific product references mentioned — open to standard modern code block patterns (VS Code,
GitHub-style).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 07-code-blocks_ _Context gathered: 2026-01-20_
