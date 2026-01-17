import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BingoGrid from './BingoGrid.svelte';
import type { BingoBoard, CellPosition, BoardSize } from '$lib/types/bingo';
import { generateCellPositions } from '$lib/types/bingo';

describe('BingoGrid', () => {
	const createBoard = (size: BoardSize = 3): BingoBoard => ({
		id: 'test-board-id',
		name: '2025 Goals',
		size,
		cells: generateCellPositions(size).map((position) => ({
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

	test('renders grid layout', () => {
		const board = createBoard();
		const { container } = render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		const grid = container.querySelector('.grid-container');
		expect(grid).toBeTruthy();
	});

	test('calls onCellTap with position when cell is tapped', async () => {
		const board = createBoard();
		const onCellTap = vi.fn();
		render(BingoGrid, { props: { board, onCellTap } });

		const buttons = screen.getAllByRole('button');
		await fireEvent.mouseDown(buttons[0]);
		await fireEvent.mouseUp(buttons[0]);

		expect(onCellTap).toHaveBeenCalledTimes(1);
		expect(onCellTap).toHaveBeenCalledWith('cell_0_0');
	});

	test('calls onCellLongPress with position on long press', async () => {
		vi.useFakeTimers();
		const board = createBoard();
		const onCellTap = vi.fn();
		const onCellLongPress = vi.fn();
		render(BingoGrid, { props: { board, onCellTap, onCellLongPress } });

		const buttons = screen.getAllByRole('button');
		await fireEvent.mouseDown(buttons[0]);

		vi.advanceTimersByTime(500);

		await fireEvent.mouseUp(buttons[0]);

		expect(onCellLongPress).toHaveBeenCalledTimes(1);
		expect(onCellLongPress).toHaveBeenCalledWith('cell_0_0');
		expect(onCellTap).not.toHaveBeenCalled();
		vi.useRealTimers();
	});

	test('displays goal text in each cell', () => {
		const board = createBoard();
		board.cells[0].goal = 'First Goal';
		render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		expect(screen.getByText('First Goal')).toBeTruthy();
	});

	test('highlights cells that are part of highlightedPositions', () => {
		const board = createBoard();
		const highlightedPositions: CellPosition[] = ['cell_0_0', 'cell_1_1', 'cell_2_2'];
		const { container } = render(BingoGrid, {
			props: { board, onCellTap: vi.fn(), highlightedPositions }
		});

		const buttons = container.querySelectorAll('button');
		const topLeftButton = buttons[0];
		expect(topLeftButton.classList.contains('bingo-highlight')).toBe(true);
	});

	test('renders 16 cells for 4x4 board', () => {
		const board = createBoard(4);
		render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(16);
	});

	test('renders 25 cells for 5x5 board', () => {
		const board = createBoard(5);
		render(BingoGrid, { props: { board, onCellTap: vi.fn() } });

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(25);
	});

	test('applies correct grid columns for different sizes', () => {
		const board4x4 = createBoard(4);
		const { container } = render(BingoGrid, { props: { board: board4x4, onCellTap: vi.fn() } });

		const grid = container.querySelector('.grid-container') as HTMLElement;
		expect(grid.style.getPropertyValue('--grid-size')).toBe('4');
	});
});
