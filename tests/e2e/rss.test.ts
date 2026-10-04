import { expect, test } from '@playwright/test';

test('/rss.xml carries inline post images', async ({ request }) => {
    const xml = await (await request.get('/rss.xml')).text();

    expect(xml).toMatch(
        /<figure><img src="https:\/\/cdn\.sanity\.io\/images\/[^"]+" alt="[^"]+" \/>/
    );
});
