// Check the built Vercel output (what production serves), which neither `vite preview` nor the
// dev server reflects:
// - prerendered OG images exist as static JPEGs: one per home locale and one per post;
// - the function bundle, which only contains files Vercel's tracing picked up, still answers
//   at request time, so missing runtime files fail here instead of in production.
// Usage: npm run build && node scripts/smoke-vercel-functions.mjs
import { readFileSync, realpathSync } from 'node:fs';

const staticDir = realpathSync('.vercel/output/static');
let failed = 0;
const report = (ok, line) => {
    if (!ok) failed++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${line}`);
};

// Every post listed in the sitemap needs a prerendered OG image.
const sitemap = readFileSync(`${staticDir}/sitemap.xml`, 'utf8');
const posts = [
    ...sitemap.matchAll(/<loc>https:\/\/www\.maxdaten\.io\/([^/<]+)<\/loc>/g),
]
    .map((m) => m[1])
    .filter((slug) => !['en', 'blog', 'gems'].includes(slug));
report(posts.length >= 5, `${posts.length} posts in the sitemap`);

for (const path of [
    '/og/de.jpg',
    '/og/en.jpg',
    ...posts.map((slug) => `/${slug}/og.jpg`),
]) {
    let bytes;
    try {
        bytes = readFileSync(`${staticDir}${path}`);
    } catch {
        report(false, `static ${path} missing`);
        continue;
    }
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    report(isJpeg && bytes.length > 20_000, `static ${path} ${bytes.length} B`);
}

const fn = realpathSync('.vercel/output/functions/![-]/catchall.func');
process.chdir(fn); // Vercel runs the handler from the function root
const { default: handler } = await import(
    `${fn}/.svelte-kit/vercel-tmp/index.js`
);

for (const [path, expected, type] of [
    ['/og.jpg/preview', 200, 'text/html'],
    ['/no-such-post/og.jpg', 404],
]) {
    let status, contentType;
    try {
        const response = await handler.fetch(
            new Request(`https://www.maxdaten.io${path}`)
        );
        ({ status } = response);
        contentType = response.headers.get('content-type');
    } catch (error) {
        status = `threw ${error.message}`;
    }
    const ok = status === expected && (!type || contentType?.startsWith(type));
    report(ok, `function ${status} ${contentType ?? ''} ${path}`);
}
process.exit(failed ? 1 : 0);
