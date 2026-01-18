# Phase 1: Foundation - Context

**Gathered:** 2025-01-18 **Status:** Ready for planning

<domain>
## Phase Boundary

Sanity project configured with complete schemas and working Studio for content authoring. This
includes document schemas for blog posts, gems, tags, series, and authors, plus Studio configuration
for efficient content management. Does NOT include frontend integration, migration scripts, or
rendering — those are later phases.

</domain>

<decisions>
## Implementation Decisions

### Body Content Structure

- Use Portable Text (Sanity's native rich text) for blog post bodies
- Custom blocks: code blocks, callout/note blocks, YouTube embeds, images
- Code blocks capture: language, filename, line numbers (matches current Shiki setup)
- Callout types: Info, Warning, Tip (three types)
- Standard marks only: bold, italic, underline, strikethrough, links, inline code
- Internal links between posts as Sanity references (enables broken link detection)
- No math/LaTeX support needed
- No footnotes needed

### Image Handling

- Cover images: alt text + caption + hotspot (Sanity's built-in crop/hotspot)
- Inline images in body: same metadata as cover images (alt, caption, hotspot)

### Blog Post Schema Fields

- title (required)
- slug (auto-generated, globally unique)
- body (Portable Text)
- excerpt (required, hand-crafted)
- coverImage (with alt, caption, hotspot)
- date (publish date)
- lastModified (explicit field for significant updates, separate from \_updatedAt)
- tags (references to tag documents)
- keywords (separate field from tags, for SEO meta)
- hidden (boolean)
- series (reference to series document, optional)
- author (reference to author document, pre-filled with primary author)
- Reading time: calculated automatically from body content (not stored)

### Tag System

- Tags as separate documents (not string arrays)
- Tag fields: name + slug only
- Tag slugs auto-generated from name
- Shared taxonomy between blog posts and gems

### Series Support

- Series documents with: title, slug, description, cover image
- Series slugs auto-generated from title
- Posts ordered within series by date (chronological)

### Author Schema

- Author documents with: name, bio (plain text), avatar, social links
- Social links: Twitter, GitHub, LinkedIn, Website (structured fields)
- No author pages/slugs needed
- Default author pre-filled when creating new posts

### Gems Schema

- Plain text description (not rich text)
- Use Sanity timestamps (\_createdAt/\_updatedAt) for ordering
- Share same tags as blog posts
- Manual slug entry (not auto-generated)

### Related Posts

- Automatic derivation from tags (matches current algorithm)
- No manual curation field

### Slug Generation

- Blog posts: auto-generate from title with stop words removed
- Series: auto-generate from title
- Tags: auto-generate from name
- Gems: manual entry
- Global uniqueness validation (across all document types)
- Always editable (no lock after publish)
- Simple error message for conflicts ("Slug already in use")
- Format hint displayed under field
- No maximum length
- Existing slugs from migration preserved exactly

### Studio Organization

- Sidebar grouped by purpose:
    - Content: Posts, Gems
    - Taxonomies: Tags, Series
    - Settings: Authors
- Posts sorted newest first (by date)
- Filter tabs for: All, Drafts, Published, Hidden

### Claude's Discretion

- Exact Portable Text configuration and field layout
- Sanity plugin choices
- Studio color scheme and branding
- Document preview components
- Validation message wording beyond specified

</decisions>

<specifics>
## Specific Ideas

- Code blocks should match current Shiki transformer setup (filename display, line numbers)
- Three callout types (Info, Warning, Tip) similar to documentation sites
- Author social links are structured (not freeform URL array)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-foundation_ _Context gathered: 2025-01-18_
