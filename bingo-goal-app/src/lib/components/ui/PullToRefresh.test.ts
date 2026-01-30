import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import PullToRefresh from './PullToRefresh.svelte';

describe('PullToRefresh Component', () => {
	let mockOnRefresh: () => Promise<void>;

	beforeEach(() => {
		mockOnRefresh = vi.fn();
	});

	it('should render component', () => {
		const { container } = render(PullToRefresh, {
			props: {
				onRefresh: mockOnRefresh
			}
		});
		expect(container.querySelector('.pull-area')).toBeInTheDocument();
	});

	it('should show pull indicator when pulling down', async () => {
		const { container } = render(PullToRefresh, {
			props: {
				onRefresh: mockOnRefresh
			}
		});
		
		const pullArea = container.querySelector('.pull-area');
		expect(pullArea).toBeInTheDocument();
		
		// Simulate touch start at top
		await fireEvent.touchStart(pullArea!, {
			touches: [{ clientY: 0 }]
		});
		
		// Simulate touch move (pull down)
		await fireEvent.touchMove(pullArea!, {
			touches: [{ clientY: 100 }]
		});
		
		// Indicator should be visible
		const indicator = container.querySelector('.pull-indicator');
		expect(indicator).toBeInTheDocument();
	});

	it('should call onRefresh when pulled beyond threshold', async () => {
		const { container } = render(PullToRefresh, {
			props: {
				onRefresh: mockOnRefresh
			}
		});
		
		const pullArea = container.querySelector('.pull-area');
		
		// Simulate pull beyond threshold (100px)
		await fireEvent.touchStart(pullArea!, {
			touches: [{ clientY: 0 }]
		});
		
		await fireEvent.touchMove(pullArea!, {
			touches: [{ clientY: 150 }]
		});
		
		await fireEvent.touchEnd(pullArea!);
		
		// Wait for the async operation
		await new Promise(resolve => setTimeout(resolve, 100));
		
		expect(mockOnRefresh).toHaveBeenCalled();
	});

	it('should not call onRefresh when pulled below threshold', async () => {
		const { container } = render(PullToRefresh, {
			props: {
				onRefresh: mockOnRefresh
			}
		});
		
		const pullArea = container.querySelector('.pull-area');
		
		// Simulate small pull (below threshold)
		await fireEvent.touchStart(pullArea!, {
			touches: [{ clientY: 0 }]
		});
		
		await fireEvent.touchMove(pullArea!, {
			touches: [{ clientY: 50 }]
		});
		
		await fireEvent.touchEnd(pullArea!);
		
		expect(mockOnRefresh).not.toHaveBeenCalled();
	});

	it('should show loading state during refresh', async () => {
		const slowRefresh = vi.fn((): Promise<void> => new Promise(resolve => setTimeout(resolve, 100)));
		
		const { container } = render(PullToRefresh, {
			props: {
				onRefresh: slowRefresh
			}
		});
		
		const pullArea = container.querySelector('.pull-area');
		
		// Trigger refresh
		await fireEvent.touchStart(pullArea!, {
			touches: [{ clientY: 0 }]
		});
		
		await fireEvent.touchMove(pullArea!, {
			touches: [{ clientY: 150 }]
		});
		
		await fireEvent.touchEnd(pullArea!);
		
		// Check for loading indicator
		await new Promise(resolve => setTimeout(resolve, 50));
		const loadingIndicator = container.querySelector('.loading');
		expect(loadingIndicator).toBeInTheDocument();
	});
});
