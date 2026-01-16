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

<div class="grid grid-cols-3 gap-1 p-2 bg-gray-100 rounded-xl max-w-md mx-auto aspect-square">
	{#each board.cells as cell (cell.position)}
		<BingoCell
			{cell}
			isHighlighted={isHighlighted(cell.position)}
			ontap={() => onCellTap(cell.position)}
			onlongpress={() => onCellLongPress?.(cell.position)}
		/>
	{/each}
</div>

<style>
	.grid {
		display: grid;
	}

	.grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.gap-1 {
		gap: 0.25rem;
	}

	.p-2 {
		padding: 0.5rem;
	}

	.bg-gray-100 {
		background-color: #f3f4f6;
	}

	.rounded-xl {
		border-radius: 0.75rem;
	}

	.max-w-md {
		max-width: 28rem;
	}

	.mx-auto {
		margin-left: auto;
		margin-right: auto;
	}

	.aspect-square {
		aspect-ratio: 1 / 1;
	}
</style>
