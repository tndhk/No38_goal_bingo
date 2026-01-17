export type ThemeId = 'forest' | 'ocean' | 'sakura' | 'midnight';

export interface ThemeIcon {
	svgPath: string;
	viewBox: string;
	clipPath: string;
}

export interface ThemeColors {
	primary: string;
	primaryLight: string;
	primaryDark: string;
	achieved: string;
	achievedLight: string;
	achievedGlow: string;
	pending: string;
	pendingBorder: string;
	bingo: string;
	bingoGlow: string;
	background: string;
	surface: string;
	text: string;
	textLight: string;
}

export interface ThemeFonts {
	body: string;
	heading: string;
	googleFontsUrl: string;
}

export interface ThemeMeta {
	id: ThemeId;
	name: string;
	description: string;
	icon: string;
}

export interface Theme {
	meta: ThemeMeta;
	colors: ThemeColors;
	fonts: ThemeFonts;
	icon: ThemeIcon;
}
