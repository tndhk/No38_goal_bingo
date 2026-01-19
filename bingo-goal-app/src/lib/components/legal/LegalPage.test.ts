import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import LegalPage from './LegalPage.svelte';

describe('LegalPage', () => {
	const defaultProps = {
		title: 'Test Title',
		lastUpdated: 'Last updated: 2025',
		sections: [
			{ heading: 'Section 1', content: 'Content 1' },
			{ heading: 'Section 2', content: 'Content 2' }
		],
		footerLink: { href: '/other', label: 'Other Page' },
		backLabel: 'Back to Home'
	};

	test('renders title', () => {
		render(LegalPage, { props: defaultProps });
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
	});

	test('renders last updated text', () => {
		render(LegalPage, { props: defaultProps });
		expect(screen.getByText('Last updated: 2025')).toBeInTheDocument();
	});

	test('renders all sections', () => {
		render(LegalPage, { props: defaultProps });
		expect(screen.getByText('Section 1')).toBeInTheDocument();
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByText('Section 2')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});

	test('renders footer link', () => {
		render(LegalPage, { props: defaultProps });
		const link = screen.getByRole('link', { name: 'Other Page' });
		expect(link).toHaveAttribute('href', '/other');
	});

	test('renders back to home link', () => {
		render(LegalPage, { props: defaultProps });
		const backLink = screen.getByRole('link', { name: /Back to Home/ });
		expect(backLink).toHaveAttribute('href', '/');
	});

	test('renders multiple sections in order', () => {
		render(LegalPage, {
			props: {
				...defaultProps,
				sections: [
					{ heading: 'First', content: 'First content' },
					{ heading: 'Second', content: 'Second content' },
					{ heading: 'Third', content: 'Third content' }
				]
			}
		});

		const headings = screen.getAllByRole('heading', { level: 2 });
		expect(headings).toHaveLength(3);
		expect(headings[0]).toHaveTextContent('First');
		expect(headings[1]).toHaveTextContent('Second');
		expect(headings[2]).toHaveTextContent('Third');
	});
});
