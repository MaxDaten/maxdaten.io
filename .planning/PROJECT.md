# maxdaten.io

## What This Is

A personal blog (maxdaten.io) powered by Sanity CMS with precision-engineered minimalist design.
Content is authored in Sanity Studio with visual editing, served via SvelteKit with server-side
rendering, and delivered through Vercel.

## Core Value

Creating new blog posts should be frictionless — no manual file scaffolding, no image folder
management, just write and publish.

## Current State

**Shipped:**

- v2.0 Design Refinement (2026-01-21)
- v1.0 Sanity CMS Migration (2026-01-20)

**Live site:**

- Sanity Studio: https://maxdaten.sanity.studio
- Content: 9 blog posts, 3 gems, 7 tags, 1 author
- Tech stack: SvelteKit 2.0, Svelte 5, Sanity.io, Vercel

**Codebase:**

- ~29,000 LOC (TypeScript, Svelte, JS, SCSS)
- Sanity schemas in `studio/schemas/`
- GROQ queries in `src/lib/sanity/`
- Design tokens in `src/lib/scss/_tokens-*.scss`
- Portable Text components in `src/lib/sanity/portable-text/`

**Next milestone:** Planning — use `/gsd:new-milestone` to start

## Requirements

### Validated

**v1.0 — CMS Migration:**

- ✓ Blog Post schema with all fields — v1.0
- ✓ Gems schema — v1.0
- ✓ Author schema — v1.0
- ✓ Tag management — v1.0
- ✓ Portable Text with code blocks, images, callouts — v1.0
- ✓ Sanity Studio deployed — v1.0
- ✓ Draft/publish workflow — v1.0
- ✓ Image optimization via Sanity CDN — v1.0
- ✓ All content migrated with preserved URLs — v1.0
- ✓ RSS feed with full HTML body — v1.0
- ✓ Sitemap generation — v1.0
- ✓ Old markdown system removed — v1.0

**v2.0 — Design Refinement:**

- ✓ Unified design system (spacing, typography, colors) — v2.0
- ✓ Code block integration (container styling, filename headers, line highlighting) — v2.0
- ✓ Blog post meta refinement (author, reading time, hero image) — v2.0
- ✓ Page layouts (prose width, aspect-ratio images) — v2.0
- ✓ Navigation and footer polish (active states, tap targets) — v2.0

### Active

(None — start `/gsd:new-milestone` to define next milestone requirements)

### Deferred

- Variable font implementation — v2.1+
- Dark mode font weight adjustment — v2.1+
- Scheduled publishing (publish date in future) — v2.1+
- Live preview in Studio — v2.1+
- Related posts algorithm — v2.1+

### Out of Scope

- Real-time collaborative editing — single author workflow
- Multiple datasets — personal blog
- Newsletter integration — can be added later
- Comments system — not part of current site
- Animation/motion system — polish, defer

## Key Decisions

| Decision                                  | Rationale                                | Outcome    |
| ----------------------------------------- | ---------------------------------------- | ---------- |
| Sanity.io as CMS                          | Visual editor, good image handling       | ✓ Good     |
| Full migration (not incremental)          | Clean break from file-based workflow     | ✓ Good     |
| Predictable IDs (post-{slug}, gem-{slug}) | Enables idempotent migration             | ✓ Good     |
| Vertical slice before full migration      | Validates approach with minimal risk     | ✓ Good     |
| Dual-source routing during migration      | Gradual transition, no big bang          | ✓ Good     |
| RSS with @portabletext/to-html            | Full HTML body without custom rendering  | ✓ Good     |
| skipLibCheck in tsconfig                  | Avoid Sanity v5 type errors              | ⚠️ Revisit |
| Two-layer token architecture              | Primitives + semantic for flexibility    | ✓ Good     |
| JetBrains Mono for code/meta              | Single weight, consistent tech aesthetic | ✓ Good     |
| Single accent color (orange)              | Unified brand, no competing colors       | ✓ Good     |
| 680px prose width                         | Optimal 60-80 chars per line             | ✓ Good     |
| $app/state for Svelte 5                   | Modern reactive primitives               | ✓ Good     |

## Constraints

- **URLs**: Must preserve existing URL slugs
- **CMS**: Sanity.io (decided)
- **Framework**: SvelteKit with SSR
- **Deployment**: Vercel

---

_Last updated: 2026-01-21 after v2.0 milestone completion_
