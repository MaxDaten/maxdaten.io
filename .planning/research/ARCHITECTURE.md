# Architecture Research: Sanity.io + SvelteKit

**Project:** maxdaten.io **Researched:** 2026-01-18 **Confidence:** HIGH (official documentation +
verified patterns)

## Executive Summary

Sanity.io integrates with SvelteKit through a well-documented official toolkit
(`@sanity/sveltekit`). The recommended architecture for a static site is:

1. **Embedded Studio** - Sanity Studio lives as a route within the SvelteKit app (`/studio`)
2. **Build-time fetching** - Content fetched from Sanity API during prerendering
3. **Entry generators** - Dynamic routes use `entries()` functions to tell SvelteKit which pages to
   prerender
4. **Webhook-triggered rebuilds** - Sanity webhooks trigger Vercel deploys on content changes

This preserves the existing static generation workflow while moving content management to Sanity.

---

## Component Boundaries

### Current Architecture

```
┌─────────────────────────────────────────┐
│           SvelteKit Application          │
├─────────────────────────────────────────┤
│  src/content/blog/*.md  (Content)        │
│  src/lib/data/posts.ts  (Loaders)        │
│  src/lib/server/posts.ts (Processing)    │
│  src/routes/[slug]/     (Rendering)      │
└─────────────────────────────────────────┘
           ↓ Build
┌─────────────────────────────────────────┐
│         Static HTML Files (Vercel)       │
└─────────────────────────────────────────┘
```

### Target Architecture with Sanity

```
┌─────────────────────────────────────────┐
│         Sanity Content Lake              │
│  (Hosted by Sanity - sanity.io)          │
│  - Documents (posts, pages)              │
│  - Assets (images, files)                │
│  - Schemas (content structure)           │
└────────────────┬────────────────────────┘
                 │ GROQ API
                 ↓
┌─────────────────────────────────────────┐
│           SvelteKit Application          │
├─────────────────────────────────────────┤
│  /studio/*      (Embedded Sanity Studio) │ ← React app embedded as SvelteKit route
│  src/lib/sanity/                         │
│    client.ts    (Sanity client config)   │
│    queries.ts   (GROQ queries)           │
│    types.ts     (TypeScript types)       │
│  src/routes/[slug]/                      │
│    +page.server.ts (fetch from Sanity)   │
│    +page.ts        (entries generator)   │
└─────────────────────────────────────────┘
           ↓ Build (with Sanity API calls)
┌─────────────────────────────────────────┐
│         Static HTML Files (Vercel)       │
└─────────────────────────────────────────┘
           ↑ Webhook trigger
┌─────────────────────────────────────────┐
│         Sanity Webhook                   │
│  (Triggers Vercel rebuild on publish)    │
└─────────────────────────────────────────┘
```

### Component Responsibilities

| Component               | Responsibility                            | Technology                    |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| **Sanity Content Lake** | Store content, manage versions, serve API | Hosted by Sanity              |
| **Sanity Studio**       | Content editing UI                        | React (embedded in SvelteKit) |
| **SvelteKit App**       | Routing, rendering, static generation     | SvelteKit 2.0                 |
| **Sanity Client**       | API communication                         | `@sanity/sveltekit`           |
| **GROQ Queries**        | Content retrieval logic                   | GROQ query language           |
| **Vercel**              | Hosting, builds, deploy hooks             | Vercel adapter                |

---

## Data Flow

### Build-Time Flow (Static Generation)

```
1. Vercel triggers build (manual or webhook)
           ↓
2. SvelteKit starts prerendering
           ↓
3. Entry generators call Sanity API
   - Fetch all post slugs
   - Return { slug: 'post-slug' }[] for prerenderer
           ↓
4. For each entry, load function runs
   - Fetch full document from Sanity
   - Include Portable Text body
   - Include image references
           ↓
5. Page component renders
   - Portable Text → HTML via @portabletext/svelte
   - Images via Sanity CDN URLs
           ↓
6. Static HTML written to build output
           ↓
7. Deploy to Vercel CDN
```

### Content Update Flow

```
1. Editor publishes content in Sanity Studio
           ↓
2. Sanity fires webhook to Vercel deploy hook
   (Optional: 2-3 second delay for CDN propagation)
           ↓
3. Vercel triggers new build
           ↓
4. Build fetches fresh content from Sanity API
   (Use useCdn: false during build for fresh data)
           ↓
5. New static files deployed
```

### Live Editing Flow (Optional Future Enhancement)

```
1. Editor opens Presentation tool in Sanity Studio
           ↓
2. Studio embeds preview of SvelteKit app
           ↓
3. Editor makes changes
           ↓
4. Sanity Live Content API streams updates
           ↓
5. SvelteKit Query Loader receives updates
           ↓
6. Page re-renders with draft content
   (Only visible in preview, not published site)
```

---

## Build Process

### Static Generation with Sanity as Data Source

The existing prerendering workflow remains largely unchanged. The key difference is the data source.

**Current pattern (markdown files):**

```typescript
// src/lib/data/posts.ts
export const postLoaders = import.meta.glob<PostComponent>('/src/content/blog/*.md');
```

**Target pattern (Sanity API):**

```typescript
// src/lib/sanity/queries.ts
export const allPostSlugsQuery = groq`*[_type == "post" && !(_id in path("drafts.**"))]{
  "slug": slug.current
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  body,
  coverImage,
  excerpt,
  date,
  tags,
  "readingTime": round(length(pt::text(body)) / 5 / 200)
}`;
```

**Entry generator for prerendering:**

```typescript
// src/routes/[slug]/+page.server.ts
import type { EntryGenerator } from './$types';
import { client } from '$lib/sanity/client';
import { allPostSlugsQuery } from '$lib/sanity/queries';

export const entries: EntryGenerator = async () => {
    const posts = await client.fetch(allPostSlugsQuery);
    return posts.map((post) => ({ slug: post.slug }));
};

export const prerender = true;
```

### Build Configuration

**No changes needed to `svelte.config.js`:**

- Continue using `adapter-vercel`
- Prerendering configuration remains the same
- The adapter handles static output

**Environment variables for build:**

```env
PUBLIC_SANITY_PROJECT_ID=your-project-id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_STUDIO_URL=/studio
SANITY_VIEWER_TOKEN=sk-... (for draft preview, optional)
```

### Build Order Dependencies

```
1. Sanity schemas must exist before content
2. Content must exist before build
3. Build fetches from Sanity API (network dependency)
4. Static files depend on successful API responses
```

**Failure modes to handle:**

- Sanity API timeout → build fails, retry
- Empty content → graceful fallback or skip
- Schema mismatch → TypeScript errors catch this

---

## Deployment Architecture

### Recommended: Embedded Studio

The Sanity Studio embeds as a SvelteKit route at `/studio`. This is the modern, recommended
approach.

**Directory structure:**

```
src/routes/
├── (app)/              # Group for main site routes
│   ├── +layout.svelte
│   ├── +page.svelte
│   ├── blog/
│   └── [slug]/
└── studio/
    └── [...catchall]/   # Catch-all for Studio SPA
        └── +page.svelte
```

**Why embedded:**

1. **Simpler deployment** - One Vercel project, one domain
2. **Shared environment** - Same env vars for both
3. **Easier development** - `npm run dev` runs everything
4. **Cost effective** - No separate hosting for Studio

**Studio route implementation:**

```svelte
<!-- src/routes/studio/[...catchall]/+page.svelte -->
<script lang="ts">
    import { SanityStudio } from '@sanity/sveltekit';
    import config from '$lib/sanity/sanity.config';
</script>

<SanityStudio {config} />
```

### Deployment Targets

| Component           | Where             | URL                |
| ------------------- | ----------------- | ------------------ |
| SvelteKit Site      | Vercel            | maxdaten.io        |
| Sanity Studio       | Vercel (embedded) | maxdaten.io/studio |
| Sanity Content Lake | Sanity Cloud      | API via sanity.io  |
| Assets (images)     | Sanity CDN        | cdn.sanity.io      |

### Vercel Configuration

```json
// vercel.json (if needed)
{
    "buildCommand": "npm run build",
    "outputDirectory": ".vercel/output",
    "framework": "sveltekit"
}
```

No special configuration needed - adapter-vercel handles everything.

---

## Integration Approach

### Recommended Migration Strategy

**Phase 1: Setup Sanity (Foundation)**

1. Install `@sanity/sveltekit`
2. Create Sanity project and dataset
3. Define schemas matching current frontmatter
4. Embed Studio at `/studio`
5. Verify Studio works in dev

**Phase 2: Dual Data Source (Parallel Running)**

1. Create Sanity client and queries
2. Add data abstraction layer
3. Routes can fetch from either source
4. Migrate content to Sanity
5. Test prerendering with Sanity data

**Phase 3: Cutover (Full Migration)**

1. Switch routes to Sanity-only
2. Set up webhook for rebuilds
3. Remove markdown files
4. Remove MDsveX dependency (optional)

### File Structure After Migration

```
src/
├── lib/
│   ├── sanity/
│   │   ├── client.ts           # Sanity client configuration
│   │   ├── queries.ts          # GROQ queries (centralized)
│   │   ├── types.ts            # TypeScript types for documents
│   │   ├── portable-text.ts    # Portable Text component config
│   │   └── sanity.config.ts    # Studio configuration
│   ├── components/
│   │   ├── portable-text/      # Custom PT renderers
│   │   │   ├── Link.svelte
│   │   │   ├── Image.svelte
│   │   │   └── CodeBlock.svelte
│   │   └── ... (existing components)
│   └── ... (existing lib structure)
├── routes/
│   ├── (app)/                  # Grouped main site routes
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── blog/
│   │   │   └── +page.server.ts # Fetch all posts
│   │   └── [slug]/
│   │       ├── +page.server.ts # Fetch single post
│   │       └── +page.svelte
│   └── studio/
│       └── [...catchall]/
│           └── +page.svelte    # Embedded Sanity Studio
└── content/                    # Can be removed after migration
```

### Key Integration Points

**1. Sanity Client Setup:**

```typescript
// src/lib/sanity/client.ts
import { createClient } from '@sanity/sveltekit';
import {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
    PUBLIC_SANITY_STUDIO_URL,
} from '$env/static/public';

export const client = createClient({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    apiVersion: '2025-01-18',
    useCdn: false, // false during build for fresh data
});
```

**2. Portable Text Rendering:**

```typescript
// src/lib/sanity/portable-text.ts
import type { PortableTextComponents } from '@portabletext/svelte';
import Link from '$components/portable-text/Link.svelte';
import CodeBlock from '$components/portable-text/CodeBlock.svelte';

export const portableTextComponents: PortableTextComponents = {
    marks: {
        link: Link,
    },
    types: {
        code: CodeBlock,
    },
};
```

**3. Content Fetching in Load Functions:**

```typescript
// src/routes/(app)/[slug]/+page.server.ts
import type { PageServerLoad, EntryGenerator } from './$types';
import { client } from '$lib/sanity/client';
import { postBySlugQuery, allPostSlugsQuery } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';

export const entries: EntryGenerator = async () => {
    const posts = await client.fetch(allPostSlugsQuery);
    return posts.map((post) => ({ slug: post.slug }));
};

export const load: PageServerLoad = async ({ params }) => {
    const post = await client.fetch(postBySlugQuery, { slug: params.slug });
    if (!post) throw error(404, 'Post not found');
    return { post };
};

export const prerender = true;
```

---

## Architectural Decisions

### Decision 1: Embedded vs Separate Studio

**Decision:** Embedded Studio at `/studio`

**Rationale:**

- Simpler deployment (one Vercel project)
- Easier local development
- Shared environment variables
- Official recommendation from Sanity for smaller projects

**Tradeoff:**

- Slightly longer build times (~30-50 seconds added)
- Studio changes require full site redeploy

### Decision 2: Build-time vs Runtime Fetching

**Decision:** Build-time fetching (prerendering)

**Rationale:**

- Preserves existing static site architecture
- Better performance (no runtime API calls)
- Simpler caching (Vercel CDN only)
- Matches current deployment model

**Tradeoff:**

- Content updates require rebuild
- Need webhook automation for timely updates

### Decision 3: CDN Usage During Build

**Decision:** `useCdn: false` during build

**Rationale:**

- Ensures fresh content after webhook triggers
- Avoids CDN propagation timing issues
- Build is infrequent, API can handle direct calls

**Tradeoff:**

- Slightly slower builds
- Counts against API quota (not CDN quota)

### Decision 4: Portable Text vs Markdown Migration

**Decision:** Full migration to Portable Text

**Rationale:**

- Enables structured content
- Better for custom embeds (code blocks, images)
- Native to Sanity (no conversion layer)

**Tradeoff:**

- Existing markdown content needs migration
- Custom Svelte components for PT blocks needed

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Runtime API Calls on Static Site

**What:** Fetching from Sanity API at request time on static pages

**Why bad:** Defeats purpose of static generation, adds latency, API quota usage

**Instead:** Fetch at build time using prerendering and entry generators

### Anti-Pattern 2: Nested Content Types for Simple Fields

**What:** Creating separate document types for simple related data

**Why bad:** Over-complicates schema, requires multiple queries

**Instead:** Use embedded objects for tightly coupled data (like author info on posts)

### Anti-Pattern 3: CDN During Webhook-Triggered Builds

**What:** Using `useCdn: true` when building after content publish webhook

**Why bad:** CDN may not have propagated new content yet

**Instead:** Use `useCdn: false` or add delay before build

### Anti-Pattern 4: Blocking on Optional Visual Editing

**What:** Delaying migration to implement live preview features first

**Why bad:** Visual editing is enhancement, not requirement for static sites

**Instead:** Get basic integration working first, add visual editing later

---

## Sources

**Official Documentation (HIGH confidence):**

- [Sanity Visual Editing with SvelteKit](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit)
- [SvelteKit Page Options - Entry Generators](https://svelte.dev/docs/kit/page-options)
- [@sanity/sveltekit GitHub](https://github.com/sanity-io/sanity-sveltekit)
- [Sanity SvelteKit Clean Template](https://github.com/sanity-io/sanity-template-sveltekit-clean)

**Verified Community Sources (MEDIUM confidence):**

- [Embedding Sanity V3 in SvelteKit](https://chrisjayden.com/articles/sveltekit-sanity-v3)
- [SvelteKit Static Adapter Guide](https://khromov.se/the-missing-guide-to-understanding-adapter-static-in-sveltekit/)
- [On-Demand Revalidation with SvelteKit + Sanity + Vercel](https://www.megamashmedia.com/blog/how-to-setup-on-demand-revalidation-with-sveltekit-sanity-and-vercel)

**Sanity Community Answers (MEDIUM confidence):**

- [Monorepo vs Separate Repos for Studio](https://www.sanity.io/answers/best-approach-to-structuring-a-repo-for-a-studio-and-using-separate-repos-for-front-end-and-studio-)
- [Webhook Timing Issues](https://www.sanity.io/answers/sanity-webhook-to-a-vercel-deploy-url-trigger-not-working)
