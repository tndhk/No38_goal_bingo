<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		onRefresh: () => Promise<void> | void;
		children?: Snippet;
		threshold?: number;
	}

	let { onRefresh, children, threshold = 100 }: Props = $props();

	let isRefreshing = $state(false);
	let pullDistance = $state(0);
	let startY = $state(0);
	let isPulling = $state(false);
	let pullAreaRef: HTMLDivElement;

	const maxPullDistance = 150;

	onMount(() => {
		if (!pullAreaRef) return;

		// Use addEventListener with {passive: false} to allow preventDefault
		pullAreaRef.addEventListener('touchmove', handleTouchMove, { passive: false });

		return () => {
			pullAreaRef.removeEventListener('touchmove', handleTouchMove);
		};
	});

	function handleTouchStart(event: TouchEvent) {
		// Only allow pull when at top of page
		if (window.scrollY > 0) return;
		
		startY = event.touches[0].clientY;
		isPulling = true;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isPulling || isRefreshing) return;
		
		const currentY = event.touches[0].clientY;
		const diff = currentY - startY;
		
		if (diff > 0) {
			// Pulling down
			event.preventDefault();
			pullDistance = Math.min(diff, maxPullDistance);
		}
	}

	async function handleTouchEnd() {
		if (!isPulling || isRefreshing) return;
		
		isPulling = false;
		
		if (pullDistance >= threshold) {
			// Trigger refresh
			isRefreshing = true;
			try {
				await onRefresh();
			} finally {
				isRefreshing = false;
				pullDistance = 0;
			}
		} else {
			// Reset pull
			pullDistance = 0;
		}
	}

	function handleTouchCancel() {
		isPulling = false;
		pullDistance = 0;
	}

	const pullProgress = $derived(pullDistance / threshold);
	const isTriggered = $derived(pullDistance >= threshold);
</script>

<div
	bind:this={pullAreaRef}
	class="pull-area"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	ontouchcancel={handleTouchCancel}
>
	{#if pullDistance > 0 || isRefreshing}
		<div
			class="pull-indicator"
			class:loading={isRefreshing}
			class:triggered={isTriggered}
			style="transform: translateY({pullDistance}px)"
		>
			<div class="indicator-content">
				{#if isRefreshing}
					<div class="spinner"></div>
					<span>更新中...</span>
				{:else}
					<svg
						class="arrow"
						class:rotate={isTriggered}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M12 5v14M19 12l-7 7-7-7" />
					</svg>
					<span>{isTriggered ? '離して更新' : '引っ張って更新'}</span>
				{/if}
			</div>
		</div>
	{/if}
	
	<div class="content" class:pulling={pullDistance > 0} style="--pull-distance: {pullDistance}px">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.pull-area {
		position: relative;
		overflow: hidden;
		touch-action: pan-y pinch-zoom;
	}

	.pull-indicator {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: linear-gradient(180deg, var(--theme-surface) 0%, transparent 100%);
		z-index: 10;
		transition: transform 0.1s ease-out;
	}

	.indicator-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--theme-text-muted);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.arrow {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform 0.2s ease-out;
	}

	.arrow.rotate {
		transform: rotate(180deg);
	}

	.spinner {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--theme-text-muted);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.pull-indicator.triggered .indicator-content {
		color: var(--theme-primary);
	}

	.content {
		transition: transform 0.1s ease-out;
	}

	.content.pulling {
		transform: translateY(var(--pull-distance, 0));
	}
</style>
