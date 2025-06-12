<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import RecentPosts from '$lib/components/organisms/RecentPosts.svelte';
	import type { Feature, BlogPost } from '$lib/utils/types';

	interface Props {
		features: Feature[];
		posts: BlogPost[];
	}

	let { features, posts }: Props = $props();
</script>

<div class="container">
	<Hero />
	<About />
	{#if posts && posts.length > 0}
		<RecentPosts {posts} />
	{/if}
	<!-- <Features {features} /> -->
</div>
