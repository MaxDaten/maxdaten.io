// Invoke the built Vercel function bundle (what production runs) for endpoints rendered at
// request time. Unlike `vite preview` or the dev server, the bundle only contains files that
// Vercel's tracing picked up, so missing runtime files fail here instead of in production.
// Usage: npm run build && node scripts/smoke-vercel-functions.mjs
import { realpathSync } from 'node:fs';

const fn = realpathSync('.vercel/output/functions/![-]/catchall.func');
process.chdir(fn); // Vercel runs the handler from the function root
const { default: handler } = await import(
    `${fn}/.svelte-kit/vercel-tmp/index.js`
);

const checks = [
    ['/og.jpg', 'image/jpeg'],
    ['/og.jpg?locale=de', 'image/jpeg'],
    [
        '/2026-01-31-ship-your-toolchain-not-just-infrastructure/og.jpg',
        'image/jpeg',
    ],
];

let failed = 0;
for (const [path, type] of checks) {
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
    const ok = status === 200 && contentType === type;
    if (!ok) failed++;
    console.log(
        `${ok ? 'ok  ' : 'FAIL'} ${status} ${contentType ?? ''} ${path}`
    );
}
process.exit(failed ? 1 : 0);
