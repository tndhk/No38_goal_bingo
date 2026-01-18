import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import GoalInputModal from './GoalInputModal.svelte';
import type { CellPosition } from '$lib/types/bingo';

describe('GoalInputModal', () => {
	const defaultProps = {
		isOpen: true,
		position: 'topLeft' as CellPosition,
		currentGoal: '',
		isAchieved: false,
		onSave: vi.fn(),
		onClear: vi.fn(),
		onClose: vi.fn(),
		onToggleAchieved: vi.fn()
	};

	test('displays current goal text in textarea', () => {
		render(GoalInputModal, {
			props: { ...defaultProps, currentGoal: 'Existing goal' }
		});

		const textarea = screen.getByRole('textbox');
		expect((textarea as HTMLTextAreaElement).value).toBe('Existing goal');
	});

	test('enforces 50 character limit', async () => {
		render(GoalInputModal, { props: defaultProps });

		const textarea = screen.getByRole('textbox');
		expect((textarea as HTMLTextAreaElement).maxLength).toBe(50);
	});

	test('displays character count', async () => {
		render(GoalInputModal, {
			props: { ...defaultProps, currentGoal: 'Hello' }
		});

		expect(screen.getByText('5')).toBeTruthy();
		expect(screen.getByText('50')).toBeTruthy();
	});

	test('calls onSave with goal when save button is clicked', async () => {
		const onSave = vi.fn();
		render(GoalInputModal, { props: { ...defaultProps, onSave } });

		const textarea = screen.getByRole('textbox');
		await fireEvent.input(textarea, { target: { value: 'New goal' } });

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		const saveButton = screen.getByText('Save');
		await fireEvent.click(saveButton);

		expect(onSave).toHaveBeenCalledWith('New goal');
	});

	test('calls onClose when cancel button is clicked', async () => {
		const onClose = vi.fn();
		render(GoalInputModal, { props: { ...defaultProps, onClose } });

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		const cancelButton = screen.getByText('Cancel');
		await fireEvent.click(cancelButton);

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	test('calls onClear when clear button is clicked', async () => {
		const onClear = vi.fn();
		render(GoalInputModal, {
			props: { ...defaultProps, currentGoal: 'Some goal', onClear }
		});

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		const clearButton = screen.getByText('Clear');
		await fireEvent.click(clearButton);

		expect(onClear).toHaveBeenCalledTimes(1);
	});

	test('does not render when isOpen is false', () => {
		const { container } = render(GoalInputModal, {
			props: { ...defaultProps, isOpen: false }
		});

		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	test('shows title', () => {
		render(GoalInputModal, { props: defaultProps });

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		expect(screen.getByText('Goal')).toBeTruthy();
	});

	test('displays Not Achieved button when isAchieved is false', () => {
		render(GoalInputModal, { props: defaultProps });

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		expect(screen.getByText('Mark achieved')).toBeTruthy();
	});

	test('displays Achieved button when isAchieved is true', () => {
		render(GoalInputModal, {
			props: { ...defaultProps, isAchieved: true }
		});

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		expect(screen.getByText('Achieved')).toBeTruthy();
	});

	test('calls onToggleAchieved when achieved button is clicked', async () => {
		const onToggleAchieved = vi.fn();
		render(GoalInputModal, {
			props: { ...defaultProps, onToggleAchieved }
		});

		// テスト環境ではlocaleが'en'（vitest環境のnavigator.languageがen）
		const toggleButton = screen.getByText('Mark achieved');
		await fireEvent.click(toggleButton);

		expect(onToggleAchieved).toHaveBeenCalledTimes(1);
	});
});
