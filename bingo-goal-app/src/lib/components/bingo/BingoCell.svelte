<script lang="ts">
	import type { Cell } from '$lib/types/bingo';
	import { currentTheme } from '$lib/stores/themeStore';

	interface Props {
		cell: Cell;
		isHighlighted?: boolean;
		ontap: () => void;
		onlongpress?: () => void;
	}

	let { cell, isHighlighted = false, ontap, onlongpress }: Props = $props();

	const isEmpty = $derived(cell.goal.trim() === '');
	const themeIcon = $derived($currentTheme.icon);

	let pressTimer: ReturnType<typeof setTimeout> | null = null;
	let isLongPress = false;

	function handleMouseDown() {
		isLongPress = false;
		pressTimer = setTimeout(() => {
			isLongPress = true;
			onlongpress?.();
		}, 500);
	}

	function handleMouseUp() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
		if (!isLongPress) {
			ontap();
		}
		isLongPress = false;
	}

	function handleMouseLeave() {
		if (pressTimer) {
			clearTimeout(pressTimer);
			pressTimer = null;
		}
		isLongPress = false;
	}
</script>

<button
	type="button"
	class="cell {cell.isAchieved ? 'achieved' : 'pending'} {isHighlighted ? 'bingo-highlight' : ''}"
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseLeave}
	ontouchstart={handleMouseDown}
	ontouchend={handleMouseUp}
	ontouchcancel={handleMouseLeave}
>
	{#if isEmpty}
		<span class="empty-state">
			<svg class="empty-icon" fill="currentColor" viewBox={themeIcon.viewBox}>
				<path d={themeIcon.svgPath}/>
			</svg>
			<span class="empty-text">Goal</span>
		</span>
	{:else}
		<span class="goal-text">{cell.goal}</span>
		{#if cell.isAchieved}
			<span class="check-icon">
				<svg fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
				</svg>
			</span>
		{/if}
	{/if}
</button>

<style>
	.cell {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		min-height: 80px;
		padding: 0.5rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.2s ease-out;
		cursor: pointer;
		outline: none;
		font-family: var(--theme-font-body);
	}

	.cell:focus-visible {
		outline: 2px solid var(--theme-primary-light);
		outline-offset: 2px;
	}

	/* Pending (未達成) */
	.pending {
		background: linear-gradient(145deg, var(--theme-surface), var(--theme-pending));
		color: var(--theme-text);
		box-shadow:
			inset 2px 2px 4px rgba(0, 0, 0, 0.03),
			4px 4px 12px rgba(0, 0, 0, 0.06),
			-2px -2px 8px rgba(255, 255, 255, 0.8);
		border: 2px dashed var(--theme-pending-border);
	}

	.pending:hover {
		transform: scale(1.02);
		box-shadow:
			inset 2px 2px 4px rgba(0, 0, 0, 0.05),
			6px 6px 16px rgba(0, 0, 0, 0.1),
			-2px -2px 8px rgba(255, 255, 255, 0.9);
	}

	.pending:active {
		transform: scale(0.98);
	}

	/* Achieved (達成) */
	.achieved {
		background: linear-gradient(145deg, var(--theme-primary-light), var(--theme-primary));
		color: white;
		box-shadow:
			0 4px 16px color-mix(in srgb, var(--theme-primary) 30%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
		border: none;
	}

	.achieved:hover {
		transform: scale(1.02);
		box-shadow:
			0 6px 20px color-mix(in srgb, var(--theme-primary) 40%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.achieved:active {
		transform: scale(0.98);
	}

	/* Bingo Highlight */
	.bingo-highlight {
		animation: pulse-bingo 2s ease-in-out infinite;
	}

	.bingo-highlight.achieved {
		box-shadow:
			0 0 0 3px var(--theme-bingo),
			0 0 0 6px color-mix(in srgb, var(--theme-bingo) 30%, transparent),
			0 4px 16px color-mix(in srgb, var(--theme-primary) 30%, transparent);
	}

	.bingo-highlight.pending {
		box-shadow:
			0 0 0 3px var(--theme-bingo),
			0 0 0 6px color-mix(in srgb, var(--theme-bingo) 30%, transparent),
			4px 4px 12px rgba(0, 0, 0, 0.1);
	}

	@keyframes pulse-bingo {
		0%, 100% {
			box-shadow:
				0 0 0 3px var(--theme-bingo),
				0 0 0 6px color-mix(in srgb, var(--theme-bingo) 30%, transparent);
		}
		50% {
			box-shadow:
				0 0 0 4px var(--theme-bingo-glow),
				0 0 0 10px color-mix(in srgb, var(--theme-bingo-glow) 20%, transparent);
		}
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		color: var(--theme-text-light);
	}

	.empty-icon {
		width: 1.5rem;
		height: 1.5rem;
		opacity: 0.6;
	}

	.empty-text {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Goal text */
	.goal-text {
		word-break: break-word;
		text-align: center;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Check icon */
	.check-icon {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 1.25rem;
		height: 1.25rem;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.check-icon svg {
		width: 0.875rem;
		height: 0.875rem;
		color: white;
	}
</style>
