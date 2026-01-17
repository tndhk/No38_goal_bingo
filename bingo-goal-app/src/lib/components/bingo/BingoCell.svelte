<script lang="ts">
	import type { Cell } from '$lib/types/bingo';

	interface Props {
		cell: Cell;
		isHighlighted?: boolean;
		ontap: () => void;
		onlongpress?: () => void;
	}

	let { cell, isHighlighted = false, ontap, onlongpress }: Props = $props();

	const isEmpty = $derived(cell.goal.trim() === '');

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
			<svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
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
		border-radius: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s ease-out;
		cursor: pointer;
		border: none;
		outline: none;
	}

	.cell:focus-visible {
		outline: 2px solid #A78BFA;
		outline-offset: 2px;
	}

	/* Pending (未達成) */
	.pending {
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		color: #1E1B4B;
		box-shadow:
			inset 2px 2px 4px rgba(124, 58, 237, 0.05),
			4px 4px 12px rgba(124, 58, 237, 0.1),
			-2px -2px 8px rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(124, 58, 237, 0.1);
	}

	.pending:hover {
		transform: scale(1.02);
		box-shadow:
			inset 2px 2px 4px rgba(124, 58, 237, 0.08),
			6px 6px 16px rgba(124, 58, 237, 0.15),
			-2px -2px 8px rgba(255, 255, 255, 0.9);
	}

	.pending:active {
		transform: scale(0.98);
	}

	/* Achieved (達成) */
	.achieved {
		background: linear-gradient(145deg, #10B981, #34D399);
		color: white;
		box-shadow:
			0 4px 16px rgba(16, 185, 129, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		border: none;
	}

	.achieved:hover {
		transform: scale(1.02);
		box-shadow:
			0 6px 20px rgba(16, 185, 129, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
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
			0 0 0 3px #F59E0B,
			0 0 0 6px rgba(245, 158, 11, 0.3),
			0 4px 16px rgba(16, 185, 129, 0.3);
	}

	.bingo-highlight.pending {
		box-shadow:
			0 0 0 3px #F59E0B,
			0 0 0 6px rgba(245, 158, 11, 0.3),
			4px 4px 12px rgba(124, 58, 237, 0.1);
	}

	@keyframes pulse-bingo {
		0%, 100% {
			box-shadow:
				0 0 0 3px #F59E0B,
				0 0 0 6px rgba(245, 158, 11, 0.3);
		}
		50% {
			box-shadow:
				0 0 0 4px #FBBF24,
				0 0 0 10px rgba(251, 191, 36, 0.2);
		}
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		color: #A78BFA;
	}

	.empty-icon {
		width: 1.5rem;
		height: 1.5rem;
		opacity: 0.7;
	}

	.empty-text {
		font-size: 0.75rem;
		font-weight: 700;
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
		background: rgba(255, 255, 255, 0.3);
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
