import { expect, test } from '@playwright/test';

for (const path of ['/en', '/blog']) {
    test(`${path} preloads the three latin faces it renders`, async ({
        page,
    }) => {
        const fetched: string[] = [];
        page.on('request', (request) => {
            if (request.resourceType() === 'font') fetched.push(request.url());
        });
        await page.goto(path, { waitUntil: 'networkidle' });

        const preloads = await page
            .locator('link[rel="preload"][as="font"]')
            .evaluateAll((links) =>
                links.map((l) => (l as HTMLLinkElement).href)
            );
        expect(preloads).toHaveLength(3);
        // Every font the page fetches is a preloaded latin face, fetched once.
        expect([...new Set(fetched)].sort()).toEqual([...preloads].sort());
        for (const url of fetched) expect(url).toMatch(/-latin-/);

        const loaded = await page.evaluate(async () => {
            await document.fonts.ready;
            return [...document.fonts]
                .filter((font) => font.status === 'loaded')
                .map((font) => font.family.replaceAll('"', ''));
        });
        expect(new Set(loaded)).toEqual(
            new Set([
                'Inter Variable',
                'Space Grotesk Variable',
                'JetBrains Mono',
            ])
        );
    });
}
