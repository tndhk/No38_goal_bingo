<script lang="ts">
	import type { CellPosition } from '$lib/types/bingo';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { localeStore } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';

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

	const locale = $derived($localeStore);
	const i18n = $derived(t(locale));

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

<Modal {isOpen} onclose={onClose} title={i18n.goal.title} variant="bottom">
	<div class="modal-body">
		<textarea
			bind:value={goalText}
			maxlength={MAX_LENGTH}
			placeholder={i18n.goal.placeholder}
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
				<span>{i18n.goal.achieved}</span>
			{:else}
				<svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
				</svg>
				<span>{i18n.goal.markAchieved}</span>
			{/if}
		</button>

		<div class="button-group">
			{#if currentGoal}
				<button
					type="button"
					onclick={handleClear}
					class="btn btn-danger"
				>
					{i18n.goal.clear}
				</button>
			{/if}
			<button
				type="button"
				onclick={onClose}
				class="btn btn-ghost"
			>
				{i18n.common.cancel}
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="btn btn-primary"
			>
				{i18n.common.save}
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
		padding: 1.5rem;
		border: 2px solid var(--theme-border); /* Thicker border */
		border-radius: 1rem;
		resize: none;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--theme-text);
		background: rgba(0, 0, 0, 0.5); /* Much more opaque */
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: var(--font-body);
		line-height: 1.6;
	}

	.textarea::placeholder {
		color: var(--theme-text-muted);
		opacity: 0.8;
	}

	.textarea:focus {
		outline: none;
		border-color: var(--theme-primary);
		background: rgba(0, 0, 0, 0.6);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--theme-primary) 30%, transparent);
	}

	.char-count {
		text-align: right;
		font-size: 1rem;
		font-weight: 700;
		margin-top: -1.25rem;
		color: var(--theme-text-muted);
	}

	.char-count-current {
		color: var(--theme-primary);
	}

	.button-group {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	/* Mobile: Stack buttons vertically */
	@media (max-width: 640px) {
		.button-group {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3.5rem; /* Fixed height for all buttons */
		min-height: var(--touch-target-min, 44px);
		padding: 0 1.5rem;
		border-radius: 1rem;
		font-weight: 700;
		font-size: 1.125rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: var(--font-body);
		border: 2px solid transparent; /* Base border for height consistency */
	}

	.btn-primary {
		grid-column: span 1;
		background: var(--theme-primary);
		color: var(--theme-text-on-primary);
		box-shadow: 0 8px 20px -5px var(--theme-glow);
	}

	/* Mobile: Save button at bottom (last in flex order) */
	@media (max-width: 640px) {
		.btn-primary {
			order: 3;
		}
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 25px -5px var(--theme-glow);
	}

	.btn-ghost {
		background: rgba(255, 255, 255, 0.05);
		color: var(--theme-text);
		border-color: var(--theme-border);
	}

	/* Mobile: Cancel button in middle */
	@media (max-width: 640px) {
		.btn-ghost {
			order: 2;
		}
	}

	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--theme-primary);
	}

	.btn-danger {
		grid-column: span 2; /* Full width danger button above others */
		margin-bottom: 0.5rem;
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border-color: rgba(239, 68, 68, 0.3);
	}

	/* Mobile: Delete button at top (first in flex order) */
	@media (max-width: 640px) {
		.btn-danger {
			order: 1;
			margin-bottom: 0;
		}
	}

	.btn-danger:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: #ef4444;
	}

	.toggle-achieved-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 4rem; /* Prominent height */
		padding: 0 1.5rem;
		border: 2px solid var(--theme-border);
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.08);
		font-weight: 700;
		font-size: 1.125rem;
		color: var(--theme-text);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: var(--font-body);
	}

	.toggle-achieved-btn:hover {
		border-color: var(--theme-primary);
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
	}

	.toggle-achieved-btn.achieved {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		border-color: transparent;
		color: var(--theme-text-on-primary);
		box-shadow: 0 10px 20px -5px var(--theme-glow);
	}

	.toggle-achieved-btn.achieved:hover {
		transform: translateY(-3px);
		box-shadow: 0 15px 30px -10px var(--theme-glow);
		filter: brightness(1.1);
	}

	.toggle-icon {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>
