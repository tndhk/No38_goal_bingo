<script lang="ts">
	import { currentLocale } from '$lib/stores/localeStore';
	import { t } from '$lib/i18n/translations';
	import LegalPage from '$lib/components/legal/LegalPage.svelte';

	const locale = $derived($currentLocale);
	const i18n = $derived(t(locale));
</script>

<svelte:head>
	<title>{i18n.terms.title} - BinGoal!</title>
</svelte:head>

<LegalPage
	title={i18n.terms.title}
	lastUpdated={i18n.terms.lastUpdated}
	sections={i18n.terms.sections}
	footerLink={{ href: '/privacy', label: i18n.footer.privacy }}
	backLabel={i18n.common.backToHome}
/>
