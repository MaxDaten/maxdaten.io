import { expect, test } from '@playwright/test';

/** Whether any loaded stylesheet has a rule for the post-body `.prose` typography. */
const hasProseCss = (page: import('@playwright/test').Page) =>
    page.evaluate(() =>
        [...document.styleSheets].some((sheet) =>
            [...sheet.cssRules].some((rule) => rule.cssText.includes('.prose'))
        )
    );

test('post typography loads with posts only', async ({ page }) => {
    for (const path of ['/en', '/blog', '/gems']) {
        await page.goto(path);
        expect(await hasProseCss(page), path).toBe(false);
    }

    await page.goto('/blog');
    await page.goto(
        (await page.locator('a.blog-post-card').first().getAttribute('href'))!
    );
    expect(await hasProseCss(page)).toBe(true);
    await expect(page.locator('.prose')).toHaveCount(1);
});
