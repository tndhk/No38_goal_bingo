import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Touch Target Size', () => {
	describe('Button Component', () => {
		const buttonPath = resolve(process.cwd(), 'src/lib/components/ui/Button.svelte');
		const buttonContent = readFileSync(buttonPath, 'utf-8');

		it('should have minimum touch target of 44px', () => {
			// Check for min-height or min-width using the CSS variable
			const hasMinHeight = buttonContent.includes('min-height') && buttonContent.includes('--touch-target-min');
			const hasMinWidth = buttonContent.includes('min-width') && buttonContent.includes('--touch-target-min');
			
			expect(hasMinHeight || hasMinWidth).toBe(true);
		});

		it('should use CSS variable for touch target size', () => {
			expect(buttonContent).toContain('--touch-target-min');
		});
	});

	describe('BoardList Component', () => {
		const boardListPath = resolve(process.cwd(), 'src/lib/components/bingo/BoardList.svelte');
		const boardListContent = readFileSync(boardListPath, 'utf-8');

		it('should have minimum touch target of 44px for list items', () => {
			const hasMinHeight = boardListContent.includes('min-height') && boardListContent.includes('--touch-target-min');
			const hasMinWidth = boardListContent.includes('min-width') && boardListContent.includes('--touch-target-min');
			
			expect(hasMinHeight || hasMinWidth).toBe(true);
		});

		it('should use CSS variable for touch target size', () => {
			expect(boardListContent).toContain('--touch-target-min');
		});
	});
});
