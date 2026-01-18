# Codebase Structure

**Analysis Date:** 2026-01-18

## Directory Layout

```
maxdaten.io/
├── src/
│   ├── content/
│   │   └── blog/               # Markdown blog posts
│   ├── lib/
│   │   ├── assets/
│   │   │   └── images/         # Optimizable images
│   │   ├── components/
│   │   │   ├── atoms/          # Basic UI elements
│   │   │   ├── molecules/      # Composed components
│   │   │   └── organisms/      # Complex page sections
│   │   ├── config/             # App configuration
│   │   ├── data/               # Data definitions & loaders
│   │   ├── icons/              # SVG icon components
│   │   ├── rehype/             # Custom rehype plugins
│   │   ├── scss/               # Global styles
│   │   ├── server/             # Server-only code
│   │   ├── shiki/              # Code highlighting config
│   │   ├── stores/             # Svelte stores
│   │   ├── transitions/        # Page transition effects
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Shared utilities
│   └── routes/                 # SvelteKit routes
├── static/                     # Static assets (favicons, etc.)
├── tests/                      # Test files
│   └── e2e/                    # Playwright E2E tests
├── .storybook/                 # Storybook configuration
├── scripts/                    # Build/utility scripts
└── [config files]              # Root configuration
```

## Directory Purposes

**`src/content/blog/`:**

- Purpose: Blog post markdown files
- Contains: `.md` files with YAML frontmatter
- Key files: `2025-*.md` (dated posts), `00-*.md` (static pages like impressum, uses)

**`src/lib/components/atoms/`:**

- Purpose: Smallest reusable UI elements
- Contains: `Analytics.svelte`, `Button.svelte`, `Card.svelte`, `Tag.svelte`, `Logo.svelte`,
  `FileIcon.svelte`, `RssLink.svelte`, `MarkdownImage.svelte`, `DiagonalStrip.svelte`,
  `Sparkles.svelte`

**`src/lib/components/molecules/`:**

- Purpose: Components composed of atoms
- Contains: `BlogPostCard.svelte`, `Author.svelte`, `CodeBlock.svelte`, `Callout.svelte`,
  `GemCard.svelte`, `ThemeToggle.svelte`, `Socials.svelte`, highlight components (Marker, Tint,
  Sparkling)

**`src/lib/components/organisms/`:**

- Purpose: Large page sections and layouts
- Contains: `Header.svelte`, `Footer.svelte`, `Hero.svelte`, `About.svelte`,
  `ContentSection.svelte`, `RecentPosts.svelte`, `RelatedPosts.svelte`, `MdsvexWrapper.svelte`,
  `Bubbles.svelte`

**`src/lib/data/`:**

- Purpose: Data definitions and content loaders
- Contains: `posts.ts` (post loaders), `authors.ts` (author data), `meta.ts` (SEO metadata),
  `gems/index.ts` (curated links)

**`src/lib/server/`:**

- Purpose: Server-only utilities (not bundled to client)
- Contains: `posts.ts` (server-side post processing), `og-generation.ts` (OG image rendering)

**`src/lib/assets/images/`:**

- Purpose: Optimizable images processed by vite-imagetools
- Contains: `posts/{slug}/cover.png` (blog covers), `posts/{slug}/*.png` (inline images),
  `authors/*.png` (avatars), `gems/*.png` (gem covers), `site/` (site images)

**`src/lib/scss/`:**

- Purpose: Global SCSS styles and utilities
- Contains: `global.scss` (entry), `_variables.scss`, `_themes.scss`, `_mixins.scss`,
  `_breakpoints.scss`, `_typography.scss`, `_markdown.scss`, `_code-highlights.scss`,
  `_animations.scss`, `_reset.scss`, `_base.scss`, `_functions.scss`

**`src/lib/icons/`:**

- Purpose: SVG icon Svelte components
- Contains: General icons and `socials/` subdirectory for social media icons

**`src/lib/rehype/`:**

- Purpose: Custom rehype plugins for markdown processing
- Contains: `rehype-collect-external-links.js`, `rehype-github-callouts.js`

**`src/lib/shiki/`:**

- Purpose: Shiki code highlighting customization
- Contains: `transformerCodeBlock.js`

**`src/routes/`:**

- Purpose: SvelteKit file-based routing
- Contains: Page routes, API routes, dynamic routes

## Key File Locations

**Entry Points:**

- `src/routes/+layout.svelte`: Root layout (Header, Footer, Analytics)
- `src/routes/+layout.ts`: Base meta tags and prerender config
- `src/routes/+page.svelte`: Home page (Hero, About, RecentPosts)

**Configuration:**

- `svelte.config.js`: SvelteKit config, path aliases, MDsveX integration
- `mdsvex.config.js`: Markdown processing (Shiki, rehype plugins, layout)
- `vite.config.ts`: Vite build config, test config
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: ESLint rules
- `.prettierrc`: Prettier formatting options
- `playwright.config.ts`: E2E test configuration

**Core Logic:**

- `src/lib/data/posts.ts`: Blog post loading, filtering, reading time
- `src/lib/server/posts.ts`: Server-side post rendering and HTML extraction
- `src/lib/utils/image-loader.ts`: Dynamic image loading via import.meta.glob
- `src/lib/data/meta.ts`: Site metadata, schema.org definitions
- `src/lib/server/og-generation.ts`: Satori + Sharp OG image pipeline

**Route Files:**

- `src/routes/[slug]/+page.svelte`: Blog post template
- `src/routes/[slug]/+page.server.ts`: Load post metadata
- `src/routes/[slug]/+page.ts`: Load post component, generate page meta
- `src/routes/[slug]/og.jpg/+server.ts`: Dynamic OG image generation
- `src/routes/blog/+page.svelte`: Blog listing page
- `src/routes/gems/+page.svelte`: Curated links page
- `src/routes/rss.xml/+server.ts`: RSS feed generation
- `src/routes/sitemap.xml/+server.ts`: Sitemap generation

**Testing:**

- `tests/e2e/`: Playwright E2E tests
- `*.test.ts` alongside source files: Vitest unit tests

## Naming Conventions

**Files:**

- Components: `PascalCase.svelte` (e.g., `BlogPostCard.svelte`)
- TypeScript modules: `kebab-case.ts` or `camelCase.ts` (e.g., `image-loader.ts`)
- Test files: `*.test.ts` co-located with source (e.g., `CodeBlock.svelte.test.ts`)
- Stories: `*.stories.svelte` (e.g., `Button.stories.svelte`)
- SCSS partials: `_kebab-case.scss` (e.g., `_breakpoints.scss`)
- Blog posts: `YYYY-MM-DD-slug.md` or `00-slug.md` for static pages
- Icons: `kebab-case.svelte` (e.g., `external-link.svelte`)

**Directories:**

- Lowercase with hyphens where multi-word
- Component directories: `atoms/`, `molecules/`, `organisms/`
- Asset subdirectories: `posts/{slug}/`, `authors/`, `gems/`

**Routes:**

- Dynamic segments: `[param]` (e.g., `[slug]`, `[authorId]`)
- Static routes: lowercase (e.g., `blog/`, `gems/`)
- API routes: filename as endpoint (e.g., `rss.xml/`, `og.jpg/`)

## Where to Add New Code

**New Blog Post:**

- Create: `src/content/blog/YYYY-MM-DD-slug.md`
- Add cover image: `src/lib/assets/images/posts/slug/cover.png`
- Inline images: `src/lib/assets/images/posts/slug/*.png`

**New UI Component:**

- Atoms (buttons, tags): `src/lib/components/atoms/ComponentName.svelte`
- Molecules (cards, callouts): `src/lib/components/molecules/ComponentName.svelte`
- Organisms (sections, layouts): `src/lib/components/organisms/ComponentName.svelte`
- Story: Co-locate as `ComponentName.stories.svelte`
- Test: Co-locate as `ComponentName.svelte.test.ts`

**New Page Route:**

- Static page: `src/routes/page-name/+page.svelte`
- With server data: Add `+page.server.ts` or `+page.ts`
- API endpoint: `src/routes/endpoint/+server.ts`

**New Icon:**

- General: `src/lib/icons/icon-name.svelte`
- Social: `src/lib/icons/socials/platform-name.svelte`

**New Data Type:**

- Type definition: `src/lib/utils/types.ts`
- Data loader: `src/lib/data/` or `src/lib/server/` if server-only

**New Utility Function:**

- Client-safe: `src/lib/utils/`
- Server-only: `src/lib/server/`

**New SCSS Module:**

- Global styles: `src/lib/scss/_module-name.scss`
- Import in: `src/lib/scss/global.scss`

**New Rehype Plugin:**

- Location: `src/lib/rehype/rehype-plugin-name.js`
- Register in: `mdsvex.config.js` rehypePlugins array

## Special Directories

**`.svelte-kit/`:**

- Purpose: SvelteKit build artifacts and generated types
- Generated: Yes (during dev/build)
- Committed: No (gitignored)

**`.vercel/`:**

- Purpose: Vercel deployment output
- Generated: Yes (during build)
- Committed: No (gitignored)

**`node_modules/`:**

- Purpose: npm dependencies
- Generated: Yes (npm install)
- Committed: No (gitignored)

**`static/`:**

- Purpose: Files served directly without processing
- Generated: No
- Committed: Yes
- Contents: `favicons/`, `themes/` (CSS themes), static images

**`.storybook/`:**

- Purpose: Storybook configuration
- Generated: No
- Committed: Yes
- Key files: `main.ts`, `preview.ts`

**`test-results/`:**

- Purpose: Playwright test artifacts
- Generated: Yes (during test runs)
- Committed: No (gitignored)

**`playwright-report/`:**

- Purpose: Playwright HTML reports
- Generated: Yes (after test runs)
- Committed: No (gitignored)

---

_Structure analysis: 2026-01-18_
