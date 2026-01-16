import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Button from './Button.svelte';

describe('Button', () => {
	test('renders button element', () => {
		render(Button);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	test('calls onclick when clicked', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		render(Button, { props: { onclick: handleClick } });
		await user.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledOnce();
	});

	test('is disabled when disabled prop is true', () => {
		render(Button, { props: { disabled: true } });
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('is disabled when loading prop is true', () => {
		render(Button, { props: { loading: true } });
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('applies primary variant styles by default', () => {
		render(Button);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-primary');
	});

	test('applies secondary variant styles when specified', () => {
		render(Button, { props: { variant: 'secondary' } });
		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-gray-200');
	});

	test('applies ghost variant styles when specified', () => {
		render(Button, { props: { variant: 'ghost' } });
		const button = screen.getByRole('button');
		expect(button).toHaveClass('bg-transparent');
	});
});
