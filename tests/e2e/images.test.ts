import { expect, test } from '@playwright/test';

// Avatars render at 36px or smaller; anything near the 1024px source is wasted bandwidth.
const MAX_AVATAR_BYTES = 20_000;

test('post avatars are served at display size', async ({ page, request }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a.blog-post-card').first();
    await page.goto((await firstPost.getAttribute('href'))!);

    const avatars = page.locator('img.avatar-inline, img.avatar');
    await expect(avatars.first()).toBeVisible();

    for (const src of await avatars.evaluateAll((imgs) =>
        imgs.map(
            (img) =>
                (img as HTMLImageElement).currentSrc ||
                (img as HTMLImageElement).src
        )
    )) {
        const response = await request.get(src);
        const bytes = (await response.body()).length;
        expect(bytes, `${src} is ${bytes} bytes`).toBeLessThan(
            MAX_AVATAR_BYTES
        );
    }
});

for (const path of ['/', '/en']) {
    test(`hero portrait on ${path} loads eagerly with high priority`, async ({
        page,
    }) => {
        await page.goto(path);

        const hero = page.locator('img.avatar-image');
        await expect(hero).toHaveAttribute('loading', 'eager');
        await expect(hero).toHaveAttribute('fetchpriority', 'high');
    });
}

const coverPages = [
    ['blog covers', '/blog', 'a.blog-post-card img'],
    ['gem covers', '/gems', 'a.gem-card img'],
] as const;

for (const [width, dpr] of [
    [412, 1.75],
    [1350, 1],
])
    for (const [name, path, selector] of coverPages) {
        test.describe(`${name} at ${width}px @${dpr}x`, () => {
            test.use({
                viewport: { width, height: 900 },
                deviceScaleFactor: dpr,
            });

            test('download at most 1.3x the rendered device pixels', async ({
                page,
            }) => {
                await page.goto(path, { waitUntil: 'networkidle' });
                await page.$$eval(selector, (imgs) =>
                    imgs.forEach(
                        (img) => ((img as HTMLImageElement).loading = 'eager')
                    )
                );
                await page.waitForLoadState('networkidle');
                const covers = await page.$$eval(selector, (imgs) =>
                    imgs.map((img) => ({
                        rendered:
                            img.getBoundingClientRect().width *
                            devicePixelRatio,
                        downloaded: Number(
                            new URL(
                                (img as HTMLImageElement).currentSrc
                            ).searchParams.get('w')
                        ),
                    }))
                );

                expect(covers.length).toBeGreaterThan(0);
                for (const { rendered, downloaded } of covers) {
                    expect(
                        downloaded,
                        'a resized image (w= parameter)'
                    ).toBeGreaterThan(0);
                    expect(
                        downloaded,
                        `rendered ${Math.round(rendered)}px`
                    ).toBeLessThanOrEqual(Math.ceil(rendered * 1.3));
                }
            });
        });
    }

test('blog index fetches the first cover first and lazy-loads the rest', async ({
    page,
}) => {
    await page.goto('/blog');
    const covers = page.locator('a.blog-post-card img');
    expect(await covers.count()).toBeGreaterThan(1);
    await expect(covers.first()).toHaveAttribute('loading', 'eager');
    await expect(covers.first()).toHaveAttribute('fetchpriority', 'high');
    for (const cover of (await covers.all()).slice(1)) {
        await expect(cover).toHaveAttribute('loading', 'lazy');
        await expect(cover).not.toHaveAttribute('fetchpriority', /./);
    }
});

test('a post cover loads eagerly with high priority', async ({ page }) => {
    await page.goto('/blog');
    await page.goto(
        (await page.locator('a.blog-post-card').first().getAttribute('href'))!
    );
    const cover = page.locator('img.cover-image');
    await expect(cover).toHaveAttribute('loading', 'eager');
    await expect(cover).toHaveAttribute('fetchpriority', 'high');
});
