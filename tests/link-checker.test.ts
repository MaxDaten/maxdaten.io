import { createClient } from '@sanity/client';
import { describe, expect, it } from 'vitest';

// Public values (they ship in the client bundle); CI and devenv set them, the fallbacks keep
// the test runnable anywhere.
const sanity = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? 'hvsy54ho',
    dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2025-02-19',
    useCdn: true,
});

// Every external link in published post bodies and every gem URL.
const LINKS_QUERY = `{
  "posts": *[_type == "post"]{ "source": slug.current, "urls": body[].markDefs[_type == "link"].href },
  "gems": *[_type == "gem"]{ "source": "gem: " + title, "urls": [url] }
}`;

// Sites that block automated requests but are reliable.
const ALLOWLISTED = [
    'notion.so',
    'oracle.com',
    'linkedin.com',
    'microsoft.com',
    'apple.com',
];
// Own side projects that may be offline; warn instead of failing.
const KNOWN_PROJECTS = ['qwiz.buzz', 'cv.maxdaten.io'];

const HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (compatible; Link-Checker/1.0; +https://maxdaten.io)',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

async function check(url: string): Promise<string | null> {
    const request = (method: string) =>
        fetch(url, {
            method,
            headers: HEADERS,
            signal: AbortSignal.timeout(10_000),
        });
    try {
        let response = await request('HEAD');
        // Some servers reject HEAD; retry with GET before calling the link dead.
        if (!response.ok) response = await request('GET');
        return response.ok ? null : `HTTP ${response.status}`;
    } catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
}

describe.skipIf(process.env.VITEST_SKIP_SLOW === 'true')(
    'Sanity content link checker',
    () => {
        it('has no dead external links in posts and gems', async () => {
            const { posts, gems } =
                await sanity.fetch<
                    Record<
                        'posts' | 'gems',
                        { source: string; urls: (string | null)[] | null }[]
                    >
                >(LINKS_QUERY);

            const sourcesByUrl = new Map<string, string[]>();
            for (const { source, urls } of [...posts, ...gems]) {
                for (const url of urls ?? []) {
                    if (
                        !url ||
                        !/^https?:\/\//.test(url) ||
                        /localhost|127\.0\.0\.1/.test(url)
                    )
                        continue;
                    sourcesByUrl.set(url, [
                        ...(sourcesByUrl.get(url) ?? []),
                        source,
                    ]);
                }
            }
            // Guards against the previous version's failure mode: scanning nothing and passing.
            expect(
                sourcesByUrl.size,
                'no links found in Sanity content'
            ).toBeGreaterThan(10);

            const urls = [...sourcesByUrl.keys()].filter(
                (u) => !ALLOWLISTED.some((s) => u.includes(s))
            );
            const dead: string[] = [];
            for (let i = 0; i < urls.length; i += 8) {
                const batch = urls.slice(i, i + 8);
                const results = await Promise.all(batch.map(check));
                batch.forEach((url, j) => {
                    const error = results[j];
                    if (!error) return;
                    if (KNOWN_PROJECTS.some((s) => url.includes(s))) {
                        console.warn(
                            `Known project unreachable: ${url} (${error})`
                        );
                        return;
                    }
                    dead.push(
                        `${url} (${error}) in ${sourcesByUrl.get(url)!.join(', ')}`
                    );
                });
            }

            console.log(
                `Checked ${urls.length} links from ${posts.length} posts and ${gems.length} gems.`
            );
            expect(dead, `dead links:\n${dead.join('\n')}`).toEqual([]);
        }, 180_000);
    }
);
