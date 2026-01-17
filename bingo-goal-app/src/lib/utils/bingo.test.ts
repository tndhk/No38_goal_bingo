import { describe, test, expect } from 'vitest';
import type { Cell, BingoLine, CellPosition, BoardSize } from '$lib/types/bingo';
import { generateCellPositions, generateBingoLines } from '$lib/types/bingo';
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

function createCells(achievedPositions: CellPosition[] = [], size: BoardSize = 3): Cell[] {
	return generateCellPositions(size).map((position) => ({
		position,
		goal: `Goal for ${position}`,
		isAchieved: achievedPositions.includes(position)
	}));
}

describe('bingo utilities', () => {
	describe('getCompletedLines', () => {
		test('returns empty array when no bingo', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toEqual([]);
		});

		test('returns completed line for horizontal row (3x3)', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2']);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('row');
			expect(result[0].positions).toEqual(['cell_0_0', 'cell_0_1', 'cell_0_2']);
		});

		test('returns completed line for middle row (3x3)', () => {
			const cells = createCells(['cell_1_0', 'cell_1_1', 'cell_1_2']);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('row');
			expect(result[0].positions).toEqual(['cell_1_0', 'cell_1_1', 'cell_1_2']);
		});

		test('returns completed line for diagonal (3x3)', () => {
			const cells = createCells(['cell_0_0', 'cell_1_1', 'cell_2_2']);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('diagonal');
			expect(result[0].positions).toEqual(['cell_0_0', 'cell_1_1', 'cell_2_2']);
		});

		test('returns completed line for column (3x3)', () => {
			const cells = createCells(['cell_0_0', 'cell_1_0', 'cell_2_0']);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('column');
			expect(result[0].positions).toEqual(['cell_0_0', 'cell_1_0', 'cell_2_0']);
		});

		test('returns multiple completed lines', () => {
			// Top row + left column
			const cells = createCells([
				'cell_0_0',
				'cell_0_1',
				'cell_0_2',
				'cell_1_0',
				'cell_2_0'
			]);
			const lines = generateBingoLines(3);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(2);
			expect(result.map((l) => l.type)).toContain('row');
			expect(result.map((l) => l.type)).toContain('column');
		});

		test('detects horizontal bingo for 4x4', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2', 'cell_0_3'], 4);
			const lines = generateBingoLines(4);
			const result = getCompletedLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].type).toBe('row');
		});
	});

	describe('getBingoCount', () => {
		test('returns 0 when no bingo', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			expect(getBingoCount(cells, lines)).toBe(0);
		});

		test('returns 1 for single bingo', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2']);
			const lines = generateBingoLines(3);
			expect(getBingoCount(cells, lines)).toBe(1);
		});

		test('returns correct count for multiple bingos', () => {
			// Top row + left column
			const cells = createCells([
				'cell_0_0',
				'cell_0_1',
				'cell_0_2',
				'cell_1_0',
				'cell_2_0'
			]);
			const lines = generateBingoLines(3);
			expect(getBingoCount(cells, lines)).toBe(2);
		});

		test('returns 8 for perfect 3x3 (all lines)', () => {
			const allPositions = generateCellPositions(3);
			const cells = createCells(allPositions);
			const lines = generateBingoLines(3);
			expect(getBingoCount(cells, lines)).toBe(8);
		});
	});

	describe('getAchievedCount', () => {
		test('returns 0 when no cells achieved', () => {
			const cells = createCells([]);
			expect(getAchievedCount(cells)).toBe(0);
		});

		test('returns correct count', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_1_1']);
			expect(getAchievedCount(cells)).toBe(3);
		});

		test('returns 9 for perfect 3x3', () => {
			const allPositions = generateCellPositions(3);
			const cells = createCells(allPositions);
			expect(getAchievedCount(cells)).toBe(9);
		});
	});

	describe('getNearBingoLines', () => {
		test('returns empty array when no near bingo', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			expect(getNearBingoLines(cells, lines)).toEqual([]);
		});

		test('returns lines with exactly 2 achieved cells for 3x3', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1']);
			const lines = generateBingoLines(3);
			const result = getNearBingoLines(cells, lines);
			expect(result).toHaveLength(1);
			expect(result[0].positions).toEqual(['cell_0_0', 'cell_0_1', 'cell_0_2']);
		});

		test('does not return completed lines', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2']);
			const lines = generateBingoLines(3);
			const result = getNearBingoLines(cells, lines);
			expect(result).toEqual([]);
		});

		test('returns multiple near bingo lines', () => {
			// Near top row and near left column
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_1_0']);
			const lines = generateBingoLines(3);
			const result = getNearBingoLines(cells, lines);
			expect(result).toHaveLength(2);
		});

		test('detects near bingo for 4x4 (3 of 4 achieved)', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2'], 4);
			const lines = generateBingoLines(4);
			const result = getNearBingoLines(cells, lines);
			expect(result).toHaveLength(1);
		});
	});

	describe('getNearBingoPositions', () => {
		test('returns empty array when no near bingo', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			expect(getNearBingoPositions(cells, lines)).toEqual([]);
		});

		test('returns position to complete bingo', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1']);
			const lines = generateBingoLines(3);
			const result = getNearBingoPositions(cells, lines);
			expect(result).toContain('cell_0_2');
		});

		test('returns unique positions only', () => {
			// Multiple lines pointing to same position
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_1_0', 'cell_1_1']);
			const lines = generateBingoLines(3);
			const result = getNearBingoPositions(cells, lines);
			const unique = [...new Set(result)];
			expect(result.length).toBe(unique.length);
		});
	});

	describe('getBingoLinePositions', () => {
		test('returns empty array when no bingo', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			expect(getBingoLinePositions(cells, lines)).toEqual([]);
		});

		test('returns positions for completed line', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2']);
			const lines = generateBingoLines(3);
			const result = getBingoLinePositions(cells, lines);
			expect(result).toContain('cell_0_0');
			expect(result).toContain('cell_0_1');
			expect(result).toContain('cell_0_2');
		});

		test('returns unique positions for multiple lines', () => {
			// Two lines sharing cell_0_0
			const cells = createCells([
				'cell_0_0',
				'cell_0_1',
				'cell_0_2',
				'cell_1_0',
				'cell_2_0'
			]);
			const lines = generateBingoLines(3);
			const result = getBingoLinePositions(cells, lines);
			const unique = [...new Set(result)];
			expect(result.length).toBe(unique.length);
			expect(result).toHaveLength(5); // 3 from row + 3 from column - 1 shared
		});
	});

	describe('isPerfect', () => {
		test('returns false when not all cells achieved', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1']);
			expect(isPerfect(cells)).toBe(false);
		});

		test('returns false when 8 cells achieved', () => {
			const allPositions = generateCellPositions(3);
			const almostAll = allPositions.filter((p) => p !== 'cell_2_2');
			const cells = createCells(almostAll);
			expect(isPerfect(cells)).toBe(false);
		});

		test('returns true when all 9 cells achieved', () => {
			const allPositions = generateCellPositions(3);
			const cells = createCells(allPositions);
			expect(isPerfect(cells)).toBe(true);
		});
	});

	describe('getProgressSummary', () => {
		test('returns correct summary for empty board', () => {
			const cells = createCells([]);
			const lines = generateBingoLines(3);
			const result = getProgressSummary(cells, lines);
			expect(result).toEqual({
				achieved: 0,
				total: 9,
				bingoCount: 0,
				isPerfect: false,
				hint: null
			});
		});

		test('returns hint when near bingo', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1']);
			const lines = generateBingoLines(3);
			const result = getProgressSummary(cells, lines);
			expect(result.achieved).toBe(2);
			expect(result.bingoCount).toBe(0);
			expect(result.hint).not.toBeNull();
			expect(result.hint).toContain('1');
		});

		test('returns no hint when bingo already achieved', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_0_2']);
			const lines = generateBingoLines(3);
			const result = getProgressSummary(cells, lines);
			expect(result.bingoCount).toBe(1);
			expect(result.hint).toBeNull();
		});

		test('returns hint for multiple near bingos', () => {
			const cells = createCells(['cell_0_0', 'cell_0_1', 'cell_1_0', 'cell_1_1']);
			const lines = generateBingoLines(3);
			const result = getProgressSummary(cells, lines);
			expect(result.hint).not.toBeNull();
		});

		test('returns correct summary for perfect 3x3', () => {
			const allPositions = generateCellPositions(3);
			const cells = createCells(allPositions);
			const lines = generateBingoLines(3);
			const result = getProgressSummary(cells, lines);
			expect(result).toEqual({
				achieved: 9,
				total: 9,
				bingoCount: 8,
				isPerfect: true,
				hint: null
			});
		});

		test('returns correct total for 5x5', () => {
			const cells = createCells([], 5);
			const lines = generateBingoLines(5);
			const result = getProgressSummary(cells, lines);
			expect(result.total).toBe(25);
		});
	});
});
