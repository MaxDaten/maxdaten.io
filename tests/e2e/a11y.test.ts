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
});
