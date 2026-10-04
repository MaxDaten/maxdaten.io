// Check production after a deploy: host redirects, language and canonical per page, security
// headers, and the prerendered files answer engines and social cards rely on.
// Usage: node scripts/prod-check.mjs
const post = '/2026-01-31-ship-your-toolchain-not-just-infrastructure';
const io = 'https://www.maxdaten.io';
const de = 'https://maxdaten.de';

// [url, expected status, expected Location]
const redirects = [
    ['https://www.maxdaten.de/', 308, `${de}/`],
    [`${de}/blog`, 308, `${io}/blog`],
    [`${de}/en`, 308, `${io}/en`],
    [`${de}${post}`, 308, `${io}${post}`],
    [`${io}/`, 308, '/en'],
    [`${io}/impressum`, 308, `${de}/impressum`],
];

// [url, lang, canonical]
const pages = [
    [`${de}/`, 'de', `${de}/`],
    [`${io}/en`, 'en', `${io}/en`],
    [`${io}/blog`, 'en', `${io}/blog`],
    [`${io}${post}`, 'en', `${io}${post}`],
    [`${io}/about/jloos`, 'en', `${io}/about/jloos`],
    [`${de}/impressum`, 'de', `${de}/impressum`],
];

// [url, content-type prefix]
const files = [
    [`${io}/og/en.jpg`, 'image/jpeg'],
    [`${io}/og/de.jpg`, 'image/jpeg'],
    [`${io}${post}/og.jpg`, 'image/jpeg'],
    [`${io}/llms.txt`, 'text/plain'],
    [`${io}/llms-full.txt`, 'text/plain'],
    [`${de}/sitemap.xml`, 'application/xml'],
    [`${io}/rss.xml`, 'application/xml'],
];

let failed = 0;
const report = (ok, line) => {
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${line}`);
};
const get = (url) => fetch(url, { redirect: 'manual' });

for (const [url, status, location] of redirects) {
    const res = await get(url);
    const got = res.headers.get('location');
    report(
        res.status === status && got === location,
        `${url} → ${res.status} ${got}`
    );
}

for (const [url, lang, canonical] of pages) {
    const res = await get(url);
    const html = await res.text();
    const gotLang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
    const gotCanonical = html.match(
        /<link rel="canonical" href="([^"]+)"/
    )?.[1];
    report(
        res.status === 200 && gotLang === lang && gotCanonical === canonical,
        `${url} ${res.status} lang=${gotLang} canonical=${gotCanonical}`
    );
}

// Social cards and the robots Sitemap line must point at the final host, not the build origin.
const postHtml = await (await get(`${io}${post}`)).text();
const ogImage = postHtml.match(
    /<meta property="og:image" content="([^"]+)"/
)?.[1];
report(ogImage?.startsWith(`${io}/`), `og:image ${ogImage}`);
for (const host of [io, de]) {
    const robots = await (await get(`${host}/robots.txt`)).text();
    report(
        robots.includes(`Sitemap: ${io}/sitemap.xml`),
        `${host}/robots.txt names ${io}/sitemap.xml`
    );
}

const headers = (await get(`${io}/en`)).headers;
report(
    headers.get('content-security-policy')?.includes("frame-ancestors 'none'"),
    'Content-Security-Policy is enforced'
);
report(headers.get('x-content-type-options') === 'nosniff', 'nosniff');

for (const [url, type] of files) {
    const res = await get(url);
    const got = res.headers.get('content-type') ?? '';
    report(
        res.status === 200 && got.startsWith(type),
        `${url} ${res.status} ${got}`
    );
}

process.exit(failed ? 1 : 0);
