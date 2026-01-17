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
		},
		icon: {
			svgPath: 'M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z',
			viewBox: '0 0 24 24',
			clipPath: 'polygon(50% 0%, 100% 50%, 80% 100%, 50% 80%, 20% 100%, 0% 50%)'
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
		},
		icon: {
			svgPath: 'M2 12c1.5-2 3-3 4.5-3s3 1 4.5 3c1.5 2 3 3 4.5 3s3-1 4.5-3M2 17c1.5-2 3-3 4.5-3s3 1 4.5 3c1.5 2 3 3 4.5 3s3-1 4.5-3M2 7c1.5-2 3-3 4.5-3s3 1 4.5 3c1.5 2 3 3 4.5 3s3-1 4.5-3',
			viewBox: '0 0 24 24',
			clipPath: 'polygon(0% 30%, 25% 0%, 50% 30%, 75% 0%, 100% 30%, 100% 100%, 0% 100%)'
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
		},
		icon: {
			svgPath: 'M12 2C12 2 9 5 9 8c0 1.5 1 3 3 3s3-1.5 3-3c0-3-3-6-3-6zm-5.5 5c0 0-2.5 1.5-2.5 4 0 1.2.8 2.5 2.5 2.5s2.5-1.3 2.5-2.5c0-2.5-2.5-4-2.5-4zm11 0c0 0-2.5 1.5-2.5 4 0 1.2.8 2.5 2.5 2.5s2.5-1.3 2.5-2.5c0-2.5-2.5-4-2.5-4zM7 15c0 0-3 1.5-3 4 0 1.2.8 2.5 2.5 2.5S9 20.2 9 19c0-2.5-2-4-2-4zm10 0c0 0-2 1.5-2 4 0 1.2.8 2.5 2.5 2.5s2.5-1.3 2.5-2.5c0-2.5-3-4-3-4z',
			viewBox: '0 0 24 24',
			clipPath: 'polygon(50% 5%, 65% 35%, 95% 25%, 80% 55%, 95% 85%, 50% 70%, 5% 85%, 20% 55%, 5% 25%, 35% 35%)'
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
		},
		icon: {
			svgPath: 'M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z',
			viewBox: '0 0 24 24',
			clipPath: 'polygon(50% 0%, 56% 44%, 100% 50%, 56% 56%, 50% 100%, 44% 56%, 0% 50%, 44% 44%)'
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

export type { Theme, ThemeId, ThemeMeta, ThemeColors, ThemeFonts, ThemeIcon } from './types';
