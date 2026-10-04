import { expect, test } from '@playwright/test';

/**
 * body { overflow-x: hidden } hides anything wider than the viewport instead of letting the page
 * scroll, so overflow shows up as controls that silently vanish. Check them directly.
 */
async function offscreenControls(page: import('@playwright/test').Page) {
    return page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return [...document.querySelectorAll('a, button')]
            .filter((el) => {
                const style = getComputedStyle(el);
                if (style.visibility === 'hidden' || style.display === 'none') return false;
                if (el.getAttribute('tabindex') === '-1') return false;
                const box = el.getBoundingClientRect();
                if (box.width === 0 || box.height === 0) return false;
                return box.left < -1 || box.right > width + 1;
            })
            .map((el) => `${el.tagName} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim()}"`);
    });
}

for (const width of [320, 360, 375]) {
    test.describe(`no controls clipped at ${width}px`, () => {
        test.use({ viewport: { width, height: 800 } });

        for (const path of ['/', '/en', '/blog', '/gems']) {
            test(path, async ({ page }) => {
                await page.goto(path);
                expect(await offscreenControls(page)).toEqual([]);
            });
        }
    });
}
