<script lang="ts">
	import type { BingoBoard, CellPosition } from '$lib/types/bingo';
	import BingoCell from './BingoCell.svelte';

	interface Props {
		board: BingoBoard;
		onCellTap: (position: CellPosition) => void;
		onCellLongPress?: (position: CellPosition) => void;
		highlightedPositions?: CellPosition[];
	}

	let { board, onCellTap, onCellLongPress, highlightedPositions = [] }: Props = $props();

	function isHighlighted(position: CellPosition): boolean {
		return highlightedPositions.includes(position);
	}
</script>

<div class="grid-wrapper">
	<!-- Geometric decorations -->
	<div class="decoration decoration-1"></div>
	<div class="decoration decoration-2"></div>
	<div class="decoration decoration-3"></div>

	<div class="grid-container">
		{#each board.cells as cell (cell.position)}
			<BingoCell
				{cell}
				isHighlighted={isHighlighted(cell.position)}
				ontap={() => onCellTap(cell.position)}
				onlongpress={() => onCellLongPress?.(cell.position)}
			/>
		{/each}
	</div>
</div>

<style>
	.grid-wrapper {
		position: relative;
		max-width: 28rem;
		margin-left: auto;
		margin-right: auto;
		padding: 1rem;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		padding: 1rem;
		background: linear-gradient(145deg, var(--theme-background), var(--theme-pending));
		border-radius: 1rem;
		aspect-ratio: 1 / 1;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.08),
			0 2px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid var(--theme-pending-border);
		position: relative;
		z-index: 1;
	}

	/* Decorations */
	.decoration {
		position: absolute;
		z-index: 0;
		opacity: 0.15;
	}

	.decoration-1 {
		width: 60px;
		height: 60px;
		top: -15px;
		right: 0px;
		background: var(--theme-primary-light);
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(15deg);
	}

	.decoration-2 {
		width: 45px;
		height: 45px;
		bottom: -5px;
		left: -10px;
		background: var(--theme-primary);
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(-30deg);
	}

	.decoration-3 {
		width: 35px;
		height: 35px;
		top: 45%;
		left: -15px;
		background: var(--theme-achieved-light);
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(45deg);
	}
</style>
