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
