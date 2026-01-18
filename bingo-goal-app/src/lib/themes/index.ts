import type { Theme, ThemeId } from './types';

export const themes: Record<ThemeId, Theme> = {
	aurora: {
		meta: {
			id: 'aurora',
			name: 'Aurora',
			description: 'Deep cosmic vibes',
			icon: '🌌'
		},
		colors: {
			primary: '#818cf8',
			primaryLight: '#c084fc', // Secondary in CSS
			primaryDark: '#4338ca',
			achieved: '#d946ef',
			achievedLight: '#f0abfc',
			achievedGlow: '#a21caf',
			pending: 'rgba(15, 23, 42, 0.6)', // Surface
			pendingBorder: 'rgba(148, 163, 184, 0.1)',
			bingo: '#f59e0b',
			bingoGlow: '#fcd34d',
			background: '#020617',
			surface: 'rgba(15, 23, 42, 0.6)',
			text: '#f8fafc',
			textLight: '#94a3b8'
		},
		fonts: {
			body: "'Inter', system-ui, sans-serif",
			heading: "'Outfit', 'Plus Jakarta Sans', sans-serif",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
		},
		icon: {
			svgPath: 'M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 12l-2.5-2.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z',
			viewBox: '0 0 24 24',
			clipPath: 'circle(50% at 50% 50%)'
		}
	},
	neon: {
		meta: {
			id: 'neon',
			name: 'Neon',
			description: 'Cyberpunk night',
			icon: '⚡'
		},
		colors: {
			primary: '#22d3ee',
			primaryLight: '#e879f9',
			primaryDark: '#0891b2',
			achieved: '#e879f9',
			achievedLight: '#f0abfc',
			achievedGlow: '#d946ef',
			pending: 'rgba(24, 24, 27, 0.8)',
			pendingBorder: 'rgba(34, 211, 238, 0.2)',
			bingo: '#facc15',
			bingoGlow: '#fef08a',
			background: '#09090b',
			surface: 'rgba(24, 24, 27, 0.8)',
			text: '#ffffff',
			textLight: '#a1a1aa'
		},
		fonts: {
			body: "'Inter', system-ui, sans-serif",
			heading: "'Outfit', sans-serif",
			googleFontsUrl: ''
		},
		icon: {
			svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
			viewBox: '0 0 24 24',
			clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)'
		}
	},
	midnight: {
		meta: {
			id: 'midnight',
			name: 'Midnight',
			description: 'Neon Pop vibes',
			icon: '🌃'
		},
		colors: {
			primary: '#ff6b9d',
			primaryLight: '#ff8fb3',
			primaryDark: '#c44569',
			achieved: '#ffd93d',
			achievedLight: '#ffe066',
			achievedGlow: '#f4c430',
			pending: 'rgba(26, 26, 46, 0.9)',
			pendingBorder: 'rgba(255, 107, 157, 0.25)',
			bingo: '#6bcb77',
			bingoGlow: '#98d9a1',
			background: '#1a1a2e',
			surface: 'rgba(26, 26, 46, 0.9)',
			text: '#f8f8f8',
			textLight: '#b8b8d1'
		},
		fonts: {
			body: "'Inter', sans-serif",
			heading: "'Outfit', sans-serif",
			googleFontsUrl: ''
		},
		icon: {
			svgPath: 'M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2',
			viewBox: '0 0 24 24',
			clipPath: 'circle(50% at 50% 50%)'
		}
	},
	glass: {
		meta: {
			id: 'glass',
			name: 'Candy',
			description: 'Sweet & Pop',
			icon: '🍬'
		},
		colors: {
			primary: '#ec4899',
			primaryLight: '#f472b6',
			primaryDark: '#db2777',
			achieved: '#8b5cf6',
			achievedLight: '#a78bfa',
			achievedGlow: '#7c3aed',
			pending: 'rgba(255, 255, 255, 0.85)',
			pendingBorder: 'rgba(236, 72, 153, 0.2)',
			bingo: '#f59e0b',
			bingoGlow: '#fbbf24',
			background: '#fff0f5',
			surface: 'rgba(255, 255, 255, 0.85)',
			text: '#831843',
			textLight: '#9d174d'
		},
		fonts: {
			body: "'M PLUS Rounded 1c', 'Quicksand', sans-serif",
			heading: "'M PLUS Rounded 1c', 'Quicksand', sans-serif",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Quicksand:wght@400;500;600;700&display=swap'
		},
		icon: {
			svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12.57 6.6c-.36-.08-.73-.08-1.12 0-1.72.4-1.63 2.15-2.88 2.58-.69.23-1.42-.03-2-.37-.62-.35-1.57-.42-2.12.3-.53.7.1 1.63.38 2.27.52 1.18-.32 1.34-.33 1.73-.01.55.57 1.11 1.25 1.58.55.39.29 1.16.58 1.83.27.65 1.05 1.2 1.93.99 1.35-.32 1.9-1.99 3.25-1.99 1.35 0 1.9 1.67 3.25 1.99.88.21 1.66-.34 1.93-.99.29-.67.03-1.44.58-1.83.68-.47 1.26-1.03 1.25-1.58-.01-.39-.85-.56-.33-1.73.28-.64.91-1.57.38-2.27-.55-.72-1.5-.65-2.12-.3-.58.34-1.31.6-2 .37-1.25-.43-1.16-2.18-2.88-2.58z', // Candy swirl-ish / Flower
			viewBox: '0 0 24 24',
			clipPath: 'circle(50% at 50% 50%)'
		}
	}
};

export const themeIds: ThemeId[] = ['aurora', 'neon', 'midnight', 'glass'];

export const defaultThemeId: ThemeId = 'aurora';

export function getTheme(id: ThemeId): Theme {
	return themes[id];
}

export function isValidThemeId(id: string): id is ThemeId {
	return themeIds.includes(id as ThemeId);
}

export type { Theme, ThemeId, ThemeMeta, ThemeColors, ThemeFonts, ThemeIcon } from './types';
