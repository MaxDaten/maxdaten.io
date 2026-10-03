import { describe, expect, it } from 'vitest';
import {
    getTransformedRoutes,
    type Redirect,
    type RouteWithSrc,
} from '@vercel/routing-utils';
import vercelConfig from '../vercel.json' with { type: 'json' };

// Compile vercel.json redirects the way Vercel's build does, then match them in order.
const { routes, error } = getTransformedRoutes({
    redirects: vercelConfig.redirects as Redirect[],
});
const redirectRoutes = (routes ?? []).filter(
    (route): route is RouteWithSrc => 'src' in route
);

function redirect(host: string, path: string) {
    for (const route of redirectRoutes) {
        if (!route.headers?.Location) continue;
        const hosts = (route.has ?? []).filter((h) => h.type === 'host');
        if (hosts.some((h) => h.value !== host)) continue;
        const match = new RegExp(route.src).exec(path);
        if (!match) continue;
        const location = route.headers.Location.replace(
            /\$(\d+)/g,
            (_, i: string) => match[Number(i)] ?? ''
        );
        return { status: route.status, location };
    }
    return null;
}

const permanent = [301, 308];

describe('vercel.json redirects', () => {
    it('compiles', () => {
        expect(error).toBeNull();
    });

    it.each([
        ['www.maxdaten.de', '/', 'https://maxdaten.de/'],
        ['www.maxdaten.de', '/impressum', 'https://maxdaten.de/impressum'],
        ['www.maxdaten.io', '/', '/en'],
        ['maxdaten.de', '/en', 'https://www.maxdaten.io/en'],
        ['maxdaten.de', '/blog', 'https://www.maxdaten.io/blog'],
        ['maxdaten.de', '/gems', 'https://www.maxdaten.io/gems'],
        ['maxdaten.de', '/00-uses', 'https://www.maxdaten.io/00-uses'],
        [
            'maxdaten.de',
            '/2026-01-31-ship-your-toolchain-not-just-infrastructure',
            'https://www.maxdaten.io/2026-01-31-ship-your-toolchain-not-just-infrastructure',
        ],
        ['maxdaten.de', '/about/jloos', 'https://www.maxdaten.io/about/jloos'],
    ])('%s%s redirects permanently to %s', (host, path, location) => {
        const result = redirect(host, path);
        expect(result?.location).toBe(location);
        expect(permanent).toContain(result?.status);
    });

    it.each([
        ['maxdaten.de', '/'],
        ['maxdaten.de', '/impressum'],
        ['maxdaten.de', '/datenschutz'],
        ['maxdaten.de', '/404'],
        ['maxdaten.de', '/_app/immutable/entry/start.js'],
        ['maxdaten.de', '/favicons/favicon-32x32.png'],
        ['maxdaten.de', '/scitylana/js/script.js'],
        ['maxdaten.de', '/sitemap.xml'],
        ['maxdaten.de', '/robots.txt'],
        ['maxdaten.de', '/rss.xml'],
        ['maxdaten.de', '/og/de.jpg'],
        ['maxdaten.de', '/2026-01-31-ship/og.jpg'],
        ['www.maxdaten.io', '/en'],
        ['www.maxdaten.io', '/blog'],
        ['www.maxdaten.io', '/impressum'],
    ])('%s%s is served without a redirect', (host, path) => {
        expect(redirect(host, path)).toBeNull();
    });
});
