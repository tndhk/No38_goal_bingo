import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { themes, defaultThemeId, isValidThemeId } from '$lib/themes';
import type { ThemeId, Theme } from '$lib/themes';

const STORAGE_KEY = 'bingo-goal-theme';

function getInitialThemeId(): ThemeId {
	if (!browser) return defaultThemeId;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isValidThemeId(stored)) {
		return stored;
	}
	return defaultThemeId;
}

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeId>(getInitialThemeId());

	return {
		subscribe,
		setTheme: (id: ThemeId) => {
			set(id);
			if (browser) {
				localStorage.setItem(STORAGE_KEY, id);
				document.documentElement.setAttribute('data-theme', id);
			}
		},
		initialize: () => {
			if (browser) {
				const currentThemeId = get({ subscribe });
				document.documentElement.setAttribute('data-theme', currentThemeId);
			}
		}
	};
}

export const themeStore = createThemeStore();

export const currentTheme = derived(themeStore, ($themeId): Theme => {
	return themes[$themeId];
});

export const currentThemeId = derived(themeStore, ($themeId): ThemeId => $themeId);

export function setTheme(id: ThemeId): void {
	themeStore.setTheme(id);
}

export function initializeTheme(): void {
	themeStore.initialize();
}
