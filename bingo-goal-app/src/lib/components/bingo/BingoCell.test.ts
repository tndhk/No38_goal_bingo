import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import BingoCell from './BingoCell.svelte';
import type { Cell } from '$lib/types/bingo';

describe('BingoCell', () => {
	const createCell = (overrides: Partial<Cell> = {}): Cell => ({
		position: 'topLeft',
		goal: '',
		isAchieved: false,
		...overrides
	});

	test('displays goal text', () => {
		const cell = createCell({ goal: 'Learn TypeScript' });
		render(BingoCell, { props: { cell, ontap: vi.fn() } });

		expect(screen.getByText('Learn TypeScript')).toBeTruthy();
	});

	test('shows achieved style when achieved', () => {
		const cell = createCell({ isAchieved: true, goal: 'Done' });
		const { container } = render(BingoCell, { props: { cell, ontap: vi.fn() } });

		const button = container.querySelector('button');
		expect(button?.classList.contains('achieved')).toBe(true);
	});

	test('shows pending style when not achieved', () => {
		const cell = createCell({ isAchieved: false, goal: 'Not done' });
		const { container } = render(BingoCell, { props: { cell, ontap: vi.fn() } });

		const button = container.querySelector('button');
		expect(button?.classList.contains('pending')).toBe(true);
	});

	test('calls ontap when tapped (quick press)', async () => {
		const ontap = vi.fn();
		const cell = createCell({ goal: 'Test goal' });
		render(BingoCell, { props: { cell, ontap } });

		const button = screen.getByRole('button');
		await fireEvent.mouseDown(button);
		await fireEvent.mouseUp(button);

		expect(ontap).toHaveBeenCalledTimes(1);
	});

	test('calls onlongpress on long press', async () => {
		vi.useFakeTimers();
		const ontap = vi.fn();
		const onlongpress = vi.fn();
		const cell = createCell({ goal: 'Test goal' });
		render(BingoCell, { props: { cell, ontap, onlongpress } });

		const button = screen.getByRole('button');
		await fireEvent.mouseDown(button);

		vi.advanceTimersByTime(500);

		await fireEvent.mouseUp(button);

		expect(onlongpress).toHaveBeenCalledTimes(1);
		expect(ontap).not.toHaveBeenCalled();
		vi.useRealTimers();
	});

	test('shows placeholder when goal is empty', () => {
		const cell = createCell({ goal: '' });
		render(BingoCell, { props: { cell, ontap: vi.fn() } });

		expect(screen.getByText('Goal')).toBeTruthy();
	});

	test('applies highlight style when isHighlighted is true', () => {
		const cell = createCell({ goal: 'Highlighted' });
		const { container } = render(BingoCell, {
			props: { cell, ontap: vi.fn(), isHighlighted: true }
		});

		const button = container.querySelector('button');
		expect(button?.classList.contains('bingo-highlight')).toBe(true);
	});

	test('does not apply highlight style by default', () => {
		const cell = createCell({ goal: 'Not highlighted' });
		const { container } = render(BingoCell, { props: { cell, ontap: vi.fn() } });

		const button = container.querySelector('button');
		expect(button?.classList.contains('bingo-highlight')).toBe(false);
	});
});
