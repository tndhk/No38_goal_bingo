import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Viewport Meta Tag Configuration', () => {
	const htmlPath = resolve(process.cwd(), 'src/app.html');
	const htmlContent = readFileSync(htmlPath, 'utf-8');

	it('should have viewport meta tag', () => {
		expect(htmlContent).toContain('<meta name="viewport"');
	});

	it('should include width=device-width', () => {
		const viewportMatch = htmlContent.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"[^>]*>/);
		expect(viewportMatch).toBeTruthy();
		expect(viewportMatch![1]).toContain('width=device-width');
	});

	it('should include initial-scale=1', () => {
		const viewportMatch = htmlContent.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"[^>]*>/);
		expect(viewportMatch).toBeTruthy();
		expect(viewportMatch![1]).toContain('initial-scale=1');
	});

	it('should include viewport-fit=cover for safe area support', () => {
		const viewportMatch = htmlContent.match(/<meta[^>]*name="viewport"[^>]*content="([^"]*)"[^>]*>/);
		expect(viewportMatch).toBeTruthy();
		expect(viewportMatch![1]).toContain('viewport-fit=cover');
	});
});
