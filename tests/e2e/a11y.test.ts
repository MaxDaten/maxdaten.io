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

/** Contrast of `selector`'s text (or its `pseudo` element's) against its background, composited from
 * the translucent background colours of its ancestors. axe skips pseudo-element text and gives up
 * on translucent layers, so these elements need their own check. */
async function contrastOf(
    page: import('@playwright/test').Page,
    selector: string,
    pseudo: string | null = null
) {
    return page
        .locator(selector)
        .first()
        .evaluate((el, pseudo) => {
            const rgba = (value: string) => {
                const [r, g, b, a = 1] = value.match(/[\d.]+/g)!.map(Number);
                return { r, g, b, a };
            };
            type Rgba = ReturnType<typeof rgba>;
            const over = (top: Rgba, bottom: Rgba): Rgba => ({
                r: top.r * top.a + bottom.r * (1 - top.a),
                g: top.g * top.a + bottom.g * (1 - top.a),
                b: top.b * top.a + bottom.b * (1 - top.a),
                a: 1,
            });
            const layers: Rgba[] = [];
            for (let n: Element | null = el; n; n = n.parentElement) {
                const bg = rgba(getComputedStyle(n).backgroundColor);
                if (bg.a > 0) layers.push(bg);
                if (bg.a === 1) break;
            }
            const background = layers.reduceRight(over, {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
            });
            const text = over(
                rgba(getComputedStyle(el, pseudo).color),
                background
            );
            const luminance = ({ r, g, b }: Rgba) => {
                const [R, G, B] = [r, g, b].map((c) => {
                    c /= 255;
                    return c <= 0.03928
                        ? c / 12.92
                        : ((c + 0.055) / 1.055) ** 2.4;
                });
                return 0.2126 * R + 0.7152 * G + 0.0722 * B;
            };
            const [hi, lo] = [luminance(text), luminance(background)].sort(
                (a, b) => b - a
            );
            return (hi + 0.05) / (lo + 0.05);
        }, pseudo);
}

test.describe('colour contrast axe cannot check (WCAG AA)', () => {
    test('profile card footer', async ({ page }) => {
        await page.goto('/en');
        expect(await contrastOf(page, '.card-footer')).toBeGreaterThanOrEqual(
            4.5
        );
    });

    test('code line numbers', async ({ page }) => {
        await page.goto('/blog');
        const posts = await page
            .locator('a.blog-post-card')
            .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
        let checked = 0;
        for (const post of posts) {
            await page.goto(post);
            const numbered = '.show-line-numbers .line';
            if ((await page.locator(numbered).count()) === 0) continue;
            expect(
                await contrastOf(page, numbered, '::before'),
                post
            ).toBeGreaterThanOrEqual(4.5);
            if (++checked === 2) break;
        }
        expect(checked).toBeGreaterThan(0);
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

    for (const [path, rss, github] of [
        ['/', 'RSS-Feed abonnieren', 'GitHub-Profil'],
        ['/en', 'Subscribe to the RSS feed', 'GitHub profile'],
    ]) {
        test(`icon links on ${path} have names in the page language`, async ({
            page,
        }) => {
            await page.goto(path);
            await expect(
                page.locator('header').getByRole('link', { name: rss })
            ).toBeVisible();
            const footer = page.locator('footer');
            await expect(footer.getByRole('link', { name: rss })).toBeVisible();
            await expect(
                footer.getByRole('link', { name: github })
            ).toBeVisible();

            const icons = page.locator('.socials a, a[href$="rss.xml"]');
            expect(await icons.count()).toBeGreaterThan(3);
            for (const link of await icons.all()) {
                await expect(link).toHaveAttribute('aria-label', /\S/);
                await expect(link.locator('svg')).toHaveAttribute(
                    'aria-hidden',
                    'true'
                );
            }
            // The mail app opens itself; a blank tab would be left behind.
            for (const mail of await page.locator('a[href^="mailto:"]').all())
                await expect(mail).not.toHaveAttribute('target', /./);
        });
    }

    test('callouts announce their type, not just colour and icon', async ({
        page,
    }) => {
        await page.goto('/blog');
        const posts = await page
            .locator('a.blog-post-card')
            .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
        let checked = 0;
        for (const post of posts) {
            await page.goto(post);
            for (const callout of await page
                .locator('aside.callout:not(.default)')
                .all()) {
                await expect(
                    callout.locator('.content > .visually-hidden')
                ).toHaveText(/^(Info|Warning|Error|Success|Tip):$/);
                await expect(callout.locator('.icon')).toHaveAttribute(
                    'aria-hidden',
                    'true'
                );
                checked++;
            }
        }
        expect(checked).toBeGreaterThan(0);
    });
});
