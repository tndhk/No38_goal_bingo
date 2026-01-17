import { writable, derived, get } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppState, BingoBoard, CellPosition, BoardSize } from '$lib/types/bingo';
import { createEmptyBoard } from '$lib/types/bingo';
import type { StorageAdapter } from '$lib/utils/storageAdapter';
import {
	createLocalStorageAdapter,
	clearLocalStorage,
	getLocalStorageData
} from '$lib/utils/localStorageAdapter';
import { createSupabaseAdapter } from '$lib/utils/supabaseAdapter';
import { mergeLocalDataToCloud, getBoardsToUpload } from '$lib/utils/dataMerge';
import type { Database } from '$lib/supabase/types';

const DEBOUNCE_MS = 500;

const initialState: AppState = {
	boards: [],
	currentBoardId: null,
	isSaving: false
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;
let currentAdapter: StorageAdapter = createLocalStorageAdapter();
let supabaseClient: SupabaseClient<Database> | null = null;
let currentUserId: string | null = null;

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

export function setSupabaseClient(
	client: SupabaseClient<Database> | null,
	userId: string | null
): void {
	supabaseClient = client;
	const wasAuthenticated = currentUserId !== null;
	const isNowAuthenticated = userId !== null;
	currentUserId = userId;

	if (isNowAuthenticated && client) {
		currentAdapter = createSupabaseAdapter(client, userId);

		if (!wasAuthenticated) {
			handleLoginMerge();
		} else {
			reloadFromCloud();
		}
	} else {
		currentAdapter = createLocalStorageAdapter();

		if (wasAuthenticated && !isNowAuthenticated) {
			handleLogout();
		}
	}
}

async function handleLoginMerge(): Promise<void> {
	if (!supabaseClient || !currentUserId) return;

	const localData = getLocalStorageData();
	const cloudData = await currentAdapter.load();
	const boardsToUpload = getBoardsToUpload(localData, cloudData);

	if (boardsToUpload.length > 0) {
		for (const board of boardsToUpload) {
			await currentAdapter.saveBoard(board);
		}
	}

	const mergedState = mergeLocalDataToCloud(localData, cloudData);
	boardStore.set(mergedState);

	clearLocalStorage();

	isInitialized = true;
}

async function reloadFromCloud(): Promise<void> {
	const cloudData = await currentAdapter.load();
	if (cloudData) {
		boardStore.set(cloudData);
	}
	isInitialized = true;
}

function handleLogout(): void {
	clearLocalStorage();
	boardStore.reset();
	isInitialized = false;
}

async function triggerAutoSave(): Promise<void> {
	if (debounceTimer) clearTimeout(debounceTimer);

	boardStore.update((state) => ({ ...state, isSaving: true }));

	debounceTimer = setTimeout(async () => {
		const state = get(boardStore);

		try {
			await currentAdapter.save(state);
		} catch (error) {
			console.error('Failed to save:', error);
		}

		boardStore.update((s) => ({ ...s, isSaving: false }));
	}, DEBOUNCE_MS);
}

export function resetStore(): void {
	boardStore.reset();
}

export async function initializeStore(): Promise<void> {
	if (isInitialized) return;

	const stored = await currentAdapter.load();
	if (stored) {
		boardStore.set(stored);
	}
	isInitialized = true;
}

export function createBoard(name: string, size: BoardSize = 3): void {
	boardStore.update((state) => {
		const newBoard = createEmptyBoard(name, size);
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

export async function deleteBoard(boardId: string): Promise<void> {
	await currentAdapter.deleteBoard(boardId);

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
