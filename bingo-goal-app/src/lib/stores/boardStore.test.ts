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
		createBoard(2025);
		const state = get(boardStore);

		expect(state.boards).toHaveLength(1);
		expect(state.boards[0].year).toBe(2025);
		expect(state.boards[0].cells).toHaveLength(9);
		expect(state.currentBoardId).toBe(state.boards[0].id);
	});

	test('createBoard() initializes cells with empty goals', () => {
		createBoard(2025);
		const state = get(boardStore);
		const board = state.boards[0];

		board.cells.forEach((cell) => {
			expect(cell.goal).toBe('');
			expect(cell.isAchieved).toBe(false);
		});
	});

	test('updateCell() updates goal text for specified position', () => {
		createBoard(2025);
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		updateCell(boardId, 'topLeft', 'Learn TypeScript');

		const updatedState = get(boardStore);
		const cell = updatedState.boards[0].cells.find((c) => c.position === 'topLeft');
		expect(cell?.goal).toBe('Learn TypeScript');
	});

	test('updateCell() updates updatedAt timestamp', () => {
		createBoard(2025);
		const state = get(boardStore);
		const boardId = state.boards[0].id;
		const originalUpdatedAt = state.boards[0].updatedAt;

		vi.useFakeTimers();
		vi.advanceTimersByTime(1000);
		updateCell(boardId, 'topLeft', 'New Goal');
		vi.useRealTimers();

		const updatedState = get(boardStore);
		expect(updatedState.boards[0].updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
	});

	test('toggleAchieved() toggles isAchieved for cell', () => {
		createBoard(2025);
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		toggleAchieved(boardId, 'middleCenter');

		const updatedState = get(boardStore);
		const cell = updatedState.boards[0].cells.find((c) => c.position === 'middleCenter');
		expect(cell?.isAchieved).toBe(true);

		toggleAchieved(boardId, 'middleCenter');

		const toggledBack = get(boardStore);
		const cellAfterToggle = toggledBack.boards[0].cells.find((c) => c.position === 'middleCenter');
		expect(cellAfterToggle?.isAchieved).toBe(false);
	});

	test('deleteBoard() removes board from list', () => {
		createBoard(2025);
		createBoard(2026);
		const state = get(boardStore);
		expect(state.boards).toHaveLength(2);

		const boardIdToDelete = state.boards[0].id;
		deleteBoard(boardIdToDelete);

		const updatedState = get(boardStore);
		expect(updatedState.boards).toHaveLength(1);
		expect(updatedState.boards.find((b) => b.id === boardIdToDelete)).toBeUndefined();
	});

	test('deleteBoard() clears currentBoardId when deleting current board', () => {
		createBoard(2025);
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		expect(state.currentBoardId).toBe(boardId);

		deleteBoard(boardId);

		const updatedState = get(boardStore);
		expect(updatedState.currentBoardId).toBeNull();
	});

	test('setCurrentBoard() sets currentBoardId', () => {
		createBoard(2025);
		createBoard(2026);
		const state = get(boardStore);
		const secondBoardId = state.boards[1].id;

		setCurrentBoard(secondBoardId);

		const updatedState = get(boardStore);
		expect(updatedState.currentBoardId).toBe(secondBoardId);
	});

	test('currentBoard derived store returns current board', () => {
		createBoard(2025);
		const state = get(boardStore);
		const boardId = state.boards[0].id;

		const board = get(currentBoard);
		expect(board?.id).toBe(boardId);
		expect(board?.year).toBe(2025);
	});

	test('currentBoard returns null when no board selected', () => {
		const board = get(currentBoard);
		expect(board).toBeNull();
	});

	test('prevents duplicate year boards', () => {
		createBoard(2025);
		createBoard(2025);
		const state = get(boardStore);

		expect(state.boards).toHaveLength(1);
	});
});
