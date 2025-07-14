<script lang="ts">
	import { getFileIcon } from '$lib/utils/fileIcons.js';

	interface Props {
		lang: string | null;
		size?: number;
		class?: string;
	}

	let { lang, size = 16, class: className = '' }: Props = $props();

	const iconSvg = $derived(getFileIcon(lang));
</script>

{#if iconSvg}
	<span class="file-icon {className}" style="width: {size}px; height: {size}px;">
		{@html iconSvg}
	</span>
{/if}

<style>
	.file-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.file-icon :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>