<script>
	import '$lib/scss/global.scss';
	import Analytics from '$components/atoms/Analytics.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<Analytics />
{@render children?.()}
