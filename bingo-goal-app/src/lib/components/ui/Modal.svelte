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
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(30, 27, 75, 0.4);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	.modal-content {
		background: linear-gradient(145deg, #FFFFFF, #FAF5FF);
		border-radius: 1.5rem;
		box-shadow:
			0 24px 48px rgba(124, 58, 237, 0.15),
			0 8px 16px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		max-width: 28rem;
		width: 100%;
		margin-left: 1rem;
		margin-right: 1rem;
		padding: 1.5rem;
		animation: modalEnter 0.25s ease-out;
		border: 1px solid rgba(124, 58, 237, 0.08);
	}

	.modal-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1E1B4B;
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modalEnter {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
