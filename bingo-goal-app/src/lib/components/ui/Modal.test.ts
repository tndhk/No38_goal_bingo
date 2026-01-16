import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Modal from './Modal.svelte';

describe('Modal', () => {
	test('renders content when isOpen is true', () => {
		render(Modal, { props: { isOpen: true, onclose: vi.fn() } });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('does not render when isOpen is false', () => {
		render(Modal, { props: { isOpen: false, onclose: vi.fn() } });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('calls onclose when Escape key is pressed', async () => {
		const user = userEvent.setup();
		const onclose = vi.fn();
		render(Modal, { props: { isOpen: true, onclose } });
		await user.keyboard('{Escape}');
		expect(onclose).toHaveBeenCalledOnce();
	});

	test('calls onclose when backdrop is clicked', async () => {
		const user = userEvent.setup();
		const onclose = vi.fn();
		render(Modal, { props: { isOpen: true, onclose } });
		const backdrop = screen.getByTestId('modal-backdrop');
		await user.click(backdrop);
		expect(onclose).toHaveBeenCalledOnce();
	});

	test('does not close when modal content is clicked', async () => {
		const user = userEvent.setup();
		const onclose = vi.fn();
		render(Modal, { props: { isOpen: true, onclose } });
		const dialog = screen.getByRole('dialog');
		await user.click(dialog);
		expect(onclose).not.toHaveBeenCalled();
	});

	test('renders title when provided', () => {
		render(Modal, { props: { isOpen: true, onclose: vi.fn(), title: 'Test Title' } });
		expect(screen.getByText('Test Title')).toBeInTheDocument();
	});
});
