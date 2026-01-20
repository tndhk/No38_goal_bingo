<script lang="ts">
	interface Section {
		heading: string;
		content: string;
	}

	interface FooterLink {
		href: string;
		label: string;
	}

	interface Props {
		title: string;
		lastUpdated: string;
		sections: Section[];
		footerLink: FooterLink;
		backLabel: string;
	}

	let { title, lastUpdated, sections, footerLink, backLabel }: Props = $props();
</script>

<div class="page">
	<div class="content">
		<a href="/" class="back-link">{backLabel}</a>

		<h1 class="title">{title}</h1>
		<p class="last-updated">{lastUpdated}</p>

		<div class="sections">
			{#each sections as section}
				<section class="section">
					<h2 class="section-heading">{section.heading}</h2>
					<p class="section-content">{@html section.content}</p>
				</section>
			{/each}
		</div>

		<div class="footer-links">
			<a href={footerLink.href} class="link">{footerLink.label}</a>
		</div>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: linear-gradient(
			180deg,
			var(--theme-background) 0%,
			var(--theme-pending) 100%
		);
		padding: 2rem 1rem;
	}

	.content {
		max-width: 48rem;
		margin: 0 auto;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--theme-primary);
		text-decoration: none;
		font-size: 0.875rem;
		margin-bottom: 2rem;
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.8;
	}

	.back-link::before {
		content: '\2190';
	}

	.title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--theme-text);
		margin-bottom: 0.5rem;
		font-family: var(--theme-font-heading);
	}

	.last-updated {
		color: var(--theme-text-light);
		font-size: 0.875rem;
		margin-bottom: 2rem;
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section {
		background: var(--theme-card-bg);
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--theme-border);
	}

	.section-heading {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--theme-text);
		margin-bottom: 0.75rem;
		font-family: var(--theme-font-heading);
	}

	.section-content {
		color: var(--theme-text-light);
		line-height: 1.7;
	}

	.section-content :global(a) {
		color: var(--theme-primary);
		text-decoration: underline;
		transition: opacity 0.2s;
	}

	.section-content :global(a:hover) {
		opacity: 0.8;
	}

	.footer-links {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--theme-border);
		text-align: center;
	}

	.link {
		color: var(--theme-primary);
		text-decoration: none;
		font-size: 0.875rem;
		transition: opacity 0.2s;
	}

	.link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}
</style>
