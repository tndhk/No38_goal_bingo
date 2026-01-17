import { createSupabaseBrowserClient } from '$lib/supabase/client';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseBrowserClient();

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		supabase,
		session,
		user: data.user
	};
};
