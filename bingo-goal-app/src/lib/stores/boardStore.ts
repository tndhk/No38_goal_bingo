import { writable, derived } from 'svelte/store';
import type { AppState, BingoBoard, CellPosition } from '$lib/types/bingo';
import { createEmptyBoard } from '$lib/types/bingo';
import { saveToStorage, loadFromStorage } from '$lib/utils/storage';

const DEBOUNCE_MS = 500;

const initialState: AppState = {
	boards: [],
	currentBoardId: null,
	isSaving: false
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;

function createBoardStore() {
	const { subscribe, set, update } = writable<AppState>(initialState);

	return {
		subscribe,
		set,
		update,
		reset: () => {
			if (debounceTimer) clearTimeout(debounceTimer);
			isInitialized = false;
			set({ ...initialState });
		}
	};
}

export const boardStore = createBoardStore();

function triggerAutoSave() {
	if (debounceTimer) clearTimeout(debounceTimer);

	boardStore.update((state) => ({ ...state, isSaving: true }));

	debounceTimer = setTimeout(() => {
		boardStore.update((state) => {
			saveToStorage(state);
			return { ...state, isSaving: false };
		});
	}, DEBOUNCE_MS);
}

export function resetStore() {
	boardStore.reset();
}

export function initializeStore(): void {
	if (isInitialized) return;

	const stored = loadFromStorage();
	if (stored) {
		boardStore.set(stored);
	}
	isInitialized = true;
}

export function createBoard(name: string): void {
	boardStore.update((state) => {
		const newBoard = createEmptyBoard(name);
		return {
			...state,
			boards: [...state.boards, newBoard],
			currentBoardId: newBoard.id
		};
	});
	triggerAutoSave();
}

export function updateCell(boardId: string, position: CellPosition, goal: string): void {
	boardStore.update((state) => {
		const boardIndex = state.boards.findIndex((b) => b.id === boardId);
		if (boardIndex === -1) return state;

		const board = state.boards[boardIndex];
		const updatedCells = board.cells.map((cell) =>
			cell.position === position ? { ...cell, goal } : cell
		);

		const updatedBoard: BingoBoard = {
			...board,
			cells: updatedCells,
			updatedAt: new Date()
		};

		const updatedBoards = [...state.boards];
		updatedBoards[boardIndex] = updatedBoard;

		return {
			...state,
			boards: updatedBoards
		};
	});
	triggerAutoSave();
}

export function toggleAchieved(boardId: string, position: CellPosition): void {
	boardStore.update((state) => {
		const boardIndex = state.boards.findIndex((b) => b.id === boardId);
		if (boardIndex === -1) return state;

		const board = state.boards[boardIndex];
		const updatedCells = board.cells.map((cell) =>
			cell.position === position ? { ...cell, isAchieved: !cell.isAchieved } : cell
		);

		const updatedBoard: BingoBoard = {
			...board,
			cells: updatedCells,
			updatedAt: new Date()
		};

		const updatedBoards = [...state.boards];
		updatedBoards[boardIndex] = updatedBoard;

		return {
			...state,
			boards: updatedBoards
		};
	});
	triggerAutoSave();
}

export function deleteBoard(boardId: string): void {
	boardStore.update((state) => {
		const filteredBoards = state.boards.filter((b) => b.id !== boardId);
		const newCurrentBoardId = state.currentBoardId === boardId ? null : state.currentBoardId;

		return {
			...state,
			boards: filteredBoards,
			currentBoardId: newCurrentBoardId
		};
	});
	triggerAutoSave();
}

export function setCurrentBoard(boardId: string | null): void {
	boardStore.update((state) => ({
		...state,
		currentBoardId: boardId
	}));
}

export function setIsSaving(isSaving: boolean): void {
	boardStore.update((state) => ({
		...state,
		isSaving
	}));
}

export const currentBoard = derived(boardStore, ($state) => {
	if (!$state.currentBoardId) return null;
	return $state.boards.find((b) => b.id === $state.currentBoardId) ?? null;
});
