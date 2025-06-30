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

- `npm run test` - Run all tests once
- `npm run test:unit` - Run unit tests in watch mode
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

**Component Architecture:**

- **Atoms:** Basic UI elements (Button, Card, Image, etc.)
- **Molecules:** Composed components (BlogPostCard, ThemeToggle, etc.)
- **Organisms:** Complex layouts (Header, Footer, Hero, etc.)

**Content System:**

- Blog posts are `.md` files in `src/routes/(blog-article)/`
- Posts use frontmatter metadata and are processed by MDsveX
- Blog data is centralized in `src/lib/data/blog-posts/`
- Site metadata is configured in `src/lib/data/meta.ts`

**Routing Structure:**

- `(waves)` route group for main site pages
- `(blog-article)` route group for blog posts
- Static routes for `/blog`, `/gems`, RSS feed

**Styling System:**

- Global SCSS files in `src/lib/scss/`
- Theme system with light/dark mode support
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
