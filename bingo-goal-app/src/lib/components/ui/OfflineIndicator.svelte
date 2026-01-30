<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isOnline = $state(true);
	let isVisible = $state(false);

	function updateOnlineStatus() {
		if (browser) {
			isOnline = navigator.onLine;
			isVisible = !isOnline;
		}
	}

	onMount(() => {
		if (!browser) return;
		
		updateOnlineStatus();
		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
		
		// Return cleanup function
		return () => {
			window.removeEventListener('online', updateOnlineStatus);
			window.removeEventListener('offline', updateOnlineStatus);
		};
	});
</script>

{#if isVisible}
	<div class="offline-indicator" role="status" aria-live="polite">
		<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
		</svg>
		<span class="text">オフライン</span>
	</div>
{/if}

<style>
	.offline-indicator {
		position: fixed;
		top: var(--safe-area-top);
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.text {
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
