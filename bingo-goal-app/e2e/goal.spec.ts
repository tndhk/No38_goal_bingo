import { test, expect } from '@playwright/test';

test.describe('Goal Input and Achievement', () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage and create a board
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();

		// Create a board first via Guest Mode
		const guestButton = page.getByRole('button', { name: /Guest Mode|ゲストで試す/i });
		await guestButton.click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();

		// Wait for grid to appear
		await page.waitForSelector('button.cell', { timeout: 5000 });
	});

	test('should open goal input modal when clicking a cell', async ({ page }) => {
		// Click a cell
		await page.locator('button.cell').first().click();

		// Wait for modal
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Modal should appear
		await expect(page.getByRole('dialog', { name: '目標' })).toBeVisible();
		await expect(page.getByPlaceholder('目標を入力...')).toBeVisible();
	});

	test('should save a goal', async ({ page }) => {
		// Click a cell
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Enter goal text
		await page.getByPlaceholder('目標を入力...').fill('Learn TypeScript');

		// Save
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: '保存' }).click();

		// Modal should close and goal should appear in cell
		await expect(page.getByRole('dialog', { name: '目標' })).not.toBeVisible();
		await expect(page.locator('button.cell').first()).toContainText('Learn TypeScript');
	});

	test('should cancel without saving', async ({ page }) => {
		// Click a cell
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Enter goal text
		await page.getByPlaceholder('目標を入力...').fill('Draft Goal');

		// Cancel
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: 'キャンセル' }).click();

		// Modal should close and cell should still be empty
		await expect(page.getByRole('dialog', { name: '目標' })).not.toBeVisible();
		await expect(page.locator('button.cell').first()).not.toContainText('Draft Goal');
	});

	test('should mark goal as achieved', async ({ page }) => {
		// Click a cell and save a goal
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });
		await page.getByPlaceholder('目標を入力...').fill('Complete project');
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: '保存' }).click();

		// Wait for modal to close
		await expect(page.getByRole('dialog', { name: '目標' })).not.toBeVisible();

		// Click the cell again
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Click 達成 (Mark as Done)
		await page.getByRole('button', { name: '達成' }).click();

		// Button should now show "達成済み" (Achieved)
		await expect(page.getByRole('button', { name: '達成済み' })).toBeVisible();

		// Save and verify
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: '保存' }).click();

		// Cell should have achieved class
		await expect(page.locator('button.cell').first()).toHaveClass(/achieved/);
	});

	test('should clear a goal', async ({ page }) => {
		// Click a cell and save a goal
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });
		await page.getByPlaceholder('目標を入力...').fill('Goal to clear');
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: '保存' }).click();

		// Wait for modal to close
		await expect(page.getByRole('dialog', { name: '目標' })).not.toBeVisible();

		// Click the cell again
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Click Clear button
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: 'クリア' }).click();

		// Cell should now be empty (show "目標" placeholder text)
		await expect(page.locator('button.cell').first().locator('.empty-text')).toContainText('目標');
	});

	test('should show character count', async ({ page }) => {
		// Click a cell
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });

		// Enter text
		await page.getByPlaceholder('目標を入力...').fill('Hello');

		// Character count should show 5/50
		await expect(page.locator('.char-count')).toContainText('5');
		await expect(page.locator('.char-count')).toContainText('50');
	});

	test('should persist goal after page reload', async ({ page }) => {
		// Click a cell and save a goal
		await page.locator('button.cell').first().click();
		await page.waitForSelector('[aria-labelledby="modal-title"]', { timeout: 5000 });
		await page.getByPlaceholder('目標を入力...').fill('Persistent Goal');
		await page.getByRole('dialog', { name: '目標' }).getByRole('button', { name: '保存' }).click();

		// Wait for modal to close
		await expect(page.getByRole('dialog', { name: '目標' })).not.toBeVisible();

		// Wait for save to complete (SaveIndicator shows saving state)
		await page.waitForTimeout(500);

		// Reload page
		await page.reload();

		// Wait for grid to reappear after reload
		await page.waitForSelector('button.cell', { timeout: 5000 });

		// Goal should still be there
		await expect(page.locator('button.cell').first()).toContainText('Persistent Goal');
	});
});
