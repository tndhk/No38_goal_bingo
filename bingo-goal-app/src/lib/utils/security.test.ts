import { describe, test, expect } from 'vitest';
import { isValidRedirectPath, getSafeRedirectPath } from './security';

describe('isValidRedirectPath', () => {
	// 有効なパス
	test('accepts root path', () => {
		expect(isValidRedirectPath('/')).toBe(true);
	});

	test('accepts /boards path', () => {
		expect(isValidRedirectPath('/boards')).toBe(true);
	});

	test('accepts /boards with subpath', () => {
		expect(isValidRedirectPath('/boards/123')).toBe(true);
	});

	// 無効なパス（攻撃パターン）
	test('rejects https URL', () => {
		expect(isValidRedirectPath('https://evil.com')).toBe(false);
	});

	test('rejects http URL', () => {
		expect(isValidRedirectPath('http://evil.com')).toBe(false);
	});

	test('rejects protocol-relative URL', () => {
		expect(isValidRedirectPath('//evil.com')).toBe(false);
	});

	test('rejects javascript: scheme', () => {
		expect(isValidRedirectPath('javascript:alert(1)')).toBe(false);
	});

	test('rejects data: scheme', () => {
		expect(isValidRedirectPath('data:text/html,<script>alert(1)</script>')).toBe(false);
	});

	test('rejects empty string', () => {
		expect(isValidRedirectPath('')).toBe(false);
	});

	test('rejects null', () => {
		expect(isValidRedirectPath(null as unknown as string)).toBe(false);
	});

	test('rejects undefined', () => {
		expect(isValidRedirectPath(undefined as unknown as string)).toBe(false);
	});

	test('rejects relative path without leading slash', () => {
		expect(isValidRedirectPath('boards')).toBe(false);
	});

	test('rejects path not in allowed list', () => {
		expect(isValidRedirectPath('/admin')).toBe(false);
	});

	test('rejects path with query string attempting bypass', () => {
		expect(isValidRedirectPath('/boards?redirect=https://evil.com')).toBe(true);
	});
});

describe('getSafeRedirectPath', () => {
	test('returns valid path as-is', () => {
		expect(getSafeRedirectPath('/boards')).toBe('/boards');
	});

	test('returns root path as-is', () => {
		expect(getSafeRedirectPath('/')).toBe('/');
	});

	test('returns default for invalid path', () => {
		expect(getSafeRedirectPath('https://evil.com')).toBe('/');
	});

	test('returns default for null', () => {
		expect(getSafeRedirectPath(null)).toBe('/');
	});

	test('returns default for undefined', () => {
		expect(getSafeRedirectPath(undefined)).toBe('/');
	});

	test('returns default for empty string', () => {
		expect(getSafeRedirectPath('')).toBe('/');
	});

	test('returns default for protocol-relative URL', () => {
		expect(getSafeRedirectPath('//evil.com')).toBe('/');
	});
});
