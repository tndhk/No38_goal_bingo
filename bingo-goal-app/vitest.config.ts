import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test-setup.ts'],
		alias: {
			'$lib': '/src/lib',
			'$app/environment': path.resolve('./src/test-mocks/app-environment.ts'),
			'$env/dynamic/public': path.resolve('./src/test-mocks/env-dynamic-public.ts')
		}
	},
	resolve: {
		conditions: ['browser']
	}
});
