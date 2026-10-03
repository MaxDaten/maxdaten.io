import { expect, test } from '@playwright/test';

test.describe('Impressum', () => {
    test('is a standalone page citing the DDG, not the repealed TMG', async ({
        page,
    }) => {
        const response = await page.goto('/impressum');

        expect(response?.status()).toBe(200);
        expect(new URL(page.url()).pathname).toBe('/impressum');
        await expect(page.locator('h1')).toHaveText('Impressum');
        await expect(page.locator('main')).toContainText('§ 5 DDG');
        await expect(page.locator('main')).not.toContainText('TMG');
    });

    test('has a working contact email link', async ({ page }) => {
        await page.goto('/impressum');

        const mail = page.locator('main a[href^="mailto:"]');
        await expect(mail).toHaveAttribute('href', 'mailto:jloos@maxdaten.com');
        await expect(mail).toHaveText('jloos@maxdaten.com');
    });

    test('has no blog-post chrome', async ({ page }) => {
        await page.goto('/impressum');

        await expect(page.locator('.reading-time')).toHaveCount(0);
        await expect(page.locator('.date-header')).toHaveCount(0);
    });
});

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
