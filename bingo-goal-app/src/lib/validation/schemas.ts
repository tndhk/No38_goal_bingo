import { z } from 'zod';
import type { BoardSize, CellPosition } from '$lib/types/bingo';

// Constants for validation
export const GOAL_MAX_LENGTH = 50;
export const BOARD_NAME_MAX_LENGTH = 100;
const BOARD_NAME_MIN_LENGTH = 1;

// Goal text schema
export const goalSchema = z
	.string()
	.max(GOAL_MAX_LENGTH, `目標は${GOAL_MAX_LENGTH}文字以内で入力してください`)
	.transform((val) => val.trim());

// Board name schema - trim first, then validate min length
export const boardNameSchema = z
	.string()
	.transform((val) => val.trim())
	.refine((val) => val.length >= BOARD_NAME_MIN_LENGTH, {
		message: 'ボード名を入力してください'
	})
	.refine((val) => val.length <= BOARD_NAME_MAX_LENGTH, {
		message: `ボード名は${BOARD_NAME_MAX_LENGTH}文字以内で入力してください`
	});

// Board size schema
export const boardSizeSchema = z.union([z.literal(3), z.literal(4), z.literal(5)]);

// Cell position schema (validates format cell_X_Y)
export const cellPositionSchema = z.string().refine(
	(val): val is CellPosition => {
		const match = val.match(/^cell_(\d+)_(\d+)$/);
		if (!match) return false;
		const row = parseInt(match[1], 10);
		const col = parseInt(match[2], 10);
		// Allow positions within max board size (5x5)
		return row >= 0 && row < 5 && col >= 0 && col < 5;
	},
	{ message: '無効なセル位置です' }
);

// Cell schema (internal use)
const cellSchema = z.object({
	position: cellPositionSchema,
	goal: goalSchema,
	isAchieved: z.boolean()
});

// Board create input schema
export const createBoardInputSchema = z.object({
	name: boardNameSchema,
	size: boardSizeSchema
});

// Cell update input schema
export const updateCellInputSchema = z.object({
	boardId: z.string().uuid('無効なボードIDです'),
	position: cellPositionSchema,
	goal: goalSchema,
	isAchieved: z.boolean()
});

// Types inferred from schemas
export type CreateBoardInput = z.infer<typeof createBoardInputSchema>;
export type UpdateCellInput = z.infer<typeof updateCellInputSchema>;

// Validation result type - using issues for zod v4 compatibility
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; errors: z.ZodError['issues'] };

// Safe parse helper functions
export function validateGoal(input: unknown): ValidationResult<string> {
	const result = goalSchema.safeParse(input);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.error.issues };
}

export function validateBoardName(input: unknown): ValidationResult<string> {
	const result = boardNameSchema.safeParse(input);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.error.issues };
}

export function validateCreateBoardInput(input: unknown): ValidationResult<CreateBoardInput> {
	const result = createBoardInputSchema.safeParse(input);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.error.issues };
}

export function validateUpdateCellInput(input: unknown): ValidationResult<UpdateCellInput> {
	const result = updateCellInputSchema.safeParse(input);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.error.issues };
}
