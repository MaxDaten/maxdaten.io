# Phase 1: Foundation - Research

**Researched:** 2026-01-18 **Domain:** Sanity.io CMS schema design and Studio configuration
**Confidence:** HIGH

## Summary

This phase establishes the Sanity CMS foundation: document schemas matching existing content
structure, Portable Text configuration for rich blog post bodies, and Studio deployment via Sanity's
hosted service. The research builds on prior project research (STACK.md, FEATURES.md, PITFALLS.md)
and CONTEXT.md decisions.

Key findings:

- Sanity schema uses `defineType`, `defineField`, `defineArrayMember` helper functions for
  TypeScript type safety
- Portable Text custom blocks (code, callout, image) are defined as object types in the `of` array
- `@sanity/code-input` plugin provides code blocks with filename and language metadata (but is
  archived as of Dec 2025 - built-in code type now recommended)
- Global slug uniqueness requires custom `isUnique` function querying across all document types
- Studio deployment to `*.sanity.studio` uses `sanity deploy` command with `studioHost`
  configuration

**Primary recommendation:** Use schema-as-code with TypeScript helper functions, custom `isUnique`
for global slug validation, and `structureTool` for sidebar organization.

## Standard Stack

The established libraries/tools for this phase:

### Core

| Package       | Version | Purpose                                    | Why Standard                   |
| ------------- | ------- | ------------------------------------------ | ------------------------------ |
| `sanity`      | ^3.72+  | Studio core, schema definition, CLI        | Official Sanity Studio package |
| `@sanity/cli` | ^3.72+  | CLI for deploy, typegen, schema extraction | Required for `sanity deploy`   |

### Supporting

| Package            | Version    | Purpose                                | When to Use                        |
| ------------------ | ---------- | -------------------------------------- | ---------------------------------- |
| `sanity/structure` | (included) | Sidebar organization via structureTool | Grouping document types in sidebar |
| `lucide-react`     | ^0.460+    | Icons for schema types and Studio UI   | Already in Sanity dependencies     |

### Alternatives Considered

| Instead of                   | Could Use                             | Tradeoff                                                                                    |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `@sanity/code-input`         | Built-in code type with custom object | Plugin archived Dec 2025; custom object gives more control over filename/line number fields |
| Embedded Studio in SvelteKit | Hosted Studio at sanity.studio        | Embedded adds React to SvelteKit bundle; hosted is simpler (per PROJECT decision)           |

**Installation:**

```bash
# Already installed per prior research
npm install sanity @sanity/cli
```

## Architecture Patterns

### Recommended Project Structure

```
studio/                          # Sanity Studio project (separate directory)
├── sanity.config.ts             # Studio configuration
├── sanity.cli.ts                # CLI config (studioHost for deploy)
├── package.json                 # Studio dependencies
├── schemas/
│   ├── index.ts                 # Schema type exports
│   ├── documents/
│   │   ├── post.ts              # Blog post document
│   │   ├── gem.ts               # Gem document
│   │   ├── tag.ts               # Tag document
│   │   ├── series.ts            # Series document
│   │   └── author.ts            # Author document
│   ├── objects/
│   │   ├── seo.ts               # SEO metadata object
│   │   ├── codeBlock.ts         # Custom code block object
│   │   ├── callout.ts           # Callout/note block object
│   │   ├── youtubeEmbed.ts      # YouTube embed object
│   │   └── portableImage.ts     # Image with alt/caption
│   └── fields/
│       └── slug.ts              # Reusable slug field with isUnique
└── structure/
    └── index.ts                 # Sidebar structure configuration
```

### Pattern 1: Schema Definition with TypeScript Helpers

**What:** Use `defineType`, `defineField`, `defineArrayMember` for all schema definitions **When to
use:** All schema files **Example:**

```typescript
// Source: https://www.sanity.io/docs/studio/schema-types
import { defineType, defineField, defineArrayMember } from 'sanity';

export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
    ],
});
```

### Pattern 2: Global Slug Uniqueness

**What:** Custom `isUnique` function that validates slug across ALL document types **When to use:**
All slugs (posts, gems, tags, series) **Example:**

```typescript
// Source: https://www.sanity.io/docs/studio/slug-type
import { getPublishedId } from 'sanity';
import { groq } from 'next-sanity';

export async function isUniqueAcrossAllDocuments(
    slug: { current: string },
    context: { document: { _id: string }; getClient: (config: { apiVersion: string }) => any }
) {
    const { document, getClient } = context;
    const client = getClient({ apiVersion: '2025-01-18' });
    const id = document._id;
    const publishedId = getPublishedId(id);

    const query = groq`!defined(*[
    !(_id in [$draft, $published]) &&
    slug.current == $slug
  ][0]._id)`;

    return client.fetch(query, {
        slug: slug.current,
        draft: `drafts.${publishedId}`,
        published: publishedId,
    });
}
```

### Pattern 3: Portable Text with Custom Blocks

**What:** Array field with block type plus custom object types for code, callouts, images **When to
use:** Blog post body field **Example:**

```typescript
// Source: https://www.sanity.io/docs/studio/customizing-block-content
defineField({
    name: 'body',
    title: 'Body',
    type: 'array',
    of: [
        defineArrayMember({
            type: 'block',
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            marks: {
                decorators: [
                    { title: 'Bold', value: 'strong' },
                    { title: 'Italic', value: 'em' },
                    { title: 'Underline', value: 'underline' },
                    { title: 'Strike', value: 'strike-through' },
                    { title: 'Code', value: 'code' },
                ],
                annotations: [
                    {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [{ name: 'href', type: 'url', title: 'URL' }],
                    },
                    {
                        name: 'internalLink',
                        type: 'object',
                        title: 'Internal Link',
                        fields: [
                            {
                                name: 'reference',
                                type: 'reference',
                                to: [{ type: 'post' }, { type: 'gem' }],
                            },
                        ],
                    },
                ],
            },
        }),
        defineArrayMember({ type: 'codeBlock' }),
        defineArrayMember({ type: 'callout' }),
        defineArrayMember({ type: 'portableImage' }),
        defineArrayMember({ type: 'youtubeEmbed' }),
    ],
});
```

### Pattern 4: Custom Code Block Object

**What:** Object type for code blocks with language, filename, code, and line number metadata **When
to use:** Code snippets in blog posts **Example:**

```typescript
// Source: Custom pattern based on @sanity/code-input data model
import { defineType, defineField } from 'sanity';
import { CodeIcon } from 'lucide-react';

export const codeBlockType = defineType({
    name: 'codeBlock',
    title: 'Code Block',
    type: 'object',
    icon: CodeIcon,
    fields: [
        defineField({
            name: 'code',
            title: 'Code',
            type: 'text',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: [
                    { title: 'TypeScript', value: 'ts' },
                    { title: 'JavaScript', value: 'js' },
                    { title: 'Bash', value: 'bash' },
                    { title: 'HCL/Terraform', value: 'hcl' },
                    { title: 'Nix', value: 'nix' },
                    { title: 'YAML', value: 'yaml' },
                    { title: 'HTML', value: 'html' },
                    { title: 'CSS', value: 'css' },
                    { title: 'SCSS', value: 'scss' },
                    { title: 'Svelte', value: 'svelte' },
                    { title: 'Python', value: 'python' },
                    { title: 'Java', value: 'java' },
                    { title: 'Kotlin', value: 'kotlin' },
                    { title: 'Haskell', value: 'haskell' },
                    { title: 'Docker', value: 'docker' },
                    { title: 'Nginx', value: 'nginx' },
                    { title: 'HTTP', value: 'http' },
                    { title: 'Text', value: 'text' },
                ],
            },
            initialValue: 'text',
        }),
        defineField({
            name: 'filename',
            title: 'Filename',
            type: 'string',
            description: 'Optional filename to display above code block',
        }),
        defineField({
            name: 'showLineNumbers',
            title: 'Show Line Numbers',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'highlightedLines',
            title: 'Highlighted Lines',
            type: 'string',
            description: 'Comma-separated line numbers to highlight, e.g., "1,3-5,10"',
        }),
    ],
    preview: {
        select: {
            code: 'code',
            language: 'language',
            filename: 'filename',
        },
        prepare({ code, language, filename }) {
            return {
                title: filename || `${language || 'Code'} block`,
                subtitle: code?.slice(0, 50) + (code?.length > 50 ? '...' : ''),
            };
        },
    },
});
```

### Pattern 5: Callout Block Object

**What:** Object type for callout/admonition blocks with type (info, warning, tip) and content
**When to use:** Notes, warnings, tips in blog posts **Example:**

```typescript
// Source: Community patterns + CONTEXT.md decisions
import { defineType, defineField } from 'sanity';
import { InfoIcon, AlertTriangleIcon, LightbulbIcon } from 'lucide-react';

export const calloutType = defineType({
    name: 'callout',
    title: 'Callout',
    type: 'object',
    fields: [
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Info', value: 'info' },
                    { title: 'Warning', value: 'warning' },
                    { title: 'Tip', value: 'tip' },
                ],
                layout: 'radio',
            },
            initialValue: 'info',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            type: 'type',
            content: 'content',
        },
        prepare({ type, content }) {
            const icons = { info: InfoIcon, warning: AlertTriangleIcon, tip: LightbulbIcon };
            const text = content?.[0]?.children?.[0]?.text || 'Callout';
            return {
                title: `${type?.charAt(0).toUpperCase()}${type?.slice(1) || 'Info'}`,
                subtitle: text.slice(0, 50),
                media: icons[type] || InfoIcon,
            };
        },
    },
});
```

### Pattern 6: Studio Structure (Sidebar Organization)

**What:** Configure sidebar grouping using structureTool **When to use:** Studio configuration
**Example:**

```typescript
// Source: https://www.sanity.io/docs/studio/structure-introduction
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
    // ...
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        // Content group
                        S.listItem()
                            .title('Content')
                            .child(
                                S.list()
                                    .title('Content')
                                    .items([
                                        S.documentTypeListItem('post').title('Posts'),
                                        S.documentTypeListItem('gem').title('Gems'),
                                    ])
                            ),
                        S.divider(),
                        // Taxonomies group
                        S.listItem()
                            .title('Taxonomies')
                            .child(
                                S.list()
                                    .title('Taxonomies')
                                    .items([
                                        S.documentTypeListItem('tag').title('Tags'),
                                        S.documentTypeListItem('series').title('Series'),
                                    ])
                            ),
                        S.divider(),
                        // Settings group
                        S.listItem()
                            .title('Settings')
                            .child(
                                S.list()
                                    .title('Settings')
                                    .items([S.documentTypeListItem('author').title('Authors')])
                            ),
                    ]),
        }),
    ],
});
```

### Anti-Patterns to Avoid

- **Inline schema definitions:** Define schemas in separate files, import into config
- **Using deprecated `deskTool`:** Use `structureTool` from `sanity/structure` (renamed in v3.24.1)
- **String arrays for tags:** Use reference arrays to tag documents (per CONTEXT.md decision)
- **Boolean fields for modes:** Use string literals with options list instead
- **Forgetting `defineField` in arrays:** TypeScript type safety requires wrapping each field

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                            | Don't Build                  | Use Instead                                     | Why                                         |
| ---------------------------------- | ---------------------------- | ----------------------------------------------- | ------------------------------------------- |
| Slug uniqueness validation         | Custom validation function   | `isUnique` option in slug field                 | Built-in hook with proper draft handling    |
| Code syntax highlighting in editor | Custom editor component      | Monaco editor (built into Sanity) or text field | Sanity's text field handles large code well |
| Image cropping/hotspot UI          | Custom image component       | `options: { hotspot: true }` on image field     | Sanity's hotspot UI is production-ready     |
| Draft/publish workflow             | Custom status field          | Sanity's built-in draft system                  | Uses `drafts.` prefix, handles versioning   |
| Auto-generated slugs               | Custom slug generation logic | `source` option with slugify function           | Built-in with customization hooks           |

**Key insight:** Sanity's schema system has extensive built-in options. Research the field type
options before building custom solutions.

## Common Pitfalls

### Pitfall 1: Slug Uniqueness Only Within Type

**What goes wrong:** Slugs validate unique per document type, but routing needs global uniqueness
**Why it happens:** Default `isUnique` checks within `_type` only **How to avoid:** Implement custom
`isUniqueAcrossAllDocuments` function querying all slugs **Warning signs:** Different document types
with same slug pass validation

### Pitfall 2: @sanity/code-input Plugin Archived

**What goes wrong:** Installing deprecated plugin that may have compatibility issues **Why it
happens:** Plugin was archived December 18, 2025 **How to avoid:** Use custom code block object type
(Pattern 4 above) **Warning signs:** npm warnings about deprecated package

### Pitfall 3: Missing Slug Format Hint

**What goes wrong:** Authors don't know expected slug format, create inconsistent slugs **Why it
happens:** No description field on slug field **How to avoid:** Add `description` with format
example: "URL-safe identifier, e.g., 'my-post-title'" **Warning signs:** Slugs with spaces, special
characters, or inconsistent formatting

### Pitfall 4: Image Fields Without Alt Text

**What goes wrong:** Images lack accessibility metadata **Why it happens:** Image type doesn't
include alt by default **How to avoid:** Add custom `fields` array to image type with required alt
field **Warning signs:** `alt` returns undefined in queries

### Pitfall 5: References Without Weak Option

**What goes wrong:** Can't delete referenced documents (tag still used by post) **Why it happens:**
Strong references prevent deletion **How to avoid:** Consider `weak: true` for optional references,
or handle in Studio workflow **Warning signs:** "Cannot delete document because it's referenced
by..." errors

### Pitfall 6: Forgetting Initial Values for Required Fields

**What goes wrong:** Authors must fill every field even when sensible defaults exist **Why it
happens:** No `initialValue` specified on fields **How to avoid:** Set `initialValue` for author
(primary author), hidden (false), callout type (info) **Warning signs:** Repeated manual entry of
same values

## Code Examples

### Complete Blog Post Schema

```typescript
// studio/schemas/documents/post.ts
import { defineType, defineField, defineArrayMember } from 'sanity';
import { FileTextIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    icon: FileTextIcon,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'meta', title: 'Metadata' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        // Content group
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'content',
            description: 'URL-safe identifier, auto-generated from title',
            options: {
                source: 'title',
                slugify: (input) =>
                    input
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            group: 'content',
            description: 'Brief summary for listings and SEO (required)',
            validation: (rule) => rule.required().max(300),
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            group: 'content',
            of: [
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                            { title: 'Underline', value: 'underline' },
                            { title: 'Strike', value: 'strike-through' },
                            { title: 'Code', value: 'code' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'External Link',
                                fields: [
                                    {
                                        name: 'href',
                                        type: 'url',
                                        title: 'URL',
                                        validation: (rule) =>
                                            rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                                    },
                                ],
                            },
                            {
                                name: 'internalLink',
                                type: 'object',
                                title: 'Internal Link',
                                fields: [
                                    {
                                        name: 'reference',
                                        type: 'reference',
                                        to: [{ type: 'post' }, { type: 'gem' }],
                                    },
                                ],
                            },
                        ],
                    },
                }),
                defineArrayMember({ type: 'codeBlock' }),
                defineArrayMember({ type: 'callout' }),
                defineArrayMember({ type: 'portableImage' }),
                defineArrayMember({ type: 'youtubeEmbed' }),
            ],
        }),
        // Meta group
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            group: 'meta',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }),
                defineField({
                    name: 'caption',
                    title: 'Caption',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'date',
            title: 'Publish Date',
            type: 'datetime',
            group: 'meta',
            initialValue: () => new Date().toISOString(),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lastModified',
            title: 'Last Modified',
            type: 'datetime',
            group: 'meta',
            description: 'Set when making significant content updates',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'meta',
            // initialValue will be set via document actions or template
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'meta',
            of: [{ type: 'reference', to: [{ type: 'tag' }] }],
        }),
        defineField({
            name: 'series',
            title: 'Series',
            type: 'reference',
            to: [{ type: 'series' }],
            group: 'meta',
        }),
        defineField({
            name: 'hidden',
            title: 'Hidden',
            type: 'boolean',
            group: 'meta',
            initialValue: false,
            description: 'Hide from public listings',
        }),
        // SEO group
        defineField({
            name: 'keywords',
            title: 'SEO Keywords',
            type: 'array',
            group: 'seo',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'Keywords for search engines (separate from tags)',
        }),
        defineField({
            name: 'seo',
            title: 'SEO Overrides',
            type: 'seo',
            group: 'seo',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            date: 'date',
            media: 'coverImage',
            hidden: 'hidden',
        },
        prepare({ title, date, media, hidden }) {
            return {
                title: hidden ? `[Hidden] ${title}` : title,
                subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
                media,
            };
        },
    },
    orderings: [
        {
            title: 'Publish Date, Newest',
            name: 'dateDesc',
            by: [{ field: 'date', direction: 'desc' }],
        },
        {
            title: 'Publish Date, Oldest',
            name: 'dateAsc',
            by: [{ field: 'date', direction: 'asc' }],
        },
    ],
});
```

### Tag Schema

```typescript
// studio/schemas/documents/tag.ts
import { defineType, defineField } from 'sanity';
import { TagIcon } from 'lucide-react';
import { isUniqueAcrossAllDocuments } from '../fields/slug';

export const tagType = defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                isUnique: isUniqueAcrossAllDocuments,
            },
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: { title: 'name' },
    },
});
```

### SEO Object Schema

```typescript
// studio/schemas/objects/seo.ts
import { defineType, defineField } from 'sanity';

export const seoType = defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'metaTitle',
            title: 'Meta Title Override',
            type: 'string',
            description: 'Override the default title for search engines (max 60 chars)',
            validation: (rule) => rule.max(60),
        }),
        defineField({
            name: 'metaDescription',
            title: 'Meta Description Override',
            type: 'text',
            rows: 3,
            description: 'Override excerpt for search engines (max 155 chars)',
            validation: (rule) => rule.max(155),
        }),
        defineField({
            name: 'ogImage',
            title: 'Open Graph Image Override',
            type: 'image',
            description: 'Override cover image for social sharing',
            options: { hotspot: true },
        }),
        defineField({
            name: 'noIndex',
            title: 'No Index',
            type: 'boolean',
            description: 'Prevent search engines from indexing this page',
            initialValue: false,
        }),
    ],
});
```

### sanity.cli.ts Configuration

```typescript
// studio/sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    api: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID',
        dataset: process.env.SANITY_STUDIO_DATASET || 'production',
    },
    studioHost: 'maxdaten', // Deploys to maxdaten.sanity.studio
});
```

## State of the Art

| Old Approach                | Current Approach                        | When Changed        | Impact                                  |
| --------------------------- | --------------------------------------- | ------------------- | --------------------------------------- |
| `deskTool`                  | `structureTool` from `sanity/structure` | v3.24.1 (2024)      | Import path changed, same functionality |
| `@sanity/code-input` plugin | Custom code block object type           | Dec 2025 (archived) | Build custom code block schema          |
| String arrays for tags      | Reference arrays to tag documents       | Best practice       | Enables tag management, validation      |
| Inline schema definitions   | External files with `defineType`        | Sanity v3           | Better organization, type safety        |

**Deprecated/outdated:**

- `@sanity/code-input`: Archived December 18, 2025. Use custom object type instead.
- `deskTool`: Renamed to `structureTool` in v3.24.1. Same API, different import.

## Open Questions

Things that couldn't be fully resolved:

1. **Default Author Pre-fill**
    - What we know: `initialValue` can set defaults, but author reference needs document ID
    - What's unclear: Best pattern for setting default author (template, document action, or
      initialValue with ID)
    - Recommendation: Use initialValue with known author document ID, or create template

2. **Posts List Filtering (All/Drafts/Published/Hidden)**
    - What we know: Structure builder can create filtered lists, requires GROQ filters
    - What's unclear: Exact GROQ syntax for draft detection in structure
    - Recommendation: Research `drafts.**` path syntax for structure builder during implementation

## Sources

### Primary (HIGH confidence)

- [Sanity Schema Types](https://www.sanity.io/docs/studio/schema-types) - defineType, defineField
  usage
- [Sanity Slug Type](https://www.sanity.io/docs/studio/slug-type) - isUnique, slugify, source
  options
- [Sanity Image Type](https://www.sanity.io/docs/studio/image-type) - hotspot, custom fields
- [Sanity Structure Introduction](https://www.sanity.io/docs/studio/structure-introduction) -
  structureTool, sidebar
- [Sanity Deployment](https://www.sanity.io/docs/studio/deployment) - sanity deploy, studioHost
- [Customizing Block Content](https://www.sanity.io/docs/studio/customizing-block-content) -
  Portable Text custom blocks

### Secondary (MEDIUM confidence)

- [GitHub jamesreaco/portable-text-blocks](https://github.com/jamesreaco/portable-text-blocks) -
  Callout patterns
- [Sanity Community: isUnique across documents](https://www.sanity.io/answers/adding-type-to-unique-slug-validation-in-sanity-io)
- [Build with Matija: TypeGen](https://www.buildwithmatija.com/blog/how-to-generate-typescript-types-for-your-sanity-v3-schema)

### Tertiary (LOW confidence)

- [@sanity/code-input GitHub](https://github.com/sanity-io/code-input) - Archived, used for data
  model reference only

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Official packages, well-documented
- Architecture patterns: HIGH - Official documentation patterns
- Custom code block: MEDIUM - Based on archived plugin's data model, needs validation
- Callout block: MEDIUM - Community pattern, verify during implementation

**Research date:** 2026-01-18 **Valid until:** 2026-02-18 (30 days - stable domain)
