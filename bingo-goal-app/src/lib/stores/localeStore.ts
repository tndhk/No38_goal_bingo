import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Locale = 'ja' | 'en';

const STORAGE_KEY = 'bingo-goal-locale';

function getInitialLocale(): Locale {
	if (!browser) return 'ja';

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'ja' || stored === 'en') {
		return stored;
	}

	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('ja')) {
		return 'ja';
	}
	return 'en';
}

function createLocaleStore() {
	const { subscribe, set } = writable<Locale>(getInitialLocale());

	return {
		subscribe,
		setLocale: (locale: Locale) => {
			set(locale);
			if (browser) {
				localStorage.setItem(STORAGE_KEY, locale);
			}
		}
	};
}

export const localeStore = createLocaleStore();

export const currentLocale = derived(localeStore, ($locale): Locale => $locale);

export function setLocale(locale: Locale): void {
	localeStore.setLocale(locale);
}
