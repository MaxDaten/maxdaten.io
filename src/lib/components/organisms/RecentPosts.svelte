<script lang="ts">
	import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
	import ContentSection from '$lib/components/organisms/ContentSection.svelte';
	import type { BlogPost } from '$lib/utils/types';
	import Button from '$lib/components/atoms/Button.svelte';

	interface Props {
		posts: BlogPost[];
	}

	let { posts }: Props = $props();
</script>

<ContentSection
	id="recent-posts"
	title="Blog posts"
	description="Most recent blog posts"
	align="left"
>
	{#snippet button()}
		<div >
			<Button href="/blog">View More</Button>
		</div>
	{/snippet}
	<div class="grid">
		{#each posts as post}
			<BlogPostCard {post} showImage={false}
			/>
		{/each}
	</div>
</ContentSection>

<style lang="scss">
	@use '$lib/scss/breakpoints.scss';

	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 20px;

		@media for-phone-only {
			grid-template-columns: 1fr;
		}
	}
</style>
