import { describe, test, expect, beforeEach, vi } from 'vitest';
import { saveToStorage, loadFromStorage, STORAGE_KEY } from './storage';
import type { AppState } from '$lib/types/bingo';

const mockLocalStorage = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string): string | null => store[key] ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: mockLocalStorage
});

describe('storage', () => {
	beforeEach(() => {
		mockLocalStorage.clear();
		vi.clearAllMocks();
	});

	test('saveToStorage() saves data to localStorage', () => {
		const state: AppState = {
			boards: [
				{
					id: 'test-id',
					year: 2025,
					cells: [],
					createdAt: new Date('2025-01-01'),
					updatedAt: new Date('2025-01-01')
				}
			],
			currentBoardId: 'test-id',
			isSaving: false
		};

		saveToStorage(state);

		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
		const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
		expect(savedData.boards).toHaveLength(1);
		expect(savedData.boards[0].year).toBe(2025);
	});

	test('loadFromStorage() loads data from localStorage', () => {
		const storedData = {
			boards: [
				{
					id: 'test-id',
					year: 2025,
					cells: [],
					createdAt: '2025-01-01T00:00:00.000Z',
					updatedAt: '2025-01-01T00:00:00.000Z'
				}
			],
			currentBoardId: 'test-id',
			isSaving: false
		};
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedData));

		const result = loadFromStorage();

		expect(result).not.toBeNull();
		expect(result?.boards).toHaveLength(1);
		expect(result?.boards[0].year).toBe(2025);
	});

	test('loadFromStorage() returns null when localStorage is empty', () => {
		mockLocalStorage.getItem.mockReturnValueOnce(null);

		const result = loadFromStorage();

		expect(result).toBeNull();
	});

	test('loadFromStorage() returns null for invalid JSON', () => {
		mockLocalStorage.getItem.mockReturnValueOnce('invalid json {{{');

		const result = loadFromStorage();

		expect(result).toBeNull();
	});

	test('loadFromStorage() converts date strings to Date objects', () => {
		const storedData = {
			boards: [
				{
					id: 'test-id',
					year: 2025,
					cells: [],
					createdAt: '2025-01-01T00:00:00.000Z',
					updatedAt: '2025-01-02T00:00:00.000Z'
				}
			],
			currentBoardId: 'test-id',
			isSaving: false
		};
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedData));

		const result = loadFromStorage();

		expect(result?.boards[0].createdAt).toBeInstanceOf(Date);
		expect(result?.boards[0].updatedAt).toBeInstanceOf(Date);
	});

	test('saveToStorage() excludes isSaving from persistence', () => {
		const state: AppState = {
			boards: [],
			currentBoardId: null,
			isSaving: true
		};

		saveToStorage(state);

		const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
		expect(savedData.isSaving).toBe(false);
	});
});
