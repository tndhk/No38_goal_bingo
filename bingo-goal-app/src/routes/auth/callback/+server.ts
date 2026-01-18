import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSafeRedirectPath } from '$lib/utils/security';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next');

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, getSafeRedirectPath(next));
		}
	}

	redirect(303, '/auth/error');
};
