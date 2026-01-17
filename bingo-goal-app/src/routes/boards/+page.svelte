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
	let boardToDelete = $state<{ id: string; name: string } | null>(null);
	let isNameDialogOpen = $state(false);
	let newBoardName = $state('');

	const boards = $derived($boardStore.boards);

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
			boardToDelete = { id: board.id, name: board.name };
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

	function openNameDialog() {
		newBoardName = '';
		isNameDialogOpen = true;
	}

	function handleCreateBoard() {
		const name = newBoardName.trim() || `${new Date().getFullYear()} Goals`;
		createBoard(name);
		newBoardName = '';
		isNameDialogOpen = false;
	}
</script>

<svelte:head>
	<title>My Boards - Forest Planner</title>
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
			<div class="new-board-section">
				<button type="button" class="btn-new" onclick={openNameDialog}>
					+ Create New Board
				</button>
			</div>
		{:else}
			<div class="empty-state">
				<div class="empty-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<p class="empty-text">No boards yet</p>
				<button type="button" class="btn-create" onclick={openNameDialog}>
					Create Your First Board
				</button>
			</div>
		{/if}
	</main>
</div>

<Dialog
	isOpen={isDeleteDialogOpen}
	title="Delete Board"
	message="「{boardToDelete?.name}」を削除しますか? この操作は取り消せません。"
	confirmLabel="Delete"
	cancelLabel="Cancel"
	variant="danger"
	onconfirm={handleDeleteConfirm}
	oncancel={handleDeleteCancel}
/>

{#if isNameDialogOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		role="presentation"
		class="dialog-backdrop"
		onclick={() => (isNameDialogOpen = false)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div
			role="dialog"
			aria-modal="true"
			class="dialog"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="dialog-title">New Board</h2>
			<input
				type="text"
				bind:value={newBoardName}
				placeholder={`${new Date().getFullYear()} Goals`}
				class="dialog-input"
			/>
			<div class="dialog-actions">
				<button
					type="button"
					onclick={() => (isNameDialogOpen = false)}
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
		background: linear-gradient(180deg, #FDFBF7 0%, #F7F3EC 50%, #F0EBE1 100%);
		position: relative;
		overflow: hidden;
	}

	.bg-decoration {
		position: fixed;
		z-index: 0;
		pointer-events: none;
		opacity: 0.08;
	}

	.bg-decoration-1 {
		width: 200px;
		height: 200px;
		background: #4A7C23;
		top: -50px;
		right: -50px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(25deg);
	}

	.bg-decoration-2 {
		width: 150px;
		height: 150px;
		background: #2D5016;
		bottom: 15%;
		left: -40px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(-15deg);
	}

	.bg-decoration-3 {
		width: 120px;
		height: 120px;
		background: #7CB342;
		bottom: 40%;
		right: -30px;
		clip-path: polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%);
		transform: rotate(45deg);
	}

	.header {
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		box-shadow:
			0 4px 20px rgba(45, 80, 22, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
		border-radius: 0.5rem;
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
		font-size: 1.5rem;
		font-weight: 600;
		color: white;
		letter-spacing: -0.01em;
		font-family: 'Caveat', 'Zen Kurenaido', cursive;
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
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-new:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1rem;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 12px rgba(61, 48, 36, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid #D4C4B0;
	}

	.empty-icon svg {
		width: 2rem;
		height: 2rem;
		color: #8B6F47;
	}

	.empty-text {
		color: #6B5C4C;
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	.btn-create {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-create:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
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
		background-color: rgba(61, 48, 36, 0.4);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	.dialog {
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border-radius: 1rem;
		box-shadow:
			0 24px 48px rgba(61, 48, 36, 0.12),
			0 8px 16px rgba(61, 48, 36, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		max-width: 24rem;
		width: 100%;
		margin: 0 1rem;
		padding: 1.5rem;
		animation: modalEnter 0.25s ease-out;
		border: 1px solid #D4C4B0;
	}

	.dialog-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #2D5016;
		font-family: 'Caveat', 'Zen Kurenaido', cursive;
	}

	.dialog-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: linear-gradient(145deg, #FDFBF7, #F5F0E6);
		border: 2px solid #D4C4B0;
		border-radius: 0.75rem;
		font-weight: 500;
		color: #3D3024;
		margin-bottom: 1rem;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.dialog-input::placeholder {
		color: #8B6F47;
	}

	.dialog-input:focus {
		outline: none;
		border-color: #4A7C23;
		box-shadow: 0 0 0 3px rgba(74, 124, 35, 0.15);
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn-ghost {
		padding: 0.625rem 1.25rem;
		background: transparent;
		color: #6B5C4C;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-ghost:hover {
		background: rgba(45, 80, 22, 0.08);
	}

	.btn-primary {
		padding: 0.625rem 1.25rem;
		background: linear-gradient(135deg, #4A7C23, #2D5016);
		color: white;
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px rgba(45, 80, 22, 0.25);
		font-family: 'Quicksand', 'M PLUS Rounded 1c', sans-serif;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(45, 80, 22, 0.35);
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
