import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function firstPostPath(page: import('@playwright/test').Page) {
    await page.goto('/blog');
    return (await page
        .locator('a.blog-post-card')
        .first()
        .getAttribute('href'))!;
}

test.describe('colour contrast (WCAG AA)', () => {
    for (const path of ['/', '/en', '/blog', '/gems', '/about/jloos']) {
        test(path, async ({ page }) => {
            await page.goto(path);
            const { violations } = await new AxeBuilder({ page })
                .withRules(['color-contrast'])
                .analyze();
            expect(
                violations.flatMap((v) =>
                    v.nodes.map((n) => n.target.join(' '))
                )
            ).toEqual([]);
        });
    }

    test('a post with code', async ({ page }) => {
        await page.goto(await firstPostPath(page));
        const { violations } = await new AxeBuilder({ page })
            .withRules(['color-contrast'])
            .analyze();
        expect(
            violations.flatMap((v) =>
                v.nodes.map((n) => `${n.target.join(' ')}: ${n.failureSummary}`)
            )
        ).toEqual([]);
    });
});

test.describe('keyboard and labelling', () => {
    test('focusable elements are not hidden and names match visible labels', async ({
        page,
    }) => {
        for (const path of ['/en', await firstPostPath(page)]) {
            await page.goto(path);
            const { violations } = await new AxeBuilder({ page })
                .withRules(['aria-hidden-focus', 'label-content-name-mismatch'])
                .analyze();
            expect(
                violations.map((v) => `${path}: ${v.id} (${v.nodes.length})`)
            ).toEqual([]);
        }
    });

    for (const [path, label] of [
        ['/', 'Zum Inhalt springen'],
        ['/en', 'Skip to content'],
    ]) {
        test(`first Tab on ${path} reaches a skip link to the main content`, async ({
            page,
        }) => {
            await page.goto(path);
            await page.keyboard.press('Tab');

            const focused = page.locator(':focus');
            await expect(focused).toHaveText(label);
            await expect(focused).toHaveAttribute('href', '#main-content');
            await expect(page.locator('main#main-content')).toHaveCount(1);
        });
    }

    test('every control shows the orange focus ring at full strength', async ({
        page,
    }) => {
        for (const path of ['/en', await firstPostPath(page)]) {
            await page.goto(path);
            let seen = 0;
            const failures: string[] = [];
            // Tab through the page until focus wraps back to the first control.
            for (let i = 0; i < 80; i++) {
                await page.keyboard.press('Tab');
                const ring = await page.evaluate(() => {
                    const el = document.activeElement as HTMLElement | null;
                    if (!el || el === document.body) return null;
                    if (el.dataset.focusSeen) return 'wrapped';
                    el.dataset.focusSeen = 'true';
                    // Read the settled ring, not a frame of its fade-in.
                    for (const a of document.getAnimations())
                        if (a instanceof CSSTransition) a.finish();
                    const style = getComputedStyle(el);
                    // Opacity multiplies down the tree, so a dimmed ancestor dims the ring too.
                    let opacity = 1;
                    for (let n: Element | null = el; n; n = n.parentElement)
                        opacity *= Number(getComputedStyle(n).opacity);
                    return {
                        id: `${el.tagName.toLowerCase()} ${el.getAttribute('href') ?? el.textContent?.trim().slice(0, 30)}`,
                        style: style.outlineStyle,
                        width: parseFloat(style.outlineWidth),
                        color: style.outlineColor,
                        opacity,
                    };
                });
                if (!ring) continue;
                if (ring === 'wrapped') break;
                seen++;
                if (
                    ring.style !== 'solid' ||
                    ring.width < 2 ||
                    ring.color !== 'rgb(255, 128, 0)' ||
                    ring.opacity < 0.9
                )
                    failures.push(`${path}: ${JSON.stringify(ring)}`);
            }
            expect(seen).toBeGreaterThan(5);
            expect(failures).toEqual([]);
        }
    });
});
