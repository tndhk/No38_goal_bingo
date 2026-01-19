import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// $env/dynamic/public と $app/environment のモックはvitest.config.tsで設定済み

describe('Analytics', () => {
	let originalWindow: typeof window;
	let mockScript: {
		async: boolean;
		src: string;
		onerror: ((event: Event | string) => void) | null;
		onload: (() => void) | null;
	};

	beforeEach(() => {
		vi.resetModules();
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		// window.dataLayer と window.gtag をリセット
		// @ts-expect-error - テスト用にリセット
		window.dataLayer = undefined;
		// @ts-expect-error - テスト用にリセット
		window.gtag = undefined;

		// document.createElement のモック
		mockScript = {
			async: false,
			src: '',
			onerror: null,
			onload: null
		};

		vi.spyOn(document, 'createElement').mockReturnValue(mockScript as unknown as HTMLScriptElement);
		vi.spyOn(document.head, 'appendChild').mockImplementation((node) => node);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('initGA', () => {
		it('should handle script load error gracefully', async () => {
			const { initGA } = await import('./analytics');

			// appendChild が呼ばれた後に onerror をトリガー
			vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
				setTimeout(() => {
					if (mockScript.onerror) {
						mockScript.onerror('Script load error');
					}
				}, 0);
				return node;
			});

			initGA();

			// 非同期でonerrorが呼ばれるのを待つ
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(console.warn).toHaveBeenCalledWith(
				'[Analytics] Failed to load Google Analytics script'
			);
		});

		it('should initialize dataLayer and gtag immediately', async () => {
			const { initGA } = await import('./analytics');

			initGA();

			expect(window.dataLayer).toBeDefined();
			expect(window.gtag).toBeDefined();
		});

		it('should not initialize twice', async () => {
			vi.resetModules();
			const { initGA } = await import('./analytics');

			initGA();
			initGA();

			// createElement は1回だけ呼ばれる
			expect(document.createElement).toHaveBeenCalledTimes(1);
		});
	});

	describe('trackEvent', () => {
		it('should call gtag with event parameters', async () => {
			const { initGA, trackEvent } = await import('./analytics');

			// 初期化してgtagをセットアップ
			initGA();

			const gtagSpy = vi.spyOn(window, 'gtag');
			trackEvent('test_event', { value: 100 });

			expect(gtagSpy).toHaveBeenCalledWith('event', 'test_event', { value: 100 });
		});

		it('should not call gtag if not initialized', async () => {
			vi.resetModules();

			// initialized = false の状態で呼び出す
			const analytics = await import('./analytics');

			// gtagを手動で設定
			const mockGtag = vi.fn();
			window.gtag = mockGtag;

			// 直接trackEventを呼び出し（initGAなし）
			analytics.trackEvent('test_event', { value: 100 });

			// 初期化されていないので呼ばれない
			expect(mockGtag).not.toHaveBeenCalled();
		});
	});

	describe('trackPageView', () => {
		it('should call gtag with page_view event', async () => {
			const { initGA, trackPageView } = await import('./analytics');

			initGA();

			const gtagSpy = vi.spyOn(window, 'gtag');
			trackPageView('/test-page', 'Test Page');

			expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', {
				page_path: '/test-page',
				page_title: 'Test Page'
			});
		});
	});
});
