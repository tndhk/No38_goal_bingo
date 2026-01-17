import type { Theme, ThemeId } from './types';

export const themes: Record<ThemeId, Theme> = {
	forest: {
		meta: {
			id: 'forest',
			name: 'Forest',
			description: '森の中の静けさ、自然との調和',
			icon: '🌲'
		},
		colors: {
			primary: '#2D5016',
			primaryLight: '#4A7C23',
			primaryDark: '#1F3A0F',
			achieved: '#C2410C',
			achievedLight: '#EA580C',
			achievedGlow: '#FB923C',
			pending: '#F5F0E6',
			pendingBorder: '#D4C4B0',
			bingo: '#B45309',
			bingoGlow: '#D97706',
			background: '#FDFBF7',
			surface: '#FAF7F2',
			text: '#3D3024',
			textLight: '#6B5C4C'
		},
		fonts: {
			body: "'Quicksand', 'M PLUS Rounded 1c', sans-serif",
			heading: "'Caveat', 'Zen Kurenaido', cursive",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=M+PLUS+Rounded+1c:wght@400;500;700&family=Quicksand:wght@400;500;600;700&family=Zen+Kurenaido&display=swap'
		}
	},
	ocean: {
		meta: {
			id: 'ocean',
			name: 'Ocean',
			description: '深い海の静寂、波のリズム',
			icon: '🌊'
		},
		colors: {
			primary: '#1E3A5F',
			primaryLight: '#2563EB',
			primaryDark: '#1E3A8A',
			achieved: '#059669',
			achievedLight: '#10B981',
			achievedGlow: '#34D399',
			pending: '#E0F2FE',
			pendingBorder: '#BAE6FD',
			bingo: '#0891B2',
			bingoGlow: '#22D3EE',
			background: '#F0F9FF',
			surface: '#E0F2FE',
			text: '#0C4A6E',
			textLight: '#0369A1'
		},
		fonts: {
			body: "'Inter', 'Noto Sans JP', sans-serif",
			heading: "'Playfair Display', 'Shippori Mincho', serif",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700&family=Shippori+Mincho:wght@400;500;700&display=swap'
		}
	},
	sakura: {
		meta: {
			id: 'sakura',
			name: 'Sakura',
			description: '日本の春、桜の花びら',
			icon: '🌸'
		},
		colors: {
			primary: '#9D174D',
			primaryLight: '#DB2777',
			primaryDark: '#831843',
			achieved: '#7C3AED',
			achievedLight: '#8B5CF6',
			achievedGlow: '#A78BFA',
			pending: '#FDF2F8',
			pendingBorder: '#FBCFE8',
			bingo: '#C026D3',
			bingoGlow: '#E879F9',
			background: '#FFF1F5',
			surface: '#FDF2F8',
			text: '#831843',
			textLight: '#BE185D'
		},
		fonts: {
			body: "'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif",
			heading: "'Shippori Mincho', 'Noto Serif JP', serif",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&family=Noto+Serif+JP:wght@400;500;700&family=Shippori+Mincho:wght@400;500;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap'
		}
	},
	midnight: {
		meta: {
			id: 'midnight',
			name: 'Midnight',
			description: '夜空の神秘、集中と内省',
			icon: '🌙'
		},
		colors: {
			primary: '#6366F1',
			primaryLight: '#818CF8',
			primaryDark: '#4F46E5',
			achieved: '#10B981',
			achievedLight: '#34D399',
			achievedGlow: '#6EE7B7',
			pending: '#1E293B',
			pendingBorder: '#334155',
			bingo: '#F59E0B',
			bingoGlow: '#FBBF24',
			background: '#0F172A',
			surface: '#1E293B',
			text: '#E2E8F0',
			textLight: '#94A3B8'
		},
		fonts: {
			body: "'JetBrains Mono', 'M PLUS 1 Code', monospace",
			heading: "'Space Grotesk', 'Noto Sans JP', sans-serif",
			googleFontsUrl:
				'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=M+PLUS+1+Code:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
		}
	}
};

export const themeIds: ThemeId[] = ['forest', 'ocean', 'sakura', 'midnight'];

export const defaultThemeId: ThemeId = 'forest';

export function getTheme(id: ThemeId): Theme {
	return themes[id];
}

export function isValidThemeId(id: string): id is ThemeId {
	return themeIds.includes(id as ThemeId);
}

export type { Theme, ThemeId, ThemeMeta, ThemeColors, ThemeFonts } from './types';
