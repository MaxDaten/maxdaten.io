<script lang="ts">
	import { run } from 'svelte/legacy';

	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import dateformat from 'dateformat';

	import { keywords, siteBaseUrl, title } from '$lib/data/meta';
	import type { BlogPost } from '$lib/utils/types';
	import RelatedPosts from '$lib/components/organisms/RelatedPosts.svelte';
	import Image from '$lib/components/atoms/Image.svelte';

	interface Props {
		data: { post: BlogPost };
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let { post } = $derived(data);

	let metaKeywords = $state(keywords);

	run(() => {
		if (post?.tags?.length) {
			metaKeywords = post.tags.concat(metaKeywords);
		}
		if (post?.keywords?.length) {
			metaKeywords = post.keywords.concat(metaKeywords);
		}
	});
</script>

<svelte:head>
	{#if post}
		<meta name="keywords" content={metaKeywords.join(', ')} />

		<meta name="description" content={post.excerpt} />
		<meta property="og:description" content={post.excerpt} />
		<meta name="twitter:description" content={post.excerpt} />
		<link rel="canonical" href="{siteBaseUrl}/{post.slug}" />

		<title>{post.title} - {title}</title>
		<meta property="og:title" content="{post.title} - {title}" />
		<meta name="twitter:title" content="{post.title} - {title}" />

		{#if post.coverImage}
			<meta property="og:image" content="{siteBaseUrl}/{post.coverImage}" />
			<meta name="twitter:image" content="{siteBaseUrl}/{post.coverImage}" />
			<meta name="twitter:card" content="summary_large_image" />
		{/if}
	{/if}
</svelte:head>

<div class="article-layout">
	<Header showBackground />

	<main>
		<article id="article-content">
			<div class="header">
				{#if post}
					<h1>{post.title}</h1>
					<div class="note">
						Published on {dateformat(post.date, 'UTC:dd mmmm yyyy')}
					</div>
					{#if post.updated}
						<div class="note">
							Updated on {dateformat(post.updated, 'UTC:dd mmmm yyyy')}
						</div>
					{/if}
					{#if post.readingTimeMinutes}
						<div class="note">{post.readingTimeMinutes} minutes to read</div>
					{/if}
					{#if post.tags?.length}
						<div class="tags">
							{#each post.tags as tag}
								<Tag>{tag}</Tag>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
			{#if post && post.coverImage}
				<div class="cover-image">
					<Image src={post.coverImage} alt={post.title} />
				</div>
			{/if}
			<div class="content">
				{@render children?.()}
			</div>
		</article>

		{#if post.relatedPosts && post.relatedPosts.length > 0}
			<div class="container">
				<RelatedPosts posts={post.relatedPosts} />
			</div>
		{/if}
	</main>

	<Footer />
</div>

<style lang="scss">
	@use '$lib/scss/_mixins.scss';
	@use '$lib/scss/_breakpoints.scss';

	.article-layout {
		--body-background-color: var(--color--post-page-background);
		background-color: var(--color--post-page-background);
	}

	#article-content {
		--main-column-width: 65ch;
		position: relative;
		padding-top: 40px;
		padding-bottom: 80px;
		padding-right: 15px;
		padding-left: 15px;
		display: flex;
		flex-direction: column;
		gap: 30px;

		@include breakpoints.for-iphone-se {
			padding-left: 0;
			padding-right: 0;
		}

		@include breakpoints.for-tablet-portrait-up {
			padding-right: 20px;
			padding-left: 20px;
		}

		@include breakpoints.for-tablet-landscape-up {
			padding-right: 30px;
			padding-left: 30px;
		}

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 10px;
			width: min(var(--main-column-width), 100%);
			margin: 0 auto;

			.note {
				font-size: 90%;
				color: rgba(var(--color--secondary-rgb), 0.8);
			}
		}

		.cover-image {
			width: min(var(--main-column-width), 100%);
			margin: 0 auto;
			max-height: 400px;
			box-shadow: var(--image-shadow);
			border-radius: 6px;

			img {
				width: 100%;
				height: 100%;
				max-height: 400px;
				object-fit: cover;
			}
		}

		:global(.cover-image img) {
			max-height: 400px;
			object-fit: cover;
		}

		.content {
			display: grid;
			grid-template-columns:
				1fr
				min(var(--main-column-width), 100%)
				1fr;

			:global(> *) {
				grid-column: 2;
			}

			:global(> .full-bleed) {
				grid-column: 1 / 4;
				width: 100%;
				max-width: 1600px;
				margin-left: auto;
				margin-right: auto;
			}
		}

		.tags {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 5px;
			flex-wrap: wrap;
		}
	}
</style>
