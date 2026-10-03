import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

type VercelHeaders = {
    source: string;
    headers: { key: string; value: string }[];
}[];

const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    headers?: VercelHeaders;
};
const siteWide =
    config.headers?.find((h) => h.source === '/(.*)')?.headers ?? [];
const header = (key: string) =>
    siteWide.find((h) => h.key.toLowerCase() === key)?.value;

test('vercel.json sets the baseline security headers site-wide', () => {
    expect(header('x-content-type-options')).toBe('nosniff');
    expect(header('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(header('x-frame-options')).toBe('DENY');
    expect(header('permissions-policy')).toBeTruthy();
    expect(header('content-security-policy')).toContain(
        "frame-ancestors 'none'"
    );
    expect(header('content-security-policy-report-only')).toBeUndefined();
});

// Vercel adds the CSP only in production; inject the same policy here to prove the pages run
// under it.
// Vite's dev server adds its own HMR websocket and inline module scripts, so those are allowed.
const devAllowance = " ws://localhost:* 'unsafe-eval'";

for (const path of [
    '/',
    '/en',
    '/blog',
    '/gems',
    '/about/jloos',
    '/impressum',
    '/datenschutz',
    'first-post',
]) {
    test(`pages run under the enforced CSP: ${path}`, async ({ page }) => {
        const csp = header('content-security-policy')!.replace(
            /(connect-src[^;]*)/,
            `$1${devAllowance}`
        );
        const violations: string[] = [];
        await page.exposeFunction('reportViolation', (v: string) =>
            violations.push(v)
        );
        await page.addInitScript(() =>
            document.addEventListener('securitypolicyviolation', (e) =>
                // @ts-expect-error exposed above
                window.reportViolation(`${e.violatedDirective} ${e.blockedURI}`)
            )
        );
        await page.route('**/*', async (route) => {
            if (route.request().resourceType() !== 'document')
                return route.continue();
            const response = await route.fetch();
            await route.fulfill({
                response,
                headers: {
                    ...response.headers(),
                    'content-security-policy': csp,
                },
            });
        });

        let target = path;
        if (path === 'first-post') {
            await page.goto('/blog');
            target = (await page
                .locator('a.blog-post-card')
                .first()
                .getAttribute('href'))!;
        }
        await page.goto(target, { waitUntil: 'networkidle' });

        expect(violations).toEqual([]);
    });
}
