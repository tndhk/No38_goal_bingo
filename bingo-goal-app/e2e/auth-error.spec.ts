import { test, expect } from '@playwright/test';

test.describe('Auth Error Page', () => {
	test('should display error page with correct content', async ({ page }) => {
		await page.goto('/auth/error');

		// Check page title
		await expect(page).toHaveTitle(/認証エラー.*BinGoal!/);

		// Check error title is visible
		await expect(page.locator('h1')).toContainText('認証エラー');

		// Check error description
		await expect(page.locator('p')).toContainText('問題が発生しました');
	});

	test('should have working return home link', async ({ page }) => {
		await page.goto('/auth/error');

		// Click return home link
		const homeLink = page.getByRole('link', { name: 'ホームに戻る' });
		await expect(homeLink).toBeVisible();
		await homeLink.click();

		// Should navigate to home
		await expect(page).toHaveURL('/');
	});

	test('should display error icon', async ({ page }) => {
		await page.goto('/auth/error');

		// Check SVG icon is present
		const icon = page.locator('svg.icon');
		await expect(icon).toBeVisible();
	});
});
