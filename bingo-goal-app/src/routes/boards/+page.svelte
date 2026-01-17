<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		boardStore,
		initializeStore,
		deleteBoard,
		setCurrentBoard,
		createBoard
	} from '$lib/stores/boardStore';
	import BoardList from '$lib/components/bingo/BoardList.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';

	let isDeleteDialogOpen = $state(false);
	let boardToDelete = $state<{ id: string; year: number } | null>(null);
	let isYearDialogOpen = $state(false);
	let selectedYear = $state(new Date().getFullYear());

	const boards = $derived($boardStore.boards);

	const availableYears = $derived(() => {
		const currentYear = new Date().getFullYear();
		const years: number[] = [];
		for (let y = currentYear - 2; y <= currentYear + 1; y++) {
			if (!boards.some((b) => b.year === y)) {
				years.push(y);
			}
		}
		return years;
	});

	onMount(() => {
		initializeStore();
	});

	function handleSelectBoard(boardId: string) {
		setCurrentBoard(boardId);
		goto('/');
	}

	function handleDeleteRequest(boardId: string) {
		const board = boards.find((b) => b.id === boardId);
		if (board) {
			boardToDelete = { id: board.id, year: board.year };
			isDeleteDialogOpen = true;
		}
	}

	function handleDeleteConfirm() {
		if (boardToDelete) {
			deleteBoard(boardToDelete.id);
			boardToDelete = null;
		}
		isDeleteDialogOpen = false;
	}

	function handleDeleteCancel() {
		boardToDelete = null;
		isDeleteDialogOpen = false;
	}

	function openYearDialog() {
		const years = availableYears();
		if (years.length > 0) {
			selectedYear = years[0];
		}
		isYearDialogOpen = true;
	}

	function handleCreateBoard() {
		createBoard(selectedYear);
		isYearDialogOpen = false;
	}
</script>

<svelte:head>
	<title>My Boards - Goal Bingo</title>
</svelte:head>

<div class="page">
	<div class="bg-decoration bg-decoration-1"></div>
	<div class="bg-decoration bg-decoration-2"></div>
	<div class="bg-decoration bg-decoration-3"></div>

	<header class="header">
		<div class="header-content">
			<a href="/" class="back-link" aria-label="Back to home">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
			</a>
			<h1 class="title">My Boards</h1>
		</div>
	</header>

	<main class="main">
		{#if boards.length > 0}
			<BoardList
				{boards}
				onSelectBoard={handleSelectBoard}
				onDeleteBoard={handleDeleteRequest}
			/>
			{#if availableYears().length > 0}
				<div class="new-board-section">
					<button type="button" class="btn-new" onclick={openYearDialog}>
						+ Create New Board
					</button>
				</div>
			{/if}
		{:else}
			<div class="empty-state">
				<div class="empty-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<p class="empty-text">No boards yet</p>
				<button type="button" class="btn-create" onclick={openYearDialog}>
					Create Your First Board
				</button>
			</div>
		{/if}
	</main>
</div>

<Dialog
	isOpen={isDeleteDialogOpen}
	title="Delete Board"
	message="{boardToDelete?.year}年のボードを削除しますか? この操作は取り消せません。"
	confirmLabel="Delete"
	cancelLabel="Cancel"
	variant="danger"
	onconfirm={handleDeleteConfirm}
	oncancel={handleDeleteCancel}
/>

{#if isYearDialogOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="presentation"
		class="dialog-backdrop"
		onclick={() => (isYearDialogOpen = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			role="dialog"
			aria-modal="true"
			class="dialog"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="dialog-title">Select Year</h2>
			<select bind:value={selectedYear} class="dialog-select">
				{#each availableYears() as year (year)}
					<option value={year}>{year}</option>
				{/each}
			</select>
			<div class="dialog-actions">
				<button
					type="button"
					onclick={() => (isYearDialogOpen = false)}
					class="btn-ghost"
				>
					Cancel
				</button>
				<button type="button" onclick={handleCreateBoard} class="btn-primary">
					Create
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%);
		position: relative;
		overflow: hidden;
	}

	.bg-decoration {
		position: fixed;
		border-radius: 50%;
		z-index: 0;
		pointer-events: none;
	}

	.bg-decoration-1 {
		width: 300px;
		height: 300px;
		background: linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(167, 139, 250, 0.2));
		top: -100px;
		right: -100px;
		filter: blur(60px);
	}

	.bg-decoration-2 {
		width: 250px;
		height: 250px;
		background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(52, 211, 153, 0.2));
		bottom: 10%;
		left: -80px;
		filter: blur(50px);
	}

	.bg-decoration-3 {
		width: 200px;
		height: 200px;
		background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(244, 114, 182, 0.2));
		bottom: 30%;
		right: -60px;
		filter: blur(40px);
	}

	.header {
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		box-shadow:
			0 4px 20px rgba(124, 58, 237, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);
		position: relative;
		z-index: 10;
	}

	.header-content {
		max-width: 28rem;
		margin: 0 auto;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.75rem;
		color: white;
		transition: background 0.15s ease-out;
	}

	.back-link:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.back-link svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 800;
		color: white;
		letter-spacing: -0.01em;
	}

	.main {
		max-width: 28rem;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		position: relative;
		z-index: 1;
	}

	.new-board-section {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.btn-new {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
	}

	.btn-new:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1rem;
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 12px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	.empty-icon svg {
		width: 2rem;
		height: 2rem;
		color: #A78BFA;
	}

	.empty-text {
		color: #6366F1;
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	.btn-create {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
	}

	.btn-create:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
	}

	.dialog-backdrop {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(30, 27, 75, 0.4);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	.dialog {
		background: linear-gradient(145deg, #FFFFFF, #FAF5FF);
		border-radius: 1.5rem;
		box-shadow:
			0 24px 48px rgba(124, 58, 237, 0.15),
			0 8px 16px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		max-width: 24rem;
		width: 100%;
		margin: 0 1rem;
		padding: 1.5rem;
		animation: modalEnter 0.25s ease-out;
		border: 1px solid rgba(124, 58, 237, 0.08);
	}

	.dialog-title {
		font-size: 1.125rem;
		font-weight: 700;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.dialog-select {
		width: 100%;
		padding: 0.75rem 1rem;
		background: linear-gradient(145deg, #FFFFFF, #F5F3FF);
		border: 2px solid rgba(124, 58, 237, 0.15);
		border-radius: 9999px;
		font-weight: 600;
		color: #1E1B4B;
		margin-bottom: 1rem;
	}

	.dialog-select:focus {
		outline: none;
		border-color: #7C3AED;
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn-ghost {
		padding: 0.625rem 1.25rem;
		background: transparent;
		color: #6366F1;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.btn-ghost:hover {
		background: rgba(124, 58, 237, 0.08);
	}

	.btn-primary {
		padding: 0.625rem 1.25rem;
		background: linear-gradient(135deg, #7C3AED, #A78BFA);
		color: white;
		border: none;
		border-radius: 9999px;
		font-weight: 700;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(124, 58, 237, 0.25);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes modalEnter {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
