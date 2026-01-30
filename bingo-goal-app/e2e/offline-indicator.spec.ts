import { test, expect } from '@playwright/test';

test.describe('Offline Indicator', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		// Clear localStorage and start fresh
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('should not show offline indicator when online', async ({ page }) => {
		// Ensure we're online
		await page.evaluate(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: true,
				writable: true,
				configurable: true
			});
		});

		// Wait for app to load
		await page.waitForLoadState('networkidle');

		// Offline indicator should not be visible
		const offlineIndicator = page.locator('.offline-indicator');
		await expect(offlineIndicator).not.toBeVisible();
	});

	test('should show offline indicator when network goes offline', async ({ page }) => {
		// Navigate to app first
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await expect(page.locator('button.cell').first()).toBeVisible();

		// Simulate going offline
		await page.evaluate(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
				configurable: true
			});
			window.dispatchEvent(new Event('offline'));
		});

		// Wait a bit for the event to be processed
		await page.waitForTimeout(100);

		// Offline indicator should be visible
		const offlineIndicator = page.locator('.offline-indicator');
		await expect(offlineIndicator).toBeVisible();
		await expect(offlineIndicator).toContainText(/offline/i);
	});

	test('should hide offline indicator when network comes back online', async ({ page }) => {
		// Navigate to app
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await expect(page.locator('button.cell').first()).toBeVisible();

		// Go offline first
		await page.evaluate(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
				configurable: true
			});
			window.dispatchEvent(new Event('offline'));
		});
		await page.waitForTimeout(100);

		// Verify indicator is visible
		const offlineIndicator = page.locator('.offline-indicator');
		await expect(offlineIndicator).toBeVisible();

		// Come back online
		await page.evaluate(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: true,
				writable: true,
				configurable: true
			});
			window.dispatchEvent(new Event('online'));
		});
		await page.waitForTimeout(100);

		// Indicator should be hidden
		await expect(offlineIndicator).not.toBeVisible();
	});

	test('should have correct styling for offline indicator', async ({ page }) => {
		// Navigate to app
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();

		// Go offline
		await page.evaluate(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
				configurable: true
			});
			window.dispatchEvent(new Event('offline'));
		});
		await page.waitForTimeout(100);

		// Check styling
		const offlineIndicator = page.locator('.offline-indicator');
		await expect(offlineIndicator).toHaveCSS('position', 'fixed');
		await expect(offlineIndicator).toHaveCSS('top', '0px');
		await expect(offlineIndicator).toHaveCSS('z-index', '9999');
	});
});
