import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BingoGrid from './BingoGrid.svelte';
import type { BingoBoard, CellPosition } from '$lib/types/bingo';
import { CELL_POSITIONS } from '$lib/types/bingo';

describe('BingoGrid', () => {
	const createBoard = (): BingoBoard => ({
		id: 'test-board-id',
		name: '2025 Goals',
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
		expect(onCellTap).toHaveBeenCalledWith('topLeft');
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
		expect(onCellLongPress).toHaveBeenCalledWith('topLeft');
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
		const highlightedPositions: CellPosition[] = ['topLeft', 'middleCenter', 'bottomRight'];
		const { container } = render(BingoGrid, {
			props: { board, onCellTap: vi.fn(), highlightedPositions }
		});

		const buttons = container.querySelectorAll('button');
		const topLeftButton = buttons[0];
		expect(topLeftButton.classList.contains('bingo-highlight')).toBe(true);
	});
});
