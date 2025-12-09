
import { test, expect } from '@playwright/test';

test('home page has correct title and heating', async ({ page }) => {
    await page.goto('/');

    // Expect the main hero heading to contain the text
    await expect(page.getByRole('heading', { name: /The World Is/i })).toBeVisible();
});
