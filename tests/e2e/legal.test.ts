import { expect, test } from '@playwright/test';

test.describe('Datenschutzerklärung', () => {
    test('names every third party that receives visitor data', async ({
        page,
    }) => {
        const response = await page.goto('/datenschutz');

        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toHaveText('Datenschutzerklärung');
        const main = page.locator('main');
        await expect(main).toContainText('Vercel Inc.');
        await expect(main).toContainText('Sanity');
        await expect(main).toContainText('Data Privacy Framework');
    });
});

test.describe('Footer', () => {
    for (const path of ['/', '/en', '/blog']) {
        test(`links to both legal pages on ${path}`, async ({ page }) => {
            await page.goto(path);

            const footer = page.locator('footer');
            await expect(footer.locator('a[href="/impressum"]')).toBeVisible();
            await expect(
                footer.locator('a[href="/datenschutz"]')
            ).toBeVisible();
        });
    }
});
