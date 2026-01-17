<script lang="ts">
	import { themeStore, currentTheme } from '$lib/stores/themeStore';
	import { themes, themeIds } from '$lib/themes';
	import type { ThemeId } from '$lib/themes';

	let isOpen = $state(false);

	const theme = $derived($currentTheme);

	function selectTheme(id: ThemeId) {
		themeStore.setTheme(id);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.theme-selector')) {
			isOpen = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="theme-selector">
	<button
		type="button"
		class="trigger"
		onclick={toggleDropdown}
		aria-label="Select theme"
		aria-expanded={isOpen}
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	</button>

	{#if isOpen}
		<div class="dropdown" role="menu">
			{#each themeIds as id}
				{@const t = themes[id]}
				<button
					type="button"
					class="theme-option"
					class:active={id === theme.meta.id}
					onclick={() => selectTheme(id)}
					role="menuitem"
				>
					<span class="theme-icon">{t.meta.icon}</span>
					<div class="theme-info">
						<span class="theme-name">{t.meta.name}</span>
						<span class="theme-desc">{t.meta.description}</span>
					</div>
					<div class="color-preview">
						<span class="color-dot" style="background: {t.colors.primary}"></span>
						<span class="color-dot" style="background: {t.colors.achieved}"></span>
						<span class="color-dot" style="background: {t.colors.background}"></span>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.theme-selector {
		position: relative;
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		background: transparent;
		border: none;
		color: white;
		cursor: pointer;
		transition: background 0.15s ease-out;
	}

	.trigger:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.trigger svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		width: 16rem;
		background: var(--theme-background);
		border: 1px solid var(--theme-pending-border);
		border-radius: 0.75rem;
		box-shadow:
			0 10px 25px rgba(0, 0, 0, 0.15),
			0 4px 10px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		z-index: 100;
		animation: slideDown 0.15s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.theme-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background 0.15s ease-out;
		text-align: left;
	}

	.theme-option:hover {
		background: color-mix(in srgb, var(--theme-primary) 8%, transparent);
	}

	.theme-option.active {
		background: color-mix(in srgb, var(--theme-primary) 12%, transparent);
	}

	.theme-icon {
		font-size: 1.25rem;
		width: 2rem;
		text-align: center;
	}

	.theme-info {
		flex: 1;
		min-width: 0;
	}

	.theme-name {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--theme-text);
	}

	.theme-desc {
		display: block;
		font-size: 0.75rem;
		color: var(--theme-text-light);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.color-preview {
		display: flex;
		gap: 0.25rem;
	}

	.color-dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
</style>
