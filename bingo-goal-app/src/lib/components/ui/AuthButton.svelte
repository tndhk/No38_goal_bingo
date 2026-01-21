<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/supabase/types';
	import { signInWithGoogle, signOut, isAuthenticated, currentUser } from '$lib/stores/authStore';

	type Props = {
		supabase: SupabaseClient<Database>;
	};

	let { supabase }: Props = $props();

	const authenticated = $derived($isAuthenticated);
	const user = $derived($currentUser);

	let isLoading = $state(false);
	let avatarError = $state(false);

	function isValidImageUrl(url: string | undefined): url is string {
		if (!url) return false;
		try {
			const parsedUrl = new URL(url);
			return ['https:', 'http:'].includes(parsedUrl.protocol);
		} catch {
			return false;
		}
	}

	const avatarUrl = $derived(() => {
		const picture = user?.user_metadata?.picture;
		const avatar = user?.user_metadata?.avatar_url;
		if (isValidImageUrl(picture)) return picture;
		if (isValidImageUrl(avatar)) return avatar;
		return null;
	});

	function handleAvatarError() {
		avatarError = true;
	}

	async function handleSignIn() {
		isLoading = true;
		try {
			await signInWithGoogle(supabase);
		} catch (error) {
			console.error('Sign in failed:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleSignOut() {
		isLoading = true;
		try {
			await signOut(supabase);
		} catch (error) {
			console.error('Sign out failed:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

{#if authenticated}
	<button
		type="button"
		class="auth-button signed-in"
		onclick={handleSignOut}
		disabled={isLoading}
		title={user?.email ?? 'Sign out'}
	>
		{#if avatarUrl() && !avatarError}
			<img
				src={avatarUrl()}
				alt="Avatar"
				class="avatar"
				onerror={handleAvatarError}
			/>
		{:else}
			<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		{/if}
	</button>
{:else}
	<button
		type="button"
		class="auth-button sign-in"
		onclick={handleSignIn}
		disabled={isLoading}
		title="Sign in with Google"
	>
		<svg class="icon google-icon" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="currentColor"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="currentColor"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="currentColor"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	</button>
{/if}

<style>
	.auth-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease-out;
	}

	.auth-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.sign-in {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--theme-border);
		color: var(--theme-text);
		backdrop-filter: blur(4px);
	}

	.sign-in:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.25);
		border-color: var(--theme-primary);
		box-shadow: 0 0 10px var(--theme-glow);
		transform: translateY(-1px);
	}

	.signed-in {
		background: transparent;
		padding: 0;
		overflow: hidden;
	}

	.signed-in:hover:not(:disabled) {
		transform: scale(1.05);
	}

	.icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.google-icon {
		width: 1.125rem;
		height: 1.125rem;
	}

	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.5);
	}
</style>
