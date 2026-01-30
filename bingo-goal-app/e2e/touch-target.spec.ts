import { test, expect } from '@playwright/test';

test.describe('Touch Target Size', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('buttons should have minimum touch target of 44px', async ({ page }) => {
		// Navigate to a page with buttons
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Get all buttons in the dialog
		const buttons = page.locator('[role="dialog"] button');
		const count = await buttons.count();

		// Check each button has minimum size
		for (let i = 0; i < count; i++) {
			const button = buttons.nth(i);
			const box = await button.boundingBox();
			
			if (box) {
				// Minimum touch target should be 44x44px
				expect(box.width).toBeGreaterThanOrEqual(44);
				expect(box.height).toBeGreaterThanOrEqual(44);
			}
		}
	});

	test('bingo cells should have minimum touch target of 44px', async ({ page }) => {
		// Create a board first
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		
		// Wait for cells to appear
		await expect(page.locator('button.cell').first()).toBeVisible();

		// Get all cells
		const cells = page.locator('button.cell');
		const count = await cells.count();
		expect(count).toBeGreaterThan(0);

		// Check each cell has minimum size
		for (let i = 0; i < count; i++) {
			const cell = cells.nth(i);
			const box = await cell.boundingBox();
			
			if (box) {
				expect(box.width).toBeGreaterThanOrEqual(44);
				expect(box.height).toBeGreaterThanOrEqual(44);
			}
		}
	});

	test('board list items should have minimum touch target of 44px', async ({ page }) => {
		// Create a board first
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		
		// Navigate to boards page
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Check if there are board cards
		const boardCards = page.locator('.board-card');
		const count = await boardCards.count();

		if (count > 0) {
			// Check board card buttons
			const cardButtons = page.locator('.board-card button');
			const buttonCount = await cardButtons.count();

			for (let i = 0; i < buttonCount; i++) {
				const button = cardButtons.nth(i);
				const box = await button.boundingBox();
				
				if (box) {
					expect(box.width).toBeGreaterThanOrEqual(44);
					expect(box.height).toBeGreaterThanOrEqual(44);
				}
			}
		}
	});

	test('delete buttons should meet minimum touch target size', async ({ page }) => {
		// Create a board first
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		
		// Navigate to boards page
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Check delete buttons
		const deleteButtons = page.locator('.delete-btn');
		const count = await deleteButtons.count();

		if (count > 0) {
			for (let i = 0; i < count; i++) {
				const button = deleteButtons.nth(i);
				const box = await button.boundingBox();
				
				if (box) {
					expect(box.width).toBeGreaterThanOrEqual(44);
					expect(box.height).toBeGreaterThanOrEqual(44);
				}
			}
		}
	});
});
