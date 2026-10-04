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
            // Wait for hydration: a hover before the handlers attach is lost.
            await page.goto('/en', { waitUntil: 'networkidle' });
            const card = page.locator('.holo-card');
            await expect(card).not.toHaveClass(/scroll-mode/);
            await page.locator('.holo-scene').hover();
            await expect(card).toHaveClass(/hovering/);
        });

        test('tilts for a pointer that was already resting on the card', async ({
            page,
        }) => {
            await page.goto('/en', { waitUntil: 'networkidle' });
            // The pointer arrived before hydration: no mouseenter, only moves.
            await page.locator('.holo-scene').evaluate((scene) => {
                const box = scene.getBoundingClientRect();
                scene.dispatchEvent(
                    new MouseEvent('mousemove', {
                        bubbles: true,
                        clientX: box.x + box.width / 2,
                        clientY: box.y + box.height / 2,
                    })
                );
            });
            await expect(page.locator('.holo-card')).toHaveClass(/hovering/);
        });
    });
});

test.describe('smooth scrolling', () => {
    const scrollBehavior = (page: import('@playwright/test').Page) =>
        page.evaluate(
            () => getComputedStyle(document.documentElement).scrollBehavior
        );

    test('smooths in-page jumps by default', async ({ page }) => {
        await page.goto('/en');
        expect(await scrollBehavior(page)).toBe('smooth');
    });

    test.describe('under reduced motion', () => {
        test.use({ reducedMotion: 'reduce' });

        test('jumps instantly', async ({ page }) => {
            await page.goto('/en');
            expect(await scrollBehavior(page)).toBe('auto');
        });
    });
});
