import { test, expect } from '@playwright/test';

test.describe('i18n — German home page (/)', () => {
    test('renders German content', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.badge')).toHaveText('Verfügbar für 2026');
        await expect(page.locator('.headline')).toContainText(
            'Software, die liefert.'
        );
        await expect(page.locator('.headline .accent')).toContainText(
            'Systeme, die skalieren'
        );
    });

    test('has lang="de" on html element', async ({ page }) => {
        await page.goto('/');
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('de');
    });

    test('has German meta description', async ({ page }) => {
        await page.goto('/');
        const description = await page
            .locator('meta[name="description"]')
            .getAttribute('content');
        expect(description).toBe(
            'Ich entwickle Ihr digitales Produkt end-to-end und sorge dafür, dass das Wissen in Ihrem Team bleibt — mit Continuous Delivery und Hochverfügbarkeit als Grundlage. Freelance Platform & Product Engineer mit 15+ Jahren Erfahrung in Produktentwicklung, Plattform-Architektur und Tech-Leadership — vom Startup bis zu Systemen mit 100M+ Requests am Tag. Hamburg.'
        );
    });

    test('has OG locale de_DE', async ({ page }) => {
        await page.goto('/');
        const ogLocale = await page
            .locator('meta[property="og:locale"]')
            .getAttribute('content');
        expect(ogLocale).toBe('de_DE');
    });

    test('has hreflang tags', async ({ page }) => {
        await page.goto('/');
        const deHreflang = await page
            .locator('link[hreflang="de"]')
            .getAttribute('href');
        const enHreflang = await page
            .locator('link[hreflang="en"]')
            .getAttribute('href');
        const xDefault = await page
            .locator('link[hreflang="x-default"]')
            .getAttribute('href');
        expect(deHreflang).toBe('https://maxdaten.de/');
        expect(enHreflang).toBe('https://www.maxdaten.io/en');
        expect(xDefault).toBe('https://maxdaten.de/');
    });

    test('has canonical pointing to maxdaten.de', async ({ page }) => {
        await page.goto('/');
        const canonical = await page
            .locator('link[rel="canonical"]')
            .getAttribute('href');
        expect(canonical).toBe('https://maxdaten.de/');
    });

    test('has titleTemplate with maxdaten.de', async ({ page }) => {
        await page.goto('/');
        const title = await page.title();
        expect(title).toContain('maxdaten.de');
    });

    test('has German keywords in meta tags', async ({ page }) => {
        await page.goto('/');
        const keywords = await page
            .locator('meta[name="keywords"]')
            .getAttribute('content');
        expect(keywords).toContain('DevOps Berater');
        expect(keywords).toContain('Freelancer Hamburg');
        expect(keywords).toContain('Kubernetes Consulting');
    });

    test('has OG siteName maxdaten.de', async ({ page }) => {
        await page.goto('/');
        const siteName = await page
            .locator('meta[property="og:site_name"]')
            .getAttribute('content');
        expect(siteName).toBe('maxdaten.de');
    });
});

test.describe('i18n — English home page (/en/)', () => {
    test('renders English content', async ({ page }) => {
        await page.goto('/en');
        await expect(page.locator('.badge')).toHaveText('Available for 2026');
        await expect(page.locator('.headline')).toContainText(
            'Products that ship.'
        );
        await expect(page.locator('.headline .accent')).toContainText(
            'Systems that scale'
        );
    });

    test('has lang="en" on html element', async ({ page }) => {
        await page.goto('/en');
        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');
    });

    test('has English meta description', async ({ page }) => {
        await page.goto('/en');
        const description = await page
            .locator('meta[name="description"]')
            .getAttribute('content');
        expect(description).toBe(
            'I build your digital product end to end and make sure the knowledge stays in your team — with continuous delivery and high availability as the foundation. Freelance Platform & Product Engineer with 15+ years in product development, platform architecture and tech leadership — from startup to systems at 100M+ requests a day. Hamburg.'
        );
    });

    test('has OG locale en_US', async ({ page }) => {
        await page.goto('/en');
        const ogLocale = await page
            .locator('meta[property="og:locale"]')
            .getAttribute('content');
        expect(ogLocale).toBe('en_US');
    });

    test('has hreflang tags', async ({ page }) => {
        await page.goto('/en');
        const deHreflang = await page
            .locator('link[hreflang="de"]')
            .getAttribute('href');
        const enHreflang = await page
            .locator('link[hreflang="en"]')
            .getAttribute('href');
        expect(deHreflang).toBe('https://maxdaten.de/');
        expect(enHreflang).toBe('https://www.maxdaten.io/en');
    });

    test('has canonical pointing to maxdaten.io', async ({ page }) => {
        await page.goto('/en');
        const canonical = await page
            .locator('link[rel="canonical"]')
            .getAttribute('href');
        expect(canonical).toBe('https://www.maxdaten.io/en');
    });

    test('has titleTemplate with maxdaten.io', async ({ page }) => {
        await page.goto('/en');
        const title = await page.title();
        expect(title).toContain('maxdaten.io');
    });

    test('has English keywords in meta tags', async ({ page }) => {
        await page.goto('/en');
        const keywords = await page
            .locator('meta[name="keywords"]')
            .getAttribute('content');
        expect(keywords).toContain('Freelance Platform & Product Engineer');
        expect(keywords).not.toContain('Technical Product Advisor');
    });

    test('has OG siteName maxdaten.io', async ({ page }) => {
        await page.goto('/en');
        const siteName = await page
            .locator('meta[property="og:site_name"]')
            .getAttribute('content');
        expect(siteName).toBe('maxdaten.io');
    });
});

test.describe('i18n — Language switcher', () => {
    test('shows DE|EN toggle on home page', async ({ page }) => {
        await page.goto('/');
        const switcher = page.locator('.language-switcher');
        await expect(switcher).toBeVisible();
        await expect(switcher.locator('a[hreflang="de"]')).toHaveText('DE');
        await expect(switcher.locator('a[hreflang="en"]')).toHaveText('EN');
    });

    test('highlights DE as active on German home page', async ({ page }) => {
        await page.goto('/');
        const deLink = page.locator('.language-switcher a[hreflang="de"]');
        await expect(deLink).toHaveClass(/active/);
    });

    test('highlights EN as active on English home page', async ({ page }) => {
        await page.goto('/en');
        const enLink = page.locator('.language-switcher a[hreflang="en"]');
        await expect(enLink).toHaveClass(/active/);
    });
});

test.describe('i18n — Blog pages remain English', () => {
    for (const path of [
        '/blog',
        '/gems',
        '/2026-01-31-ship-your-toolchain-not-just-infrastructure',
    ]) {
        test(`${path} is marked as English`, async ({ page }) => {
            await page.goto(path);
            await expect(page.locator('html')).toHaveAttribute('lang', 'en');
            await expect(page).toHaveTitle(/\| maxdaten\.io$/);
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
                'href',
                `https://www.maxdaten.io${path}`
            );
        });
    }

    test('/impressum stays German', async ({ page }) => {
        await page.goto('/impressum');
        await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    });

    test('/blog has no hreflang tags', async ({ page }) => {
        await page.goto('/blog');
        const hreflangLinks = page.locator('link[hreflang]');
        await expect(hreflangLinks).toHaveCount(0);
    });
});

test.describe('i18n — home page services and results', () => {
    test('/en names the services and dated results', async ({ page }) => {
        await page.goto('/en');
        await expect(
            page.getByRole('heading', { level: 2, name: 'What I do' })
        ).toBeVisible();
        await expect(
            page.getByText(/reproducible environments with Nix and devenv/)
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                level: 3,
                name: 'Modern Product Engineering',
            })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', { level: 2, name: 'Selected work' })
        ).toBeVisible();
        await expect(page.getByText('Klingel Gruppe')).toBeVisible();
        await expect(page.getByText('2021–2023')).toBeVisible();
    });

    test('/ shows the same sections in German', async ({ page }) => {
        await page.goto('/');
        await expect(
            page.getByRole('heading', { level: 2, name: 'Leistungen' })
        ).toBeVisible();
        await expect(
            page.getByRole('heading', {
                level: 2,
                name: 'Ausgewählte Projekte',
            })
        ).toBeVisible();
    });
});

test('outside production the language switcher stays on this host', async ({
    page,
}) => {
    await page.goto('/en');
    const switcher = page.locator('.language-switcher');
    await expect(switcher.locator('a[hreflang="de"]')).toHaveAttribute(
        'href',
        '/'
    );
    await expect(switcher.locator('a[hreflang="en"]')).toHaveAttribute(
        'href',
        '/en'
    );
});
