# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Essential Commands

**Development:**

- `npm run dev` - Start development server with host binding
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Code Quality:**

- `npm run check` - Run svelte-check with TypeScript validation
- `npm run lint` - Run prettier and eslint checks
- `npm run format` - Format code with prettier

**Testing:**

- `npm run test` - Run fast unit tests only (suitable for commit hooks, skips slow tests)
- `npm run test:all` - Run all tests including slow ones (unit tests + link checker)
- `npm run test:unit` - Run unit tests in watch mode
- `npm run test:links` - Check all blog articles for dead links (slow, ~30s)
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with interactive UI
- `npm run test:e2e:headed` - Run E2E tests in headed browser mode
- `npm run test:e2e:debug` - Run E2E tests in debug mode

**Content Management:**

- `npm run storybook` - Start Storybook component development server
- `npm run update-site-preview-image` - Update site preview image

## Architecture Overview

This is a SvelteKit-based static blog site with MDX integration for content authoring.

**Key Technologies:**

- SvelteKit 2.0 with Svelte 5
- MDsveX for Markdown with Svelte components
- SCSS for styling with atomic design methodology
- Vitest for unit testing with separate client/server configurations
- Playwright for end-to-end testing across browsers
- Image optimization pipeline using image-transmutation
- UI components are developed via Storybook in isolation
- Shiki for advanced syntax highlighting with custom transformers

**Component Architecture:**

- **Atoms:** Basic UI elements (Button, Card, Image, etc.)
- **Molecules:** Composed components (BlogPostCard, ThemeToggle, etc.)
- **Organisms:** Complex layouts (Header, Footer, Hero, etc.)

**Content System:**

- Blog posts are `.md` files in `src/content/blog/` directory
- Dynamic routing via `src/routes/[slug]/` imports posts using `import.meta.glob()` pattern
- Posts use rich frontmatter (title, slug, coverImage, excerpt, date, tags, keywords, hidden)
- Blog data management in `src/lib/data/blog-posts/` with advanced features:
    - Automatic reading time calculation (200 wpm)
    - Related posts algorithm based on tag similarity
    - HTML rendering with Svelte component support
    - Hidden post filtering capability
- Gems (curated recommendations) system in `src/lib/data/gems/`
- MDsveX integration with custom layout (`MdsvexWrapper.svelte`) enables Svelte components in
  markdown
- Site metadata configured in `src/lib/data/meta.ts` with comprehensive SEO fields
- Content processing pipeline includes image optimization and sitemap generation

**Routing Structure:**

- Dynamic blog routing via `[slug]` for individual posts (e.g., `/my-post-slug`)
- Static routes: `/blog` (listing), `/gems` (curated links), `/404` (error page), `/` (home)
- API routes: `/rss.xml` for RSS feed generation
- Content stored in `/src/content/blog/` as `.md` files (not in routes directory)
- Sitemap auto-generated via `svelte-sitemap` package during build

**Styling System:**

- Global SCSS files in `src/lib/scss/`
- Component-scoped styles using Svelte's CSS scoping

**Path Aliases:**

- `$components` → `./src/lib/components`
- `$lib` → `./src/lib`
- `$stores` → `./src/lib/stores`
- `$styles` → `./src/lib/scss`
- `$utils` → `./src/lib/utils`
- `$routes` → `./src/routes`

**Deployment:**

- Vercel deployment with automatic image optimization
- Static site generation with prerendering
- Automatic sitemap generation post-build

**Syntax Highlighting System:**

- Shiki 3.7 with `aurora-x` theme for code blocks
- Custom transformers for enhanced features (filename display, line numbers, copy buttons)
- Supported languages: bash, css, haskell, hcl, html, http, js, kotlin, nix, svelte, terraform,
  text, ts, yaml, docker, scss, python, nginx, java
- Integration through MDsveX with custom CodeBlock component
- Configuration in `mdsvex.config.js` and `src/lib/shiki/transformerCodeBlock.js`

**Development Environment:**

- Nix flake for reproducible development environment
- Node.js 22 with npm
- Includes claude-code, vercel CLI, and formatting tools

## Development Guidelines

**Test-Driven Development (TDD):**

- When modifying or adding new functionality, follow TDD practices
- Write tests first, then implement the feature to make tests pass
- Use `npm run test` to run all tests and `npm run test:unit` for unit tests in watch mode
- Use `npm run test:e2e` for end-to-end testing with Playwright
- Ensure all tests pass before considering a feature complete
- in vitest use describe/it spec pattern
- Add stories side by side to the component

**Testing Strategy:**

- **Unit Tests (Vitest):** Test individual components and utilities
- **E2E Tests (Playwright):** Test user workflows across browsers
- Tests are located in `tests/` for E2E and alongside components for unit tests

## Code Style Guidelines

- Prefer functional style before imperative style
- Follow clean code style guides moderately
- Execute `npm run format` after each completed change

## Shiki Code Block Usage

**Basic Syntax:**

````markdown
```js
console.log('Hello world');
```
````

**With Filename:**

````markdown
```js filename="example.js"
console.log('Hello world');
```
````

**With Line Numbers:**

````markdown
```js showLineNumbers
console.log('Hello world');
```

```js showLineNumbers=10
console.log('Hello world');
```
````

## Approach

Core principle is to maintain focused contexts for both yourself (the orchestrator/main agent) and
each sub-agent. Therefore, please use the Task tool to delegate suitable tasks to sub-agents to
improve task efficiency and optimize token usage.
