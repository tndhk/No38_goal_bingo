<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';

	interface Props {
		isOpen: boolean;
		title?: string;
		message: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onconfirm: () => void;
		oncancel: () => void;
	}

	let {
		isOpen,
		title,
		message,
		confirmLabel = 'OK',
		cancelLabel = 'Cancel',
		onconfirm,
		oncancel
	}: Props = $props();
</script>

<Modal {isOpen} onclose={oncancel} {title}>
	<p class="text-gray-700 mb-6">{message}</p>
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={oncancel}>
			{cancelLabel}
		</Button>
		<Button onclick={onconfirm}>
			{confirmLabel}
		</Button>
	</div>
</Modal>
