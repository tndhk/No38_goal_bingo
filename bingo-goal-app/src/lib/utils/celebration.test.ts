import { describe, test, expect, vi, beforeEach } from 'vitest';
import { celebrate, celebrateBingo, celebratePerfect } from './celebration';

vi.mock('canvas-confetti', () => ({
	default: vi.fn()
}));

import confetti from 'canvas-confetti';

describe('celebration utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	describe('celebrateBingo', () => {
		test('calls confetti with correct parameters', () => {
			celebrateBingo();

			expect(confetti).toHaveBeenCalledTimes(1);
			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 }
				})
			);
		});

		test('uses bingo colors', () => {
			celebrateBingo();

			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					colors: expect.arrayContaining(['#F59E0B', '#FBBF24', '#7C3AED', '#A78BFA'])
				})
			);
		});
	});

	describe('celebratePerfect', () => {
		test('calls confetti from both sides', () => {
			celebratePerfect();

			// First frame calls confetti twice (left and right)
			expect(confetti).toHaveBeenCalledTimes(2);

			// Left side
			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					origin: { x: 0 }
				})
			);

			// Right side
			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					origin: { x: 1 }
				})
			);
		});

		test('uses perfect colors', () => {
			celebratePerfect();

			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					colors: expect.arrayContaining(['#7C3AED', '#A78BFA', '#F472B6', '#60A5FA', '#34D399', '#FBBF24'])
				})
			);
		});
	});

	describe('celebrate', () => {
		test('calls celebrateBingo for bingo type', () => {
			celebrate('bingo');

			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					particleCount: 100
				})
			);
		});

		test('calls celebratePerfect for perfect type', () => {
			celebrate('perfect');

			expect(confetti).toHaveBeenCalledWith(
				expect.objectContaining({
					origin: { x: 0 }
				})
			);
		});
	});
});
