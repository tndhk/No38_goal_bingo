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
		gap: 1rem;
	}

	.board-card {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		/* glass-panel style */
		background: var(--theme-surface);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--theme-border);
		border-radius: 1rem;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
		padding-right: 0.75rem;
	}

	.board-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px var(--theme-glow);
		border-color: var(--theme-primary);
	}

	.card-button {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 1.25rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		border-radius: 1rem 0 0 1rem;
		transition: background 0.2s ease-out;
	}

	.card-button:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.card-button:active {
		background: rgba(255, 255, 255, 0.08);
	}

	.card-content {
		flex: 1;
		min-width: 0;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.board-name {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--theme-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 12rem;
		font-family: var(--font-display);
	}

	.badge {
		padding: 0.25rem 0.625rem;
		border-radius: 0.5rem;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.badge-perfect {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: #000;
		box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
	}

	.badge-bingo {
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dim));
		color: var(--theme-text-on-primary);
		box-shadow: 0 2px 8px var(--theme-glow);
	}

	.card-stats {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--theme-primary), var(--theme-primary-dim));
		border-radius: 9999px;
		transition: width 0.3s ease-out;
	}

	.progress-text {
		font-size: 0.75rem;
		color: var(--theme-text-muted);
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
		border-radius: 0.75rem;
		color: var(--theme-text-muted);
		cursor: pointer;
		transition: all 0.2s ease-out;
		flex-shrink: 0;
	}

	.delete-btn:hover {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
	}

	.delete-btn svg {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
