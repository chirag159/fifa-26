import { test, expect } from '@playwright/test';

test('hero text is fully visible', async ({ page }) => {
    await page.goto('/');

    // Check "FEEL THE"
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toContainText('FEEL THE');

    // Check "PULSE" span
    const pulseText = heroHeading.locator('span');
    await expect(pulseText).toContainText('PULSE');
    await expect(pulseText).toBeVisible();

    // Optional: Check if gradient class is present
    await expect(pulseText).toHaveClass(/bg-clip-text/);
});
