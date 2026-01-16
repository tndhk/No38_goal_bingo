<script lang="ts">
	import type { CellPosition } from '$lib/types/bingo';
	import Modal from '$lib/components/ui/Modal.svelte';

	interface Props {
		isOpen: boolean;
		position: CellPosition;
		currentGoal: string;
		onSave: (goal: string) => void;
		onClear: () => void;
		onClose: () => void;
	}

	const MAX_LENGTH = 50;

	let { isOpen, position, currentGoal, onSave, onClear, onClose }: Props = $props();

	let goalText = $state(currentGoal);

	$effect(() => {
		goalText = currentGoal;
	});

	const remainingChars = $derived(MAX_LENGTH - goalText.length);

	function handleSave() {
		onSave(goalText);
	}

	function handleClear() {
		onClear();
	}
</script>

<Modal {isOpen} onclose={onClose} title="目標を入力">
	<div class="space-y-4">
		<textarea
			bind:value={goalText}
			maxlength={MAX_LENGTH}
			placeholder="目標を入力してください"
			rows="3"
			class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
		></textarea>

		<div class="text-right text-sm text-gray-500">
			{remainingChars}/{MAX_LENGTH}
		</div>

		<div class="flex gap-3 justify-end">
			{#if currentGoal}
				<button
					type="button"
					onclick={handleClear}
					class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
				>
					クリア
				</button>
			{/if}
			<button
				type="button"
				onclick={onClose}
				class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
			>
				キャンセル
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
			>
				保存
			</button>
		</div>
	</div>
</Modal>

<style>
	.space-y-4 > :not(:first-child) {
		margin-top: 1rem;
	}

	.w-full {
		width: 100%;
	}

	.p-3 {
		padding: 0.75rem;
	}

	.border {
		border-width: 1px;
	}

	.border-gray-300 {
		border-color: #d1d5db;
	}

	.rounded-lg {
		border-radius: 0.5rem;
	}

	.resize-none {
		resize: none;
	}

	.focus\:outline-none:focus {
		outline: none;
	}

	.focus\:ring-2:focus {
		box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.5);
	}

	.focus\:ring-primary:focus {
		--tw-ring-color: #4f46e5;
	}

	.text-right {
		text-align: right;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.text-gray-500 {
		color: #6b7280;
	}

	.flex {
		display: flex;
	}

	.gap-3 {
		gap: 0.75rem;
	}

	.justify-end {
		justify-content: flex-end;
	}

	.px-4 {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.py-2 {
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.text-red-600 {
		color: #dc2626;
	}

	.hover\:bg-red-50:hover {
		background-color: #fef2f2;
	}

	.text-gray-600 {
		color: #4b5563;
	}

	.hover\:bg-gray-100:hover {
		background-color: #f3f4f6;
	}

	.bg-primary {
		background-color: #4f46e5;
	}

	.text-white {
		color: white;
	}

	.hover\:bg-primary-dark:hover {
		background-color: #4338ca;
	}

	.transition-colors {
		transition-property: background-color, border-color, color;
		transition-duration: 150ms;
	}
</style>
