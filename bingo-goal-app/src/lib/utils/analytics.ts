import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

const GA_MEASUREMENT_ID = env.PUBLIC_GA_MEASUREMENT_ID;

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	}
}

let initialized = false;

/**
 * Initialize Google Analytics 4
 * Only runs in browser and when GA_MEASUREMENT_ID is configured
 */
export function initGA(): void {
	if (!browser || initialized || !GA_MEASUREMENT_ID) {
		return;
	}

	// Create script element for gtag.js
	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

	script.onerror = () => {
		console.warn('[Analytics] Failed to load Google Analytics script');
	};

	document.head.appendChild(script);

	// Initialize dataLayer and gtag
	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag(...args: unknown[]) {
		window.dataLayer.push(args);
	};

	window.gtag('js', new Date());
	window.gtag('config', GA_MEASUREMENT_ID, {
		anonymize_ip: true,
		cookie_flags: 'SameSite=None;Secure'
	});

	initialized = true;
}

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param parameters - Optional event parameters
 */
export function trackEvent(
	eventName: string,
	parameters?: Record<string, string | number | boolean>
): void {
	if (!browser || !initialized || !window.gtag) {
		return;
	}

	window.gtag('event', eventName, parameters);
}

/**
 * Track page view (useful for SPA navigation)
 * @param pagePath - The page path
 * @param pageTitle - The page title
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
	if (!browser || !initialized || !window.gtag) {
		return;
	}

	window.gtag('event', 'page_view', {
		page_path: pagePath,
		page_title: pageTitle
	});
}
