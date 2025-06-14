<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import RecentPosts from '$lib/components/organisms/RecentPosts.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="container">
	<Hero />
	<About />
	{#if data.posts && data.posts.length > 0}
		<RecentPosts posts={data.posts} />
	{/if}
</div>
