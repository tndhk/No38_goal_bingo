import confetti from 'canvas-confetti';

export type CelebrationType = 'bingo' | 'perfect';

const BINGO_COLORS = ['#FBBF24', '#10B981', '#4F46E5'];
const PERFECT_COLORS = ['#10B981', '#FBBF24', '#EC4899', '#8B5CF6'];

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
			particleCount: 3,
			angle: 60,
			spread: 55,
			origin: { x: 0 },
			colors: PERFECT_COLORS
		});
		confetti({
			particleCount: 3,
			angle: 120,
			spread: 55,
			origin: { x: 1 },
			colors: PERFECT_COLORS
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
