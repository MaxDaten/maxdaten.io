import { expect, test } from '@playwright/test';

test('/rss.xml carries inline post images', async ({ request }) => {
    const xml = await (await request.get('/rss.xml')).text();

    expect(xml).toMatch(
        /<figure><img src="https:\/\/cdn\.sanity\.io\/images\/[^"]+" alt="[^"]+" \/>/
    );
});

test('/rss.xml names its language and last change', async ({ request }) => {
    const xml = await (await request.get('/rss.xml')).text();
    const channel = xml.slice(0, xml.indexOf('<item>'));

    expect(channel).toContain('<language>en</language>');
    const lastBuild = channel.match(
        /<lastBuildDate>([^<]+)<\/lastBuildDate>/
    )?.[1];
    expect(Number.isNaN(Date.parse(lastBuild ?? ''))).toBe(false);
});
