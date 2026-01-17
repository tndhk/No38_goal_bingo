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
		border: 2px solid var(--theme-pending-border);
		border-radius: 0.75rem;
		resize: none;
		font-size: 1rem;
		font-weight: 500;
		color: var(--theme-text);
		background: linear-gradient(145deg, var(--theme-background), var(--theme-pending));
		transition: all 0.2s ease-out;
		font-family: var(--theme-font-body);
	}

	.textarea::placeholder {
		color: var(--theme-text-light);
	}

	.textarea:focus {
		outline: none;
		border-color: var(--theme-primary-light);
		box-shadow:
			0 0 0 3px color-mix(in srgb, var(--theme-primary-light) 15%, transparent),
			0 4px 12px color-mix(in srgb, var(--theme-primary) 10%, transparent);
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		font-weight: 600;
	}

	.char-count-current {
		color: var(--theme-primary);
	}

	.char-count-separator {
		color: var(--theme-text-light);
	}

	.char-count-max {
		color: var(--theme-text-light);
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
		font-family: var(--theme-font-body);
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-primary));
		color: white;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
	}

	.btn-ghost {
		background: transparent;
		color: var(--theme-text-light);
	}

	.btn-ghost:hover {
		background: color-mix(in srgb, var(--theme-primary) 8%, transparent);
	}

	.btn-danger {
		background: transparent;
		color: var(--theme-achieved);
	}

	.btn-danger:hover {
		background: color-mix(in srgb, var(--theme-achieved) 10%, transparent);
	}

	.toggle-achieved-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid var(--theme-pending-border);
		border-radius: 1rem;
		background: linear-gradient(145deg, var(--theme-surface), var(--theme-pending));
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--theme-text-light);
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: var(--theme-font-body);
	}

	.toggle-achieved-btn:hover {
		background: linear-gradient(145deg, var(--theme-pending), var(--theme-surface));
	}

	.toggle-achieved-btn.achieved {
		background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-primary));
		border-color: transparent;
		color: white;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
	}

	.toggle-achieved-btn.achieved:hover {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark));
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
	}

	.toggle-icon {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
