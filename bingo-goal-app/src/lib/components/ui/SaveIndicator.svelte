<script lang="ts">
	interface Props {
		isSaving: boolean;
	}

	let { isSaving }: Props = $props();
</script>

{#if isSaving}
	<span class="save-indicator text-sm text-gray-500">
		保存中...
	</span>
{/if}

<style>
	.save-indicator {
		display: inline-flex;
		align-items: center;
	}

	.text-sm {
		font-size: 0.875rem;
	}

	.text-gray-500 {
		color: #6b7280;
	}
</style>
