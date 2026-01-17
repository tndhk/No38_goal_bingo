import { describe, test, expect } from 'vitest';
import {
	generateCellPosition,
	generateCellPositions,
	generateBingoLines,
	createEmptyBoard,
	type BoardSize
} from './bingo';

describe('generateCellPosition', () => {
	test('generates position string from row and column', () => {
		expect(generateCellPosition(0, 0)).toBe('cell_0_0');
		expect(generateCellPosition(2, 1)).toBe('cell_2_1');
	});
});

describe('generateCellPositions', () => {
	test('generates 9 positions for 3x3', () => {
		const positions = generateCellPositions(3);
		expect(positions).toHaveLength(9);
		expect(positions[0]).toBe('cell_0_0');
		expect(positions[8]).toBe('cell_2_2');
	});

	test('generates 16 positions for 4x4', () => {
		const positions = generateCellPositions(4);
		expect(positions).toHaveLength(16);
	});

	test('generates 25 positions for 5x5', () => {
		const positions = generateCellPositions(5);
		expect(positions).toHaveLength(25);
	});
});

describe('generateBingoLines', () => {
	test('generates 8 lines for 3x3 (3 rows + 3 cols + 2 diagonals)', () => {
		const lines = generateBingoLines(3);
		expect(lines).toHaveLength(8);
	});

	test('generates 10 lines for 4x4', () => {
		const lines = generateBingoLines(4);
		expect(lines).toHaveLength(10);
	});

	test('generates 12 lines for 5x5', () => {
		const lines = generateBingoLines(5);
		expect(lines).toHaveLength(12);
	});

	test('each line has correct number of positions', () => {
		const lines = generateBingoLines(4);
		lines.forEach((line) => {
			expect(line.positions).toHaveLength(4);
		});
	});

	test('diagonal lines are correct for 3x3', () => {
		const lines = generateBingoLines(3);
		const diagonals = lines.filter((l) => l.type === 'diagonal');
		expect(diagonals).toHaveLength(2);
		expect(diagonals[0].positions).toEqual(['cell_0_0', 'cell_1_1', 'cell_2_2']);
		expect(diagonals[1].positions).toEqual(['cell_0_2', 'cell_1_1', 'cell_2_0']);
	});
});

describe('createEmptyBoard', () => {
	test('creates 3x3 board by default', () => {
		const board = createEmptyBoard('Test');
		expect(board.size).toBe(3);
		expect(board.cells).toHaveLength(9);
	});

	test('creates 4x4 board when size=4', () => {
		const board = createEmptyBoard('Test', 4);
		expect(board.size).toBe(4);
		expect(board.cells).toHaveLength(16);
	});

	test('creates 5x5 board when size=5', () => {
		const board = createEmptyBoard('Test', 5);
		expect(board.size).toBe(5);
		expect(board.cells).toHaveLength(25);
	});

	test('cells have correct positions', () => {
		const board = createEmptyBoard('Test', 3);
		expect(board.cells[0].position).toBe('cell_0_0');
		expect(board.cells[4].position).toBe('cell_1_1');
	});

	test('board has required properties', () => {
		const board = createEmptyBoard('My Board');
		expect(board.id).toBeDefined();
		expect(board.name).toBe('My Board');
		expect(board.createdAt).toBeInstanceOf(Date);
		expect(board.updatedAt).toBeInstanceOf(Date);
	});
});
