<script lang="ts">
	import { currentLocale } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';
	import LegalPage from '$lib/components/legal/LegalPage.svelte';

	const locale = $derived($currentLocale);
	const i18n = $derived(t(locale));
</script>

<svelte:head>
	<title>{i18n.privacy.title} - BinGoal!</title>
</svelte:head>

<LegalPage
	title={i18n.privacy.title}
	lastUpdated={i18n.privacy.lastUpdated}
	sections={i18n.privacy.sections}
	footerLink={{ href: '/terms', label: i18n.footer.terms }}
	backLabel={i18n.common.backToHome}
/>
