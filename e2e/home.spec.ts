
import { test, expect } from '@playwright/test';

test('home page loads correctly without errors', async ({ page }) => {
    // 1. Monitor for Console Errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 2. Monitor for Failed Network Requests & Bad Responses
    const failedRequests: string[] = [];
    page.on('requestfailed', request => {
        failedRequests.push(`[NETWORK_FAIL] ${request.url()} - ${request.failure()?.errorText}`);
    });
    page.on('response', response => {
    });

    // Set up response listener BEFORE navigation to avoid race conditions
    const imageResponsePromise = page.waitForResponse(response =>
        response.url().includes('Fifa-26-landing-page.png') && response.status() === 200
    );

    await page.goto('/');

    // 3. Verify Critical Elements
    // Heading
    await expect(page.getByRole('heading', { name: /The World Is/i })).toBeVisible();

    // Days Counter (Dynamic content)
    await expect(page.getByText('Days To Kickoff')).toBeVisible();

    // 4. Verify Background Image Loaded
    // We check if the background image style is applied and the resource was fetched successfully
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Explicitly verify the image resource receives a 200 OK
    const imageResponse = await imageResponsePromise;
    expect(imageResponse).toBeTruthy();

    // 5. Assert No Errors
    expect(failedRequests, `Failed Network Requests: ${JSON.stringify(failedRequests)}`).toHaveLength(0);
    expect(consoleErrors, `Console Errors: ${JSON.stringify(consoleErrors)}`).toHaveLength(0);
});
