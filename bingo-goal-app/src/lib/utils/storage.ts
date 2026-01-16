import type { AppState, BingoBoard } from '$lib/types/bingo';

export const STORAGE_KEY = 'bingo-goal-app-state';

type StoredBoard = Omit<BingoBoard, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

type StoredState = {
	boards: StoredBoard[];
	currentBoardId: string | null;
	isSaving: boolean;
};

export function saveToStorage(state: AppState): void {
	try {
		const dataToStore: StoredState = {
			boards: state.boards.map((board) => ({
				...board,
				createdAt: board.createdAt.toISOString(),
				updatedAt: board.updatedAt.toISOString()
			})),
			currentBoardId: state.currentBoardId,
			isSaving: false
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
	} catch {
		console.error('Failed to save to localStorage');
	}
}

export function loadFromStorage(): AppState | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return null;

		const parsed: StoredState = JSON.parse(stored);

		const state: AppState = {
			boards: parsed.boards.map((board) => ({
				...board,
				createdAt: new Date(board.createdAt),
				updatedAt: new Date(board.updatedAt)
			})),
			currentBoardId: parsed.currentBoardId,
			isSaving: false
		};

		return state;
	} catch {
		console.error('Failed to load from localStorage');
		return null;
	}
}
