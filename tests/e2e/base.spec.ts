import { expect, test } from '@playwright/test';

test('homepage has title and navigation', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/maxdaten/);

    // Check that main navigation elements are present
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
    await expect(page.locator('nav a[href="/gems"]')).toBeVisible();
});

test('blog page loads correctly', async ({ page }) => {
    await page.goto('/blog');

    // Check that the blog page has loaded
    await expect(page.locator('h1, h2')).toContainText(/Blog|Latest Posts/i);

    // Check that blog posts are displayed (at least one should exist)
    const blogPosts = page.locator(
        '.blog-post-card, [data-testid="blog-post"]'
    );
    const count = await blogPosts.count();
    expect(count).toBeGreaterThan(0);
});

test('gems page loads correctly', async ({ page }) => {
    await page.goto('/gems');

    // Check that the gems page has loaded with correct title
    await expect(page.locator('h1, h2')).toContainText(
        /Gems of Precious Friends/i
    );

    // Check that gem cards are displayed (should have 3 gems)
    const gemCards = page.locator('[data-testid="gem-card"]');
    const count = await gemCards.count();
    expect(count).toBeGreaterThan(0);

    // Check that each gem card has required elements
    const firstCard = gemCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('img')).toBeVisible(); // Cover image
});

test('page loads and is interactive', async ({ page }) => {
    await page.goto('/');

    // Check that the page body is visible
    await expect(page.locator('body')).toBeVisible();

    // Check that the page has content
    await expect(page.locator('main, #main, .main')).toBeVisible();
});
