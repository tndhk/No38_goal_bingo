<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/supabase/types';
	import type { TranslationKeys } from '$lib/i18n/translations';
	import { signInWithGoogle } from '$lib/stores/authStore';

	type Props = {
		supabase: SupabaseClient<Database>;
		onGuestTry: () => void;
		translations: TranslationKeys;
	};

	let { supabase, onGuestTry, translations }: Props = $props();
	let isLoading = $state(false);

	async function handleGoogleLogin() {
		isLoading = true;
		try {
			await signInWithGoogle(supabase);
		} catch (error) {
			console.error('Sign in failed:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="cta-group">
	<button
		type="button"
		class="btn-cta-primary"
		onclick={handleGoogleLogin}
		disabled={isLoading}
	>
		<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
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
		{isLoading ? translations.cta.loading : translations.cta.googleLogin}
	</button>

	<button
		type="button"
		class="btn-cta-secondary"
		onclick={onGuestTry}
	>
		{translations.cta.guestMode}
	</button>
</div>

<style>
	.cta-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (min-width: 480px) {
		.cta-group {
			flex-direction: row;
			justify-content: center;
		}
	}

	.btn-cta-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dim));
		color: var(--theme-text-on-primary);
		border: none;
		border-radius: 1rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 0 4px 20px color-mix(in srgb, var(--theme-primary) 40%, transparent);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.btn-cta-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 30px color-mix(in srgb, var(--theme-primary) 50%, transparent);
	}

	.btn-cta-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.google-icon {
		flex-shrink: 0;
	}

	.btn-cta-secondary {
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(4px);
		border: 1px solid var(--theme-border);
		border-radius: 1rem;
		color: var(--theme-text);
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-cta-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: var(--theme-primary);
	}
</style>
