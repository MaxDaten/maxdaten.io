# CLAUDE.md

Personal site and blog of a freelance consultant: maxdaten.de (German) and maxdaten.io (English).
SvelteKit 3 + Svelte 5 (runes) on Vite 8, prerendered and deployed on Vercel, content in Sanity CMS.

## Commands

Run inside the devenv shell (direnv loads it); `treefmt` only exists there.

- `npm run dev` / `build` / `preview`
- `npm run check` — svelte-check (uses `tsconfig.json`)
- `npm run lint` — eslint only (formatting is checked by treefmt)
- `npm run format` — `treefmt` (prettier + nixfmt); whole-repo runs must be a no-op
- `npm run test` — fast vitest run: `server` project (node) + `browser` project (`*.svelte.test.ts`,
  chromium; needs `npx playwright install chromium` once)
- `npm run test:e2e` — Playwright; use `-- --project chromium` for a quick run
- `npm run studio:dev` / `studio:deploy` — Sanity Studio in `studio/`

Git hooks (prek, from `devenv.nix`): pre-commit runs treefmt, lint, check, unit tests; pre-push runs
chromium e2e and `npm audit --audit-level=high`. Don't bypass them.

**Verify a change:** `npm run check && npm run lint && npm run test`; for UI or routing changes also
`npm run test:e2e -- --project chromium`.

## Content: Sanity

- All posts, gems, authors, tags and series live in Sanity — never create content files in the repo.
  Sanity project `hvsy54ho`, dataset `production` (pass both to the Sanity MCP).
- Schemas: `studio/schemas/documents/{post,gem,author,series,tag}.ts`. Schema changes need a studio
  deploy (`.github/workflows/studio-deploy.yml` on push to `main`).
- All GROQ lives in `src/lib/sanity/queries.ts` (`defineQuery`); client in `client.ts` (CDN,
  published content only). Images via `src/lib/sanity/image.ts`.
- Post bodies are Portable Text, rendered by components in `src/lib/sanity/portable-text/`. Code
  blocks are highlighted with Shiki in `portable-text/CodeBlock.svelte`.
- The site is prerendered (`src/routes/+layout.ts`), so published content only appears after a new
  deploy.

## Routing and i18n

- `(de)/` = German home at `/`, `en/` = English home at `/en`. Only the home page is translated;
  `/blog`, `/gems`, `/[slug]` (posts), `/about/[authorId]` are English-only.
- Other routes: `/impressum`, `/datenschutz`, `/404`, OG images `og/[locale].jpg` + `[slug]/og.jpg`
  (satori + sharp, see `src/lib/server/og-generation.ts`; prerendered, so the smoke script checks
  them in `.vercel/output/static`), `/og-preview`, `rss.xml`, `sitemap.xml` (super-sitemap),
  `robots.txt`.
- Translations: flat typed key/value in `src/lib/i18n/{de,en}.ts`; `t(locale, key)` in
  `src/lib/i18n/index.ts` falls back to `de`. Locale comes from `getLocaleFromPath()`.
- The root layout exposes the locale as a getter: `setContext('locale', () => locale)`; read it with
  `getContext('locale')` inside `$derived()` to stay reactive.
- `hooks.server.ts` sets `<html lang>` per request.
- Domains: German pages (`/`, `/impressum`, `/datenschutz`) live on maxdaten.de, everything else on
  www.maxdaten.io (Vercel's domain settings redirect the maxdaten.io apex there). `canonicalUrl()`
  in `src/lib/i18n/index.ts` gives a page's final URL; use it for canonical, hreflang, sitemap and
  feed links. Host redirects live in `vercel.json` (English pages on .de → www.maxdaten.io, `/` on
  .io → `/en`, www.maxdaten.de → apex), tested in `tests/vercel-redirects.test.ts`.
- `hero.subheadline` doubles as `meta.description` — keep them in sync.
- When changing translation text, update `tests/e2e/i18n.test.ts`. `src/lib/i18n/i18n.test.ts`
  enforces identical keys across locales and differing values (except `nav.blog`, `nav.gems`,
  `footer.impressum`, `meta.title`). Test both domain variants for routing changes.

## Styling

- Plain CSS (no SCSS despite the `src/lib/scss/` directory name), Svelte-scoped component styles.
- Design tokens are mandatory — no hardcoded colors, spacing, radius or opacity. Primitives
  `--raw-*` in `tokens-{colors,spacing,typography}.css`; components use semantic tokens.
  `tokens-migration.css` is a bridge for legacy `--color--*` names; don't add new uses.
- Exception: OG cards (`OgCard`, `ProfileOgCard`) need literal values because satori cannot resolve
  CSS variables.
- Load the `design-principles` skill for UI work.
- Components follow atoms / molecules / organisms in `src/lib/components/`.

## Conventions

- SvelteKit config lives in the `sveltekit({...})` call in `vite.config.ts` (there is no
  `svelte.config.js`). Imports use Node subpath imports from `package.json`: `#lib/...` for
  `src/lib` (components, assets, utils, …) and `#routes/...` for `src/routes`. TypeScript modules
  are imported with a `.js` extension (`#lib/sanity/client.js`).
- Commit messages: conventional commits (`feat(seo): …`, `chore(deps): …`, `content(gems): …`). Keep
  structural (tidy) and behavioural changes in separate commits.
- Blog prose style guide: `WRITING.md` (only for writing posts).
- `.planning/` is historical; don't trust it as a description of the code.
