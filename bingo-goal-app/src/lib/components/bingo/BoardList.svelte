<script lang="ts">
	import type { BingoBoard } from '$lib/types/bingo';
	import { generateBingoLines } from '$lib/types/bingo';
	import { getAchievedCount, getBingoCount } from '$lib/utils/bingo';

	interface Props {
		boards: BingoBoard[];
		onSelectBoard: (boardId: string) => void;
		onDeleteBoard: (boardId: string) => void;
	}

	let { boards, onSelectBoard, onDeleteBoard }: Props = $props();

	const sortedBoards = $derived(
		[...boards].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	);

	function getBoardSummary(board: BingoBoard) {
		const bingoLines = generateBingoLines(board.size);
		const achieved = getAchievedCount(board.cells);
		const bingoCount = getBingoCount(board.cells, bingoLines);
		const total = board.cells.length;
		const isPerfect = achieved === total;
		return { achieved, bingoCount, isPerfect, total };
	}

	function handleDeleteClick(event: MouseEvent, boardId: string) {
		event.stopPropagation();
		onDeleteBoard(boardId);
	}
</script>

<div class="board-list" role="list">
	{#each sortedBoards as board (board.id)}
		{@const summary = getBoardSummary(board)}
		<div class="board-card" role="listitem">
			<button
				type="button"
				class="card-button"
				onclick={() => onSelectBoard(board.id)}
				aria-label="{board.name} - {summary.achieved}/{summary.total} achieved"
			>
				<div class="card-content">
					<div class="card-header">
						<span class="board-name">{board.name}</span>
						{#if summary.isPerfect}
							<span class="badge badge-perfect">Perfect!</span>
						{:else if summary.bingoCount > 0}
							<span class="badge badge-bingo">{summary.bingoCount} Bingo</span>
						{/if}
					</div>
					<div class="card-stats">
						<div class="progress-bar">
							<div
								class="progress-fill"
								style="width: {(summary.achieved / summary.total) * 100}%"
							></div>
						</div>
						<span class="progress-text">{summary.achieved}/{summary.total} achieved</span>
					</div>
				</div>
			</button>
			<button
				type="button"
				class="delete-btn"
				onclick={(e) => handleDeleteClick(e, board.id)}
				aria-label="Delete {board.name}"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	.board-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.board-card {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(145deg, var(--theme-background), var(--theme-pending));
		border: 1px solid var(--theme-pending-border);
		border-radius: 0.75rem;
		transition: all 0.2s ease-out;
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		padding-right: 0.5rem;
	}

	.board-card:hover {
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
	}

	.card-button {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		border-radius: 0.75rem 0 0 0.75rem;
		transition: background 0.15s ease-out;
	}

	.card-button:hover {
		background: color-mix(in srgb, var(--theme-primary) 3%, transparent);
	}

	.card-button:active {
		background: color-mix(in srgb, var(--theme-primary) 6%, transparent);
	}

	.card-content {
		flex: 1;
		min-width: 0;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.board-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--theme-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 12rem;
		font-family: var(--theme-font-heading);
	}

	.badge {
		padding: 0.125rem 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.badge-perfect {
		background: linear-gradient(135deg, var(--theme-bingo), var(--theme-bingo-glow));
		color: white;
	}

	.badge-bingo {
		background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-primary));
		color: white;
	}

	.card-stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: var(--theme-pending-border);
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--theme-primary), var(--theme-primary-light));
		border-radius: 9999px;
		transition: width 0.3s ease-out;
	}

	.progress-text {
		font-size: 0.75rem;
		color: var(--theme-text-light);
		font-weight: 500;
		white-space: nowrap;
	}

	.delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: var(--theme-text-light);
		cursor: pointer;
		transition: all 0.15s ease-out;
		flex-shrink: 0;
	}

	.delete-btn:hover {
		background: color-mix(in srgb, var(--theme-achieved) 10%, transparent);
		color: var(--theme-achieved);
	}

	.delete-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
