import type { StorageAdapter } from './storageAdapter';
import type { AppState, BingoBoard, Cell, BoardSize } from '$lib/types/bingo';

export const STORAGE_KEY = 'bingo-goal-app-state';

type StoredBoard = Omit<BingoBoard, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

type LegacyStoredBoard = Omit<StoredBoard, 'name'> & {
	year?: number;
	name?: string;
};

type StoredState = {
	boards: (StoredBoard | LegacyStoredBoard)[];
	currentBoardId: string | null;
	isSaving: boolean;
};

const LEGACY_POSITION_MAP: Record<string, string> = {
	topLeft: 'cell_0_0',
	topCenter: 'cell_0_1',
	topRight: 'cell_0_2',
	middleLeft: 'cell_1_0',
	middleCenter: 'cell_1_1',
	middleRight: 'cell_1_2',
	bottomLeft: 'cell_2_0',
	bottomCenter: 'cell_2_1',
	bottomRight: 'cell_2_2'
};

function isLegacyPosition(position: string): boolean {
	return position in LEGACY_POSITION_MAP;
}

function migrateCellPosition(position: string): string {
	if (isLegacyPosition(position)) {
		return LEGACY_POSITION_MAP[position];
	}
	return position;
}

function migrateBoard(board: StoredBoard | LegacyStoredBoard): BingoBoard {
	const legacyBoard = board as LegacyStoredBoard;
	const name =
		legacyBoard.name ?? (legacyBoard.year ? `${legacyBoard.year} Goals` : 'Untitled Board');
	const size: BoardSize = (board as { size?: BoardSize }).size ?? 3;
	const cells: Cell[] = board.cells.map((cell) => ({
		...cell,
		position: migrateCellPosition(cell.position as string)
	})) as Cell[];

	return {
		id: board.id,
		name,
		size,
		cells,
		createdAt: new Date(board.createdAt),
		updatedAt: new Date(board.updatedAt)
	};
}

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
	const adapter = createLocalStorageAdapter();
	// This is a synchronous check for localStorage
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
