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

test.describe('holo card follows the input, not the width', () => {
    test.describe('touch tablet at desktop width', () => {
        test.use({
            viewport: { width: 1280, height: 900 },
            hasTouch: true,
            isMobile: true,
        });

        test('tilts with scroll, not hover', async ({ page }) => {
            await page.goto('/en');
            await expect(page.locator('.holo-card')).toHaveClass(/scroll-mode/);
        });
    });

    test.describe('narrow desktop window', () => {
        test.use({ viewport: { width: 800, height: 900 } });

        test('keeps the hover tilt', async ({ page }) => {
            await page.goto('/en');
            const card = page.locator('.holo-card');
            await expect(card).not.toHaveClass(/scroll-mode/);
            await page.locator('.holo-scene').hover();
            await expect(card).toHaveClass(/hovering/);
        });
    });
});
