import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BingoGrid from './BingoGrid.svelte';
import type { BingoBoard, CellPosition } from '$lib/types/bingo';
import { CELL_POSITIONS } from '$lib/types/bingo';

describe('BingoGrid', () => {
	const createBoard = (): BingoBoard => ({
		id: 'test-board-id',
		year: 2025,
		cells: CELL_POSITIONS.map((position) => ({
			position,
			goal: `Goal ${position}`,
			isAchieved: false
		})),
		createdAt: new Date(),
		updatedAt: new Date()
	});

	test('displays 9 cells', () => {
		const board = createBoard();
		render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(9);
	});

	test('renders 3x3 grid layout', () => {
		const board = createBoard();
		const { container } = render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		const grid = container.querySelector('.grid');
		expect(grid).toBeTruthy();
		expect(grid?.classList.contains('grid-cols-3')).toBe(true);
	});

	test('calls onCellTap with position when cell is tapped', async () => {
		const board = createBoard();
		const onCellTap = vi.fn();
		render(BingoGrid, { props: { board, onCellTap } });

		const buttons = screen.getAllByRole('button');
		await fireEvent.click(buttons[0]);

		expect(onCellTap).toHaveBeenCalledTimes(1);
		expect(onCellTap).toHaveBeenCalledWith('topLeft');
	});

	test('displays goal text in each cell', () => {
		const board = createBoard();
		board.cells[0].goal = 'First Goal';
		render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		expect(screen.getByText('First Goal')).toBeTruthy();
	});

	test('highlights cells that are part of highlightedPositions', () => {
		const board = createBoard();
		const highlightedPositions: CellPosition[] = ['topLeft', 'middleCenter', 'bottomRight'];
		const { container } = render(BingoGrid, {
			props: { board, onCellTap: vi.fn(), highlightedPositions }
		});

		const buttons = container.querySelectorAll('button');
		const topLeftButton = buttons[0];
		expect(topLeftButton.classList.contains('ring-bingo-line')).toBe(true);
	});
});
