# Phase 3: Migration - Context

**Gathered:** 2026-01-19 **Status:** Ready for planning

<domain>
## Phase Boundary

Move all remaining blog posts and gems from markdown to Sanity, verify each migration, then remove
dual-source routing so all content serves from Sanity only. Delete old markdown files after
successful cutover.

</domain>

<decisions>
## Implementation Decisions

### Migration order

- Small batches of 3-5 posts at a time
- Oldest posts first (lower traffic, less risk)
- Stop batch on any failure (fix before proceeding)
- Gems migrated separately after all posts complete
- Migration script must be idempotent (safe to re-run, updates existing)
- Posts published immediately after successful migration
- Skip already-migrated "Test-Driven Infrastructure" post
- Console-only logging (no persistent log file)

### Content verification

- Automated diff comparison for each migrated post
- Compare text content only (not HTML structure)
- Whitespace differences acceptable, real content changes block
- Code blocks must match exactly including language hints

### Cutover strategy

- Keep dual-source routing until all posts migrated
- Remove dual-source and delete markdown files after 100% migration
- No soak period — immediate cutover after verification
- Rollback via git revert if issues arise

### Image handling

- Upload all images to Sanity CDN (no external references)
- Upload images as part of each post migration
- Image upload failure blocks post migration
- Verify images load successfully (HTTP 200)

### Claude's Discretion

- Exact batch composition within 3-5 range
- Text extraction method for diff comparison
- Error message formatting
- Temporary file handling during migration

</decisions>

<specifics>
## Specific Ideas

- Existing migration script from Phase 2 (02-04) can be adapted for batch processing
- Verification should compare the live URLs (old markdown route vs new Sanity route)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-migration_ _Context gathered: 2026-01-19_
