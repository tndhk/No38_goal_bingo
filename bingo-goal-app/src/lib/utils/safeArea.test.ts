import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Safe Area CSS Variables', () => {
	const cssPath = resolve(process.cwd(), 'src/app.css');
	const cssContent = readFileSync(cssPath, 'utf-8');

	it('should define --safe-area-top CSS custom property', () => {
		expect(cssContent).toContain('--safe-area-top');
		expect(cssContent).toContain('env(safe-area-inset-top');
	});

	it('should define --safe-area-right CSS custom property', () => {
		expect(cssContent).toContain('--safe-area-right');
		expect(cssContent).toContain('env(safe-area-inset-right');
	});

	it('should define --safe-area-bottom CSS custom property', () => {
		expect(cssContent).toContain('--safe-area-bottom');
		expect(cssContent).toContain('env(safe-area-inset-bottom');
	});

	it('should define --safe-area-left CSS custom property', () => {
		expect(cssContent).toContain('--safe-area-left');
		expect(cssContent).toContain('env(safe-area-inset-left');
	});

	it('should define --touch-target-min CSS custom property with 44px', () => {
		expect(cssContent).toContain('--touch-target-min: 44px');
	});

	it('should have all safe area variables in :root selector', () => {
		const rootMatch = cssContent.match(/:root\s*{([^}]*)}/s);
		expect(rootMatch).toBeTruthy();
		const rootContent = rootMatch![1];
		expect(rootContent).toContain('--safe-area-top');
		expect(rootContent).toContain('--safe-area-right');
		expect(rootContent).toContain('--safe-area-bottom');
		expect(rootContent).toContain('--safe-area-left');
		expect(rootContent).toContain('--touch-target-min');
	});
});
