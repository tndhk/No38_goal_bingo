import { test, expect } from '@playwright/test';

test.describe('Page Navigation', () => {
	test('should load home page', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/BinGoal!/);
	});

	test('should load boards page', async ({ page }) => {
		await page.goto('/boards');
		await expect(page).toHaveTitle(/My Bingoals/);
		await expect(page.locator('text=My Bingoals').first()).toBeVisible();
	});

	test('should navigate from boards page to home', async ({ page }) => {
		await page.goto('/boards');
		await page.getByRole('link', { name: 'Back to home' }).click();
		await expect(page).toHaveURL('/');
	});

	test('should navigate from home to boards page when board exists', async ({ page }) => {
		// Clear localStorage first
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();

		// Create a board via Guest Mode
		const guestButton = page.getByRole('button', { name: /Guest Mode|ゲストで試す/i });
		await guestButton.click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Create Board' }).click();

		// Wait for grid to appear
		await page.waitForSelector('button.cell', { timeout: 5000 });

		// Now the Manage Boards link should be visible
		const manageBoardsLink = page.getByRole('link', { name: 'Manage Boards' });
		await expect(manageBoardsLink).toBeVisible();
		await manageBoardsLink.click();
		await expect(page).toHaveURL('/boards');
	});
});
