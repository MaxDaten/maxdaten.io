# Technology Stack

**Analysis Date:** 2026-01-18

## Languages

**Primary:**

- JavaScript/TypeScript - Main application code, configuration, components
- Svelte 5 - Component templates with `.svelte` files

**Secondary:**

- SCSS - Styling with atomic design methodology
- Nix - Development environment configuration via devenv
- Markdown (MDsveX) - Blog content in `.md` files

## Runtime

**Environment:**

- Node.js >= 20.0.0 (specified in `package.json` engines)
- ES Modules (`"type": "module"`)

**Package Manager:**

- npm
- Lockfile: `package-lock.json` (present, lockfileVersion 3)

## Frameworks

**Core:**

- SvelteKit 2.0 (`@sveltejs/kit ^2.0.0`) - Full-stack web framework
- Svelte 5 (`svelte ^5.0.0`) - Reactive UI framework
- Vite 7.3 (`vite ^7.3.1`) - Build tool and dev server

**Content:**

- MDsveX 0.12 (`mdsvex ^0.12.3`) - Markdown with Svelte components
- Shiki 3.7 (`shiki ^3.7.0`) - Syntax highlighting

**Testing:**

- Vitest 4.0 (`vitest ^4.0.17`) - Unit testing with browser/node projects
- Playwright 1.53 (`@playwright/test ^1.53.1`) - E2E testing
- Vitest Browser Svelte (`vitest-browser-svelte ^2.0.1`) - Component testing

**Build/Dev:**

- Storybook 10 (`storybook ^10.0.0`) - Component development
- Sharp 0.34 (`sharp ^0.34.5`) - Image processing for OG images
- vite-imagetools (`@zerodevx/svelte-img ^2.1.2`) - Image optimization pipeline

## Key Dependencies

**Critical:**

- `@sveltejs/adapter-vercel ^6.3.0` - Vercel deployment adapter
- `mdsvex ^0.12.3` - Enables Svelte components in markdown content
- `shiki ^3.7.0` - Code syntax highlighting with custom transformers
- `svelte-meta-tags ^4.4.0` - SEO meta tag management

**Image Processing:**

- `sharp ^0.34.5` - Server-side image conversion (OG image generation)
- `@zerodevx/svelte-img ^2.1.2` - Responsive images with effects
- `vite-imagetools ^9.0.2` - Build-time image optimization
- `satori ^0.19.1` - HTML/CSS to SVG for OG images

**Content Processing:**

- `rehype-autolink-headings ^7.1.0` - Auto-link headings
- `rehype-external-links ^3.0.0` - External link handling
- `rehype-slug ^6.0.0` - Add IDs to headings
- `rehype-unwrap-images ^1.0.0` - Image processing
- `mdsvex-relative-images ^2.0.0` - Relative image paths

**Fonts:**

- `@fontsource/baloo-2` - Display font
- `@fontsource/inter` - Body font
- `@fontsource/merriweather` - Serif font
- `@fontsource/ubuntu-mono` - Monospace font

**Utilities:**

- `dateformat ^5.0.3` - Date formatting
- `html-entities ^2.6.0` - HTML entity encoding
- `schema-dts ^1.1.5` - Schema.org TypeScript types
- `super-sitemap ^1.0.5` - Sitemap generation

## Configuration

**Environment:**

- `.env` - Environment variables (contains `GEMINI_API_KEY`)
- `.envrc` - direnv configuration for devenv integration
- `VERCEL_PROJECT_PRODUCTION_URL` - Used for prerender origin

**TypeScript:**

- `tsconfig.json` - Extends `.svelte-kit/tsconfig.json`
- Strict mode enabled with JSDoc support (`allowJs`, `checkJs`)
- Module resolution: `bundler`

**Build:**

- `vite.config.ts` - Vite configuration with SvelteKit and imagetools
- `svelte.config.js` - SvelteKit config with Vercel adapter
- `mdsvex.config.js` - Markdown processing with Shiki highlighting

**Code Quality:**

- `eslint.config.js` - ESLint flat config with TypeScript and Svelte
- `.prettierrc` - Prettier with 4-space tabs, single quotes

## Platform Requirements

**Development:**

- Node.js >= 20.0.0
- npm (for package management)
- Optional: Nix with devenv for reproducible environment

**Devenv Tools (via `devenv.nix`):**

- npm-check-updates
- vercel CLI
- treefmt (prettier + nixfmt)
- Git hooks: lint-check, unit-tests (pre-commit), e2e-tests, npm-audit (pre-push)

**Production:**

- Vercel (static site with edge functions)
- Automatic image optimization via Vercel

## Test Configuration

**Vitest Projects (`vite.config.ts`):**

1. **browser** - Component tests in Chromium
    - Include: `src/**/*.svelte.{test,spec}.{js,ts}`
    - Exclude: `src/lib/server/**`
    - Headless with clipboard permissions

2. **server** - Node environment tests
    - Include: `src/**/*.{test,spec}.{js,ts}`, `tests/**/*.{test,spec}.{js,ts}`
    - Exclude: `.svelte.test` files, E2E tests

**Playwright (`playwright.config.ts`):**

- Test dir: `./tests/e2e`
- Browsers: Chromium, Firefox, WebKit
- Base URL: `http://localhost:5173`
- HTML reporter with screenshots on failure

## Storybook Configuration

**Location:** `.storybook/`

- `main.js` - Stories from `src/**/*.stories.@(js|ts|svelte)`
- `preview.js` - Global SCSS, dark theme default

---

_Stack analysis: 2026-01-18_
