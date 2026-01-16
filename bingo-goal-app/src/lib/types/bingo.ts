// Phase 2: Cell position as string literal for 3x3 grid
export type CellPosition =
	| 'topLeft'
	| 'topCenter'
	| 'topRight'
	| 'middleLeft'
	| 'middleCenter'
	| 'middleRight'
	| 'bottomLeft'
	| 'bottomCenter'
	| 'bottomRight';

export const CELL_POSITIONS: CellPosition[] = [
	'topLeft',
	'topCenter',
	'topRight',
	'middleLeft',
	'middleCenter',
	'middleRight',
	'bottomLeft',
	'bottomCenter',
	'bottomRight'
];

export type Cell = {
	position: CellPosition;
	goal: string;
	isAchieved: boolean;
};

export type BingoLine = {
	type: 'row' | 'column' | 'diagonal';
	positions: CellPosition[];
};

export const BINGO_LINES: BingoLine[] = [
	// Rows
	{ type: 'row', positions: ['topLeft', 'topCenter', 'topRight'] },
	{ type: 'row', positions: ['middleLeft', 'middleCenter', 'middleRight'] },
	{ type: 'row', positions: ['bottomLeft', 'bottomCenter', 'bottomRight'] },
	// Columns
	{ type: 'column', positions: ['topLeft', 'middleLeft', 'bottomLeft'] },
	{ type: 'column', positions: ['topCenter', 'middleCenter', 'bottomCenter'] },
	{ type: 'column', positions: ['topRight', 'middleRight', 'bottomRight'] },
	// Diagonals
	{ type: 'diagonal', positions: ['topLeft', 'middleCenter', 'bottomRight'] },
	{ type: 'diagonal', positions: ['topRight', 'middleCenter', 'bottomLeft'] }
];

export type BingoBoard = {
	id: string;
	year: number;
	cells: Cell[];
	createdAt: Date;
	updatedAt: Date;
};

export type AppState = {
	boards: BingoBoard[];
	currentBoardId: string | null;
	isSaving: boolean;
};

// Helper function to create empty board
export function createEmptyBoard(year: number): BingoBoard {
	return {
		id: crypto.randomUUID(),
		year,
		cells: CELL_POSITIONS.map((position) => ({
			position,
			goal: '',
			isAchieved: false
		})),
		createdAt: new Date(),
		updatedAt: new Date()
	};
}

// Helper to get cell by position
export function getCellByPosition(board: BingoBoard, position: CellPosition): Cell | undefined {
	return board.cells.find((cell) => cell.position === position);
}
