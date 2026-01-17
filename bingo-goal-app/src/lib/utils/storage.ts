import type { AppState, BingoBoard, CellPosition, BoardSize, Cell } from '$lib/types/bingo';

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

// Legacy CellPosition format to new format mapping
const LEGACY_POSITION_MAP: Record<string, CellPosition> = {
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

function migrateCellPosition(position: string): CellPosition {
	if (isLegacyPosition(position)) {
		return LEGACY_POSITION_MAP[position];
	}
	return position as CellPosition;
}

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

	// Determine size: use existing size property or default to 3 for legacy boards
	const size: BoardSize = (board as { size?: BoardSize }).size ?? 3;

	// Migrate cell positions from legacy format to new format
	const cells: Cell[] = board.cells.map((cell) => ({
		...cell,
		position: migrateCellPosition(cell.position as string)
	}));

	return {
		id: board.id,
		name,
		size,
		cells,
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
