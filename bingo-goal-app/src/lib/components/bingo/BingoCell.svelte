<script lang="ts">
	import type { Cell } from '$lib/types/bingo';
	import { currentTheme } from '$lib/stores/themeStore';
	import { localeStore } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';

	interface Props {
		cell: Cell;
		isHighlighted?: boolean;
		ontap: () => void;
		onlongpress?: () => void;
	}

	let { cell, isHighlighted = false, ontap, onlongpress }: Props = $props();

	const isEmpty = $derived(cell.goal.trim() === '');
	const themeIcon = $derived($currentTheme.icon);
	const locale = $derived($localeStore);
	const i18n = $derived(t(locale));

	let pressTimer: ReturnType<typeof setTimeout> | null = null;
	let isLongPress = false;

	function handleMouseDown(event: MouseEvent | TouchEvent) {
		// iPhoneでスクロールと誤認されないようにpreventDefaultを呼ぶ
		if (event.type === 'touchstart') {
			event.preventDefault();
		}
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
			<span class="empty-text">{i18n.goal.title}</span>
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
		min-height: var(--cell-min-height, 80px);
		padding: 0.5rem;
		border-radius: 0.75rem;
		font-size: var(--cell-font-size, 0.875rem);
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		outline: none;
		font-family: var(--font-body);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		/* iPhoneでのスクロール誤認防止とタップ遅延解消 */
		touch-action: manipulation;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		user-select: none;
	}

	.cell:focus-visible {
		outline: 2px solid var(--theme-primary);
		outline-offset: 2px;
	}

	/* Pending (未達成) */
	.pending {
		background: var(--theme-surface);
		color: var(--theme-text);
		border: 1px solid var(--theme-border);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
	}

	.pending:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		border-color: var(--theme-primary);
		background: color-mix(in srgb, var(--theme-surface) 90%, var(--theme-primary));
	}

	.pending:active {
		transform: scale(0.98);
	}

	/* Achieved (達成) */
	.achieved {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
		color: var(--theme-text-on-primary);
		border: 1px solid transparent;
		box-shadow: 0 4px 15px var(--theme-glow);
	}

	.achieved:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 8px 25px var(--theme-glow);
	}

	.achieved:active {
		transform: scale(0.98);
	}

	/* Bingo Highlight */
	.bingo-highlight {
		animation: pulse-bingo 2s ease-in-out infinite;
		z-index: 10;
	}

	.bingo-highlight.achieved {
		box-shadow:
			0 0 0 2px var(--theme-bg-base),
			0 0 0 4px var(--color-bingo),
			0 0 20px var(--color-bingo-glow);
	}

	.bingo-highlight.pending {
		border-color: var(--color-bingo);
		box-shadow:
			0 0 0 2px var(--theme-bg-base),
			0 0 0 4px var(--color-bingo),
			0 0 15px var(--color-bingo-glow);
	}

	@keyframes pulse-bingo {
		0%, 100% {
			transform: scale(1);
			filter: brightness(1);
		}
		50% {
			transform: scale(1.03);
			filter: brightness(1.1);
		}
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		color: var(--theme-text-muted);
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.pending:hover .empty-state {
		opacity: 1;
		color: var(--theme-text);
	}

	.empty-icon {
		width: 1.5rem;
		height: 1.5rem;
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
		line-height: 1.4;
	}

	/* Small screens: fewer lines */
	@media (max-width: 400px) {
		.goal-text {
			-webkit-line-clamp: 2;
		}
	}

	/* Check icon */
	.check-icon {
		position: absolute;
		top: -6px;
		right: -6px;
		width: 1.5rem;
		height: 1.5rem;
		background: var(--color-achieved);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.check-icon svg {
		width: 1rem;
		height: 1rem;
		color: var(--theme-text-on-primary);
	}

	@keyframes pop-in {
		0% { transform: scale(0); }
		100% { transform: scale(1); }
	}
</style>
