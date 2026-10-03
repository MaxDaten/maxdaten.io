import { expect, test } from '@playwright/test';

test('an unknown page says it was not found', async ({ page }) => {
    const response = await page.goto('/no-such-page');

    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Page not found');
});
