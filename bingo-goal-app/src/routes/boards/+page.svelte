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
	import { currentTheme } from '$lib/stores/themeStore';
	import type { BoardSize } from '$lib/types/bingo';
	import BoardList from '$lib/components/bingo/BoardList.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';

	let isDeleteDialogOpen = $state(false);
	let boardToDelete = $state<{ id: string; name: string } | null>(null);
	let isNameDialogOpen = $state(false);
	let newBoardName = $state('');
	let selectedSize = $state<BoardSize>(3);

	const boards = $derived($boardStore.boards);
	const themeIcon = $derived($currentTheme.icon);

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
		selectedSize = 3;
		isNameDialogOpen = true;
	}

	function handleCreateBoard() {
		const name = newBoardName.trim() || `${new Date().getFullYear()} Goals`;
		createBoard(name, selectedSize);
		newBoardName = '';
		selectedSize = 3;
		isNameDialogOpen = false;
	}
</script>

<svelte:head>
	<title>My Boards - Bingo Planner</title>
</svelte:head>

<div class="page">
	<div class="bg-decoration bg-decoration-1" style="clip-path: {themeIcon.clipPath}"></div>
	<div class="bg-decoration bg-decoration-2" style="clip-path: {themeIcon.clipPath}"></div>
	<div class="bg-decoration bg-decoration-3" style="clip-path: {themeIcon.clipPath}"></div>

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

			<div class="size-selector">
				<label class="size-label">Board Size</label>
				<div class="size-options">
					{#each [3, 4, 5] as size (size)}
						<button
							type="button"
							class="size-option"
							class:selected={selectedSize === size}
							onclick={() => (selectedSize = size as BoardSize)}
						>
							{size}x{size}
							<span class="size-count">({size * size} goals)</span>
						</button>
					{/each}
				</div>
			</div>

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
		background: linear-gradient(180deg, var(--theme-background) 0%, color-mix(in srgb, var(--theme-background) 95%, var(--theme-pending)) 50%, var(--theme-pending) 100%);
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
		background: var(--theme-primary-light);
		top: -50px;
		right: -50px;
		transform: rotate(25deg);
	}

	.bg-decoration-2 {
		width: 150px;
		height: 150px;
		background: var(--theme-primary);
		bottom: 15%;
		left: -40px;
		transform: rotate(-15deg);
	}

	.bg-decoration-3 {
		width: 120px;
		height: 120px;
		background: var(--theme-achieved-light);
		bottom: 40%;
		right: -30px;
		transform: rotate(45deg);
	}

	.header {
		background: linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary));
		box-shadow:
			0 4px 20px color-mix(in srgb, var(--theme-primary) 30%, transparent),
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
		color: var(--theme-text-on-primary);
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
		color: var(--theme-text-on-primary);
		letter-spacing: -0.01em;
		font-family: var(--theme-font-heading);
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
		background: linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary));
		color: var(--theme-text-on-primary);
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
		font-family: var(--theme-font-body);
	}

	.btn-new:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-icon {
		width: 4rem;
		height: 4rem;
		margin: 0 auto 1rem;
		background: linear-gradient(145deg, var(--theme-background), var(--theme-pending));
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		border: 1px solid var(--theme-pending-border);
	}

	.empty-icon svg {
		width: 2rem;
		height: 2rem;
		color: var(--theme-text-light);
	}

	.empty-text {
		color: var(--theme-text-light);
		font-weight: 500;
		margin-bottom: 1.5rem;
	}

	.btn-create {
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary));
		color: var(--theme-text-on-primary);
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
		font-family: var(--theme-font-body);
	}

	.btn-create:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
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
		background-color: color-mix(in srgb, var(--theme-text) 40%, transparent);
		backdrop-filter: blur(4px);
		animation: fadeIn 0.2s ease-out;
	}

	.dialog {
		/* 明るいテーマでも見やすい背景 */
		background: color-mix(in srgb, var(--theme-surface) 98%, white);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 1rem;
		box-shadow:
			0 24px 48px rgba(0, 0, 0, 0.12),
			0 8px 16px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		max-width: 24rem;
		width: 100%;
		margin: 0 1rem;
		padding: 1.5rem;
		animation: modalEnter 0.25s ease-out;
		border: 2px solid var(--theme-border);
	}

	.dialog-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--theme-text); /* 常にテーマのテキストカラーを使用 */
		font-family: var(--theme-font-heading);
	}

	.dialog-input {
		width: 100%;
		padding: 0.75rem 1rem;
		/* テーマに応じた背景 */
		background: color-mix(in srgb, var(--theme-surface) 70%, var(--theme-text) 5%);
		border: 2px solid var(--theme-border);
		border-radius: 0.75rem;
		font-weight: 500;
		color: var(--theme-text);
		margin-bottom: 1rem;
		font-family: var(--theme-font-body);
	}

	.dialog-input::placeholder {
		color: var(--theme-text-light);
	}

	.dialog-input:focus {
		outline: none;
		border-color: var(--theme-primary-light);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary-light) 15%, transparent);
	}

	.size-selector {
		margin-bottom: 1rem;
	}

	.size-label {
		display: block;
		font-weight: 600;
		color: var(--theme-text);
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-family: var(--theme-font-body);
	}

	.size-options {
		display: flex;
		gap: 0.5rem;
	}

	.size-option {
		flex: 1;
		padding: 0.75rem 0.5rem;
		/* テーマに応じた背景 */
		background: color-mix(in srgb, var(--theme-surface) 60%, var(--theme-text) 3%);
		border: 2px solid var(--theme-border);
		border-radius: 0.5rem;
		font-weight: 600;
		color: var(--theme-text);
		cursor: pointer;
		transition: all 0.2s ease-out;
		text-align: center;
		font-family: var(--theme-font-body);
	}

	.size-option:hover {
		border-color: var(--theme-primary);
		background: color-mix(in srgb, var(--theme-surface) 70%, var(--theme-text) 5%);
	}

	.size-option.selected {
		border-color: var(--theme-primary);
		background: var(--theme-primary);
		color: var(--theme-text-on-primary);
		box-shadow: 0 4px 12px var(--theme-glow);
	}

	.size-count {
		display: block;
		font-size: 0.75rem;
		color: var(--theme-text-light);
		font-weight: 400;
		margin-top: 0.25rem;
	}

	.dialog-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.btn-ghost {
		padding: 0.625rem 1.25rem;
		background: transparent;
		color: var(--theme-text-light);
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		font-family: var(--theme-font-body);
	}

	.btn-ghost:hover {
		background: color-mix(in srgb, var(--theme-primary) 8%, transparent);
	}

	.btn-primary {
		padding: 0.625rem 1.25rem;
		background: linear-gradient(135deg, var(--theme-primary-dim), var(--theme-primary));
		color: var(--theme-text-on-primary);
		border: none;
		border-radius: 0.75rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease-out;
		box-shadow: 0 4px 14px color-mix(in srgb, var(--theme-primary) 25%, transparent);
		font-family: var(--theme-font-body);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px color-mix(in srgb, var(--theme-primary) 35%, transparent);
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
