import { expect, test } from '@playwright/test';

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
