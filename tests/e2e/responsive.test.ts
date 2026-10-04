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

test.describe('touch targets on phones', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

    const sizes = (page: import('@playwright/test').Page, selector: string) =>
        page.$$eval(selector, (els) =>
            els.map((el) => {
                const box = el.getBoundingClientRect();
                return {
                    name: (el.getAttribute('aria-label') ?? el.getAttribute('title') ?? el.textContent ?? '').trim(),
                    width: Math.round(box.width),
                    height: Math.round(box.height),
                };
            })
        );

    test('footer icon links are at least 44x44px', async ({ page }) => {
        await page.goto('/en');
        const icons = await sizes(page, 'footer .socials a');
        expect(icons.length).toBeGreaterThan(0);
        for (const icon of icons) {
            expect(icon.width, icon.name).toBeGreaterThanOrEqual(44);
            expect(icon.height, icon.name).toBeGreaterThanOrEqual(44);
        }
    });

    test('language switcher and legal links are at least 44px tall', async ({ page }) => {
        await page.goto('/en');
        const links = await sizes(page, '.language-switcher a, footer .legal a');
        expect(links.length).toBeGreaterThanOrEqual(4);
        for (const link of links) {
            expect(link.height, link.name).toBeGreaterThanOrEqual(44);
            expect(link.width, link.name).toBeGreaterThanOrEqual(24);
        }
    });
});

test('text scales with the browser default font size', async ({ page }) => {
    // A reader who raises the default font size from 16px to 20px expects 25% larger text.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 20 } });
    await page.goto('/en');
    const rootSize = await page.evaluate(
        () => getComputedStyle(document.documentElement).fontSize
    );
    expect(rootSize).toBe('22.5px');
    // The hero lead is 20px at the default size
    await expect(page.locator('.subheadline')).toHaveCSS('font-size', '25px');
});

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
