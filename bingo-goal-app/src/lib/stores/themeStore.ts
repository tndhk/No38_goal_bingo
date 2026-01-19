import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { themes, defaultThemeId, isValidThemeId } from '$lib/themes';
import type { ThemeId, Theme } from '$lib/themes';

const STORAGE_KEY = 'bingo-goal-theme';

function applyThemeToDOM(id: ThemeId): void {
	if (browser) {
		document.documentElement.setAttribute('data-theme', id);
	}
}

function getInitialThemeId(): ThemeId {
	if (!browser) return defaultThemeId;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isValidThemeId(stored)) {
		return stored;
	}
	return defaultThemeId;
}

function createThemeStore() {
	const initialThemeId = getInitialThemeId();
	const { subscribe, set } = writable<ThemeId>(initialThemeId);

	return {
		subscribe,
		setTheme: (id: ThemeId) => {
			set(id);
			if (browser) {
				localStorage.setItem(STORAGE_KEY, id);
			}
			applyThemeToDOM(id);
		},
		initialize: () => {
			applyThemeToDOM(initialThemeId);
		}
	};
}

export const themeStore = createThemeStore();

export const currentTheme = derived(themeStore, ($themeId): Theme => {
	return themes[$themeId];
});

export function initializeTheme(): void {
	themeStore.initialize();
}
