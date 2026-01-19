import type { StorageAdapter } from './storageAdapter';
import type { AppState, BingoBoard } from '$lib/types/bingo';
import { STORAGE_KEY, migrateBoard, boardToStoredBoard, type StoredState } from './migration';

export function createLocalStorageAdapter(): StorageAdapter {
	return {
		async load(): Promise<AppState | null> {
			try {
				const stored = localStorage.getItem(STORAGE_KEY);
				if (!stored) return null;

				const parsed: StoredState = JSON.parse(stored);
				return {
					boards: parsed.boards.map(migrateBoard),
					currentBoardId: parsed.currentBoardId,
					isSaving: false
				};
			} catch {
				console.error('Failed to load from localStorage');
				return null;
			}
		},

		async save(state: AppState): Promise<void> {
			try {
				const dataToStore: StoredState = {
					boards: state.boards.map(boardToStoredBoard),
					currentBoardId: state.currentBoardId,
					isSaving: false
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
			} catch {
				console.error('Failed to save to localStorage');
			}
		},

		async saveBoard(_board: BingoBoard): Promise<void> {
			// For localStorage, we save the entire state
			// This method is called from boardStore which handles full state save
		},

		async deleteBoard(_boardId: string): Promise<void> {
			// For localStorage, we save the entire state after deletion
			// This method is called from boardStore which handles full state save
		}
	};
}

export function clearLocalStorage(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		console.error('Failed to clear localStorage');
	}
}

export function getLocalStorageData(): AppState | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return null;

		const parsed: StoredState = JSON.parse(stored);
		return {
			boards: parsed.boards.map(migrateBoard),
			currentBoardId: parsed.currentBoardId,
			isSaving: false
		};
	} catch {
		return null;
	}
}
