import { describe, test, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	boardStore,
	createBoard,
	updateCell,
	toggleAchieved,
	deleteBoard,
	setCurrentBoard,
	currentBoard,
	resetStore
} from './boardStore';
import type { CellPosition } from '$lib/types/bingo';

describe('boardStore', () => {
	beforeEach(() => {
		resetStore();
	});

	test('initial state has empty boards array', () => {
		const state = get(boardStore);
		expect(state.boards).toEqual([]);
		expect(state.currentBoardId).toBeNull();
		expect(state.isSaving).toBe(false);
	});

	test('createBoard() creates new board with 9 cells', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);

		expect(state.boards).toHaveLength(1);
		expect(state.boards[0].name).toBe('2025 Goals');
		expect(state.boards[0].cells).toHaveLength(9);
		expect(state.currentBoardId).toBe(state.boards[0].id);
	});

	test('createBoard() initializes cells with empty goals', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const board = state.boards[0];

		board.cells.forEach((cell) => {
			expect(cell.goal).toBe('');
			expect(cell.isAchieved).toBe(false);
		});
	});

	test('updateCell() updates goal text for specified position', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		updateCell(boardId, 'cell_0_0', 'Learn TypeScript');

		const updatedState = get(boardStore);
		const cell = updatedState.boards[0].cells.find((c) => c.position === 'cell_0_0');
		expect(cell?.goal).toBe('Learn TypeScript');
	});

	test('updateCell() updates updatedAt timestamp', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const boardId = state.boards[0].id;
		const originalUpdatedAt = state.boards[0].updatedAt;

		vi.useFakeTimers();
		vi.advanceTimersByTime(1000);
		updateCell(boardId, 'cell_0_0', 'New Goal');
		vi.useRealTimers();

		const updatedState = get(boardStore);
		expect(updatedState.boards[0].updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
	});

	test('toggleAchieved() toggles isAchieved for cell', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		toggleAchieved(boardId, 'cell_1_1');

		const updatedState = get(boardStore);
		const cell = updatedState.boards[0].cells.find((c) => c.position === 'cell_1_1');
		expect(cell?.isAchieved).toBe(true);

		toggleAchieved(boardId, 'cell_1_1');

		const toggledBack = get(boardStore);
		const cellAfterToggle = toggledBack.boards[0].cells.find((c) => c.position === 'cell_1_1');
		expect(cellAfterToggle?.isAchieved).toBe(false);
	});

	test('deleteBoard() removes board from list', async () => {
		createBoard('2025 Goals');
		createBoard('2026 Goals');
		const state = get(boardStore);
		expect(state.boards).toHaveLength(2);

		const boardIdToDelete = state.boards[0].id;
		await deleteBoard(boardIdToDelete);

		const updatedState = get(boardStore);
		expect(updatedState.boards).toHaveLength(1);
		expect(updatedState.boards.find((b) => b.id === boardIdToDelete)).toBeUndefined();
	});

	test('deleteBoard() clears currentBoardId when deleting current board', async () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		expect(state.currentBoardId).toBe(boardId);

		await deleteBoard(boardId);

		const updatedState = get(boardStore);
		expect(updatedState.currentBoardId).toBeNull();
	});

	test('setCurrentBoard() sets currentBoardId', () => {
		createBoard('2025 Goals');
		createBoard('2026 Goals');
		const state = get(boardStore);
		const secondBoardId = state.boards[1].id;

		setCurrentBoard(secondBoardId);

		const updatedState = get(boardStore);
		expect(updatedState.currentBoardId).toBe(secondBoardId);
	});

	test('currentBoard derived store returns current board', () => {
		createBoard('2025 Goals');
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		const board = get(currentBoard);
		expect(board?.id).toBe(boardId);
		expect(board?.name).toBe('2025 Goals');
	});

	test('currentBoard returns null when no board selected', () => {
		const board = get(currentBoard);
		expect(board).toBeNull();
	});

	test('allows multiple boards with same name', () => {
		createBoard('2025 Goals');
		createBoard('2025 Goals');
		const state = get(boardStore);

		expect(state.boards).toHaveLength(2);
	});

	test('createBoard() creates 3x3 board by default', () => {
		createBoard('Test');
		const state = get(boardStore);
		expect(state.boards[0].size).toBe(3);
		expect(state.boards[0].cells).toHaveLength(9);
	});

	test('createBoard() creates 4x4 board when size=4', () => {
		createBoard('Test', 4);
		const state = get(boardStore);
		expect(state.boards[0].size).toBe(4);
		expect(state.boards[0].cells).toHaveLength(16);
	});

	test('createBoard() creates 5x5 board when size=5', () => {
		createBoard('Test', 5);
		const state = get(boardStore);
		expect(state.boards[0].size).toBe(5);
		expect(state.boards[0].cells).toHaveLength(25);
	});
});
