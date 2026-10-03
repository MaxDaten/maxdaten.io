import { expect, test } from '@playwright/test';

// The OG image endpoints render at request time, so nothing else exercises them.
for (const path of [
    '/og.jpg',
    '/og.jpg?locale=de',
    '/2026-01-31-ship-your-toolchain-not-just-infrastructure/og.jpg',
]) {
    test(`${path} renders a JPEG`, async ({ request }) => {
        const response = await request.get(path);

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toBe('image/jpeg');
        expect((await response.body()).length).toBeGreaterThan(20_000);
    });
}

test('an unknown post has no OG image', async ({ request }) => {
    const response = await request.get('/no-such-post/og.jpg');

    expect(response.status()).toBe(404);
});
