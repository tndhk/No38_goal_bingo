import { writable, derived, get } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppState, BingoBoard, CellPosition, BoardSize, Cell } from '$lib/types/bingo';
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

// Module-level state grouped together
const storeState = {
	debounceTimer: null as ReturnType<typeof setTimeout> | null,
	isInitialized: false,
	adapter: createLocalStorageAdapter() as StorageAdapter,
	supabaseClient: null as SupabaseClient<Database> | null,
	userId: null as string | null
};

function isAuthenticated(): boolean {
	return storeState.userId !== null;
}

/**
 * Update cells in a board and return the updated board
 */
function updateBoardCells(
	board: BingoBoard,
	position: CellPosition,
	cellUpdater: (cell: Cell) => Cell
): BingoBoard {
	const updatedCells = board.cells.map((cell) =>
		cell.position === position ? cellUpdater(cell) : cell
	);
	return {
		...board,
		cells: updatedCells,
		updatedAt: new Date()
	};
}

/**
 * Update a board in the state by its ID
 */
function updateBoardInState(
	state: AppState,
	boardId: string,
	boardUpdater: (board: BingoBoard) => BingoBoard
): AppState {
	const boardIndex = state.boards.findIndex((b) => b.id === boardId);
	if (boardIndex === -1) return state;

	const updatedBoards = [...state.boards];
	updatedBoards[boardIndex] = boardUpdater(state.boards[boardIndex]);

	return {
		...state,
		boards: updatedBoards
	};
}

function createBoardStore() {
	const { subscribe, set, update } = writable<AppState>(initialState);

	return {
		subscribe,
		set,
		update,
		reset: () => {
			if (storeState.debounceTimer) clearTimeout(storeState.debounceTimer);
			storeState.isInitialized = false;
			set({ ...initialState });
		}
	};
}

export const boardStore = createBoardStore();

export function setSupabaseClient(
	client: SupabaseClient<Database> | null,
	userId: string | null
): void {
	storeState.supabaseClient = client;
	const wasAuthenticated = isAuthenticated();
	const isNowAuthenticated = userId !== null;
	storeState.userId = userId;

	if (isNowAuthenticated && client) {
		storeState.adapter = createSupabaseAdapter(client, userId);

		if (!wasAuthenticated) {
			handleLoginMerge();
		} else {
			reloadFromCloud();
		}
	} else {
		storeState.adapter = createLocalStorageAdapter();

		if (wasAuthenticated && !isNowAuthenticated) {
			handleLogout();
		}
	}
}

async function handleLoginMerge(): Promise<void> {
	if (!storeState.supabaseClient || !storeState.userId) return;

	const localData = getLocalStorageData();
	const cloudData = await storeState.adapter.load();
	const boardsToUpload = getBoardsToUpload(localData, cloudData);

	if (boardsToUpload.length > 0) {
		const results = await Promise.allSettled(
			boardsToUpload.map((board) => storeState.adapter.saveBoard(board))
		);

		const failures = results.filter(
			(r): r is PromiseRejectedResult => r.status === 'rejected'
		);
		if (failures.length > 0) {
			console.error(
				'Failed to upload some local boards:',
				failures.map((f) => f.reason)
			);
		}
	}

	const mergedState = mergeLocalDataToCloud(localData, cloudData);
	boardStore.set(mergedState);

	clearLocalStorage();

	storeState.isInitialized = true;
}

async function reloadFromCloud(): Promise<void> {
	const cloudData = await storeState.adapter.load();
	if (cloudData) {
		boardStore.set(cloudData);
	}
	storeState.isInitialized = true;
}

function handleLogout(): void {
	clearLocalStorage();
	boardStore.reset();
	storeState.isInitialized = false;
}

async function triggerAutoSave(): Promise<void> {
	if (storeState.debounceTimer) clearTimeout(storeState.debounceTimer);

	boardStore.update((state) => ({ ...state, isSaving: true }));

	storeState.debounceTimer = setTimeout(async () => {
		const state = get(boardStore);

		try {
			await storeState.adapter.save(state);
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
	if (storeState.isInitialized) return;

	const stored = await storeState.adapter.load();
	if (stored) {
		boardStore.set(stored);
	}
	storeState.isInitialized = true;
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
	boardStore.update((state) =>
		updateBoardInState(state, boardId, (board) =>
			updateBoardCells(board, position, (cell) => ({ ...cell, goal }))
		)
	);
	triggerAutoSave();
}

export function toggleAchieved(boardId: string, position: CellPosition): void {
	boardStore.update((state) =>
		updateBoardInState(state, boardId, (board) =>
			updateBoardCells(board, position, (cell) => ({ ...cell, isAchieved: !cell.isAchieved }))
		)
	);
	triggerAutoSave();
}

export async function deleteBoard(boardId: string): Promise<void> {
	await storeState.adapter.deleteBoard(boardId);

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
