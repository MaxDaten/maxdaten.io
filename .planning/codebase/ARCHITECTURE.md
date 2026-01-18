# Architecture

**Analysis Date:** 2026-01-18

## Pattern Overview

**Overall:** SvelteKit Static Site Generation (SSG) with MDsveX Content Pipeline

**Key Characteristics:**

- Static site generation with prerendering enabled by default
- Content-driven architecture with markdown blog posts as primary content source
- Atomic design component hierarchy (atoms, molecules, organisms)
- Hybrid data loading: server-side for content, client-side for interactivity
- Image optimization pipeline using vite-imagetools with lazy loading

## Layers

**Presentation Layer:**

- Purpose: Render UI components and handle user interactions
- Location: `src/lib/components/`
- Contains: Svelte 5 components organized by atomic design (atoms, molecules, organisms)
- Depends on: Data layer, stores, utils
- Used by: Routes

**Routing Layer:**

- Purpose: Map URLs to pages and handle data loading
- Location: `src/routes/`
- Contains: SvelteKit route files (+page.svelte, +page.ts, +page.server.ts, +server.ts)
- Depends on: Components, data layer
- Used by: SvelteKit router

**Data Layer:**

- Purpose: Manage content, metadata, and static data
- Location: `src/lib/data/`
- Contains: Post loaders, author definitions, gems data, site metadata
- Depends on: Content files, types
- Used by: Routes, server layer

**Server Layer:**

- Purpose: Server-side data processing and generation
- Location: `src/lib/server/`
- Contains: Post processing, OG image generation
- Depends on: Data layer, external packages (sharp, satori)
- Used by: Server routes (+page.server.ts, +server.ts)

**Content Layer:**

- Purpose: Store blog post markdown files
- Location: `src/content/blog/`
- Contains: Markdown (.md) files with frontmatter
- Depends on: Nothing (source content)
- Used by: Data layer via import.meta.glob

**Content Processing Layer:**

- Purpose: Transform markdown to Svelte components with enhancements
- Location: `mdsvex.config.js`, `src/lib/shiki/`, `src/lib/rehype/`
- Contains: MDsveX config, Shiki highlighters, rehype plugins
- Depends on: shiki, rehype ecosystem
- Used by: Build process

## Data Flow

**Blog Post Rendering:**

1. Markdown files in `src/content/blog/*.md` are discovered via `import.meta.glob()` in
   `src/lib/data/posts.ts`
2. MDsveX processes markdown with rehype plugins (external links, slug, callouts)
3. Shiki highlights code blocks with custom transformers
4. `MdsvexWrapper.svelte` wraps content, providing Callout and CodeBlock components
5. Route `src/routes/[slug]/+page.server.ts` loads post metadata via `src/lib/server/posts.ts`
6. Route `src/routes/[slug]/+page.ts` loads post component and generates SEO meta tags
7. `src/routes/[slug]/+page.svelte` renders the post with author, tags, related posts

**Image Loading:**

1. Images stored in `src/lib/assets/images/posts/{slug}/`
2. `src/lib/utils/image-loader.ts` uses `import.meta.glob` to eagerly load all images
3. `getCoverBySlug()` provides optimized Picture objects for blog covers
4. `@zerodevx/svelte-img` components render with lazy loading and parallax effects

**State Management:**

- Theme preference stored in localStorage via Svelte store (`src/lib/stores/theme.ts`)
- Page meta tags merged at layout level using `svelte-meta-tags` deepMerge
- No global state management library; relies on SvelteKit's page data

## Key Abstractions

**PostComponent:**

- Purpose: Represents a loadable blog post with its Svelte component and metadata
- Examples: `src/lib/data/posts.ts` defines `PostComponent` interface
- Pattern: Lazy loading via import.meta.glob with Promise-based access

**BlogPost Type:**

- Purpose: Core content model for blog posts
- Examples: `src/lib/utils/types.ts`
- Pattern: TypeScript interface with frontmatter fields + computed fields (readingTime,
  relatedPosts)

**Picture Type:**

- Purpose: Optimized image with srcset and metadata from imagetools
- Examples: Used throughout image-loader.ts and components
- Pattern: Eager-loaded via vite-imagetools query strings

**MdsvexWrapper:**

- Purpose: Provide components and context to markdown content
- Examples: `src/lib/components/organisms/MdsvexWrapper.svelte`
- Pattern: Module-level exports make Callout, CodeBlock, img available in .md files

## Entry Points

**Application Entry:**

- Location: `src/routes/+layout.svelte`
- Triggers: Every page navigation
- Responsibilities: Global styles, Header, Footer, Analytics, Meta tags, page transitions

**Layout Data:**

- Location: `src/routes/+layout.ts`
- Triggers: Every page load
- Responsibilities: Base meta tags, base schema.org data, prerender flag

**Dynamic Blog Route:**

- Location: `src/routes/[slug]/+page.svelte`
- Triggers: Navigation to /{slug}
- Responsibilities: Render blog post with metadata, author, cover image, related posts

**RSS Feed:**

- Location: `src/routes/rss.xml/+server.ts`
- Triggers: GET /rss.xml
- Responsibilities: Generate RSS XML with full post content

**Sitemap:**

- Location: `src/routes/sitemap.xml/+server.ts`
- Triggers: GET /sitemap.xml
- Responsibilities: Generate XML sitemap with all public routes

**OG Image Generation:**

- Location: `src/routes/[slug]/og.jpg/+server.ts`
- Triggers: GET /{slug}/og.jpg
- Responsibilities: Generate dynamic OpenGraph images using Satori + Sharp

## Error Handling

**Strategy:** SvelteKit error functions with graceful fallbacks

**Patterns:**

- Use `error(404, 'message')` from @sveltejs/kit for missing resources
- Route-level error boundaries via `+error.svelte`
- Null coalescing for optional data (images, authors)
- Try-catch in OG generation with 500 response

```typescript
// Example from src/lib/data/posts.ts
const loadPost = loaderBySlug.get(slug) ?? error(404, 'Post not found');
```

## Cross-Cutting Concerns

**Logging:** Console-based logging for errors (e.g., OG image generation failures)

**Validation:** TypeScript types enforce data shapes; frontmatter validated implicitly via type
assertions

**Authentication:** None (static public site)

**SEO:**

- `svelte-meta-tags` for OpenGraph, Twitter cards
- `schema-dts` for JSON-LD structured data
- Dynamic OG image generation per post
- Automatic sitemap and robots.txt generation

**Caching:**

- Static pages prerendered at build time
- OG images: `max-age=600, s-maxage=604800`
- RSS: `max-age=0, s-maxage=3600`
- Gems page: `max-age=43200` (12 hours)

**Transitions:**

- `ssgoi` library for page transitions
- Crossfade effect configured in `src/lib/config/transitions.ts`

---

_Architecture analysis: 2026-01-18_
