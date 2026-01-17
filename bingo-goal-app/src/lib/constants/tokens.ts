export const colors = {
	// Primary: Violet
	primary: '#7C3AED',
	primaryLight: '#A78BFA',
	primaryDark: '#5B21B6',
	// Success/Achieved: Emerald
	achieved: '#10B981',
	achievedLight: '#6EE7B7',
	achievedGlow: '#34D399',
	// Pending: Amber Light
	pending: '#FEF3C7',
	pendingBorder: '#FDE68A',
	// Bingo: Amber
	bingo: '#F59E0B',
	bingoGlow: '#FBBF24',
	// Background & Surface
	background: '#FAF5FF',
	surface: '#FFFFFF',
	// Text: Indigo
	text: '#1E1B4B',
	textLight: '#6366F1',
	// Accents
	accentPink: '#F472B6',
	accentBlue: '#60A5FA',
	accentGreen: '#34D399',
	accentYellow: '#FBBF24',
} as const;

export const spacing = {
	cellGap: 4,
	boardPadding: 16,
} as const;

export const animation = {
	achieveDuration: 300,
	bingoLineDuration: 500,
} as const;
