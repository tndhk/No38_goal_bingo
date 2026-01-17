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
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		border-radius: 1.5rem;
		aspect-ratio: 1 / 1;
		box-shadow:
			0 8px 32px rgba(124, 58, 237, 0.12),
			0 2px 8px rgba(124, 58, 237, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid rgba(124, 58, 237, 0.08);
		position: relative;
		z-index: 1;
	}

	/* Geometric decorations */
	.decoration {
		position: absolute;
		border-radius: 50%;
		z-index: 0;
		opacity: 0.6;
	}

	.decoration-1 {
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #F472B6, #A78BFA);
		top: -20px;
		right: -10px;
		filter: blur(20px);
	}

	.decoration-2 {
		width: 60px;
		height: 60px;
		background: linear-gradient(135deg, #60A5FA, #34D399);
		bottom: -10px;
		left: -15px;
		filter: blur(15px);
	}

	.decoration-3 {
		width: 40px;
		height: 40px;
		background: linear-gradient(135deg, #FBBF24, #F472B6);
		top: 50%;
		left: -20px;
		filter: blur(12px);
	}
</style>
