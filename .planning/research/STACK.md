# Stack Research: Sanity.io + SvelteKit

**Project:** maxdaten.io blog CMS migration **Researched:** 2026-01-18 **Overall Confidence:** HIGH

## Executive Summary

Sanity.io has a mature, official SvelteKit integration via the `@sanity/sveltekit` package (v1.0.4).
The ecosystem is well-documented with first-party support for Svelte 5. The recommended stack uses
the official packages rather than assembling individual libraries. Key decision: whether to embed
Sanity Studio in the SvelteKit app or deploy it separately.

## Recommended Stack

### Core Sanity Packages

| Package             | Version | Purpose                                                                  | Confidence |
| ------------------- | ------- | ------------------------------------------------------------------------ | ---------- |
| `@sanity/sveltekit` | ^1.0.4  | All-in-one SvelteKit integration (includes client, GROQ, Visual Editing) | HIGH       |
| `sanity`            | ^5.4.0  | Sanity Studio (React-based CMS interface)                                | HIGH       |
| `@sanity/cli`       | ^5.2.0  | CLI for schema extraction, TypeGen, deployments                          | HIGH       |

**Why @sanity/sveltekit is the answer:**

- Exports `createClient`, `defineQuery`, `groq` - no need for separate `@sanity/client`
- Includes Visual Editing components (`VisualEditing`, `PreviewMode`)
- Embeddable Studio via `SanityStudio` component
- First-party maintained by Sanity team
- Released October 2025, actively maintained

Source: [GitHub sanity-io/sanity-sveltekit](https://github.com/sanity-io/sanity-sveltekit)

### Content Rendering

| Package                | Version | Purpose                                                  | Confidence |
| ---------------------- | ------- | -------------------------------------------------------- | ---------- |
| `@portabletext/svelte` | ^3.0.0  | Render Portable Text (rich content) as Svelte components | HIGH       |
| `@sanity/image-url`    | ^2.0.2  | Generate optimized image URLs with hotspot/crop support  | HIGH       |

**Why these packages:**

- `@portabletext/svelte` v3.0.0 requires Svelte 5 (matches your project)
- `@sanity/image-url` handles Sanity's image pipeline with CDN optimization
- Both are official packages with active maintenance

Source: [PortableText to Svelte](https://svelte-portabletext.sanity.build/)

### TypeScript Support

| Package                    | Version | Purpose                      | Confidence |
| -------------------------- | ------- | ---------------------------- | ---------- |
| (included in `sanity` CLI) | -       | TypeGen for GROQ query types | HIGH       |

**How it works:**

```bash
# Extract schema
npx sanity schema extract

# Generate types for queries
npx sanity typegen generate
```

TypeGen scans for `defineQuery()` calls and generates TypeScript types. No additional packages
needed.

Source: [Sanity TypeGen Docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)

## Installation

```bash
# Core SvelteKit integration
npm install @sanity/sveltekit

# Sanity Studio (for embedded or separate deployment)
npm install sanity @sanity/cli

# Content rendering
npm install @portabletext/svelte @sanity/image-url
```

**Dev dependencies:**

```bash
# TypeGen types (generated, not installed)
# Run: npx sanity typegen generate
```

## Sanity Studio Setup

### Option A: Embedded in SvelteKit (Recommended for simplicity)

The `@sanity/sveltekit` package exports a `SanityStudio` component that can render the full Studio
at a route.

**File: `src/routes/studio/[...catchall]/+page.svelte`**

```svelte
<script lang="ts">
    import config from '$lib/sanity/sanity.config';
    import { SanityStudio } from '@sanity/sveltekit';
</script>

<SanityStudio {config} />
```

**Pros:**

- Single deployment
- Shared authentication context
- No CORS configuration needed

**Cons:**

- Adds React as a dependency (Studio is React-based)
- Larger bundle for main app

Source:
[Visual Editing with SvelteKit](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit)

### Option B: Separate Studio Deployment (Recommended for production)

Deploy Studio as a standalone app to `studio.yourdomain.com` or Sanity's hosted platform.

```bash
# Initialize in a /studio subdirectory
npx sanity@latest init --template clean --create-project "maxdaten-blog" --dataset production

# Deploy to Sanity's hosting
npx sanity deploy
```

**Pros:**

- No React in main SvelteKit bundle
- Independent scaling/deployment
- Free hosting from Sanity

**Cons:**

- Separate deployment pipeline
- CORS configuration needed

**Recommendation:** Start with Option B (separate Studio). The SvelteKit app stays clean, and Studio
deployment is free.

## Client Integration

### Environment Variables

```bash
# .env
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"
PUBLIC_SANITY_STUDIO_URL="https://your-studio.sanity.studio"
SANITY_VIEWER_TOKEN="sk_..."  # Server-only, for draft content
```

### Sanity Client Configuration

**File: `src/lib/sanity/client.ts`**

```typescript
import { createClient, groq, defineQuery } from '@sanity/sveltekit';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';

export const client = createClient({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    apiVersion: '2025-01-18', // Use today's date, hardcoded
    useCdn: true, // true for production, false for previews
});

export { groq, defineQuery };
```

### GROQ Queries

```typescript
import { defineQuery, groq } from '$lib/sanity/client';

// defineQuery enables TypeGen type generation
export const postsQuery = defineQuery(groq`
  *[_type == "post" && !hidden] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "coverImage": coverImage.asset->url,
    tags
  }
`);

export const postBySlugQuery = defineQuery(groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    "coverImage": coverImage.asset->url,
    tags
  }
`);
```

Source: [GROQ Query Cheat Sheet](https://www.sanity.io/docs/content-lake/query-cheat-sheet)

### Data Fetching in SvelteKit

**File: `src/routes/blog/+page.server.ts`**

```typescript
import { client, postsQuery } from '$lib/sanity/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const posts = await client.fetch(postsQuery);
    return { posts };
};

// Enable static prerendering
export const prerender = true;
```

## Image Handling

### URL Builder Setup

**File: `src/lib/sanity/image.ts`**

```typescript
import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
    return builder.image(source);
}
```

### Usage in Components

```svelte
<script lang="ts">
    import { urlFor } from '$lib/sanity/image';

    export let image: SanityImageSource;
</script>

<img
    src={urlFor(image).width(800).height(450).fit('crop').auto('format').url()}
    alt={image.alt || ''}
    loading="lazy"
/>
```

**Key image transformations:**

- `.width(n)` / `.height(n)` - Resize
- `.fit('crop')` - Crop to dimensions (respects hotspot)
- `.auto('format')` - Serve WebP/AVIF when supported
- `.quality(n)` - Compression (default: 75)
- `.blur(n)` - For placeholder/blur-up patterns

Source:
[Presenting Images | Sanity Docs](https://www.sanity.io/docs/apis-and-sdks/presenting-images)

## Static Site Generation Considerations

### Prerendering with Sanity Data

For your Vercel static deployment, all Sanity data fetching happens at build time:

```typescript
// src/routes/blog/[slug]/+page.server.ts
import { client, postBySlugQuery, postsQuery } from '$lib/sanity/client';

export const prerender = true;

export async function load({ params }) {
    const post = await client.fetch(postBySlugQuery, { slug: params.slug });
    return { post };
}

// Generate all post routes
export async function entries() {
    const posts = await client.fetch(postsQuery);
    return posts.map((post) => ({ slug: post.slug.current }));
}
```

### Triggering Rebuilds on Content Changes

**Option 1: Sanity Webhook to Vercel Deploy Hook**

- Create a Vercel Deploy Hook URL
- Add webhook in Sanity: Project Settings > API > Webhooks
- Trigger on: Create, Update, Delete

**Option 2: ISR with `@sveltejs/adapter-vercel`** Your current `@sveltejs/adapter-vercel` supports
ISR:

```typescript
// src/routes/blog/[slug]/+page.server.ts
export const config = {
    isr: {
        expiration: 60 * 60, // Revalidate every hour
    },
};
```

**Recommendation:** Use webhooks for immediate rebuilds. ISR adds complexity and Vercel costs.

## What NOT to Use

### Anti-Recommendations

| Package                       | Why NOT                                           | Alternative                          |
| ----------------------------- | ------------------------------------------------- | ------------------------------------ |
| `@sanity/client` (standalone) | `@sanity/sveltekit` already exports it            | Use `@sanity/sveltekit`              |
| `@sanity/svelte-loader`       | Older approach, superseded by `@sanity/sveltekit` | Use `@sanity/sveltekit`              |
| `groq` (standalone npm)       | Included in `@sanity/sveltekit`                   | Use exports from `@sanity/sveltekit` |
| GraphQL API                   | GROQ is preferred, more powerful, better TypeGen  | Use GROQ                             |
| Custom image URL logic        | Reinventing hotspot/crop handling                 | Use `@sanity/image-url`              |
| `svelte-pote`                 | Beta, less maintained than official               | Use `@portabletext/svelte`           |

### Common Mistakes to Avoid

1. **Installing @sanity/client separately** - It's exported from @sanity/sveltekit
2. **Using dynamic apiVersion** - Always hardcode the date string
3. **Forgetting useCdn: false for previews** - CDN caches aggressively
4. **Not using defineQuery** - TypeGen won't generate types without it

## Confidence Levels

| Recommendation                       | Confidence | Source                                       |
| ------------------------------------ | ---------- | -------------------------------------------- |
| @sanity/sveltekit as primary package | HIGH       | Official GitHub, npm registry                |
| sanity v5.4.0 for Studio             | HIGH       | Official npm, Sanity blog                    |
| @portabletext/svelte v3.0.0          | HIGH       | npm registry, requires Svelte 5              |
| @sanity/image-url v2.0.2             | HIGH       | npm registry, official package               |
| Separate Studio deployment           | MEDIUM     | Best practice, but embedded also works       |
| Webhook-triggered rebuilds           | MEDIUM     | Common pattern, depends on content frequency |

## Free Tier Considerations

Sanity Free Plan limits:

- 1 dataset
- 10,000 documents
- 20 users
- Asset storage limits (no overages)

For a personal blog, the free tier is more than sufficient. Growth plan is $15/user/month if needed.

Source: [Sanity Pricing](https://www.sanity.io/pricing)

## Sources

### Official Documentation

- [Visual Editing with SvelteKit](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit)
- [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/content-lake/query-cheat-sheet)
- [Presenting Images](https://www.sanity.io/docs/apis-and-sdks/presenting-images)
- [Configuration API](https://www.sanity.io/docs/studio/config-api-reference)

### GitHub Repositories

- [sanity-io/sanity-sveltekit](https://github.com/sanity-io/sanity-sveltekit)
- [sanity-io/sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean)
- [portabletext/svelte-portabletext](https://github.com/portabletext/svelte-portabletext)

### Package Registries

- [@sanity/sveltekit - npm](https://www.npmjs.com/package/@sanity/sveltekit)
- [@sanity/image-url - npm](https://www.npmjs.com/package/@sanity/image-url)
- [@portabletext/svelte - npm](https://www.npmjs.com/package/@portabletext/svelte)
