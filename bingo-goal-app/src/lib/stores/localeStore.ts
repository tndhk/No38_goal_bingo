import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export type Locale = 'ja' | 'en';

const STORAGE_KEY = 'bingo-goal-locale';
const DEFAULT_LOCALE: Locale = 'ja';

function isValidLocale(value: string): value is Locale {
	return value === 'ja' || value === 'en';
}

function detectBrowserLocale(): Locale {
	const browserLang = navigator.language.toLowerCase();
	return browserLang.startsWith('ja') ? 'ja' : 'en';
}

function getInitialLocale(): Locale {
	if (!browser) return DEFAULT_LOCALE;

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && isValidLocale(stored)) {
		return stored;
	}

	return detectBrowserLocale();
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
