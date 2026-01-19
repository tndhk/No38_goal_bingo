import { test, expect } from '@playwright/test';

test.describe('Board Creation Limit (Max 3 boards)', () => {
	test.beforeEach(async ({ page }) => {
		// Clear localStorage before each test
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
	});

	test('should show remaining board count when no boards exist', async ({ page }) => {
		// Go to boards page after creating first board to access board management
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		await page.waitForTimeout(500);

		// Navigate to boards page
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Verify remaining message shows 2 available (1 board created, 2 remaining)
		await expect(page.locator('text=残り2個作成可能')).toBeVisible();
	});

	test('should create boards up to the limit of 3', async ({ page }) => {
		// Create first board via landing page
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		const nameInput1 = page.locator('[role="dialog"]').locator('input[type="text"]');
		await nameInput1.fill('Board 1');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		await page.waitForTimeout(500);

		// Go to boards page to create more boards
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Verify first board exists and remaining count
		await expect(page.locator('text=Board 1')).toBeVisible();
		await expect(page.locator('text=残り2個作成可能')).toBeVisible();

		// Create second board
		await page.getByRole('button', { name: /\+ 新しいビンゴ|Create New Board/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		const nameInput2 = page.locator('[role="dialog"]').locator('input[type="text"]');
		await nameInput2.fill('Board 2');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		// Verify remaining count updated
		await expect(page.locator('text=Board 2')).toBeVisible();
		await expect(page.locator('text=残り1個作成可能')).toBeVisible();

		// Create third board
		await page.getByRole('button', { name: /\+ 新しいビンゴ|Create New Board/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		const nameInput3 = page.locator('[role="dialog"]').locator('input[type="text"]');
		await nameInput3.fill('Board 3');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		// Verify all three boards exist
		await expect(page.locator('text=Board 1')).toBeVisible();
		await expect(page.locator('text=Board 2')).toBeVisible();
		await expect(page.locator('text=Board 3')).toBeVisible();
	});

	test('should disable create button when 3 boards exist', async ({ page }) => {
		// Create three boards quickly
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 1');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		await page.waitForTimeout(300);

		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Create board 2
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 2');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Create board 3
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 3');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Verify create button is disabled
		const createButton = page.getByRole('button', { name: /\+ 新しいビンゴ/i });
		await expect(createButton).toBeDisabled();
	});

	test('should show limit reached message when at max boards', async ({ page }) => {
		// Create three boards
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 1');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		await page.waitForTimeout(300);

		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Create board 2
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 2');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Create board 3
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 3');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Verify limit reached message is displayed
		await expect(page.locator('text=上限に達しました')).toBeVisible();

		// Verify remaining message is NOT displayed
		await expect(page.locator('text=/残り\\d+個作成可能/')).not.toBeVisible();
	});

	test('should enable create button after deleting a board', async ({ page }) => {
		// Create three boards
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 1');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		await page.waitForTimeout(300);

		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Create board 2
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 2');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Create board 3
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Board 3');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Verify button is disabled
		const createButton = page.getByRole('button', { name: /\+ 新しいビンゴ/i });
		await expect(createButton).toBeDisabled();
		await expect(page.locator('text=上限に達しました')).toBeVisible();

		// Delete one board
		const deleteButton = page.locator('[aria-label="削除 Board 1"]');
		await deleteButton.click();

		// Confirm deletion
		const confirmDialog = page.locator('[role="dialog"]');
		await confirmDialog.getByRole('button', { name: '削除' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(300);

		// Verify button is now enabled
		await expect(createButton).toBeEnabled();

		// Verify remaining message is shown again
		await expect(page.locator('text=残り1個作成可能')).toBeVisible();

		// Verify limit message is gone
		await expect(page.locator('text=上限に達しました')).not.toBeVisible();
	});

	test('should show correct remaining count as boards are created and deleted', async ({
		page
	}) => {
		// Start fresh and track remaining count throughout
		await page.goto('/');
		await page.getByRole('button', { name: /Guest Mode|ゲストで試す/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('First Board');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		await page.waitForSelector('button.cell', { timeout: 5000 });
		// Wait for debounced save (500ms) plus buffer
		await page.waitForTimeout(800);

		// Go to boards page - should show 2 remaining
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');
		// Wait for board list to render
		await expect(page.locator('text=First Board')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('text=残り2個作成可能')).toBeVisible();

		// Create second board from boards page (stays on /boards)
		await page.getByRole('button', { name: /\+ 新しいビンゴ/i }).click();
		await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
		await page.locator('[role="dialog"]').locator('input[type="text"]').fill('Second Board');
		await page.locator('[role="dialog"]').getByRole('button', { name: 'ビンゴ作成' }).click();
		// Dialog closes, we stay on /boards page - wait for store update and save
		await page.waitForTimeout(800);
		// State should update reactively on the same page
		await expect(page.locator('text=Second Board')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('text=残り1個作成可能')).toBeVisible();

		// Delete first board - should show 2 remaining again
		const deleteButton = page.locator('[aria-label="削除 First Board"]');
		await deleteButton.click();
		const confirmDialog = page.locator('[role="dialog"]');
		await confirmDialog.getByRole('button', { name: '削除' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(800);
		await expect(page.locator('text=残り2個作成可能')).toBeVisible();

		// Verify First Board is deleted
		await expect(page.locator('text=First Board')).not.toBeVisible();

		// Second Board should still exist
		await expect(page.locator('text=Second Board')).toBeVisible();
	});

	test('empty state should also respect board limit', async ({ page }) => {
		// First, verify fresh state (no boards)
		await page.goto('/boards');
		await page.waitForLoadState('networkidle');

		// Empty state should show remaining count (3 remaining)
		// Note: In empty state, the message uses different text
		const remainingText = page.locator('text=/残り\\d+個作成可能/');
		await expect(remainingText).toBeVisible();
		await expect(page.locator('text=残り3個作成可能')).toBeVisible();

		// Create button should be enabled in empty state
		const createButton = page.getByRole('button', { name: /最初のビンゴを作成/i });
		await expect(createButton).toBeEnabled();
	});
});
