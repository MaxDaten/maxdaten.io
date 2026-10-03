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
