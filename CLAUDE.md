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
- Shiki/CodeBlock styling in `src/lib/scss/_markdown.scss:74` `.code-block` class

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

**TDD & Tidy First Principles:**

- **TDD Cycle:** Always follow Red → Green → Refactor
    - Write the simplest failing test first (Red)
    - Implement minimum code to make test pass (Green)
    - Refactor only after tests are passing (Refactor)
- **Tidy First:** Separate structural from behavioral changes
    - STRUCTURAL CHANGES: Rearranging code without changing behavior
    - BEHAVIORAL CHANGES: Adding or modifying actual functionality
    - Never mix structural and behavioral changes in the same commit
    - Always make structural changes first when both are needed
    - Validate structural changes don't alter behavior by running tests

**Testing Strategy:**

- **Unit Tests (Vitest):** Use describe/it spec pattern, add stories alongside components
- **E2E Tests (Playwright):** Test user workflows across browsers
- Use meaningful test names that describe behavior
- Tests located in `tests/` for E2E and alongside components for unit tests

**Code Quality Standards:**

- Eliminate duplication ruthlessly
- Express intent clearly through naming and structure
- Make dependencies explicit
- Keep methods small and focused on a single responsibility
- Minimize state and side effects
- Use the simplest solution that could possibly work
- Prefer functional style before imperative style
- Follow clean code style guides moderately

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
improve task efficiency and optimize token usage. Use Gemini for planning and architectural
evaluation and changes.

**Development Workflow:**

1. Write failing test for small feature increment
2. Implement minimum code to pass
3. Refactor if needed (run tests after each change)
4. Commit structural and behavioral changes separately
5. Repeat for next increment

Always run tests between changes. Prioritize clean, well-tested code over speed.
