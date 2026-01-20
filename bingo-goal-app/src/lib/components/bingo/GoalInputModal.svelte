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
	let textareaRef: HTMLTextAreaElement | null = $state(null);

	// 編集モードかどうか（既存の目標があるか）
	const isEditMode = $derived(currentGoal.length > 0);

	$effect(() => {
		goalText = currentGoal;
	});

	// モーダルが開いたらテキストエリアにフォーカス
	$effect(() => {
		if (isOpen && textareaRef) {
			// 少し遅延させてモーダルのアニメーション後にフォーカス
			setTimeout(() => {
				textareaRef?.focus();
			}, 100);
		}
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
			bind:this={textareaRef}
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

		{#if isEditMode}
			<button
				type="button"
				onclick={onToggleAchieved}
				class="toggle-switch-container"
			>
				<span class="toggle-label">{i18n.goal.achieved}</span>
				<span class="toggle-switch" class:active={isAchieved}>
					<span class="toggle-knob"></span>
				</span>
			</button>
		{/if}

		<div class="button-group">
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

		{#if isEditMode}
			<button
				type="button"
				onclick={handleClear}
				class="btn-delete"
			>
				<svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
				</svg>
				<span>{i18n.goal.clear}</span>
			</button>
		{/if}
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
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 3.25rem;
		min-height: var(--touch-target-min, 44px);
		padding: 0 1.5rem;
		border-radius: 1rem;
		font-weight: 700;
		font-size: 1.125rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		font-family: var(--font-body);
		border: 2px solid transparent;
	}

	.btn-primary {
		background: var(--theme-primary);
		color: var(--theme-text-on-primary);
		box-shadow: 0 8px 20px -5px var(--theme-glow);
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

	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--theme-primary);
	}

	/* Toggle Switch */
	.toggle-switch-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 1rem 1.25rem;
		border: 2px solid var(--theme-border);
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.05);
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font-body);
	}

	.toggle-switch-container:hover {
		border-color: var(--theme-primary);
		background: rgba(255, 255, 255, 0.08);
	}

	.toggle-label {
		font-weight: 600;
		font-size: 1rem;
		color: var(--theme-text);
	}

	.toggle-switch {
		position: relative;
		width: 3.25rem;
		height: 2rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toggle-switch.active {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		box-shadow: 0 4px 12px -2px var(--theme-glow);
	}

	.toggle-knob {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		background: white;
		border-radius: 50%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-switch.active .toggle-knob {
		transform: translateX(1.25rem);
	}

	/* Delete Button */
	.btn-delete {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem;
		margin-top: 0.5rem;
		border: none;
		border-radius: 0.75rem;
		background: transparent;
		color: var(--theme-text-muted);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font-body);
	}

	.btn-delete:hover {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
	}

	.delete-icon {
		width: 1.125rem;
		height: 1.125rem;
	}
</style>
