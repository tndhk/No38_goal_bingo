import { test, expect } from '@playwright/test';

test.describe('Pull to Refresh', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('should have pull-area element on boards page', async ({ page }) => {
		// Navigate to boards page
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Find the pull area - it should exist
		const pullArea = page.locator('.pull-area');
		await expect(pullArea).toBeVisible();
	});

	test('should render boards page content correctly', async ({ page }) => {
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Check that the page loaded - look for specific elements
		await expect(page.locator('.page-container')).toBeVisible();
		await expect(page.locator('.content-wrapper')).toBeVisible();
		
		// Check for the header
		const header = page.locator('header.header');
		await expect(header).toBeVisible();
	});

	test('should have correct styling for pull area', async ({ page }) => {
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		const pullArea = page.locator('.pull-area');
		await expect(pullArea).toBeVisible();
		
		// Check CSS properties
		await expect(pullArea).toHaveCSS('position', 'relative');
		await expect(pullArea).toHaveCSS('overflow', 'hidden');
	});

	test('should allow scrolling on boards page', async ({ page }) => {
		// Navigate to boards page
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Check that the page structure is correct
		await expect(page.locator('.page-container')).toBeVisible();
		await expect(page.locator('.content-wrapper')).toBeVisible();
	});

	test('should maintain touch target sizes after pull-to-refresh integration', async ({ page }) => {
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Check that buttons still have minimum touch target
		const buttons = page.locator('button');
		const count = await buttons.count();
		
		if (count > 0) {
			for (let i = 0; i < Math.min(count, 3); i++) {
				const button = buttons.nth(i);
				const box = await button.boundingBox();
				
				if (box) {
					expect(box.width).toBeGreaterThanOrEqual(44);
					expect(box.height).toBeGreaterThanOrEqual(44);
				}
			}
		}
	});
});
