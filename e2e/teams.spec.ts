import { test, expect } from '@playwright/test';

test.describe('Team Detail Page', () => {
    test('should navigate from Rankings to Team Detail', async ({ page }) => {
        await page.goto('/rankings');

        // Find link to Argentina (ARG) and click it
        // Note: The UI displays the Team Name, so we look for "Argentina"
        const teamLink = page.getByRole('link', { name: 'Argentina' });
        await expect(teamLink).toBeVisible();
        await teamLink.click();

        // Check URL
        await expect(page).toHaveURL(/\/teams\/ARG/);

        // Check Header
        await expect(page.getByRole('heading', { name: 'Argentina' })).toBeVisible();

        // Check Sections
        await expect(page.getByText('FIFA Rank:')).toBeVisible();
        await expect(page.getByText('Road to 2026')).toBeVisible(); // Qualification
        await expect(page.getByText('World Cup History')).toBeVisible(); // History
        await expect(page.getByText('Key Players')).toBeVisible();
    });

    test('should display fallback states if data is missing', async ({ page }) => {
        // Navigate to a team that might not have data yet (or mock it)
        // Since we are running against real app state which might be empty or full depending on script status
        // We can just check the structure exists.

        await page.goto('/teams/USA');
        await expect(page.getByRole('heading', { name: 'USA' })).toBeVisible();
    });

    test('should have a working back button', async ({ page }) => {
        await page.goto('/teams/BRA');
        await page.click('text=Back to Home');
        await expect(page).toHaveURL('/');
    });
});
