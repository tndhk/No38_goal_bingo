import { writable, derived } from 'svelte/store';
import type { Session, User, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types';

type AuthState = {
	session: Session | null;
	user: User | null;
	isLoading: boolean;
};

const initialState: AuthState = {
	session: null,
	user: null,
	isLoading: true
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		set,
		update,
		setSession: (session: Session | null, user: User | null) => {
			set({ session, user, isLoading: false });
		},
		setLoading: (isLoading: boolean) => {
			update((state) => ({ ...state, isLoading }));
		},
		reset: () => {
			set({ ...initialState, isLoading: false });
		}
	};
}

export const authStore = createAuthStore();

export const isAuthenticated = derived(authStore, ($auth) => !!$auth.session && !!$auth.user);
export const currentUser = derived(authStore, ($auth) => $auth.user);
export const isAuthLoading = derived(authStore, ($auth) => $auth.isLoading);

export async function signInWithGoogle(supabase: SupabaseClient<Database>) {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${window.location.origin}/auth/callback`
		}
	});

	if (error) {
		console.error('Google sign in error:', error);
		throw error;
	}
}

export async function signOut(supabase: SupabaseClient<Database>) {
	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error('Sign out error:', error);
		throw error;
	}

	authStore.reset();
}
