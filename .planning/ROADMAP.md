# Roadmap: Sanity CMS Migration

## Overview

This roadmap guides maxdaten.io's migration from git-managed markdown files to Sanity.io CMS. The
journey starts with establishing the content schema and Studio, validates the approach through a
single vertical slice, migrates all remaining content, and concludes with cleanup and feed
generation. Each phase delivers verifiable capability before proceeding.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Sanity schemas and Studio ready for content
- [ ] **Phase 2: Vertical Slice** - One blog post end-to-end in production
- [ ] **Phase 3: Migration** - All content moved to Sanity
- [ ] **Phase 4: Finalization** - RSS, sitemap, cleanup

## Phase Details

### Phase 1: Foundation

**Goal**: Sanity project configured with complete schemas and working Studio for content authoring
**Depends on**: Nothing (first phase) **Requirements**: SCHM-01, SCHM-02, SCHM-03, SCHM-04, SCHM-05,
SCHM-06, SCHM-07, STDO-01, STDO-02, STDO-03, STDO-04 **Success Criteria** (what must be TRUE):

1. Author can create a new blog post in Sanity Studio with all fields (title, slug, body, excerpt,
   cover image, date, tags, keywords, hidden)
2. Author can create a new gem in Sanity Studio with all fields (title, url, description, tags)
3. Author can upload and crop images with hotspot support in Studio
4. Author can see draft/published status for each document in Studio
5. Slug field validates uniqueness across blog posts and gems

**Plans**: TBD

Plans:

- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: Vertical Slice

**Goal**: One complete blog post served from Sanity, live in production alongside existing markdown
posts **Depends on**: Phase 1 **Requirements**: SLCE-01, SLCE-02, SLCE-03, SLCE-04, SLCE-05,
SLCE-06, SLCE-07, SLCE-08 **Success Criteria** (what must be TRUE):

1. Visitor can view migrated blog post at its existing URL with correct rendering
2. Code blocks render with syntax highlighting, filename display, and line numbers preserved
3. Images load from Sanity CDN with responsive optimization
4. Gems page shows gems from Sanity with correct styling
5. Existing markdown posts continue to work unchanged during this phase

**Plans**: TBD

Plans:

- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Migration

**Goal**: All blog posts and gems migrated to Sanity with markdown content system still present as
fallback **Depends on**: Phase 2 **Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04, MIGR-05
**Success Criteria** (what must be TRUE):

1. Every existing blog post is accessible from Sanity (count matches original)
2. Every existing gem is accessible from Sanity (count matches original)
3. All URLs return identical content to pre-migration state
4. All images load from Sanity CDN (no local image references remain in served content)
5. Dual-source routing removed, all content served from Sanity only

**Plans**: TBD

Plans:

- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Finalization

**Goal**: Migration complete with RSS/sitemap generation and old content system removed **Depends
on**: Phase 3 **Requirements**: FINL-01, FINL-02, FINL-03, FINL-04 **Success Criteria** (what must
be TRUE):

1. RSS feed at /rss.xml contains all published blog posts from Sanity
2. Sitemap includes all blog posts and gems with correct URLs
3. Old markdown files removed from repository (src/content/blog/)
4. Old image folder structure removed from repository (src/lib/assets/images/posts/)

**Plans**: TBD

Plans:

- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:** Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase           | Plans Complete | Status      | Completed |
| --------------- | -------------- | ----------- | --------- |
| 1. Foundation   | 0/3            | Not started | -         |
| 2. Vertical     | 0/3            | Not started | -         |
| 3. Migration    | 0/2            | Not started | -         |
| 4. Finalization | 0/2            | Not started | -         |

---

_Roadmap created: 2025-01-18_ _Last updated: 2025-01-18_
