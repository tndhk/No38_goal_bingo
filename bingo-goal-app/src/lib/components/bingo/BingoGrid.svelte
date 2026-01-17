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
	<div class="grid-container glass-panel" style:--grid-size={board.size}>
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
		width: 100%;
		max-width: 100%;
		position: relative;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(var(--grid-size, 3), minmax(0, 1fr));
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 1.5rem;
		aspect-ratio: 1 / 1;
		transition: all 0.3s ease;
	}
</style>
