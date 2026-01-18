# Testing Patterns

**Analysis Date:** 2026-01-18

## Test Framework

**Unit/Integration Runner:**

- Vitest 4.x
- Config: `vite.config.ts` (inline test configuration)
- Two project configurations: `browser` and `server`

**E2E Runner:**

- Playwright 1.53.x
- Config: `playwright.config.ts`
- Browsers: Chromium, Firefox, WebKit

**Run Commands:**

```bash
npm run test                # Fast unit tests only (skips slow tests)
npm run test:all            # All tests including slow ones
npm run test:unit           # Unit tests in watch mode
npm run test:links          # Link checker only (~30s)
npm run test:e2e            # E2E tests (all browsers)
npm run test:e2e:ui         # E2E with interactive UI
npm run test:e2e:headed     # E2E in headed browser mode
npm run test:e2e:debug      # E2E debug mode
```

## Test File Organization

**Location:**

- Unit tests: Co-located with source files
- Component tests: `ComponentName.svelte.test.ts` alongside component
- E2E tests: `tests/e2e/` directory
- Slow tests: `tests/` directory (link checker)

**Naming:**

- Unit/integration: `*.test.ts`
- Spec files: `*.spec.ts` (used for both unit and e2e)
- Component tests: `*.svelte.test.ts` (browser environment)

**Structure:**

```
src/
├── lib/
│   ├── components/
│   │   └── molecules/
│   │       ├── CodeBlock.svelte
│   │       ├── CodeBlock.svelte.test.ts  # Browser test
│   │       └── Socials.svelte.test.ts
│   ├── data/
│   │   ├── posts.ts
│   │   └── posts.test.ts                  # Node test
│   ├── server/
│   │   ├── posts.ts
│   │   └── posts.test.ts                  # Node test
│   └── utils/
│       ├── fileIcons.ts
│       ├── fileIcons.test.ts              # Node test
│       ├── regex.ts
│       └── regex.test.ts                  # Node test
tests/
├── link-checker.test.ts                   # Slow test (skippable)
└── e2e/
    ├── base.spec.ts                       # Playwright
    ├── blog-meta-tags.test.ts
    ├── og-preview-images.spec.ts
    ├── robots.test.ts
    └── sitemap.test.ts
```

## Vitest Configuration

**Multi-project Setup:**

```typescript
// vite.config.ts
test: {
    projects: [
        // Browser tests for Svelte components
        {
            extends: './vite.config.ts',
            test: {
                name: 'browser',
                browser: {
                    enabled: true,
                    headless: true,
                    instances: [
                        {
                            browser: 'chromium',
                            context: {
                                permissions: ['clipboard-write', 'clipboard-read'],
                            },
                        },
                    ],
                    provider: playwright(),
                },
                include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                exclude: ['src/lib/server/**'],
            },
        },
        // Node tests for server/logic
        {
            extends: './vite.config.ts',
            test: {
                name: 'server',
                environment: 'node',
                include: [
                    'src/**/*.{test,spec}.{js,ts}',
                    'tests/**/*.{test,spec}.{js,ts}',
                ],
                exclude: [
                    'src/**/*.svelte.{test,spec}.{js,ts}',
                    'tests/e2e/**/*.{test,spec}.{js,ts}',
                ],
            },
        },
    ],
}
```

**Skip Slow Tests:**

```bash
VITEST_SKIP_SLOW=true vitest --run
```

## Test Structure

**Unit Test Pattern:**

```typescript
import { describe, it, expect } from 'vitest';
import { readingTime } from '$lib/data/posts';

describe('readingTime', () => {
    it('should calculate reading time for short text', () => {
        const text = 'This is a short text with exactly ten words here.';
        const result = readingTime(text);

        expect(result.minutes).toBe(1);
        expect(result.text).toBe('1 min read');
    });

    it('should handle empty string', () => {
        const result = readingTime('');

        expect(result.minutes).toBe(1);
        expect(result.text).toBe('1 min read');
    });
});
```

**Component Test Pattern:**

```typescript
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CodeBlock from './CodeBlock.svelte';

describe('CodeBlock Component', () => {
    beforeEach(() => {
        vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    });

    test('renders code block with filename', async () => {
        const screen = render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await expect.element(screen.getByTestId('code-filename')).toHaveTextContent('example.js');
    });
});
```

**Playwright E2E Pattern:**

```typescript
import { expect, test } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/maxdaten/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
});
```

## Mocking

**Framework:** Vitest's built-in `vi`

**Browser API Mocking:**

```typescript
beforeEach(() => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
});
```

**What to Mock:**

- Browser APIs (clipboard, localStorage)
- External network requests (in slow tests)
- Time-dependent operations

**What NOT to Mock:**

- SvelteKit's internal routing
- Component rendering
- Real filesystem operations in server tests

## Fixtures and Factories

**Test Data Inline:**

```typescript
const validUrls = [
    'https://example.com',
    'http://localhost:3000',
    'https://sub.domain.com/path?query=value',
];

validUrls.forEach((url) => {
    expect(HttpRegex.test(url)).toBe(true);
});
```

**Dynamic Test Data:**

```typescript
// Reading blog posts from filesystem for parameterized tests
const blogPosts = readdirSync(CONTENT_DIR)
    .filter((file) => {
        const content = readFileSync(`${CONTENT_DIR}/${file}`, 'utf-8');
        return file.endsWith('.md') && !content.includes('hidden: true');
    })
    .map((file) => ({
        filename: file,
        slug: basename(file, '.md'),
    }));

for (const post of blogPosts) {
    test(`should have valid meta tags for ${post.slug}`, async ({ page }) => {
        // ...
    });
}
```

**Location:**

- No dedicated fixtures directory
- Test data created inline or read from real content files

## Coverage

**Requirements:** Not enforced (no coverage thresholds configured)

**View Coverage:**

```bash
vitest --coverage
```

## Test Types

**Unit Tests:**

- Pure function testing
- Utility function validation
- Data transformation logic
- Located alongside source files

**Integration Tests:**

- Server-side post importing
- RSS feed generation
- Route handlers

**Component Tests (Browser):**

- Svelte component rendering
- User interactions (clicks)
- DOM state assertions
- Accessibility checks (role queries)

**E2E Tests (Playwright):**

- Full page navigation
- SEO meta tag validation
- Image loading verification
- Cross-browser compatibility
- API endpoint validation (robots.txt, sitemap.xml)

## Common Patterns

**Async Testing:**

```typescript
test('renders copy button', async () => {
    const screen = render(CodeBlock, { filename: 'example.js' });

    await expect.element(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
});
```

**Error Testing:**

```typescript
test('rejects URLs not starting with http', () => {
    const invalidUrls = ['ftp://example.com', 'www.example.com'];

    invalidUrls.forEach((url) => {
        expect(HttpRegex.test(url)).toBe(false);
    });
});
```

**Parameterized Tests:**

```typescript
for (const post of blogPosts) {
    test(`should have valid JSON-LD schemas for ${post.slug}`, async ({ page }) => {
        const response = await page.goto(`/${post.slug}`);
        expect(response?.status()).toBe(200);

        const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
        expect(jsonLdScripts.length).toBeGreaterThan(0);
    });
}
```

**Conditional Skip:**

```typescript
// Skip slow tests when VITEST_SKIP_SLOW is set
describe.skipIf(process.env.VITEST_SKIP_SLOW === 'true')('Blog Articles Link Checker', () => {
    // ...
});

// Skip browser-incompatible tests
test('/sitemap.xml is valid', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Not compatible with WebKit');
    // ...
});
```

**Polling for Async State:**

```typescript
await expect
    .poll(
        async () => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
        {
            message: `Image failed to load: ${imageSrc}`,
            timeout: 20000,
        }
    )
    .toBe(true);
```

## Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
```

## Testing Data Attributes

**Pattern:** Use `data-testid` for test-specific selectors

**Examples:**

```svelte
<div data-testid="code-filename" class="filename">{filename}</div>
<div data-testid="code-lang" class="lang">{lang}</div>
```

**Query:**

```typescript
await expect.element(screen.getByTestId('code-filename')).toHaveTextContent('example.js');
```

---

_Testing analysis: 2026-01-18_
