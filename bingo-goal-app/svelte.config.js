import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://www.googletagmanager.com'],
				// Note: 'unsafe-inline' is required for SvelteKit's style injection.
				// Security is maintained through nonce-based CSP (%sveltekit.nonce%).
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'connect-src': ['self', 'https://*.supabase.co', 'wss://*.supabase.co', 'https://www.google-analytics.com', 'https://analytics.google.com'],
				'img-src': ['self', 'data:', 'blob:', 'https://www.google-analytics.com'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
