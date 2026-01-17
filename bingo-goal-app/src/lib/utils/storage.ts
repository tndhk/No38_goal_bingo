import type { AppState, BingoBoard } from '$lib/types/bingo';

export const STORAGE_KEY = 'bingo-goal-app-state';

type StoredBoard = Omit<BingoBoard, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

// Legacy type for migration (year-based boards)
type LegacyStoredBoard = Omit<StoredBoard, 'name'> & {
	year?: number;
	name?: string;
};

type StoredState = {
	boards: (StoredBoard | LegacyStoredBoard)[];
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

// Migrate legacy board (year-based) to new format (name-based)
function migrateBoard(board: StoredBoard | LegacyStoredBoard): BingoBoard {
	const legacyBoard = board as LegacyStoredBoard;

	// If board has year but no name, migrate it
	const name =
		legacyBoard.name ?? (legacyBoard.year ? `${legacyBoard.year} Goals` : 'Untitled Board');

	return {
		id: board.id,
		name,
		cells: board.cells,
		createdAt: new Date(board.createdAt),
		updatedAt: new Date(board.updatedAt)
	};
}

export function loadFromStorage(): AppState | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return null;

		const parsed: StoredState = JSON.parse(stored);

		const state: AppState = {
			boards: parsed.boards.map(migrateBoard),
			currentBoardId: parsed.currentBoardId,
			isSaving: false
		};

		return state;
	} catch {
		console.error('Failed to load from localStorage');
		return null;
	}
}
