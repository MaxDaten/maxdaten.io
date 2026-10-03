import { expect, test } from '@playwright/test';

test('/sitemap.xml is valid', async ({ page, browserName }) => {
    test.skip(
        browserName === 'webkit',
        'This test is not compatible with WebKit'
    );
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    // Ensure XML is valid. Playwright parses the XML here and will error if it
    // cannot be parsed.
    const urls = await page.$$eval('url', (urls) =>
        urls.map((url) => ({
            loc: url.querySelector('loc')?.textContent,
            // changefreq: url.querySelector('changefreq')?.textContent, // if you enabled in your sitemap
            // priority: url.querySelector('priority')?.textContent,
        }))
    );

    // Sanity check
    expect(urls.length).toBeGreaterThan(5);

    // Ensure entries are in a valid format.
    for (const url of urls) {
        expect(url.loc).toBeTruthy();
        expect(() => new URL(url.loc!)).not.toThrow();
        // expect(url.changefreq).toBe('daily');
        // expect(url.priority).toBe('0.7');
    }
});

test('/sitemap.xml lists each page on its final host', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>|href="([^"]+)"/g)].map(
        (m) => new URL(m[1] ?? m[2])
    );
    const germanPaths = new Set(['/', '/impressum', '/datenschutz']);

    expect(urls.map((u) => u.href)).toContain('https://www.maxdaten.io/en');
    for (const url of urls) {
        const expectedOrigin = germanPaths.has(url.pathname)
            ? 'https://maxdaten.de'
            : 'https://www.maxdaten.io';
        expect(url.origin, url.href).toBe(expectedOrigin);
    }
});
