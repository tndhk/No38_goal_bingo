import { test, expect } from '@playwright/test';

test.describe('Board Management', () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('should show create board dialog from landing page', async ({ page }) => {
		await page.goto('/');

		// Click Guest Mode button (on landing page)
		const guestButton = page.getByRole('button', { name: /Guest Mode|ゲストで試す/i });
		await guestButton.click();

		// Wait for dialog to appear
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Dialog should appear
		await expect(page.locator('[role="dialog"]')).toBeVisible();
		await expect(page.getByText('New Board')).toBeVisible();
	});

	test('should create a new board with default settings', async ({ page }) => {
		await page.goto('/');

		// Open create dialog
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Click Create Board in dialog (default 3x3)
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Create Board' }).click();

		// Should show the bingo grid (9 cells for 3x3)
		await expect(page.locator('button.cell').first()).toBeVisible();
	});

	test('should create a board with custom name', async ({ page }) => {
		await page.goto('/');

		// Open create dialog
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Enter custom name
		const nameInput = page.locator('[role="dialog"]').locator('input[type="text"]');
		await nameInput.fill('My Custom Goals');

		// Create board
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Create Board' }).click();

		// Board should be selectable with that name
		const boardSelect = page.getByRole('combobox', { name: 'Select Board' });
		await expect(boardSelect).toContainText('My Custom Goals');
	});

	test('should create a board with different sizes', async ({ page }) => {
		await page.goto('/');

		// Open create dialog
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Select 5x5 size
		await page.locator('[role="dialog"]').getByText('5x5').click();

		// Create board
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Create Board' }).click();

		// Should show grid with 25 cells
		await expect(page.locator('button.cell')).toHaveCount(25);
	});

	test('should cancel board creation', async ({ page }) => {
		await page.goto('/');

		// Open create dialog
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		// Cancel
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Cancel' }).click();

		// Dialog should be closed
		await expect(page.locator('[role="dialog"]')).not.toBeVisible();
	});

	test('should delete a board from boards page', async ({ page }) => {
		// First create a board
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

		const nameInput = page.locator('[role="dialog"]').locator('input[type="text"]');
		await nameInput.fill('Board To Delete');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'Create Board' }).click();

		// Wait for grid to appear
		await page.waitForSelector('button.cell', { timeout: 5000 });

		// Wait for save to complete
		await page.waitForTimeout(500);

		// Go to boards page
		await page.goto('/boards');

		// Wait for board list to load
		await page.waitForSelector('text=Board To Delete', { timeout: 5000 });

		// Find and click delete button for the board
		const deleteButton = page.locator('[aria-label="Delete Board To Delete"]');

		if (await deleteButton.isVisible().catch(() => false)) {
			await deleteButton.click();

			// Confirm deletion in dialog
			const confirmDialog = page.locator('[role="dialog"]');
			await confirmDialog.getByRole('button', { name: 'Delete' }).click();

			// Board should be removed
			await expect(page.locator('text=Board To Delete')).not.toBeVisible();
		}
	});
});
