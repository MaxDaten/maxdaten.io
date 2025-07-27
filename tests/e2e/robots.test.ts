import { expect, test } from '@playwright/test';

test('/robots.txt is valid', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    // Check content type
    expect(response?.headers()['content-type']).toBe('text/plain');

    // Get the robots.txt content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();

    // Verify robots.txt structure
    const lines = content!
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);

    // Should contain User-agent directive
    expect(lines).toContain('User-agent: *');

    // Should contain Allow directive
    expect(lines).toContain('Allow: /');

    // Should contain Sitemap reference
    const sitemapLine = lines.find((line) => line.startsWith('Sitemap:'));
    expect(sitemapLine).toBeTruthy();
    expect(sitemapLine).toMatch(/Sitemap: https?:\/\/.*\/sitemap\.xml/);

    // Verify sitemap URL is valid
    const sitemapUrl = sitemapLine!.split('Sitemap: ')[1];
    expect(() => new URL(sitemapUrl)).not.toThrow();
});
