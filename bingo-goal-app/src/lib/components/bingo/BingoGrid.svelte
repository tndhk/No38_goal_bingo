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

	// Dynamic CSS variables based on grid size
	const gridConfig = $derived({
		'--cell-min-height': board.size === 3 ? '80px' : board.size === 4 ? '70px' : '60px',
		'--cell-font-size': board.size === 3 ? '0.875rem' : board.size === 4 ? '0.8125rem' : '0.75rem',
		'--grid-gap': board.size === 3 ? '0.75rem' : board.size === 4 ? '0.625rem' : '0.5rem'
	});
</script>

<div class="grid-wrapper">
	<div
		class="grid-container glass-panel"
		style:--grid-size={board.size}
		style:--cell-min-height={gridConfig['--cell-min-height']}
		style:--cell-font-size={gridConfig['--cell-font-size']}
		style:--grid-gap={gridConfig['--grid-gap']}
	>
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
		gap: var(--grid-gap, 0.75rem);
		padding: 1rem;
		border-radius: 1.5rem;
		aspect-ratio: 1 / 1;
		transition: all 0.3s ease;
	}

	/* Small screens: tighter layout */
	@media (max-width: 400px) {
		.grid-container {
			gap: 0.375rem;
			padding: 0.75rem;
		}
	}
</style>
