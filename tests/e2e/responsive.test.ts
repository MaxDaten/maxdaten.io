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

for (const width of [920, 1000, 1100, 1280]) {
    test.describe(`two-column hero at ${width}px`, () => {
        test.use({ viewport: { width, height: 900 } });

        test('shares the row between headline and card', async ({ page }) => {
            await page.goto('/en');
            const box = async (selector: string) =>
                (await page.locator(selector).first().boundingBox())!;
            const grid = await box('.hero-grid');
            const content = await box('.hero-grid .content');
            const column = await box('.card-column');
            const card = await box('.holo-card');

            expect(content.width).toBeGreaterThanOrEqual(grid.width * 0.4);
            expect(card.x).toBeGreaterThanOrEqual(column.x - 1);
            expect(card.x + card.width).toBeLessThanOrEqual(column.x + column.width + 1);
        });
    });
}

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

test.describe('long URLs in post content', () => {
    test.use({ viewport: { width: 320, height: 800 } });

    test('wrap inside list items, paragraphs and callouts', async ({
        page,
    }) => {
        // A post with lists and callouts; the long URL is injected so the check doesn't depend on
        // whatever a post happens to contain today.
        await page.goto('/blog');
        const posts = await page
            .locator('a.blog-post-card')
            .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
        let post: string | undefined;
        for (const path of posts) {
            await page.goto(path);
            if (
                (await page
                    .locator(
                        '.content aside.callout li, .content aside.callout p'
                    )
                    .count()) > 0 &&
                (await page.locator('.content li').count()) > 0
            ) {
                post = path;
                break;
            }
        }
        expect(post, 'a post with a callout and a list').toBeDefined();

        const overflowing = await page.evaluate(() => {
            const url = `https://example.com/${'averylongpathsegment'.repeat(10)}end`;
            // Measure the text itself: a block's box keeps its width while its text spills out.
            const range = document.createRange();
            const targets = [
                document.querySelector('.content li'),
                document.querySelector('.content p'),
                document.querySelector('.content aside.callout li') ??
                    document.querySelector('.content aside.callout p'),
            ];
            const width = document.documentElement.clientWidth;
            return targets.flatMap((el) => {
                if (!el) return ['missing target'];
                const text = document.createTextNode(` ${url}`);
                el.append(text);
                range.selectNodeContents(text);
                const box = range.getBoundingClientRect();
                return box.right > width + 1
                    ? [
                          `${el.tagName.toLowerCase()} ends at ${Math.round(box.right)}px`,
                      ]
                    : [];
            });
        });
        expect(overflowing).toEqual([]);
    });
});
