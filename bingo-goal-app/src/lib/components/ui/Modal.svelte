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
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={handleBackdropClick}
		data-testid="modal-backdrop"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
			class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
			onclick={(e) => e.stopPropagation()}
		>
			{#if title}
				<h2 id="modal-title" class="text-xl font-semibold mb-4">{title}</h2>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}
