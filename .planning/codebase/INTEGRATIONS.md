# External Integrations

**Analysis Date:** 2026-01-18

## APIs & External Services

**Analytics:**

- Plausible Analytics - Privacy-focused web analytics
    - Script: `/scitylana/js/script.js` (proxied through Vercel)
    - API: `/scitylana/api/event` (proxied through Vercel)
    - Domain: `maxdaten.io`
    - Implementation: `src/lib/components/atoms/Analytics.svelte`
    - Production only (disabled in dev mode)

**AI/LLM (Development):**

- Google AI / Gemini API
    - SDK/Client: Not detected (key present but no implementation found)
    - Auth: `GEMINI_API_KEY` in `.env`
    - Status: Appears to be for development/tooling, not production

## Data Storage

**Databases:**

- None - Static site with no database

**File Storage:**

- Local filesystem only
- Content stored as markdown in `src/content/blog/`
- Static assets in `static/`

**Caching:**

- Vercel Edge Cache (via Cache-Control headers)
- OG images: `public, max-age=600, s-maxage=604800`
- RSS feed: `max-age=0, s-maxage=3600`

## Authentication & Identity

**Auth Provider:**

- None - Public static site with no authentication

## Monitoring & Observability

**Error Tracking:**

- None detected

**Analytics:**

- Plausible Analytics (self-hosted proxy via Vercel rewrites)

**Logs:**

- Console-based during development
- Vercel function logs in production

## CI/CD & Deployment

**Hosting:**

- Vercel
    - Adapter: `@sveltejs/adapter-vercel ^6.3.0`
    - Config: `svelte.config.js` (adapter)
    - Build command: `npm run build` (via `vercel-build` script)

**Image Optimization:**

- Vercel automatic image optimization
- Build-time optimization via vite-imagetools

**CI Pipeline:**

- Git hooks via devenv (not external CI service)
    - Pre-commit: treefmt, lint-check, unit-tests
    - Pre-push: e2e-tests, npm-audit

## Environment Configuration

**Required env vars:**

- `VERCEL_PROJECT_PRODUCTION_URL` - Set by Vercel, used for prerender origin

**Optional env vars:**

- `GEMINI_API_KEY` - AI integration (development/tooling)
- `CI` - Affects Playwright retry/worker config

**Secrets location:**

- `.env` file (local development)
- Vercel environment variables (production)

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- Plausible Analytics event tracking (`/scitylana/api/event`)

## Content Delivery

**RSS Feed:**

- Endpoint: `/rss.xml`
- Implementation: `src/routes/rss.xml/+server.ts`
- Prerendered at build time

**Sitemap:**

- Endpoint: `/sitemap.xml`
- Implementation: `src/routes/sitemap.xml/+server.ts`
- Uses `super-sitemap` package
- Includes all blog posts with lastmod dates

**OG Images:**

- Dynamic generation at build time
- Endpoint: `/og.jpg` (site) and `/[slug]/og.jpg` (posts)
- Implementation: `src/lib/server/og-generation.ts`
- Uses Satori + Sharp for SVG to JPEG conversion

**Robots.txt:**

- Endpoint: `/robots.txt`
- Implementation: `src/routes/robots.txt/+server.ts`

## SEO & Structured Data

**Schema.org:**

- Types: WebSite, Person, ProfilePage, Organization, BlogPosting
- Implementation: `src/lib/data/meta.ts`
- Uses `schema-dts` for type safety

**Meta Tags:**

- Managed via `svelte-meta-tags` package
- Open Graph and Twitter card support

## Proxy Configuration (Vercel)

**Rewrites (`vercel.json`):**

```json
{
    "/scitylana/js/script.js": "https://plausible.io/js/script.js",
    "/scitylana/api/event": "https://plausible.io/api/event"
}
```

Purpose: Privacy-friendly analytics proxy to avoid ad blockers

## Third-Party Fonts

**Self-hosted via Fontsource:**

- Baloo 2 (display headings)
- Inter (body text)
- Merriweather (serif accents)
- Ubuntu Mono (code blocks)

No external font API calls.

---

_Integration audit: 2026-01-18_
