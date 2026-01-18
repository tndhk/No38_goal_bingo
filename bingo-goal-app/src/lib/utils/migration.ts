/**
 * Board migration utilities for localStorage data format compatibility
 */
import type { BingoBoard, Cell, BoardSize, CellPosition } from '$lib/types/bingo';

export const STORAGE_KEY = 'bingo-goal-app-state';

export type StoredBoard = Omit<BingoBoard, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

export type LegacyStoredBoard = Omit<StoredBoard, 'name'> & {
	year?: number;
	name?: string;
};

export type StoredState = {
	boards: (StoredBoard | LegacyStoredBoard)[];
	currentBoardId: string | null;
	isSaving: boolean;
};

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

function isLegacyPosition(position: string): position is keyof typeof LEGACY_POSITION_MAP {
	return position in LEGACY_POSITION_MAP;
}

function migrateCellPosition(position: string): CellPosition {
	if (isLegacyPosition(position)) {
		return LEGACY_POSITION_MAP[position];
	}
	return position as CellPosition;
}

/**
 * Migrate legacy board (year-based) to new format (name-based)
 */
export function migrateBoard(board: StoredBoard | LegacyStoredBoard): BingoBoard {
	const legacyBoard = board as LegacyStoredBoard;

	const name =
		legacyBoard.name ?? (legacyBoard.year ? `${legacyBoard.year} Goals` : 'Untitled Board');

	const size: BoardSize = (board as { size?: BoardSize }).size ?? 3;

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

/**
 * Convert BingoBoard to StoredBoard format for persistence
 */
export function boardToStoredBoard(board: BingoBoard): StoredBoard {
	return {
		...board,
		createdAt: board.createdAt.toISOString(),
		updatedAt: board.updatedAt.toISOString()
	};
}
