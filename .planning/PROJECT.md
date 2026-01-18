# Sanity CMS Migration

## What This Is

Migration of maxdaten.io's content management from git-managed markdown files to Sanity.io CMS.
Enables frictionless content creation with visual editing, streamlined image handling, and enhanced
publishing workflows — while preserving the existing site structure and URLs.

## Core Value

Creating new blog posts should be frictionless — no manual file scaffolding, no image folder
management, just write and publish.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Blog posts content type in Sanity with all current fields
- [ ] Gems content type in Sanity
- [ ] Migrate existing blog posts to Sanity
- [ ] Migrate existing gems to Sanity
- [ ] Preserve existing URL slugs
- [ ] SvelteKit fetches content from Sanity instead of local files
- [ ] Image handling through Sanity's asset pipeline
- [ ] Draft support (unpublished posts not visible on site)
- [ ] Scheduled publishing (publish date in future)
- [ ] Tags management UI in Sanity
- [ ] SEO management (meta descriptions, OG images, keywords)

### Out of Scope

- Redesigning the site's appearance — this is a backend/CMS change only
- Real-time collaborative editing — single author workflow is sufficient
- Multiple author support — personal blog
- Comments system — not part of current site
- Newsletter integration — can be added later if desired

## Context

**Current state:**

- SvelteKit 2.0 static blog with Svelte 5
- Blog posts as `.md` files in `src/content/blog/` with MDsveX
- Images stored in `src/lib/assets/images/posts/` folder structure
- Gems system in `src/lib/data/gems/`
- Frontmatter includes: title, slug, coverImage, excerpt, date, tags, keywords, hidden

**Pain points being solved:**

- Manual file creation with implicit naming conventions
- Frontmatter field requirements hard to remember
- Image management requires placing files in specific folders
- No visual editing experience
- No draft/scheduled publishing workflow

**What stays the same:**

- Site design and appearance
- URL structure (`/[slug]` for posts)
- RSS feed generation
- Static site deployment to Vercel

## Constraints

- **URLs**: Must preserve existing URL slugs — SEO and existing links depend on this
- **CMS**: Sanity.io (decided)
- **Framework**: Existing SvelteKit architecture stays — only data source changes
- **Deployment**: Static generation must continue working (Vercel)

## Key Decisions

| Decision                         | Rationale                                           | Outcome   |
| -------------------------------- | --------------------------------------------------- | --------- |
| Sanity.io as CMS                 | User preference, good image handling, visual editor | — Pending |
| Full migration (not incremental) | Clean break from file-based workflow                | — Pending |
| Include gems in migration        | Part of site content, same friction applies         | — Pending |

---

_Last updated: 2025-01-18 after initialization_
