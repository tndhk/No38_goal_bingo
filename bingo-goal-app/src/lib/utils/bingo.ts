import type { Cell, BingoLine, CellPosition } from '$lib/types/bingo';
import { BINGO_LINES } from '$lib/types/bingo';

export type ProgressSummary = {
	achieved: number;
	total: number;
	bingoCount: number;
	isPerfect: boolean;
	hint: string | null;
};

function isLineCompleted(line: BingoLine, achievedPositions: Set<CellPosition>): boolean {
	return line.positions.every((pos) => achievedPositions.has(pos));
}

function getAchievedCountForLine(line: BingoLine, achievedPositions: Set<CellPosition>): number {
	return line.positions.filter((pos) => achievedPositions.has(pos)).length;
}

export function getCompletedLines(cells: Cell[]): BingoLine[] {
	const achievedPositions = new Set(
		cells.filter((c) => c.isAchieved).map((c) => c.position)
	);

	return BINGO_LINES.filter((line) => isLineCompleted(line, achievedPositions));
}

export function getBingoCount(cells: Cell[]): number {
	return getCompletedLines(cells).length;
}

export function getAchievedCount(cells: Cell[]): number {
	return cells.filter((c) => c.isAchieved).length;
}

export function getNearBingoLines(cells: Cell[]): BingoLine[] {
	const achievedPositions = new Set(
		cells.filter((c) => c.isAchieved).map((c) => c.position)
	);

	return BINGO_LINES.filter((line) => {
		const achievedCount = getAchievedCountForLine(line, achievedPositions);
		return achievedCount === 2;
	});
}

export function getNearBingoPositions(cells: Cell[]): CellPosition[] {
	const achievedPositions = new Set(
		cells.filter((c) => c.isAchieved).map((c) => c.position)
	);

	const nearLines = getNearBingoLines(cells);
	const positions = new Set<CellPosition>();

	for (const line of nearLines) {
		const missing = line.positions.find((pos) => !achievedPositions.has(pos));
		if (missing) {
			positions.add(missing);
		}
	}

	return [...positions];
}

export function getBingoLinePositions(cells: Cell[]): CellPosition[] {
	const completedLines = getCompletedLines(cells);
	const positions = new Set<CellPosition>();

	for (const line of completedLines) {
		for (const pos of line.positions) {
			positions.add(pos);
		}
	}

	return [...positions];
}

export function isPerfect(cells: Cell[]): boolean {
	return cells.every((c) => c.isAchieved);
}

export function getProgressSummary(cells: Cell[]): ProgressSummary {
	const achieved = getAchievedCount(cells);
	const bingoCount = getBingoCount(cells);
	const perfect = isPerfect(cells);
	const nearBingoLines = getNearBingoLines(cells);

	let hint: string | null = null;

	if (!perfect && bingoCount === 0 && nearBingoLines.length > 0) {
		const count = nearBingoLines.length;
		hint = `あと1マスでビンゴ! (${count}ライン)`;
	}

	return {
		achieved,
		total: 9,
		bingoCount,
		isPerfect: perfect,
		hint
	};
}
