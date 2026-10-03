import { expect, test } from '@playwright/test';

async function firstPostPath(page: import('@playwright/test').Page) {
    await page.goto('/blog');
    return (await page
        .locator('a.blog-post-card')
        .first()
        .getAttribute('href'))!;
}

test('code blocks are highlighted in the server-rendered HTML', async ({
    browser,
    page,
}) => {
    const path = await firstPostPath(page);
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await noJs.newPage();
    await staticPage.goto(path);

    await expect(
        staticPage.locator('pre.shiki span[style*="color"]').first()
    ).toBeAttached();
    await noJs.close();
});

test('posts do not download Shiki in the browser', async ({ page }) => {
    const path = await firstPostPath(page);
    const wasm: string[] = [];
    page.on('request', (r) => {
        if (/\.wasm|onig|shiki/i.test(r.url())) wasm.push(r.url());
    });
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.locator('pre.shiki').first()).toBeVisible();
    expect(wasm).toEqual([]);
});
