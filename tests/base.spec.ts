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
	const blogPosts = page.locator('.blog-post-card, [data-testid="blog-post"]');
	const count = await blogPosts.count();
	expect(count).toBeGreaterThan(0);
});

test('page loads and is interactive', async ({ page }) => {
	await page.goto('/');

	// Check that the page body is visible
	await expect(page.locator('body')).toBeVisible();
	
	// Check that the page has content
	await expect(page.locator('main, #main, .main')).toBeVisible();
});
