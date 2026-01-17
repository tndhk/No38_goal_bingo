export const colors = {
	// Primary: Forest Green
	primary: '#2D5016',
	primaryLight: '#4A7C23',
	primaryDark: '#1F3A0F',
	// Success/Achieved: Terracotta
	achieved: '#C2410C',
	achievedLight: '#EA580C',
	achievedGlow: '#FB923C',
	// Pending: Cream
	pending: '#F5F0E6',
	pendingBorder: '#D4C4B0',
	// Bingo: Amber
	bingo: '#B45309',
	bingoGlow: '#D97706',
	// Background & Surface: Washi Paper
	background: '#FDFBF7',
	surface: '#FAF7F2',
	// Text: Brown
	text: '#3D3024',
	textLight: '#6B5C4C',
	// Accents: Natural
	accentMoss: '#4A7C23',
	accentBark: '#8B6F47',
	accentLeaf: '#7CB342',
	accentAmber: '#D97706',
} as const;

export const spacing = {
	cellGap: 4,
	boardPadding: 16,
} as const;

export const animation = {
	achieveDuration: 300,
	bingoLineDuration: 500,
} as const;
