import { expect, test, type Page } from '@playwright/test';

// Structure that answer engines and crawlers rely on to extract and attribute content.

for (const [path, title] of [
    ['/blog', 'All Blog Posts'],
    ['/gems', 'Gems of Precious Friends'],
]) {
    test(`${path} has one H1 naming the page`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator('h1')).toHaveText([title]);
    });
}

for (const path of ['/', '/en', '/blog']) {
    test(`${path} advertises the RSS feed`, async ({ page }) => {
        await page.goto(path);
        await expect(
            page.locator('link[rel="alternate"][type="application/rss+xml"]')
        ).toHaveAttribute('href', 'https://www.maxdaten.io/rss.xml');
    });
}

test('post headings contain only their own text', async ({ page }) => {
    await page.goto('/2026-01-31-ship-your-toolchain-not-just-infrastructure');
    const headings = await page
        .locator('article h2, article h3')
        .allTextContents();

    expect(headings.length).toBeGreaterThan(0);
    for (const text of headings) {
        expect(text.trim()).not.toMatch(/^#/);
    }
});

test('/about/jloos sends one consistent set of meta tags', async ({ page }) => {
    await page.goto('/about/jloos');

    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(1);
    await expect(robots).toHaveAttribute('content', /noindex/);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page).toHaveTitle(
        'Jan-Philip Loos - Trading Card | maxdaten.io'
    );
});

type Schema = Record<string, unknown> & { '@type'?: string; '@id'?: string };

async function jsonLd(page: Page, path: string): Promise<Schema[]> {
    await page.goto(path);
    const scripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
    return scripts.flatMap((s) => {
        const parsed = JSON.parse(s);
        return parsed['@graph'] ?? [parsed];
    });
}

const byType = (graph: Schema[], type: string) =>
    graph.find((s) => s['@type'] === type);

test('JSON-LD names each entity the same in both languages', async ({
    page,
}) => {
    const de = await jsonLd(page, '/');
    const en = await jsonLd(page, '/en');

    for (const type of ['WebSite', 'Organization', 'ProfessionalService']) {
        const [deEntity, enEntity] = [byType(de, type), byType(en, type)];
        expect(deEntity?.name, type).toBe('maxdaten.io');
        expect(deEntity?.name, type).toBe(enEntity?.name);
        expect(deEntity?.url, type).toBe(enEntity?.url);
    }
});

test('JSON-LD Person carries an image, expertise and real profiles', async ({
    page,
}) => {
    const person = byType(await jsonLd(page, '/en'), 'Person');

    expect(person?.image).toMatch(/^https:\/\/www\.maxdaten\.io\//);
    expect(person?.knowsAbout).toEqual(expect.arrayContaining(['Kubernetes']));
    expect(person?.sameAs).toContain('https://github.com/MaxDaten');
    expect(JSON.stringify(person?.sameAs)).not.toContain('signal.me');
});

test('a post has breadcrumbs and a modified date', async ({ page }) => {
    const slug = '2026-01-31-ship-your-toolchain-not-just-infrastructure';
    const graph = await jsonLd(page, `/${slug}`);

    const breadcrumbs = byType(graph, 'BreadcrumbList');
    expect(breadcrumbs?.itemListElement).toEqual([
        expect.objectContaining({
            position: 1,
            item: 'https://www.maxdaten.io/en',
        }),
        expect.objectContaining({
            position: 2,
            item: 'https://www.maxdaten.io/blog',
        }),
        expect.objectContaining({
            position: 3,
            item: `https://www.maxdaten.io/${slug}`,
        }),
    ]);
    const posting = byType(graph, 'BlogPosting');
    expect(posting?.dateModified).toBeTruthy();
    expect(posting?.dateModified).not.toBe(posting?.datePublished);
});

test('/llms.txt summarises the site for answer engines', async ({
    request,
}) => {
    const response = await request.get('/llms.txt');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^text\/plain/);
    const text = await response.text();
    expect(text).toMatch(/^# Jan-Philip Loos\n/);
    expect(text).toContain(
        '(https://www.maxdaten.io/2026-01-31-ship-your-toolchain-not-just-infrastructure)'
    );
});

test('/llms-full.txt carries the full post text', async ({ request }) => {
    const response = await request.get('/llms-full.txt');

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('# Ship Your Toolchain, Not Just Infrastructure');
    expect(text).toContain('## OpenSSL: Version Drift in the Fields');
});
