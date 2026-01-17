<script lang="ts">
	import type { CellPosition } from '$lib/types/bingo';
	import Modal from '$lib/components/ui/Modal.svelte';

	interface Props {
		isOpen: boolean;
		position: CellPosition;
		currentGoal: string;
		isAchieved: boolean;
		onSave: (goal: string) => void;
		onClear: () => void;
		onClose: () => void;
		onToggleAchieved: () => void;
	}

	const MAX_LENGTH = 50;

	let { isOpen, position, currentGoal, isAchieved, onSave, onClear, onClose, onToggleAchieved }: Props = $props();

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

		<button
			type="button"
			onclick={onToggleAchieved}
			class="toggle-achieved-btn"
			class:achieved={isAchieved}
		>
			{#if isAchieved}
				<svg class="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
				</svg>
				<span>Achieved</span>
			{:else}
				<svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
				</svg>
				<span>Not Achieved</span>
			{/if}
		</button>

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

	.toggle-achieved-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid rgba(124, 58, 237, 0.15);
		border-radius: 9999px;
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		font-weight: 600;
		font-size: 0.875rem;
		color: #6366F1;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.toggle-achieved-btn:hover {
		border-color: rgba(124, 58, 237, 0.3);
		background: linear-gradient(145deg, #F5F3FF, #EDE9FE);
	}

	.toggle-achieved-btn.achieved {
		background: linear-gradient(135deg, #10B981, #059669);
		border-color: transparent;
		color: white;
		box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
	}

	.toggle-achieved-btn.achieved:hover {
		background: linear-gradient(135deg, #059669, #047857);
		box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
	}

	.toggle-icon {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
