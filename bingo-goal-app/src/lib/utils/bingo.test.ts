import { describe, test, expect } from 'vitest';
import type { Cell, BingoLine, CellPosition } from '$lib/types/bingo';
import { CELL_POSITIONS } from '$lib/types/bingo';
import {
	getCompletedLines,
	getBingoCount,
	getAchievedCount,
	getNearBingoLines,
	getNearBingoPositions,
	getBingoLinePositions,
	isPerfect,
	getProgressSummary,
	type ProgressSummary
} from './bingo';

function createCells(achievedPositions: CellPosition[] = []): Cell[] {
	return CELL_POSITIONS.map((position) => ({
		position,
		goal: `Goal for ${position}`,
		isAchieved: achievedPositions.includes(position)
	}));
}

describe('bingo utilities', () => {
	describe('getCompletedLines', () => {
		test('returns empty array when no bingo', () => {
			const cells = createCells([]);
			const result = getCompletedLines(cells);
			expect(result).toEqual([]);
		});

		test('returns completed line for horizontal row', () => {
			const cells = createCells(['topLeft', 'topCenter', 'topRight']);
			const result = getCompletedLines(cells);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('row');
			expect(result[0].positions).toEqual(['topLeft', 'topCenter', 'topRight']);
		});

		test('returns completed line for middle row', () => {
			const cells = createCells(['middleLeft', 'middleCenter', 'middleRight']);
			const result = getCompletedLines(cells);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('row');
			expect(result[0].positions).toEqual(['middleLeft', 'middleCenter', 'middleRight']);
		});

		test('returns completed line for diagonal', () => {
			const cells = createCells(['topLeft', 'middleCenter', 'bottomRight']);
			const result = getCompletedLines(cells);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('diagonal');
			expect(result[0].positions).toEqual(['topLeft', 'middleCenter', 'bottomRight']);
		});

		test('returns completed line for column', () => {
			const cells = createCells(['topLeft', 'middleLeft', 'bottomLeft']);
			const result = getCompletedLines(cells);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('column');
			expect(result[0].positions).toEqual(['topLeft', 'middleLeft', 'bottomLeft']);
		});

		test('returns multiple completed lines', () => {
			// Top row + left column
			const cells = createCells([
				'topLeft',
				'topCenter',
				'topRight',
				'middleLeft',
				'bottomLeft'
			]);
			const result = getCompletedLines(cells);
			expect(result).toHaveLength(2);
			expect(result.map((l) => l.type)).toContain('row');
			expect(result.map((l) => l.type)).toContain('column');
		});
	});

	describe('getBingoCount', () => {
		test('returns 0 when no bingo', () => {
			const cells = createCells([]);
			expect(getBingoCount(cells)).toBe(0);
		});

		test('returns 1 for single bingo', () => {
			const cells = createCells(['topLeft', 'topCenter', 'topRight']);
			expect(getBingoCount(cells)).toBe(1);
		});

		test('returns correct count for multiple bingos', () => {
			// Top row + left column
			const cells = createCells([
				'topLeft',
				'topCenter',
				'topRight',
				'middleLeft',
				'bottomLeft'
			]);
			expect(getBingoCount(cells)).toBe(2);
		});

		test('returns 8 for perfect (all lines)', () => {
			const cells = createCells(CELL_POSITIONS);
			expect(getBingoCount(cells)).toBe(8);
		});
	});

	describe('getAchievedCount', () => {
		test('returns 0 when no cells achieved', () => {
			const cells = createCells([]);
			expect(getAchievedCount(cells)).toBe(0);
		});

		test('returns correct count', () => {
			const cells = createCells(['topLeft', 'topCenter', 'middleCenter']);
			expect(getAchievedCount(cells)).toBe(3);
		});

		test('returns 9 for perfect', () => {
			const cells = createCells(CELL_POSITIONS);
			expect(getAchievedCount(cells)).toBe(9);
		});
	});

	describe('getNearBingoLines', () => {
		test('returns empty array when no near bingo', () => {
			const cells = createCells([]);
			expect(getNearBingoLines(cells)).toEqual([]);
		});

		test('returns lines with exactly 2 achieved cells', () => {
			const cells = createCells(['topLeft', 'topCenter']);
			const result = getNearBingoLines(cells);
			expect(result).toHaveLength(1);
			expect(result[0].positions).toEqual(['topLeft', 'topCenter', 'topRight']);
		});

		test('does not return completed lines', () => {
			const cells = createCells(['topLeft', 'topCenter', 'topRight']);
			const result = getNearBingoLines(cells);
			expect(result).toEqual([]);
		});

		test('returns multiple near bingo lines', () => {
			// Near top row and near left column
			const cells = createCells(['topLeft', 'topCenter', 'middleLeft']);
			const result = getNearBingoLines(cells);
			expect(result).toHaveLength(2);
		});
	});

	describe('getNearBingoPositions', () => {
		test('returns empty array when no near bingo', () => {
			const cells = createCells([]);
			expect(getNearBingoPositions(cells)).toEqual([]);
		});

		test('returns position to complete bingo', () => {
			const cells = createCells(['topLeft', 'topCenter']);
			const result = getNearBingoPositions(cells);
			expect(result).toContain('topRight');
		});

		test('returns unique positions only', () => {
			// Multiple lines pointing to same position
			const cells = createCells(['topLeft', 'topCenter', 'middleLeft', 'middleCenter']);
			const result = getNearBingoPositions(cells);
			// topRight from row, bottomLeft from column, bottomRight from diagonal
			const unique = [...new Set(result)];
			expect(result.length).toBe(unique.length);
		});
	});

	describe('getBingoLinePositions', () => {
		test('returns empty array when no bingo', () => {
			const cells = createCells([]);
			expect(getBingoLinePositions(cells)).toEqual([]);
		});

		test('returns positions for completed line', () => {
			const cells = createCells(['topLeft', 'topCenter', 'topRight']);
			const result = getBingoLinePositions(cells);
			expect(result).toContain('topLeft');
			expect(result).toContain('topCenter');
			expect(result).toContain('topRight');
		});

		test('returns unique positions for multiple lines', () => {
			// Two lines sharing topLeft
			const cells = createCells([
				'topLeft',
				'topCenter',
				'topRight',
				'middleLeft',
				'bottomLeft'
			]);
			const result = getBingoLinePositions(cells);
			const unique = [...new Set(result)];
			expect(result.length).toBe(unique.length);
			expect(result).toHaveLength(5); // 3 from row + 3 from column - 1 shared
		});
	});

	describe('isPerfect', () => {
		test('returns false when not all cells achieved', () => {
			const cells = createCells(['topLeft', 'topCenter']);
			expect(isPerfect(cells)).toBe(false);
		});

		test('returns false when 8 cells achieved', () => {
			const almostAll = CELL_POSITIONS.filter((p) => p !== 'bottomRight');
			const cells = createCells(almostAll);
			expect(isPerfect(cells)).toBe(false);
		});

		test('returns true when all 9 cells achieved', () => {
			const cells = createCells(CELL_POSITIONS);
			expect(isPerfect(cells)).toBe(true);
		});
	});

	describe('getProgressSummary', () => {
		test('returns correct summary for empty board', () => {
			const cells = createCells([]);
			const result = getProgressSummary(cells);
			expect(result).toEqual({
				achieved: 0,
				total: 9,
				bingoCount: 0,
				isPerfect: false,
				hint: null
			});
		});

		test('returns hint when near bingo', () => {
			const cells = createCells(['topLeft', 'topCenter']);
			const result = getProgressSummary(cells);
			expect(result.achieved).toBe(2);
			expect(result.bingoCount).toBe(0);
			expect(result.hint).not.toBeNull();
			expect(result.hint).toContain('1');
		});

		test('returns no hint when bingo already achieved', () => {
			const cells = createCells(['topLeft', 'topCenter', 'topRight']);
			const result = getProgressSummary(cells);
			expect(result.bingoCount).toBe(1);
			expect(result.hint).toBeNull();
		});

		test('returns hint for multiple near bingos', () => {
			const cells = createCells(['topLeft', 'topCenter', 'middleLeft', 'middleCenter']);
			const result = getProgressSummary(cells);
			expect(result.hint).not.toBeNull();
		});

		test('returns correct summary for perfect', () => {
			const cells = createCells(CELL_POSITIONS);
			const result = getProgressSummary(cells);
			expect(result).toEqual({
				achieved: 9,
				total: 9,
				bingoCount: 8,
				isPerfect: true,
				hint: null
			});
		});
	});
});
