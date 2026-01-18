import confetti from 'canvas-confetti';

export type CelebrationType = 'bingo' | 'perfect';

const BINGO_COLORS = ['#F59E0B', '#FBBF24', '#7C3AED', '#A78BFA'];
const PERFECT_COLORS = ['#7C3AED', '#A78BFA', '#F472B6', '#60A5FA', '#34D399', '#FBBF24'];

const PERFECT_CONFETTI_BASE = {
	particleCount: 3,
	spread: 55,
	colors: PERFECT_COLORS
} as const;

export function celebrateBingo(): void {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		colors: BINGO_COLORS
	});
}

export function celebratePerfect(): void {
	const duration = 3000;
	const animationEnd = Date.now() + duration;

	const frame = () => {
		confetti({
			...PERFECT_CONFETTI_BASE,
			angle: 60,
			origin: { x: 0 }
		});
		confetti({
			...PERFECT_CONFETTI_BASE,
			angle: 120,
			origin: { x: 1 }
		});

		if (Date.now() < animationEnd) {
			requestAnimationFrame(frame);
		}
	};

	frame();
}

export function celebrate(type: CelebrationType): void {
	if (type === 'perfect') {
		celebratePerfect();
	} else {
		celebrateBingo();
	}
}
