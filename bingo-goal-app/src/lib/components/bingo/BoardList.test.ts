import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BoardList from './BoardList.svelte';
import type { BingoBoard } from '$lib/types/bingo';
import { CELL_POSITIONS } from '$lib/types/bingo';

describe('BoardList', () => {
	const createBoard = (name: string, achievedCount: number = 0, createdAt?: Date): BingoBoard => ({
		id: `board-${name}`,
		name,
		cells: CELL_POSITIONS.map((position, index) => ({
			position,
			goal: `Goal ${position}`,
			isAchieved: index < achievedCount
		})),
		createdAt: createdAt ?? new Date(),
		updatedAt: new Date()
	});

	test('displays boards sorted by createdAt descending', () => {
		const boards = [
			createBoard('2023 Goals', 0, new Date('2023-01-01')),
			createBoard('2025 Goals', 0, new Date('2025-01-01')),
			createBoard('2024 Goals', 0, new Date('2024-01-01'))
		];
		render(BoardList, {
			props: { boards, onSelectBoard: vi.fn(), onDeleteBoard: vi.fn() }
		});

		const boardNames = screen.getAllByText(/\d{4} Goals/);
		expect(boardNames[0].textContent).toBe('2025 Goals');
		expect(boardNames[1].textContent).toBe('2024 Goals');
		expect(boardNames[2].textContent).toBe('2023 Goals');
	});

	test('displays achieved count for each board', () => {
		const boards = [createBoard('2025 Goals', 5)];
		render(BoardList, {
			props: { boards, onSelectBoard: vi.fn(), onDeleteBoard: vi.fn() }
		});

		expect(screen.getByText('5/9 achieved')).toBeTruthy();
	});

	test('displays Perfect badge when all 9 achieved', () => {
		const boards = [createBoard('2025 Goals', 9)];
		render(BoardList, {
			props: { boards, onSelectBoard: vi.fn(), onDeleteBoard: vi.fn() }
		});

		expect(screen.getByText('Perfect!')).toBeTruthy();
	});

	test('displays Bingo badge when bingo exists', () => {
		// Create a board with top row completed (topLeft, topCenter, topRight)
		const board = createBoard('2025 Goals', 0);
		board.cells[0].isAchieved = true; // topLeft
		board.cells[1].isAchieved = true; // topCenter
		board.cells[2].isAchieved = true; // topRight

		render(BoardList, {
			props: { boards: [board], onSelectBoard: vi.fn(), onDeleteBoard: vi.fn() }
		});

		expect(screen.getByText('1 Bingo')).toBeTruthy();
	});

	test('calls onSelectBoard with board id when card is clicked', async () => {
		const boards = [createBoard('2025 Goals')];
		const onSelectBoard = vi.fn();
		const { container } = render(BoardList, {
			props: { boards, onSelectBoard, onDeleteBoard: vi.fn() }
		});

		const card = container.querySelector('.card-button') as HTMLButtonElement;
		await fireEvent.click(card);

		expect(onSelectBoard).toHaveBeenCalledTimes(1);
		expect(onSelectBoard).toHaveBeenCalledWith('board-2025 Goals');
	});

	test('calls onDeleteBoard with board id when delete button is clicked', async () => {
		const boards = [createBoard('2025 Goals')];
		const onDeleteBoard = vi.fn();
		render(BoardList, {
			props: { boards, onSelectBoard: vi.fn(), onDeleteBoard }
		});

		const deleteButton = screen.getByRole('button', { name: /delete 2025 Goals/i });
		await fireEvent.click(deleteButton);

		expect(onDeleteBoard).toHaveBeenCalledTimes(1);
		expect(onDeleteBoard).toHaveBeenCalledWith('board-2025 Goals');
	});

	test('delete button click does not trigger onSelectBoard', async () => {
		const boards = [createBoard('2025 Goals')];
		const onSelectBoard = vi.fn();
		const onDeleteBoard = vi.fn();
		render(BoardList, {
			props: { boards, onSelectBoard, onDeleteBoard }
		});

		const deleteButton = screen.getByRole('button', { name: /delete 2025 Goals/i });
		await fireEvent.click(deleteButton);

		expect(onSelectBoard).not.toHaveBeenCalled();
		expect(onDeleteBoard).toHaveBeenCalledTimes(1);
	});

	test('renders empty when no boards provided', () => {
		const { container } = render(BoardList, {
			props: { boards: [], onSelectBoard: vi.fn(), onDeleteBoard: vi.fn() }
		});

		const cards = container.querySelectorAll('.board-card');
		expect(cards).toHaveLength(0);
	});
});
