<script>
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';

	import { description, image, keywords, title, siteBaseUrl } from '$lib/data/meta';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<svelte:head>
	<link rel="“canonical”" href={siteBaseUrl} />
	<meta name="keywords" content={keywords.join(', ')} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />

	<meta property="og:image" content={image} />
	<meta name="twitter:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="stage">
	<Header showBackground={true} />

	<main class="fill-height">
		{@render children?.()}
	</main>

	<Footer />
</div>

<style lang="scss">
	.stage {
		height: 100%;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.fill-height {
		flex-grow: 1;
	}
</style>
