# Codebase Concerns

**Analysis Date:** 2026-01-18

## Tech Debt

**Hardcoded Author Trading Card Data:**

- Issue: Stats and abilities in author trading card are hardcoded mock data with comment "these
  could be made dynamic later"
- Files: `src/routes/about/[authorId]/+page.svelte:10-41`
- Impact: All authors display identical stats regardless of actual data
- Fix approach: Move stats configuration to `src/lib/data/authors.ts` or generate from actual
  metrics

**Bubbles Animation Initial State Bug:**

- Issue: Documented in TODO.md - bubbles all start moving in same direction
- Files: `src/lib/components/organisms/Bubbles.svelte`
- Impact: Visual glitch where all 50 bubbles animate upward uniformly on page load
- Fix approach: Randomize initial movement vector based on pixel position in SCSS generation

**Incomplete Storybook Coverage:**

- Issue: Only 2 stories exist for ~70 components
- Files: `src/lib/components/atoms/Button.stories.svelte`,
  `src/lib/components/organisms/Bubbles.stories.svelte`
- Impact: Component development lacks isolated testing environment; hard to verify visual
  regressions
- Fix approach: Add stories for critical molecules (CodeBlock, BlogPostCard, ThemeToggle) and
  organisms (Header, Footer, Hero)

**OG Preview Pages Development-Only Code in Production:**

- Issue: Debug/preview pages for OG images are accessible in production (robots noindex but still
  routable)
- Files: `src/routes/og-preview/+page.svelte`, `src/routes/[slug]/og.jpg/preview/+page.svelte`,
  `src/routes/og.jpg/preview/+page.svelte`
- Impact: Exposes internal debugging tooling; shows raw post JSON data
- Fix approach: Gate these routes behind environment check or move to a development-only route group

**Duplicate Post Loading Logic:**

- Issue: `src/lib/data/posts.ts` and `src/lib/server/posts.ts` both define post loading functions
  with overlapping responsibilities
- Files: `src/lib/data/posts.ts`, `src/lib/server/posts.ts`
- Impact: Confusing which module to import from; potential for drift between client/server post
  processing
- Fix approach: Consolidate into single source with re-exports, clearly separating client-safe vs
  server-only functions

**Custom Callout Syntax Not Implemented:**

- Issue: TODO item for GitHub-style callouts (`> ![Info] Ipsum`) remains unimplemented
- Files: `src/lib/rehype/rehype-github-callouts.js`
- Impact: Blog posts cannot use standard GitHub callout syntax; current implementation exists but
  may be incomplete
- Fix approach: Complete rehype plugin and add documentation for supported callout types

## Known Bugs

**Link Checker Path Mismatch:**

- Symptoms: Link checker searches wrong path pattern
- Files: `tests/link-checker.test.ts:11`
- Trigger: Test runs but may not find blog files
- Workaround: Path pattern `src/routes/(blog-article)/**/*.md` doesn't match actual content location
  `src/content/blog/*.md`

## Security Considerations

**Exposed API Key in .env:**

- Risk: `.env` file contains `GEMINI_API_KEY` - if committed or exposed, grants API access
- Files: `.env`
- Current mitigation: `.gitignore` includes `.env` and `.env.*`
- Recommendations: Verify API key is not in git history; rotate key if any doubt; use `.env.example`
  for documentation

**OG Preview Exposes Post Metadata:**

- Risk: Preview pages dump full post JSON including potentially sensitive frontmatter fields
- Files: `src/routes/[slug]/og.jpg/preview/+page.svelte:79`
- Current mitigation: `robots: noindex` meta tag
- Recommendations: Gate behind authentication or remove JSON dump in production builds

## Performance Bottlenecks

**Large Author Page Component:**

- Problem: Author trading card page is 692 lines with complex CSS animations
- Files: `src/routes/about/[authorId]/+page.svelte`
- Cause: All styling inline in single component; complex hover effects with multiple event listeners
- Improvement path: Extract card component; use CSS-only effects where possible; consider
  code-splitting

**Rehype External Links Plugin Complexity:**

- Problem: 367-line plugin processes every external link on every page render
- Files: `src/lib/rehype/rehype-collect-external-links.js`
- Cause: Full tree traversal with text extraction for each link
- Improvement path: Cache processed results; consider build-time only processing

**50 Bubble Elements with Complex Animations:**

- Problem: 50 individual DOM elements with multiple concurrent animations
- Files: `src/lib/components/organisms/Bubbles.svelte`
- Cause: Each bubble has float, sway, and hue-rotate animations running
- Improvement path: Reduce bubble count; use CSS `content-visibility`; consider canvas/WebGL for
  many particles

## Fragile Areas

**Blog Post Import System:**

- Files: `src/lib/data/posts.ts`, `src/lib/server/posts.ts`
- Why fragile: Uses `import.meta.glob` with regex slug extraction; small pattern changes break
  routing
- Safe modification: Test any glob pattern changes against all existing posts; verify slug
  extraction regex
- Test coverage: Minimal - `src/lib/data/posts.test.ts` only tests `readingTime` function

**OG Image Generation Pipeline:**

- Files: `src/lib/server/og-generation.ts`, `src/routes/[slug]/og.jpg/+server.ts`
- Why fragile: Depends on Satori HTML rendering with `@ts-expect-error` type bypass; font loading at
  module level
- Safe modification: Test OG image generation for multiple posts; verify JPEG output quality
- Test coverage: E2E test exists (`tests/e2e/og-preview-images.spec.ts`) but no unit tests for
  generation logic

**MDsveX Content Processing:**

- Files: `mdsvex.config.js`, `src/lib/rehype/*.js`
- Why fragile: Custom rehype plugins (callouts, external links) transform content; changes can break
  existing posts
- Safe modification: Run full blog render after any rehype plugin change; check edge cases in
  existing content
- Test coverage: None for rehype plugins

## Scaling Limits

**Static Import of All Posts:**

- Current capacity: Works for current ~10 posts
- Limit: `import.meta.glob` imports all posts into memory; hundreds of posts will slow build
- Scaling path: Implement pagination at build time; consider content CMS (noted SANITY_MIGRATION.md
  exists)

## Dependencies at Risk

**None Critical:** All major dependencies (SvelteKit, Svelte, Vite) are actively maintained. The
`cookie` package override in `package.json` suggests a past vulnerability fix but current version
`^0.7.0` is stable.

## Missing Critical Features

**No Search Functionality:**

- Problem: No way to search blog posts
- Blocks: Users must browse or use browser search

**No Table of Contents for Long Articles:**

- Problem: Long technical articles lack navigation
- Blocks: Users must scroll through entire articles; noted in DESIGN_REVIEW.md

**No Active Navigation State:**

- Problem: Current page not indicated in navigation
- Blocks: Users lack location context; noted in DESIGN_REVIEW.md

## Test Coverage Gaps

**Rehype Plugins Untested:**

- What's not tested: `rehype-github-callouts.js`, `rehype-collect-external-links.js`
- Files: `src/lib/rehype/*.js`
- Risk: Plugin changes could silently break markdown rendering
- Priority: Medium

**Server Post Loading Untested:**

- What's not tested: `importPosts()`, `importPostBySlug()`, `getPostHtml()`, `toBlogPost()`
- Files: `src/lib/server/posts.ts`
- Risk: Post loading failures not caught before production; only one basic test exists
- Priority: High

**OG Image Generation Untested:**

- What's not tested: `generateOgImage()`, `svgToJpg()`, `renderCardToHtml()`
- Files: `src/lib/server/og-generation.ts`
- Risk: OG image generation could fail silently; social sharing preview broken
- Priority: Medium

**Most Component Tests Missing:**

- What's not tested: Header, Footer, Hero, Author, BlogPostCard, GemCard, ThemeToggle, most atoms
- Files: Most files in `src/lib/components/`
- Risk: Visual/behavioral regressions undetected
- Priority: Low (E2E tests provide some coverage)

## Design Debt

**Documented in DESIGN_REVIEW.md (Score: 5.9/10):**

- Two competing accent colors (orange and teal)
- Inconsistent depth strategy (borders vs shadows)
- Hero section has 5 CTAs with unclear hierarchy
- Card layouts monotonous (no featured card distinction)
- Bio section asymmetric padding

---

_Concerns audit: 2026-01-18_
