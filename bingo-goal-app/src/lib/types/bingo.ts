// Board size type for variable grid sizes
export type BoardSize = 3 | 4 | 5;

// Cell position as template literal for dynamic grid sizes
export type CellPosition = `cell_${number}_${number}`;

// Generate a cell position string from row and column
export function generateCellPosition(row: number, col: number): CellPosition {
	return `cell_${row}_${col}`;
}

// Generate all cell positions for a given board size
export function generateCellPositions(size: BoardSize): CellPosition[] {
	const positions: CellPosition[] = [];
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			positions.push(generateCellPosition(row, col));
		}
	}
	return positions;
}

// Legacy cell positions for backward compatibility
export type LegacyCellPosition =
	| 'topLeft'
	| 'topCenter'
	| 'topRight'
	| 'middleLeft'
	| 'middleCenter'
	| 'middleRight'
	| 'bottomLeft'
	| 'bottomCenter'
	| 'bottomRight';

export const CELL_POSITIONS: CellPosition[] = generateCellPositions(3);

export type Cell = {
	position: CellPosition;
	goal: string;
	isAchieved: boolean;
};

export type BingoLine = {
	type: 'row' | 'column' | 'diagonal';
	positions: CellPosition[];
};

// Generate bingo lines dynamically based on board size
export function generateBingoLines(size: BoardSize): BingoLine[] {
	const lines: BingoLine[] = [];

	// Rows
	for (let row = 0; row < size; row++) {
		lines.push({
			type: 'row',
			positions: Array.from({ length: size }, (_, col) => generateCellPosition(row, col))
		});
	}

	// Columns
	for (let col = 0; col < size; col++) {
		lines.push({
			type: 'column',
			positions: Array.from({ length: size }, (_, row) => generateCellPosition(row, col))
		});
	}

	// Diagonal (top-left to bottom-right)
	lines.push({
		type: 'diagonal',
		positions: Array.from({ length: size }, (_, i) => generateCellPosition(i, i))
	});

	// Diagonal (top-right to bottom-left)
	lines.push({
		type: 'diagonal',
		positions: Array.from({ length: size }, (_, i) => generateCellPosition(i, size - 1 - i))
	});

	return lines;
}

// Legacy BINGO_LINES for backward compatibility
export const BINGO_LINES: BingoLine[] = generateBingoLines(3);

export type BingoBoard = {
	id: string;
	name: string;
	size: BoardSize;
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
export function createEmptyBoard(name: string, size: BoardSize = 3): BingoBoard {
	return {
		id: crypto.randomUUID(),
		name,
		size,
		cells: generateCellPositions(size).map((position) => ({
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
