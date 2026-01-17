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

<Modal {isOpen} onclose={onClose} title="Goal">
	<div class="modal-body">
		<textarea
			bind:value={goalText}
			maxlength={MAX_LENGTH}
			placeholder="Enter your goal..."
			rows="3"
			class="textarea"
		></textarea>

		<div class="char-count">
			<span class="char-count-current">{goalText.length}</span>
			<span class="char-count-separator">/</span>
			<span class="char-count-max">{MAX_LENGTH}</span>
		</div>

		<div class="button-group">
			{#if currentGoal}
				<button
					type="button"
					onclick={handleClear}
					class="btn btn-danger"
				>
					Clear
				</button>
			{/if}
			<button
				type="button"
				onclick={onClose}
				class="btn btn-ghost"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="btn btn-primary"
			>
				Save
			</button>
		</div>
	</div>
</Modal>

<style>
	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.textarea {
		width: 100%;
		padding: 1rem;
		border: 2px solid rgba(124, 58, 237, 0.15);
		border-radius: 1rem;
		resize: none;
		font-size: 1rem;
		font-weight: 500;
		color: #1E1B4B;
		background: linear-gradient(145deg, #FFFFFF, #FAF5FF);
		transition: all 0.2s ease-out;
	}

	.textarea::placeholder {
		color: #A78BFA;
	}

	.textarea:focus {
		outline: none;
		border-color: #7C3AED;
		box-shadow:
			0 0 0 3px rgba(124, 58, 237, 0.15),
			0 4px 12px rgba(124, 58, 237, 0.1);
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.char-count-current {
		color: #7C3AED;
	}

	.char-count-separator {
		color: #A78BFA;
	}

	.char-count-max {
		color: #A78BFA;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.625rem 1.25rem;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.btn-primary {
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		color: white;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
	}

	.btn-ghost {
		background: transparent;
		color: #6366F1;
	}

	.btn-ghost:hover {
		background: rgba(124, 58, 237, 0.08);
	}

	.btn-danger {
		background: transparent;
		color: #F472B6;
	}

	.btn-danger:hover {
		background: rgba(244, 114, 182, 0.1);
	}
</style>
