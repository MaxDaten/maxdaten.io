# Requirements: Sanity CMS Migration

**Defined:** 2025-01-18 **Core Value:** Creating new blog posts should be frictionless — no manual
file scaffolding, no image folder management, just write and publish.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Schema

- [x] **SCHM-01**: Blog Post schema with title, slug, body, excerpt, cover image, date, tags,
      keywords, hidden
- [x] **SCHM-02**: Gems schema with title, url, description, tags
- [x] **SCHM-03**: Author schema with name, image, bio
- [x] **SCHM-04**: Tag document type with name and slug
- [x] **SCHM-05**: SEO object type with meta description, OG image, validation rules
- [x] **SCHM-06**: Custom code block type preserving filename and line number metadata
- [x] **SCHM-07**: Portable Text configuration for blog post body with code blocks, images, links

### Studio

- [x] **STDO-01**: Sanity Studio deployed via Sanity's hosted service (sanity.studio)
- [x] **STDO-02**: Draft/publish workflow visible in Studio UI
- [x] **STDO-03**: Tag management interface
- [x] **STDO-04**: Image upload with hotspot/crop support

### Vertical Slice (integration + one post proves everything works)

- [x] **SLCE-01**: Switch from static adapter to Vercel adapter for SSR _(Pre-existing - project
      already uses @sveltejs/adapter-vercel)_
- [x] **SLCE-02**: SvelteKit fetches blog posts from Sanity dynamically (server-side)
- [x] **SLCE-04**: Portable Text renders correctly with custom code blocks
- [x] **SLCE-05**: Images served from Sanity CDN with optimization
- [x] **SLCE-06**: Dual-source routing (Sanity for slice post, markdown for rest)
- [x] **SLCE-07**: Migrate ONE blog post with images, code blocks, all fields to Sanity
- [x] **SLCE-08**: Vertical slice deployed and verified working in production

### Migration (after vertical slice succeeds)

- [ ] **MIGR-01**: Migrate remaining blog posts incrementally to Sanity
- [ ] **MIGR-02**: Migrate all blog post images to Sanity CDN
- [ ] **MIGR-03**: Migrate all gems to Sanity
- [ ] **MIGR-04**: Preserve exact URL slugs for all content
- [ ] **MIGR-05**: Remove dual-source routing after all content migrated
- [ ] **SLCE-03**: SvelteKit fetches gems from Sanity dynamically (server-side) _(Moved from Phase 2
      per CONTEXT.md decision: "Gems: No vertical slice — migrate all at once in Phase 3")_

### Finalization (after migration complete)

- [ ] **FINL-01**: RSS feed generates from Sanity content
- [ ] **FINL-02**: Sitemap generates from Sanity content
- [ ] **FINL-03**: Remove old markdown content system
- [ ] **FINL-04**: Remove old image folder structure

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Publishing Workflow

- **PUBL-01**: Scheduled publishing (publish date in future, auto-publishes)
- **PUBL-02**: Live preview in Studio (see changes before publishing)

### Enhanced Features

- **ENHC-01**: Related posts algorithm based on tags
- **ENHC-02**: Reading time calculation from Portable Text

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                         | Reason                                        |
| ------------------------------- | --------------------------------------------- |
| Static site generation          | Moving to SSR for instant content updates     |
| Webhook rebuild triggers        | Not needed with dynamic fetching              |
| Embedded Studio in SvelteKit    | Using Sanity's hosted studio, simpler setup   |
| Real-time collaborative editing | Single author workflow, adds complexity       |
| Multiple datasets               | Personal blog, single dataset sufficient      |
| Newsletter integration          | Can be added later, not part of CMS migration |
| Comments system                 | Not part of current site                      |
| Site redesign                   | Backend/CMS change only                       |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase        | Status   |
| ----------- | ------------ | -------- |
| SCHM-01     | Phase 1      | Complete |
| SCHM-02     | Phase 1      | Complete |
| SCHM-03     | Phase 1      | Complete |
| SCHM-04     | Phase 1      | Complete |
| SCHM-05     | Phase 1      | Complete |
| SCHM-06     | Phase 1      | Complete |
| SCHM-07     | Phase 1      | Complete |
| STDO-01     | Phase 1      | Complete |
| STDO-02     | Phase 1      | Complete |
| STDO-03     | Phase 1      | Complete |
| STDO-04     | Phase 1      | Complete |
| SLCE-01     | Pre-existing | Complete |
| SLCE-02     | Phase 2      | Complete |
| SLCE-03     | Phase 3      | Pending  |
| SLCE-04     | Phase 2      | Complete |
| SLCE-05     | Phase 2      | Complete |
| SLCE-06     | Phase 2      | Complete |
| SLCE-07     | Phase 2      | Complete |
| SLCE-08     | Phase 2      | Complete |
| MIGR-01     | Phase 3      | Pending  |
| MIGR-02     | Phase 3      | Pending  |
| MIGR-03     | Phase 3      | Pending  |
| MIGR-04     | Phase 3      | Pending  |
| MIGR-05     | Phase 3      | Pending  |
| FINL-01     | Phase 4      | Pending  |
| FINL-02     | Phase 4      | Pending  |
| FINL-03     | Phase 4      | Pending  |
| FINL-04     | Phase 4      | Pending  |

**Coverage:**

- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---

_Requirements defined: 2025-01-18_ _Last updated: 2026-01-19 (SLCE-01 marked pre-existing, SLCE-03
moved to Phase 3)_
