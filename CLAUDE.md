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

**i18n / Translations:**

- Locales: `de` (default), `en` — defined in `src/lib/i18n/types.ts` (`Locale` type)
- Translation files: `src/lib/i18n/de.ts` and `src/lib/i18n/en.ts` (flat key-value, typed by
  `TranslationKeys`)
- Lookup: `t(locale, key)` in `src/lib/i18n/index.ts`, falls back to `de`
- Routing: `/` is German, `/en/` is English; derived by `getLocaleFromPath()`
- Only the homepage is translated (`isTranslatedRoute()`); blog/gems stay English
- Canonical domains: `maxdaten.de` (de), `maxdaten.io` (en)
- `hero.subheadline` is reused as `meta.description` — keep them in sync when editing
- When changing translation text, also update E2E assertions in `tests/e2e/i18n.test.ts`
- Unit tests in `src/lib/i18n/i18n.test.ts` verify both locales have identical keys and that
  translated keys differ between locales (except `nav.blog`, `nav.gems`, `footer.impressum`,
  `meta.title`)
- When implementing i18n or domain-based routing changes, always update E2E tests to reflect new
  translation strings and test both domain variants (.io and .de).

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
- **Design Tokens:** Always use design tokens for styling values
    - Two-layer architecture in `src/lib/scss/_tokens-colors.scss`
    - **Primitive tokens** (`--raw-*`): Raw values without context (e.g., `--raw-radius-xs: 4px`)
    - **Semantic tokens**: Contextual usage referencing primitives (e.g.,
      `--radius-tag: var(--raw-radius-xs)`)
    - Never use hardcoded values for colors, spacing, radius, or opacity
    - Prefer semantic tokens in components; only use primitives when defining new semantic tokens

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

- Shiki 3.7 for code blocks
- Custom transformers for enhanced features (filename display, line numbers, copy buttons)
- Supported languages: bash, css, haskell, hcl, html, http, js, kotlin, nix, svelte, terraform,
  text, ts, yaml, docker, scss, python, nginx, java
- Integration through MDsveX with custom `CodeBlock` component
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

## Approach

**Development Workflow:**

1. Write failing test for small feature increment
2. Implement minimum code to pass
3. Refactor if needed (run tests after each change)
4. Commit structural and behavioral changes separately
5. Repeat for next increment

Always run tests between changes. Prioritize clean, well-tested code over speed.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and
SvelteKit documentation. Here's how to use the available tools effectively:

## Debugging

## Debugging

**Multi-Agent Debugging Process:**

When debugging, follow this structured approach using the Task tool with the `general-purpose`
subagent:

1. **Hypothesis Generation (Agent 1):** Launch an agent to analyze the issue and propose 1-3
   specific hypotheses about the root cause. Each hypothesis should include:
    - Description of the suspected cause
    - Expected symptoms if hypothesis is correct
    - Suggested verification method

2. **Hypothesis Rating (Agent 2):** Launch a second agent to evaluate each hypothesis and assign a
   probability rating (high/medium/low) based on:
    - Available evidence
    - Code complexity
    - Likelihood given the symptoms

3. **Hypothesis Verification (Agent 3):** Launch a third agent to test hypotheses in order from
   highest to lowest rating until the root cause is found.

**Example workflow:**

- Agent 1 finds: "Race condition in API call", "Missing null check in render", "Incorrect cache
  invalidation"
- Agent 2 rates: High, Medium, Low
- Agent 3 tests the race condition hypothesis first, then proceeds to next if needed

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with
titles, use_cases, and paths. When asked about Svelte or SvelteKit topics, ALWAYS use this tool at
the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections
(especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation
sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions. You MUST use this tool whenever writing
Svelte code before sending it to the user. Keep calling it until no issues or suggestions are
returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code. After completing the code, ask the user
if they want a playground link. Only call this tool after user confirmation and NEVER if code was
written to files in their project.
