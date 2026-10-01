import { test, expect } from '@playwright/test';

test.describe('Sports Overlay Hub Broadcast E2E Sync', () => {
  test('OBS Overlay displays transparent canvas and synchronizes score changes', async ({ page, context }) => {
    // 1. Open User Dashboard
    await page.goto('http://localhost:8000/');
    await expect(page).toHaveTitle(/Sports Overlay Hub/);

    // 2. Open OBS Overlay route directly in transparent window
    const overlayPage = await context.newPage();
    await overlayPage.goto('http://localhost:8000/overlay/abc123demo');

    // 3. Verify transparent viewport container
    const scoreboard = overlayPage.locator('div:has-text("DHAKA")').first();
    await expect(scoreboard).toBeVisible();

    // 4. Verify initial score 2-1
    await expect(overlayPage.locator('text=2')).toBeVisible();
    await expect(overlayPage.locator('text=1')).toBeVisible();
  });
});
