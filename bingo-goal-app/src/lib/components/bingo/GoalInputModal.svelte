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
		gap: 1.5rem;
	}

	.textarea {
		width: 100%;
		padding: 1rem;
		border: 1px solid var(--theme-border);
		border-radius: 1rem;
		resize: none;
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--theme-text);
		background: rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease-out;
		font-family: var(--font-body);
		line-height: 1.5;
	}

	.textarea::placeholder {
		color: var(--theme-text-muted);
	}

	.textarea:focus {
		outline: none;
		border-color: var(--theme-primary);
		background: rgba(0, 0, 0, 0.3);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-primary) 15%, transparent);
	}

	.char-count {
		text-align: right;
		font-size: 0.875rem;
		font-weight: 600;
		margin-top: -1rem;
	}

	.char-count-current {
		color: var(--theme-primary);
	}

	.char-count-separator {
		color: var(--theme-text-muted);
	}

	.char-count-max {
		color: var(--theme-text-muted);
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: var(--font-body);
	}

	.btn-primary {
		background: var(--theme-primary);
		color: var(--theme-text-on-primary);
		box-shadow: 0 4px 15px var(--theme-glow);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px var(--theme-glow);
	}

	.btn-ghost {
		background: transparent;
		color: var(--theme-text-muted);
	}

	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--theme-text);
	}

	.btn-danger {
		background: transparent;
		color: var(--theme-accent); /* Use accent or specific error color if defined, fallback to text */
	}

	.btn-danger:hover {
		background: rgba(255, 0, 0, 0.1);
		color: #ef4444;
	}

	.toggle-achieved-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem;
		border: 1px solid var(--theme-border);
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		font-weight: 600;
		font-size: 1rem;
		color: var(--theme-text-muted);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: var(--font-body);
	}

	.toggle-achieved-btn:hover {
		border-color: var(--theme-primary);
		background: rgba(255, 255, 255, 0.05);
	}

	.toggle-achieved-btn.achieved {
		background: linear-gradient(135deg, var(--theme-achieved), var(--theme-achieved-dim));
		border-color: transparent;
		color: white; /* Keep white for achieved because achieved color is always dark enough? Let's check. */
		box-shadow: 0 4px 15px var(--theme-achieved-glow);
	}

	.toggle-achieved-btn.achieved:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px var(--theme-achieved-glow);
	}

	.toggle-icon {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
