import { test, expect } from '@playwright/test';

test('bracket page loads without stray debug text', async ({ page }) => {
    await page.goto('/bracket');

    // 1. Verify Page Title
    await expect(page.getByRole('heading', { name: 'Bracket Simulator' })).toBeVisible();

    // 2. Regression Test: Ensure "// increased gap" is NOT present
    // We search for the text content anywhere in the body
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('// increased gap');

    // Double check with a locator query to be sure
    const strayText = page.getByText('// increased gap');
    await expect(strayText).not.toBeVisible();
});
