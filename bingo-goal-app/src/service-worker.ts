/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `bingoal-cache-${version}`;

// Files to cache immediately on install
const PRECACHE_FILES = [
	...build, // the app itself
	...files // everything in `static`
];

// Cache first strategy for static assets
const CACHE_FIRST_PATTERNS = [
	/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff|woff2)$/,
	/^https:\/\/fonts\.(googleapis|gstatic)\.com/
];

// Network first strategy for API calls
const NETWORK_FIRST_PATTERNS = [/\/api\//, /supabase\.co/];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(PRECACHE_FILES))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME && key.startsWith('bingoal-cache-'))
						.map((key) => caches.delete(key))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip chrome-extension and other non-http(s) requests
	if (!url.protocol.startsWith('http')) {
		return;
	}

	// Network first for API and Supabase
	if (NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(request.url))) {
		event.respondWith(networkFirst(request));
		return;
	}

	// Cache first for static assets
	if (CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(request.url))) {
		event.respondWith(cacheFirst(request));
		return;
	}

	// Stale while revalidate for everything else
	event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request: Request): Promise<Response> {
	const cached = await caches.match(request);
	if (cached) {
		return cached;
	}

	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		console.warn('[SW] cacheFirst failed for:', request.url, error);
		return new Response('Offline', { status: 503 });
	}
}

async function networkFirst(request: Request): Promise<Response> {
	try {
		const response = await fetch(request);
		return response;
	} catch (error) {
		console.warn('[SW] networkFirst failed, falling back to cache:', request.url, error);
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		return new Response('Offline', { status: 503 });
	}
}

async function staleWhileRevalidate(request: Request): Promise<Response> {
	const cached = await caches.match(request);

	const fetchPromise = fetch(request).then((response) => {
		if (response.ok) {
			caches.open(CACHE_NAME).then((cache) => {
				cache.put(request, response.clone());
			});
		}
		return response;
	});

	return cached ?? fetchPromise;
}
