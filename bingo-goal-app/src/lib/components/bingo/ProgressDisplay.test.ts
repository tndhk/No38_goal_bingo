import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ProgressDisplay from './ProgressDisplay.svelte';

describe('ProgressDisplay', () => {
	test('displays X/9 achieved', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 3,
				total: 9,
				bingoCount: 0,
				hint: null,
				isPerfect: false
			}
		});

		expect(screen.getByText('3/9 achieved')).toBeTruthy();
	});

	test('displays Y BINGO! when bingoCount > 0', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 5,
				total: 9,
				bingoCount: 2,
				hint: null,
				isPerfect: false
			}
		});

		expect(screen.getByText('2 BINGO!')).toBeTruthy();
	});

	test('does not display BINGO! when bingoCount = 0', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 2,
				total: 9,
				bingoCount: 0,
				hint: null,
				isPerfect: false
			}
		});

		expect(screen.queryByText(/BINGO!/)).toBeNull();
	});

	test('displays PERFECT! when isPerfect is true', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 9,
				total: 9,
				bingoCount: 8,
				hint: null,
				isPerfect: true
			}
		});

		expect(screen.getByText('PERFECT!')).toBeTruthy();
	});

	test('displays hint when provided', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 2,
				total: 9,
				bingoCount: 0,
				hint: 'Almost there!',
				isPerfect: false
			}
		});

		expect(screen.getByText('Almost there!')).toBeTruthy();
	});

	test('does not display hint when null', () => {
		const { container } = render(ProgressDisplay, {
			props: {
				achieved: 2,
				total: 9,
				bingoCount: 0,
				hint: null,
				isPerfect: false
			}
		});

		const hintElements = container.querySelectorAll('.hint');
		expect(hintElements.length).toBe(0);
	});

	test('does not display hint when isPerfect is true', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 9,
				total: 9,
				bingoCount: 8,
				hint: 'Some hint that should not appear',
				isPerfect: true
			}
		});

		expect(screen.queryByText('Some hint that should not appear')).toBeNull();
	});

	test('displays zero achieved correctly', () => {
		render(ProgressDisplay, {
			props: {
				achieved: 0,
				total: 9,
				bingoCount: 0,
				hint: null,
				isPerfect: false
			}
		});

		expect(screen.getByText('0/9 achieved')).toBeTruthy();
	});
});
