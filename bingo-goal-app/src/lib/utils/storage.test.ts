import { describe, test, expect, beforeEach, vi } from 'vitest';
import { saveToStorage, loadFromStorage, STORAGE_KEY } from './storage';
import type { AppState } from '$lib/types/bingo';
import { generateCellPositions } from '$lib/types/bingo';

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
					name: '2025 Goals',
					size: 3,
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
		expect(savedData.boards[0].name).toBe('2025 Goals');
	});

	test('loadFromStorage() loads data from localStorage', () => {
		const storedData = {
			boards: [
				{
					id: 'test-id',
					name: '2025 Goals',
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
		expect(result?.boards[0].name).toBe('2025 Goals');
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
					name: '2025 Goals',
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

	test('loadFromStorage() migrates legacy year-based boards to name-based', () => {
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
		expect(result?.boards[0].name).toBe('2025 Goals');
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

	test('loadFromStorage() migrates legacy CellPosition to new format', () => {
		const storedData = {
			boards: [
				{
					id: 'test-id',
					name: 'Test',
					cells: [
						{ position: 'topLeft', goal: 'Goal 1', isAchieved: true },
						{ position: 'topCenter', goal: 'Goal 2', isAchieved: false },
						{ position: 'topRight', goal: 'Goal 3', isAchieved: false },
						{ position: 'middleLeft', goal: 'Goal 4', isAchieved: false },
						{ position: 'middleCenter', goal: 'Goal 5', isAchieved: true },
						{ position: 'middleRight', goal: 'Goal 6', isAchieved: false },
						{ position: 'bottomLeft', goal: 'Goal 7', isAchieved: false },
						{ position: 'bottomCenter', goal: 'Goal 8', isAchieved: false },
						{ position: 'bottomRight', goal: 'Goal 9', isAchieved: false }
					],
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			],
			currentBoardId: 'test-id',
			isSaving: false
		};
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedData));

		const result = loadFromStorage();

		expect(result?.boards[0].size).toBe(3);
		expect(result?.boards[0].cells[0].position).toBe('cell_0_0');
		expect(result?.boards[0].cells[0].goal).toBe('Goal 1');
		expect(result?.boards[0].cells[0].isAchieved).toBe(true);
		expect(result?.boards[0].cells[4].position).toBe('cell_1_1');
	});

	test('loadFromStorage() preserves new format boards', () => {
		const storedData = {
			boards: [
				{
					id: 'test-id',
					name: 'Test',
					size: 4,
					cells: generateCellPositions(4).map((pos) => ({
						position: pos,
						goal: '',
						isAchieved: false
					})),
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z'
				}
			],
			currentBoardId: 'test-id',
			isSaving: false
		};
		mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedData));

		const result = loadFromStorage();

		expect(result?.boards[0].size).toBe(4);
		expect(result?.boards[0].cells).toHaveLength(16);
	});
});
