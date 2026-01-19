import { describe, it, expect } from 'vitest';
import {
	goalSchema,
	boardNameSchema,
	boardSizeSchema,
	cellPositionSchema,
	createBoardInputSchema,
	updateCellInputSchema,
	validateGoal,
	validateBoardName,
	validateCreateBoardInput,
	validateUpdateCellInput,
	GOAL_MAX_LENGTH,
	BOARD_NAME_MAX_LENGTH
} from './schemas';

describe('goalSchema', () => {
	describe('valid inputs', () => {
		it('should accept empty string', () => {
			const result = goalSchema.safeParse('');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('');
			}
		});

		it('should accept valid goal text', () => {
			const result = goalSchema.safeParse('毎日10分運動する');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('毎日10分運動する');
			}
		});

		it('should accept goal at max length', () => {
			const maxLengthGoal = 'a'.repeat(GOAL_MAX_LENGTH);
			const result = goalSchema.safeParse(maxLengthGoal);
			expect(result.success).toBe(true);
		});

		it('should trim whitespace', () => {
			const result = goalSchema.safeParse('  目標テスト  ');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('目標テスト');
			}
		});
	});

	describe('invalid inputs', () => {
		it('should reject goal exceeding max length', () => {
			const tooLongGoal = 'a'.repeat(GOAL_MAX_LENGTH + 1);
			const result = goalSchema.safeParse(tooLongGoal);
			expect(result.success).toBe(false);
		});

		it('should reject non-string input', () => {
			const result = goalSchema.safeParse(123);
			expect(result.success).toBe(false);
		});

		it('should reject null', () => {
			const result = goalSchema.safeParse(null);
			expect(result.success).toBe(false);
		});

		it('should reject undefined', () => {
			const result = goalSchema.safeParse(undefined);
			expect(result.success).toBe(false);
		});
	});
});

describe('boardNameSchema', () => {
	describe('valid inputs', () => {
		it('should accept valid board name', () => {
			const result = boardNameSchema.safeParse('マイボード');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('マイボード');
			}
		});

		it('should accept single character name', () => {
			const result = boardNameSchema.safeParse('A');
			expect(result.success).toBe(true);
		});

		it('should accept name at max length', () => {
			const maxLengthName = 'a'.repeat(BOARD_NAME_MAX_LENGTH);
			const result = boardNameSchema.safeParse(maxLengthName);
			expect(result.success).toBe(true);
		});

		it('should trim whitespace and validate', () => {
			const result = boardNameSchema.safeParse('  ボード名  ');
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe('ボード名');
			}
		});
	});

	describe('invalid inputs', () => {
		it('should reject empty string', () => {
			const result = boardNameSchema.safeParse('');
			expect(result.success).toBe(false);
		});

		it('should reject whitespace-only string', () => {
			const result = boardNameSchema.safeParse('   ');
			expect(result.success).toBe(false);
		});

		it('should reject name exceeding max length', () => {
			const tooLongName = 'a'.repeat(BOARD_NAME_MAX_LENGTH + 1);
			const result = boardNameSchema.safeParse(tooLongName);
			expect(result.success).toBe(false);
		});

		it('should reject non-string input', () => {
			const result = boardNameSchema.safeParse(123);
			expect(result.success).toBe(false);
		});
	});
});

describe('boardSizeSchema', () => {
	describe('valid inputs', () => {
		it('should accept size 3', () => {
			const result = boardSizeSchema.safeParse(3);
			expect(result.success).toBe(true);
		});

		it('should accept size 4', () => {
			const result = boardSizeSchema.safeParse(4);
			expect(result.success).toBe(true);
		});

		it('should accept size 5', () => {
			const result = boardSizeSchema.safeParse(5);
			expect(result.success).toBe(true);
		});
	});

	describe('invalid inputs', () => {
		it('should reject size 2', () => {
			const result = boardSizeSchema.safeParse(2);
			expect(result.success).toBe(false);
		});

		it('should reject size 6', () => {
			const result = boardSizeSchema.safeParse(6);
			expect(result.success).toBe(false);
		});

		it('should reject string numbers', () => {
			const result = boardSizeSchema.safeParse('3');
			expect(result.success).toBe(false);
		});

		it('should reject decimal numbers', () => {
			const result = boardSizeSchema.safeParse(3.5);
			expect(result.success).toBe(false);
		});
	});
});

describe('cellPositionSchema', () => {
	describe('valid inputs', () => {
		it('should accept cell_0_0', () => {
			const result = cellPositionSchema.safeParse('cell_0_0');
			expect(result.success).toBe(true);
		});

		it('should accept cell_2_2 (3x3 board)', () => {
			const result = cellPositionSchema.safeParse('cell_2_2');
			expect(result.success).toBe(true);
		});

		it('should accept cell_4_4 (5x5 board)', () => {
			const result = cellPositionSchema.safeParse('cell_4_4');
			expect(result.success).toBe(true);
		});
	});

	describe('invalid inputs', () => {
		it('should reject position outside bounds', () => {
			const result = cellPositionSchema.safeParse('cell_5_5');
			expect(result.success).toBe(false);
		});

		it('should reject negative positions', () => {
			const result = cellPositionSchema.safeParse('cell_-1_0');
			expect(result.success).toBe(false);
		});

		it('should reject invalid format', () => {
			const result = cellPositionSchema.safeParse('topLeft');
			expect(result.success).toBe(false);
		});

		it('should reject empty string', () => {
			const result = cellPositionSchema.safeParse('');
			expect(result.success).toBe(false);
		});
	});
});

describe('createBoardInputSchema', () => {
	describe('valid inputs', () => {
		it('should accept valid board creation input', () => {
			const result = createBoardInputSchema.safeParse({
				name: 'マイボード',
				size: 3
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe('マイボード');
				expect(result.data.size).toBe(3);
			}
		});

		it('should accept 5x5 board', () => {
			const result = createBoardInputSchema.safeParse({
				name: '大きなボード',
				size: 5
			});
			expect(result.success).toBe(true);
		});
	});

	describe('invalid inputs', () => {
		it('should reject missing name', () => {
			const result = createBoardInputSchema.safeParse({
				size: 3
			});
			expect(result.success).toBe(false);
		});

		it('should reject missing size', () => {
			const result = createBoardInputSchema.safeParse({
				name: 'ボード'
			});
			expect(result.success).toBe(false);
		});

		it('should reject invalid size', () => {
			const result = createBoardInputSchema.safeParse({
				name: 'ボード',
				size: 10
			});
			expect(result.success).toBe(false);
		});
	});
});

describe('updateCellInputSchema', () => {
	const validUUID = '550e8400-e29b-41d4-a716-446655440000';

	describe('valid inputs', () => {
		it('should accept valid cell update input', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: validUUID,
				position: 'cell_0_0',
				goal: '毎日運動する',
				isAchieved: false
			});
			expect(result.success).toBe(true);
		});

		it('should accept achieved cell', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: validUUID,
				position: 'cell_2_2',
				goal: '完了済み',
				isAchieved: true
			});
			expect(result.success).toBe(true);
		});

		it('should accept empty goal', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: validUUID,
				position: 'cell_1_1',
				goal: '',
				isAchieved: false
			});
			expect(result.success).toBe(true);
		});
	});

	describe('invalid inputs', () => {
		it('should reject invalid UUID', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: 'not-a-uuid',
				position: 'cell_0_0',
				goal: '目標',
				isAchieved: false
			});
			expect(result.success).toBe(false);
		});

		it('should reject invalid position', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: validUUID,
				position: 'invalid',
				goal: '目標',
				isAchieved: false
			});
			expect(result.success).toBe(false);
		});

		it('should reject goal exceeding max length', () => {
			const result = updateCellInputSchema.safeParse({
				boardId: validUUID,
				position: 'cell_0_0',
				goal: 'a'.repeat(GOAL_MAX_LENGTH + 1),
				isAchieved: false
			});
			expect(result.success).toBe(false);
		});
	});
});

describe('validateGoal helper', () => {
	it('should return success with valid goal', () => {
		const result = validateGoal('有効な目標');
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toBe('有効な目標');
		}
	});

	it('should return errors with invalid goal', () => {
		const result = validateGoal('a'.repeat(GOAL_MAX_LENGTH + 1));
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.errors).toBeDefined();
			expect(result.errors.length).toBeGreaterThan(0);
		}
	});
});

describe('validateBoardName helper', () => {
	it('should return success with valid name', () => {
		const result = validateBoardName('ボード名');
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toBe('ボード名');
		}
	});

	it('should return errors with empty name', () => {
		const result = validateBoardName('');
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.errors.length).toBeGreaterThan(0);
		}
	});
});

describe('validateCreateBoardInput helper', () => {
	it('should return success with valid input', () => {
		const result = validateCreateBoardInput({ name: 'テスト', size: 3 });
		expect(result.success).toBe(true);
	});

	it('should return errors with invalid input', () => {
		const result = validateCreateBoardInput({ name: '', size: 3 });
		expect(result.success).toBe(false);
	});
});

describe('validateUpdateCellInput helper', () => {
	const validUUID = '550e8400-e29b-41d4-a716-446655440000';

	it('should return success with valid input', () => {
		const result = validateUpdateCellInput({
			boardId: validUUID,
			position: 'cell_0_0',
			goal: '目標',
			isAchieved: false
		});
		expect(result.success).toBe(true);
	});

	it('should return errors with invalid input', () => {
		const result = validateUpdateCellInput({
			boardId: 'invalid',
			position: 'cell_0_0',
			goal: '目標',
			isAchieved: false
		});
		expect(result.success).toBe(false);
	});
});

describe('XSS Prevention', () => {
	it('should accept but not sanitize script tags (Svelte handles this)', () => {
		// Note: XSS sanitization is handled by Svelte's automatic escaping
		// The schema only validates format, not content
		const result = goalSchema.safeParse('<script>alert("xss")</script>');
		expect(result.success).toBe(true);
		// Svelte will escape this when rendering
	});

	it('should accept goal with special characters', () => {
		const result = goalSchema.safeParse('目標 & <特殊> "文字"');
		expect(result.success).toBe(true);
	});
});

describe('Edge Cases', () => {
	it('should handle unicode characters correctly', () => {
		const unicodeGoal = '🎯目標達成！💪';
		const result = goalSchema.safeParse(unicodeGoal);
		expect(result.success).toBe(true);
	});

	it('should handle newlines in goal', () => {
		const multilineGoal = '目標1\n目標2';
		const result = goalSchema.safeParse(multilineGoal);
		expect(result.success).toBe(true);
	});

	it('should handle very long unicode strings correctly', () => {
		// 50 Japanese characters (each is 1 character in JavaScript)
		const longJapanese = 'あ'.repeat(GOAL_MAX_LENGTH);
		const result = goalSchema.safeParse(longJapanese);
		expect(result.success).toBe(true);
	});
});
