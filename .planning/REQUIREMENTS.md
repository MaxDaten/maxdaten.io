# Requirements: Sanity CMS Migration

**Defined:** 2025-01-18 **Core Value:** Creating new blog posts should be frictionless — no manual
file scaffolding, no image folder management, just write and publish.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Schema

- [ ] **SCHM-01**: Blog Post schema with title, slug, body, excerpt, cover image, date, tags,
      keywords, hidden
- [ ] **SCHM-02**: Gems schema with title, url, description, tags
- [ ] **SCHM-03**: Author schema with name, image, bio
- [ ] **SCHM-04**: Tag document type with name and slug
- [ ] **SCHM-05**: SEO object type with meta description, OG image, validation rules
- [ ] **SCHM-06**: Custom code block type preserving filename and line number metadata
- [ ] **SCHM-07**: Portable Text configuration for blog post body with code blocks, images, links

### Studio

- [ ] **STDO-01**: Sanity Studio deployed via Sanity's hosted service (sanity.studio)
- [ ] **STDO-02**: Draft/publish workflow visible in Studio UI
- [ ] **STDO-03**: Tag management interface
- [ ] **STDO-04**: Image upload with hotspot/crop support

### Vertical Slice (integration + one post proves everything works)

- [ ] **SLCE-01**: Switch from static adapter to Vercel adapter for SSR
- [ ] **SLCE-02**: SvelteKit fetches blog posts from Sanity dynamically (server-side)
- [ ] **SLCE-03**: SvelteKit fetches gems from Sanity dynamically (server-side)
- [ ] **SLCE-04**: Portable Text renders correctly with custom code blocks
- [ ] **SLCE-05**: Images served from Sanity CDN with optimization
- [ ] **SLCE-06**: Dual-source routing (Sanity for slice post, markdown for rest)
- [ ] **SLCE-07**: Migrate ONE blog post with images, code blocks, all fields to Sanity
- [ ] **SLCE-08**: Vertical slice deployed and verified working in production

### Migration (after vertical slice succeeds)

- [ ] **MIGR-01**: Migrate remaining blog posts incrementally to Sanity
- [ ] **MIGR-02**: Migrate all blog post images to Sanity CDN
- [ ] **MIGR-03**: Migrate all gems to Sanity
- [ ] **MIGR-04**: Preserve exact URL slugs for all content
- [ ] **MIGR-05**: Remove dual-source routing after all content migrated

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

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| SCHM-01     | Phase 1 | Pending |
| SCHM-02     | Phase 1 | Pending |
| SCHM-03     | Phase 1 | Pending |
| SCHM-04     | Phase 1 | Pending |
| SCHM-05     | Phase 1 | Pending |
| SCHM-06     | Phase 1 | Pending |
| SCHM-07     | Phase 1 | Pending |
| STDO-01     | Phase 1 | Pending |
| STDO-02     | Phase 1 | Pending |
| STDO-03     | Phase 1 | Pending |
| STDO-04     | Phase 1 | Pending |
| SLCE-01     | Phase 2 | Pending |
| SLCE-02     | Phase 2 | Pending |
| SLCE-03     | Phase 2 | Pending |
| SLCE-04     | Phase 2 | Pending |
| SLCE-05     | Phase 2 | Pending |
| SLCE-06     | Phase 2 | Pending |
| SLCE-07     | Phase 2 | Pending |
| SLCE-08     | Phase 2 | Pending |
| MIGR-01     | Phase 3 | Pending |
| MIGR-02     | Phase 3 | Pending |
| MIGR-03     | Phase 3 | Pending |
| MIGR-04     | Phase 3 | Pending |
| MIGR-05     | Phase 3 | Pending |
| FINL-01     | Phase 4 | Pending |
| FINL-02     | Phase 4 | Pending |
| FINL-03     | Phase 4 | Pending |
| FINL-04     | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---

_Requirements defined: 2025-01-18_ _Last updated: 2025-01-18 after roadmap creation_
