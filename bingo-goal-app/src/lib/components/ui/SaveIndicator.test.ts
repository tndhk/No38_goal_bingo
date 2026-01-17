import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SaveIndicator from './SaveIndicator.svelte';

describe('SaveIndicator', () => {
	test('shows "Saving" when isSaving is true', () => {
		render(SaveIndicator, { props: { isSaving: true } });

		expect(screen.getByText('Saving')).toBeTruthy();
	});

	test('is hidden when isSaving is false', () => {
		const { container } = render(SaveIndicator, { props: { isSaving: false } });

		expect(container.querySelector('.save-indicator')).toBeNull();
	});

	test('has appropriate styling when visible', () => {
		const { container } = render(SaveIndicator, { props: { isSaving: true } });

		const indicator = container.querySelector('.save-indicator');
		expect(indicator).toBeTruthy();
	});
});
