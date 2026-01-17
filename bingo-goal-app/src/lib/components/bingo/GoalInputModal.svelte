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
		border: 2px solid #D4C4B0;
		border-radius: 0.75rem;
		resize: none;
		font-size: 1rem;
		font-weight: 500;
		color: #3D3024;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		transition: all 0.2s ease-out;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.textarea::placeholder {
		color: #8B6F47;
	}

	.textarea:focus {
		outline: none;
		border-color: #4A7C23;
		box-shadow:
			0 0 0 3px rgba(74, 124, 35, 0.15),
			0 4px 12px rgba(45, 80, 22, 0.1);
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.char-count-current {
		color: #2D5016;
	}

	.char-count-separator {
		color: #8B6F47;
	}

	.char-count-max {
		color: #8B6F47;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn {
		padding: 0.625rem 1.25rem;
		border-radius: 1rem;
		font-weight: 600;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-primary {
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	.btn-ghost {
		background: transparent;
		color: #6B5C4C;
	}

	.btn-ghost:hover {
		background: rgba(45, 80, 22, 0.08);
	}

	.btn-danger {
		background: transparent;
		color: #C2410C;
	}

	.btn-danger:hover {
		background: rgba(194, 65, 12, 0.1);
	}

	.toggle-achieved-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid #D4C4B0;
		border-radius: 1rem;
		background: linear-gradient(145deg, #FAF7F2, #F5F0E6);
		font-weight: 600;
		font-size: 0.875rem;
		color: #6B5C4C;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.toggle-achieved-btn:hover {
		border-color: #B8A896;
		background: linear-gradient(145deg, #F5F0E6, #EDE6D9);
	}

	.toggle-achieved-btn.achieved {
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		border-color: transparent;
		color: white;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
	}

	.toggle-achieved-btn.achieved:hover {
		background: linear-gradient(135deg, #2D5016, #1F3A0F);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	.toggle-icon {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
