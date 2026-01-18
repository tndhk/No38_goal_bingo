import type { AppState } from '$lib/types/bingo';
import { STORAGE_KEY, migrateBoard, boardToStoredBoard, type StoredState } from './migration';

export { STORAGE_KEY };

export function saveToStorage(state: AppState): void {
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
}

export function loadFromStorage(): AppState | null {
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
}
