import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Page', () => {
	test('should display privacy policy page', async ({ page }) => {
		await page.goto('/privacy');

		// Check page title
		await expect(page).toHaveTitle(/プライバシーポリシー.*BinGoal!/);

		// Check main heading
		await expect(page.locator('h1')).toContainText('プライバシーポリシー');

		// Check last updated text
		await expect(page.locator('.last-updated')).toContainText('最終更新日');
	});

	test('should display all privacy sections', async ({ page }) => {
		await page.goto('/privacy');

		// Check that sections are visible
		const sections = page.locator('.section');
		await expect(sections.first()).toBeVisible();

		// Check for key section headings
		await expect(page.locator('h2').first()).toBeVisible();
	});

	test('should have working back to home link', async ({ page }) => {
		await page.goto('/privacy');

		const backLink = page.locator('.back-link');
		await expect(backLink).toBeVisible();
		await backLink.click();

		await expect(page).toHaveURL('/');
	});

	test('should have link to terms page', async ({ page }) => {
		await page.goto('/privacy');

		const termsLink = page.locator('.footer-links a[href="/terms"]');
		await expect(termsLink).toBeVisible();
		await termsLink.click();

		await expect(page).toHaveURL('/terms');
	});
});

test.describe('Terms of Service Page', () => {
	test('should display terms page', async ({ page }) => {
		await page.goto('/terms');

		// Check page title
		await expect(page).toHaveTitle(/利用規約.*BinGoal!/);

		// Check main heading
		await expect(page.locator('h1')).toContainText('利用規約');

		// Check last updated text
		await expect(page.locator('.last-updated')).toContainText('最終更新日');
	});

	test('should display all terms sections', async ({ page }) => {
		await page.goto('/terms');

		// Check that sections are visible
		const sections = page.locator('.section');
		await expect(sections.first()).toBeVisible();

		// Check for key section headings
		await expect(page.locator('h2').first()).toBeVisible();
	});

	test('should have working back to home link', async ({ page }) => {
		await page.goto('/terms');

		const backLink = page.locator('.back-link');
		await expect(backLink).toBeVisible();
		await backLink.click();

		await expect(page).toHaveURL('/');
	});

	test('should have link to privacy page', async ({ page }) => {
		await page.goto('/terms');

		const privacyLink = page.locator('.footer-links a[href="/privacy"]');
		await expect(privacyLink).toBeVisible();
		await privacyLink.click();

		await expect(page).toHaveURL('/privacy');
	});
});

test.describe('Landing Page Footer Links', () => {
	test('should display footer links on landing page', async ({ page }) => {
		await page.goto('/');

		// Check footer links
		const privacyLink = page.locator('.footer-link[href="/privacy"]');
		const termsLink = page.locator('.footer-link[href="/terms"]');

		await expect(privacyLink).toBeVisible();
		await expect(termsLink).toBeVisible();
	});

	test('should navigate to privacy from landing page footer', async ({ page }) => {
		await page.goto('/');

		const privacyLink = page.locator('.footer-link[href="/privacy"]');
		await privacyLink.click();

		await expect(page).toHaveURL('/privacy');
	});

	test('should navigate to terms from landing page footer', async ({ page }) => {
		await page.goto('/');

		const termsLink = page.locator('.footer-link[href="/terms"]');
		await termsLink.click();

		await expect(page).toHaveURL('/terms');
	});
});
