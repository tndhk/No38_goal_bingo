<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isOpen: boolean;
		onclose: () => void;
		title?: string;
		variant?: 'center' | 'bottom';
		children?: Snippet;
	}

	let { isOpen, onclose, title, variant = 'bottom', children }: Props = $props();

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
		class="backdrop {variant === 'bottom' ? 'variant-bottom' : 'variant-center'}"
		onclick={handleBackdropClick}
		data-testid="modal-backdrop"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
			class="modal-content {variant === 'bottom' ? 'modal-bottom' : 'modal-center'}"
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
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		animation: fadeIn 0.3s ease-out;
		padding: 1rem;
	}

	.variant-center {
		align-items: center;
	}

	.variant-bottom {
		align-items: center;
	}

	/* Mobile: Bottom sheet for variant-bottom */
	@media (max-width: 640px) {
		.variant-bottom {
			align-items: flex-end;
			padding: 0;
		}
	}

	.modal-content {
		/* High opacity background for maximum readability */
		background: color-mix(in srgb, var(--theme-surface) 95%, black);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
		max-width: 28rem;
		width: 100%;
		padding: 2.5rem;
		border: 2px solid var(--theme-border);
		position: relative;
	}

	.modal-center {
		border-radius: 1.5rem;
		animation: modalEnterCenter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.modal-bottom {
		border-radius: 1.5rem;
		animation: modalEnterCenter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	/* Mobile: Bottom sheet styling */
	@media (max-width: 640px) {
		.modal-bottom {
			max-width: 100%;
			border-radius: 1.5rem 1.5rem 0 0;
			padding: 2rem 1.5rem calc(2rem + var(--safe-area-bottom));
			animation: slideUpFromBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		}
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

	@keyframes modalEnterCenter {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes slideUpFromBottom {
		from {
			opacity: 0;
			transform: translateY(100%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
