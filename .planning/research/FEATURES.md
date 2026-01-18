# Features Research: Sanity.io Blog CMS

**Domain:** Personal blog CMS migration **Researched:** 2026-01-18 **Overall Confidence:** HIGH
(verified with official Sanity documentation)

## Executive Summary

Sanity.io provides all features needed for a personal blog workflow. The table stakes features
(content modeling, drafts, images) are mature and well-documented. Scheduled publishing recently
moved to "Scheduled Drafts" (available on paid plans) with a clean single-document workflow. The
feature set maps well to the project requirements, with most complexity in the content rendering
layer (Portable Text) rather than the CMS configuration itself.

---

## Table Stakes

Must-have features for the workflow to function. Missing any of these breaks core publishing
workflow.

| Feature                               | What It Does                                                                                                                                             | Complexity | Source                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| **Content Modeling (Schema as Code)** | Define blog post structure in TypeScript/JavaScript with fields for title, slug, excerpt, date, tags, keywords, hidden, author reference                 | Low        | [Sanity Docs](https://www.sanity.io/docs)                                                      |
| **Draft/Publish Workflow**            | Documents exist as drafts until explicitly published; drafts perspective shows unpublished content while published perspective hides it                  | Low        | [Perspectives Docs](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content) |
| **Image Asset Management**            | Upload images directly in Studio, automatic CDN delivery, on-the-fly resizing/cropping, deduplication, metadata extraction (dimensions, LQIP, blur hash) | Low        | [Assets Docs](https://www.sanity.io/docs/content-lake/assets)                                  |
| **Portable Text (Rich Content)**      | JSON-based rich text with paragraphs, headings, lists, links, inline images; renders to any frontend                                                     | Medium     | [Portable Text Docs](https://www.sanity.io/docs/developer-guides/presenting-block-text)        |
| **Slug Field**                        | Auto-generates URL-safe slugs from title with uniqueness validation                                                                                      | Low        | Native field type                                                                              |
| **Reference Fields**                  | Link blog posts to author documents, enabling future multi-author support                                                                                | Low        | Native field type                                                                              |
| **Boolean Hidden Flag**               | Filter out draft/hidden posts from public queries using GROQ                                                                                             | Low        | Native field type                                                                              |
| **Array of Strings (Tags)**           | Simple tag input UI for categorization; searchable and filterable                                                                                        | Low        | Native field type                                                                              |

### Why These Are Table Stakes

- **Content modeling**: Without schema-as-code, cannot represent blog post structure
- **Draft/publish**: Core requirement from PROJECT.md; must prevent unfinished posts from appearing
- **Image management**: Current pain point is manual image folder management; must replace this
- **Portable Text**: Rich content body is the blog post itself
- **Slug preservation**: Must maintain existing URLs per constraints
- **Tags**: Current posts use tags for related posts algorithm

---

## Differentiators

Value-add features worth considering. These improve workflow but are not blocking.

| Feature                            | What It Does                                                                                                | Complexity | Value for Single Author                                   | Source                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Scheduled Drafts**               | Schedule a draft to auto-publish at a future date/time; one scheduled draft per document at a time          | Low        | HIGH - enables "write now, publish later" workflow        | [Scheduled Drafts Guide](https://www.sanity.io/docs/studio/scheduled-drafts-user-guide)         |
| **Custom Code Block Type**         | Define code object with language selector and syntax highlighting preview in Studio                         | Medium     | HIGH - essential for technical blog                       | [Custom Blocks Guide](https://www.sanity.io/docs/studio/customizing-block-content)              |
| **SEO Object Schema**              | Reusable object with meta title (65 chars), meta description (155 chars), noindex toggle, OG image override | Low        | MEDIUM - structured SEO management vs ad-hoc frontmatter  | [SEO with Sanity](https://www.sanity.io/headless-seo/seo-with-sanity)                           |
| **Live Preview / Visual Editing**  | See draft changes in real-time within Studio alongside your site; click-to-edit navigation                  | High       | LOW - single author, local preview sufficient             | [Visual Editing Docs](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing) |
| **Image Hotspot & Crop**           | Define focal points for responsive image cropping                                                           | Low        | MEDIUM - prevents awkward crops on different screen sizes | Native image field feature                                                                      |
| **Validation Rules**               | Enforce character limits, required fields, slug format validation in schema                                 | Low        | MEDIUM - catches mistakes before publish                  | Native schema feature                                                                           |
| **Document Actions Customization** | Add custom buttons (e.g., "Preview on Site") to document toolbar                                            | Medium     | LOW - nice-to-have polish                                 | Studio customization                                                                            |

### Differentiator Recommendations

**Implement in initial migration:**

- Scheduled Drafts (addresses specific requirement)
- Custom Code Block Type (technical blog essential)
- Image Hotspot (low effort, good value)
- Basic Validation Rules (prevent publishing errors)

**Defer to later iteration:**

- SEO Object Schema (can start with current keyword/excerpt approach, formalize later)
- Live Preview / Visual Editing (high complexity, single author can use standard preview)
- Document Actions Customization (polish, not core workflow)

---

## Anti-Features

Things to deliberately NOT configure. Either over-engineering for a personal blog, or known to cause
issues.

| Anti-Feature                         | Why Avoid                                                                                                                                         | What to Do Instead                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Content Releases (Enterprise)**    | Enterprise feature ($$$), designed for coordinating dozens of documents. Single author publishing individual posts does not need release bundles. | Use Scheduled Drafts for individual document scheduling                       |
| **Reference-Based Tag Documents**    | Over-engineered for a personal blog. Creates extra documents to manage, requires joins in queries.                                                | Use simple array of strings. If tag management becomes painful, migrate later |
| **Taxonomy Manager Plugin**          | SKOS-compliant taxonomy with thesauri and classification schemes. Massive overkill for a blog with ~10 tags.                                      | Simple string array with potential autocomplete                               |
| **Real-Time Collaboration Features** | Tasks, Comments, Mentions - designed for teams. Single author has no one to collaborate with.                                                     | Skip entirely; adds UI noise without value                                    |
| **Custom Studio Theme**              | Time spent on Studio aesthetics does not improve content creation. Default Studio is fine.                                                        | Use default Sanity Studio appearance                                          |
| **AI Assist Integration**            | Sanity's AI content features are useful for teams but add complexity. Single author can use external AI tools as needed.                          | Skip AI Assist in initial setup                                               |
| **Multiple Datasets**                | Splitting content into production/staging datasets adds deployment complexity. Single author can use draft perspective.                           | Single dataset, rely on draft/published perspectives                          |
| **Private Dataset**                  | Requires token management and adds authentication complexity. Blog content is public anyway.                                                      | Public dataset, simpler setup                                                 |
| **Media Library (Multi-Project)**    | Enterprise feature for organizations managing assets across projects. Single project does not need centralized asset hub.                         | Use built-in Studio asset management                                          |

### Why Avoid These

The common pattern: features designed for **teams** or **enterprises** add complexity without value
for a **single-author personal blog**. Sanity's strength is its flexibility, but that flexibility
can lead to over-engineering.

**Principle:** Start minimal, add complexity only when pain is felt.

---

## Feature Dependencies

Understanding which features require others helps phase the implementation.

```
Content Modeling
    |
    +-- Blog Post Schema
    |       |
    |       +-- Portable Text (body field)
    |       |       |
    |       |       +-- Custom Code Block Type (optional, but recommended)
    |       |       +-- Custom Image Block (optional, built-in works)
    |       |
    |       +-- Image Field (coverImage)
    |       |       |
    |       |       +-- Hotspot & Crop (optional enhancement)
    |       |
    |       +-- Reference to Author Schema
    |       +-- Tags Array
    |       +-- Slug Field
    |       +-- Hidden Boolean
    |
    +-- Author Schema (can be minimal: name, id)
    |
    +-- Gems Schema (simple: title, description, tags, link, coverImage)

Draft/Publish Workflow
    |
    +-- Scheduled Drafts (requires Growth plan, $15/mo)

SvelteKit Integration
    |
    +-- Sanity Client
    +-- GROQ Queries
    +-- Portable Text Renderer (maps Portable Text to Svelte components)
```

### Dependency Implications

1. **Content modeling must come first** - cannot migrate content without schemas
2. **Author schema needed before blog post schema** - blog posts reference authors
3. **Portable Text renderer required for content display** - without it, body content is raw JSON
4. **Scheduled Drafts requires paid plan** - budget decision, can defer if cost is a concern

---

## Complexity Notes

Effort estimates for each feature area.

| Feature                      | Effort     | Why                                                                                               |
| ---------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| **Basic Blog Post Schema**   | 1-2 hours  | Straightforward field mapping from existing frontmatter                                           |
| **Author Schema**            | 30 minutes | Simple document with name, optional fields                                                        |
| **Gems Schema**              | 30 minutes | Even simpler than blog posts                                                                      |
| **Image Handling Setup**     | 1 hour     | Configure Sanity image URL builder, update existing image components                              |
| **Portable Text Renderer**   | 2-4 hours  | Map block types to existing Svelte components (headings, paragraphs, links, images)               |
| **Custom Code Block**        | 2-3 hours  | Define code object schema, create editor preview, create frontend renderer with Shiki integration |
| **Scheduled Drafts**         | 30 minutes | Enable in Sanity project settings, learn UI workflow                                              |
| **SEO Object Schema**        | 1 hour     | Create reusable object, add to blog post schema, update meta tag generation                       |
| **Live Preview Integration** | 4-8 hours  | Requires Draft Mode setup in SvelteKit, Presentation tool configuration, overlay setup            |
| **Content Migration Script** | 2-4 hours  | Parse existing markdown, convert to Sanity documents, handle image uploads                        |

### Total Estimated Core Migration

**Minimum viable:** ~8-12 hours (schemas + basic rendering + migration) **With differentiators:**
~14-20 hours (add code blocks, scheduled drafts, validation)

---

## Plan Mapping

Features mapped to project requirements from PROJECT.md:

| Requirement                                             | Sanity Feature                         | Status         |
| ------------------------------------------------------- | -------------------------------------- | -------------- |
| Blog posts content type with all current fields         | Content Modeling with schema-as-code   | Table Stakes   |
| Gems content type                                       | Simple content type schema             | Table Stakes   |
| Preserve existing URL slugs                             | Slug field with existing values        | Table Stakes   |
| Image handling through Sanity's asset pipeline          | Image field + CDN                      | Table Stakes   |
| Draft support (unpublished posts not visible on site)   | Draft/Publish perspectives             | Table Stakes   |
| Scheduled publishing                                    | Scheduled Drafts (Growth plan)         | Differentiator |
| Tags management UI                                      | Array of strings field                 | Table Stakes   |
| SEO management (meta descriptions, OG images, keywords) | SEO object schema or individual fields | Differentiator |

**All active requirements are achievable with Sanity.io features.**

---

## Sources

### Official Documentation (HIGH Confidence)

- [Sanity Assets Documentation](https://www.sanity.io/docs/content-lake/assets) - Image and file
  asset management
- [Scheduled Drafts User Guide](https://www.sanity.io/docs/studio/scheduled-drafts-user-guide) -
  Scheduling workflow
- [Presenting Portable Text](https://www.sanity.io/docs/developer-guides/presenting-block-text) -
  Rich text rendering
- [Customizing Block Content](https://www.sanity.io/docs/studio/customizing-block-content) - Custom
  block patterns
- [Visual Editing Introduction](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing) -
  Live preview setup
- [SEO with Sanity](https://www.sanity.io/headless-seo/seo-with-sanity) - SEO schema patterns

### Web Research (MEDIUM Confidence)

- [What is Sanity CMS: A 2025 Guide](https://pagepro.co/blog/what-is-sanity/) - Feature overview
- [Sanity.io Pricing Blog Post](https://www.sanity.io/blog/pricing-update-free-users) - Free tier
  details
- [Parent/Child Taxonomy Guide](https://www.sanity.io/docs/developer-guides/parent-child-taxonomy) -
  Tag management patterns
