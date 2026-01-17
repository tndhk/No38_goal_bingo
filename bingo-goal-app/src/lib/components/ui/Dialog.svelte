<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';

	type DialogVariant = 'default' | 'danger';

	interface Props {
		isOpen: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: DialogVariant;
		onconfirm: () => void;
		oncancel: () => void;
	}

	let {
		isOpen,
		title,
		message,
		confirmLabel = 'OK',
		cancelLabel = 'Cancel',
		variant = 'default',
		onconfirm,
		oncancel
	}: Props = $props();

	const confirmButtonVariant = $derived(variant === 'danger' ? 'danger' : 'primary');
</script>

<Modal {isOpen} onclose={oncancel} {title}>
	<p class="dialog-message">{message}</p>
	<div class="dialog-actions">
		<Button variant="secondary" onclick={oncancel}>
			{cancelLabel}
		</Button>
		<Button variant={confirmButtonVariant} onclick={onconfirm}>
			{confirmLabel}
		</Button>
	</div>
</Modal>

<style>
	.dialog-message {
		color: #3D3024;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}
</style>
