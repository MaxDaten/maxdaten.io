# Plan 02-04 Summary: Migrate One Post and Verify

**Status:** Complete **Duration:** 8 min **Commits:** 2

## Objective

Migrate one blog post to Sanity and verify production deployment.

## Tasks Completed

| #   | Task                                   | Status           | Commit            |
| --- | -------------------------------------- | ---------------- | ----------------- |
| 1   | Select and migrate blog post to Sanity | Complete         | Content in Sanity |
| 2   | Set environment variables and deploy   | Complete (local) | -                 |
| 3   | Verify production deployment           | Complete         | Human approved    |

## Deliverables

### Content Migration

- **Post:** Test-Driven Infrastructure (`2025-09-03-tdd-infrastructure-terragrunt`)
- **Sanity Document ID:** `EU2iDf58BdMJj4Pg5YCKHG`
- **Studio URL:** https://hvsy54ho.sanity.studio/structure/post;EU2iDf58BdMJj4Pg5YCKHG

**Migrated content:**

- 39 Portable Text blocks
- 4 tags created (infrastructure-as-code, test-driven-development, continuous-delivery,
  design-pattern)
- 3 images uploaded (cover + 2 body images: SVG diagram, PNG screenshot)
- 4 code blocks with HCL, Bash, YAML languages
- 2 callouts (info type)
- Author reference linked

### Migration Tooling Created

- `scripts/migrate-post-to-sanity.js` - Automated markdown-to-Sanity migration
- `npm run migrate:post` - Script command with env file loading
- Supports: frontmatter, Portable Text conversion, image upload, tag creation

### Bug Fixes

- Added `asset` reference to GROQ image projections (required by @sanity/image-url)

## Commits

| Hash      | Type | Description                                       |
| --------- | ---- | ------------------------------------------------- |
| `38c8642` | feat | Add markdown-to-Sanity migration script           |
| `9dea6c1` | fix  | Include asset reference in GROQ image projections |

## Local Verification

- Post renders at http://localhost:5173/2025-09-03-tdd-infrastructure-terragrunt (200 OK)
- Post appears in blog listing at http://localhost:5173/blog
- Cover image loads from Sanity CDN
- Metadata (title, description, OG tags) render correctly

## Production Deployment

**Required:** Environment variables must be set in Vercel dashboard:

- `PUBLIC_SANITY_PROJECT_ID` = hvsy54ho
- `PUBLIC_SANITY_DATASET` = production

**Deployment:** Push to main or run `vercel --prod`

## Human Verification Checkpoint

See Task 3 checklist in 02-04-PLAN.md for full verification steps:

1. Blog listing shows migrated post
2. Post page renders correctly (code blocks, callouts, images)
3. Markdown posts still work unchanged

## Deviations

1. **Migration method:** Used automated script instead of manual Studio entry
    - Rationale: More efficient and creates reusable tooling for Phase 3
    - Impact: Positive - migration script can be reused for bulk migration

2. **Query fix required:** Added `asset` field to coverImage projections
    - Rationale: @sanity/image-url needs asset.\_ref to build URLs
    - Impact: None - fix committed and working
