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
    for (const path of ['/', '/en', '/blog', '/gems']) {
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
