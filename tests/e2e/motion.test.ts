import { expect, test } from '@playwright/test';

const sparkles = '.sparkle-wrapper .sparkle';

test.describe('hero sparkles under reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('never appear, even on focus', async ({ page }) => {
        await page.goto('/en');
        await page.locator('.ctas a').first().focus();
        await page.waitForTimeout(1200);
        await expect(page.locator(sparkles)).toHaveCount(0);
    });
});

test.describe('hero sparkles (WCAG 2.2.2)', () => {

    test('stop on their own within five seconds', async ({ page }) => {
        await page.goto('/en');
        await expect(page.locator(sparkles).first()).toBeAttached();
        await page.waitForTimeout(5500);
        await expect(page.locator(sparkles)).toHaveCount(0);
    });

    test('return while the call to action has focus', async ({ page }) => {
        await page.goto('/en');
        await page.waitForTimeout(5500);
        await page.locator('.ctas a').first().focus();
        await expect(page.locator(sparkles).first()).toBeAttached();
    });
});
