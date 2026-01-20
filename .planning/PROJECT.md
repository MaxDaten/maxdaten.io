# Sanity CMS Migration

## What This Is

A personal blog (maxdaten.io) powered by Sanity CMS. Content is authored in Sanity Studio with
visual editing, served via SvelteKit with server-side rendering, and delivered through Vercel. The
migration from git-managed markdown is complete.

## Core Value

Creating new blog posts should be frictionless — no manual file scaffolding, no image folder
management, just write and publish.

## Current State

**Shipped:** v1.0 Sanity CMS Migration (2026-01-20)

- Sanity Studio: https://maxdaten.sanity.studio
- Content: 9 blog posts, 3 gems, 7 tags, 1 author
- Tech stack: SvelteKit 2.0, Svelte 5, Sanity.io, Vercel

**Codebase:**

- ~23,000 LOC (TypeScript, Svelte, JS)
- Sanity schemas in `studio/schemas/`
- GROQ queries in `src/lib/sanity/`
- Portable Text components in `src/lib/sanity/portable-text/`

## Requirements

### Validated

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

### Active

- [ ] Scheduled publishing (publish date in future)
- [ ] Live preview in Studio
- [ ] Related posts algorithm
- [ ] Reading time calculation

### Out of Scope

- Real-time collaborative editing — single author workflow
- Multiple datasets — personal blog
- Newsletter integration — can be added later
- Comments system — not part of current site
- Site redesign — backend/CMS change only

## Key Decisions

| Decision                                  | Rationale                               | Outcome    |
| ----------------------------------------- | --------------------------------------- | ---------- |
| Sanity.io as CMS                          | Visual editor, good image handling      | ✓ Good     |
| Full migration (not incremental)          | Clean break from file-based workflow    | ✓ Good     |
| Predictable IDs (post-{slug}, gem-{slug}) | Enables idempotent migration            | ✓ Good     |
| Vertical slice before full migration      | Validates approach with minimal risk    | ✓ Good     |
| Dual-source routing during migration      | Gradual transition, no big bang         | ✓ Good     |
| RSS with @portabletext/to-html            | Full HTML body without custom rendering | ✓ Good     |
| skipLibCheck in tsconfig                  | Avoid Sanity v5 type errors             | ⚠️ Revisit |

## Constraints

- **URLs**: Must preserve existing URL slugs
- **CMS**: Sanity.io (decided)
- **Framework**: SvelteKit with SSR
- **Deployment**: Vercel

---

_Last updated: 2026-01-20 after v1.0 milestone_
