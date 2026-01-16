import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Dialog from './Dialog.svelte';

describe('Dialog', () => {
	test('renders message and buttons when open', () => {
		render(Dialog, {
			props: {
				isOpen: true,
				message: 'Are you sure?',
				onconfirm: vi.fn(),
				oncancel: vi.fn()
			}
		});
		expect(screen.getByText('Are you sure?')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /confirm|ok|yes/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /cancel|no/i })).toBeInTheDocument();
	});

	test('does not render when isOpen is false', () => {
		render(Dialog, {
			props: {
				isOpen: false,
				message: 'Are you sure?',
				onconfirm: vi.fn(),
				oncancel: vi.fn()
			}
		});
		expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
	});

	test('calls onconfirm when confirm button is clicked', async () => {
		const user = userEvent.setup();
		const onconfirm = vi.fn();
		render(Dialog, {
			props: {
				isOpen: true,
				message: 'Are you sure?',
				onconfirm,
				oncancel: vi.fn()
			}
		});
		await user.click(screen.getByRole('button', { name: /confirm|ok|yes/i }));
		expect(onconfirm).toHaveBeenCalledOnce();
	});

	test('calls oncancel when cancel button is clicked', async () => {
		const user = userEvent.setup();
		const oncancel = vi.fn();
		render(Dialog, {
			props: {
				isOpen: true,
				message: 'Are you sure?',
				onconfirm: vi.fn(),
				oncancel
			}
		});
		await user.click(screen.getByRole('button', { name: /cancel|no/i }));
		expect(oncancel).toHaveBeenCalledOnce();
	});

	test('renders custom button labels when provided', () => {
		render(Dialog, {
			props: {
				isOpen: true,
				message: 'Delete this item?',
				confirmLabel: 'Delete',
				cancelLabel: 'Keep',
				onconfirm: vi.fn(),
				oncancel: vi.fn()
			}
		});
		expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
	});

	test('renders title when provided', () => {
		render(Dialog, {
			props: {
				isOpen: true,
				title: 'Confirm Delete',
				message: 'Are you sure?',
				onconfirm: vi.fn(),
				oncancel: vi.fn()
			}
		});
		expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
	});
});
