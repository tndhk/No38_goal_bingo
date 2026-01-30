import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import OfflineIndicator from './OfflineIndicator.svelte';

describe('OfflineIndicator Component', () => {
	let onlineStatusMock: { value: boolean };

	beforeEach(() => {
		// Mock navigator.onLine
		onlineStatusMock = { value: true };
		Object.defineProperty(navigator, 'onLine', {
			get: () => onlineStatusMock.value,
			configurable: true
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should not render when online', () => {
		onlineStatusMock.value = true;
		render(OfflineIndicator);
		expect(screen.queryByText(/オフライン/)).not.toBeInTheDocument();
	});

	it('should render when offline', () => {
		onlineStatusMock.value = false;
		render(OfflineIndicator);
		expect(screen.getByText(/オフライン/)).toBeInTheDocument();
	});

	it('should update visibility when network status changes', async () => {
		render(OfflineIndicator);
		
		// Initially online
		onlineStatusMock.value = true;
		expect(screen.queryByText(/オフライン/)).not.toBeInTheDocument();
		
		// Simulate going offline
		onlineStatusMock.value = false;
		window.dispatchEvent(new Event('offline'));
		
		// Wait for the component to update
		await new Promise(resolve => setTimeout(resolve, 0));
		
		expect(screen.getByText(/オフライン/)).toBeInTheDocument();
		
		// Simulate going back online
		onlineStatusMock.value = true;
		window.dispatchEvent(new Event('online'));
		
		// Wait for the component to update
		await new Promise(resolve => setTimeout(resolve, 0));
		
		expect(screen.queryByText(/オフライン/)).not.toBeInTheDocument();
	});

	it('should have accessible role', () => {
		onlineStatusMock.value = false;
		render(OfflineIndicator);
		const indicator = screen.getByRole('status');
		expect(indicator).toBeInTheDocument();
	});
});
