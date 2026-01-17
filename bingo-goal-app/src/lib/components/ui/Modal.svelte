<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		onclose: () => void;
		title?: string;
		children?: Snippet;
	}

	let { isOpen, onclose, title, children }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onclose();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="presentation"
		class="backdrop"
		onclick={handleBackdropClick}
		data-testid="modal-backdrop"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
		>
			{#if title}
				<h2 id="modal-title" class="modal-title">{title}</h2>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8); /* Much darker backdrop */
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		animation: fadeIn 0.3s ease-out;
		padding: 1rem;
	}

	.modal-content {
		/* High opacity background for maximum readability */
		background: color-mix(in srgb, var(--theme-surface) 95%, black);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border-radius: 1.5rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		max-width: 28rem;
		width: 100%;
		padding: 2.5rem;
		animation: modalEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		border: 2px solid var(--theme-border); /* Thicker border */
		position: relative;
	}

	.modal-title {
		font-size: 1.75rem;
		font-weight: 800;
		margin-bottom: 2rem;
		color: var(--theme-text);
		font-family: var(--font-display);
		text-align: center;
		letter-spacing: -0.03em;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modalEnter {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
