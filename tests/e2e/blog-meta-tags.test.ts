import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'fs';
import { basename } from 'path';

const CONTENT_DIR = 'src/content/blog';

// Get all blog posts
const blogPosts = readdirSync(CONTENT_DIR)
    .filter((file) => {
        // Read file content and check for hidden: true
        const content = readFileSync(`${CONTENT_DIR}/${file}`, 'utf-8');
        return file.endsWith('.md') && !content.includes('hidden: true');
    })
    .map((file) => ({
        filename: file,
        slug: basename(file, '.md'),
    }));

test.describe('Blog Post Meta Tags', () => {
    for (const post of blogPosts) {
        test(`should have valid OpenGraph and Twitter meta tags for ${post.slug}`, async ({
            page,
        }) => {
            // Navigate to the blog post
            const response = await page.goto(`/${post.slug}`);
            expect(response?.status()).toBe(200);

            // Wait for the page to load
            await page.waitForLoadState('networkidle');

            // Check OpenGraph meta tags
            const ogTitle = await page
                .locator('meta[property="og:title"]')
                .getAttribute('content');
            const ogDescription = await page
                .locator('meta[property="og:description"]')
                .getAttribute('content');
            const ogImage = await page
                .locator('meta[property="og:image"]')
                .getAttribute('content');

            // Verify og:title exists
            expect(ogTitle).toBeTruthy();

            // Verify og:description exists
            expect(ogDescription).toBeTruthy();

            // Check Twitter meta tags
            const twitterTitle = await page
                .locator('meta[name="twitter:title"]')
                .getAttribute('content');
            const twitterDescription = await page
                .locator('meta[name="twitter:description"]')
                .getAttribute('content');
            const twitterImage = await page
                .locator('meta[name="twitter:image"]')
                .getAttribute('content');
            const twitterCard = await page
                .locator('meta[name="twitter:card"]')
                .getAttribute('content');

            // Verify Twitter meta tags match OpenGraph tags
            expect(twitterTitle).toBe(ogTitle);
            expect(twitterDescription).toBe(ogDescription);
            expect(twitterImage).toBe(ogImage);

            // If og:image exists, verify it
            if (ogImage) {
                // expect(ogImage).toMatch(/^https?:\/\//); // Should be absolute URL, but not locally atm
                expect(twitterCard).toBe('summary_large_image');

                // Verify the image URL is accessible
                const imageResponse = await page.request.get(ogImage);
                expect(imageResponse.status()).toBe(200);
                expect(imageResponse.headers()['content-type']).toMatch(
                    /image\/(png|jpeg|jpg|webp)/
                );
            }

            // Check canonical URL
            const canonical = await page
                .locator('link[rel="canonical"]')
                .getAttribute('href');
            expect(canonical).toBeTruthy();
            // expect(canonical).toMatch(/^https?:\/\//); // Should be absolute URL, but not locally atm
            expect(canonical).toContain(post.slug);

            // Check basic meta tags
            const description = await page
                .locator('meta[name="description"]')
                .getAttribute('content');
            const keywords = await page
                .locator('meta[name="keywords"]')
                .getAttribute('content');

            expect(description).toBeTruthy();
            expect(keywords).toBeTruthy();
        });
    }

    for (const post of blogPosts) {
        test(`should have valid JSON-LD schemas for ${post.slug}`, async ({
            page,
        }) => {
            // Navigate to the blog post
            const response = await page.goto(`/${post.slug}`);
            expect(response?.status()).toBe(200);

            // Wait for the page to load
            await page.waitForLoadState('networkidle');

            // Check JSON-LD schemas
            const jsonLdScripts = await page
                .locator('script[type="application/ld+json"]')
                .all();
            expect(jsonLdScripts.length).toBeGreaterThan(0);
        });
    }

    test('should have valid default meta tags on homepage', async ({
        page,
    }) => {
        await page.goto('/');

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Check default OpenGraph meta tags
        const ogTitle = await page
            .locator('meta[property="og:title"]')
            .getAttribute('content');
        const ogDescription = await page
            .locator('meta[property="og:description"]')
            .getAttribute('content');
        const ogImage = await page
            .locator('meta[property="og:image"]')
            .getAttribute('content');

        expect(ogTitle).toBeTruthy();
        expect(ogDescription).toBeTruthy();
        expect(ogImage).toBeTruthy();
        // expect(ogImage).toMatch(/^https?:\/\//); // Should be absolute URL, but not locally atm

        // Verify default image is accessible
        if (ogImage) {
            const imageResponse = await page.request.get(ogImage);
            expect(imageResponse.status()).toBe(200);
        }

        // Check Twitter meta tags
        const twitterCard = await page
            .locator('meta[name="twitter:card"]')
            .getAttribute('content');
        expect(twitterCard).toBe('summary_large_image');

        // Check JSON-LD schemas on homepage
        const jsonLdScripts = await page
            .locator('script[type="application/ld+json"]')
            .all();
        expect(jsonLdScripts.length).toBeGreaterThan(0); // Should have WebSite, Person, and Organization schemas
    });
});
