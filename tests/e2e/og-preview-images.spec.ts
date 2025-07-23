import { expect, test } from '@playwright/test';

test.describe('OG Preview Images', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/og-preview');
        await expect(page.locator('.og-preview-header h1')).toContainText(
            'OG Images Preview'
        );
        await expect(page.locator('.og-grid')).toBeVisible();
    });

    test('all images load correctly', async ({ page }) => {
        const imageLocators = await page
            .locator('.og-image-container img')
            .all();
        expect(
            imageLocators.length,
            'Should find images to test'
        ).toBeGreaterThan(0);
        console.log(`Found ${imageLocators.length} OG images to test`);

        const imageLoadTasks = imageLocators.map(async (image) => {
            await image.scrollIntoViewIfNeeded();
            await expect(image).toBeVisible({ timeout: 15000 });
            const imageSrc = await image.getAttribute('src');
            expect(imageSrc, 'Image should have a src attribute.').toBeTruthy();

            await expect
                .poll(
                    async () =>
                        image.evaluate(
                            (img: HTMLImageElement) =>
                                img.complete && img.naturalWidth > 0
                        ),
                    {
                        message: `Image failed to load: ${imageSrc}`,
                        timeout: 20000,
                    }
                )
                .toBe(true);
        });

        await Promise.all(imageLoadTasks);
    });

    test('page has expected structure', async ({ page }) => {
        await expect(page).toHaveTitle(/OG Images Preview/);
        await expect(page.locator('.og-preview-container')).toBeVisible();

        const firstCard = page.locator('.og-card').first();
        await expect(firstCard).toBeVisible();
        await expect(firstCard.locator('.og-image-container')).toBeVisible();
        await expect(firstCard.locator('.og-card-info')).toBeVisible();
        await expect(firstCard.locator('h3 a')).toBeVisible();
        await expect(firstCard.locator('.og-card-links')).toBeVisible();
    });

    test('OG image links are correct', async ({ page }) => {
        const firstCard = page.locator('.og-card').first();
        await expect(firstCard).toBeVisible();

        const ogLink = firstCard.locator('.og-link');
        await expect(ogLink).toBeVisible();
        await expect(ogLink).toHaveAttribute('href', /.*\/og\.png$/);

        const previewLink = firstCard.locator('.preview-link');
        await expect(previewLink).toBeVisible();
        await expect(previewLink).toHaveAttribute(
            'href',
            /.*\/og\.png\/preview$/
        );
    });
});
