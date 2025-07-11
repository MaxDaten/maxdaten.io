<script lang="ts">
    import Hero from '$components/organisms/Hero.svelte';
    import About from '$components/organisms/About.svelte';
    import RecentPosts from '$components/organisms/RecentPosts.svelte';
    import { PageTransition } from 'ssgoi';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<PageTransition>
    <div class="container">
        <Hero />
        <About />
        {#if data?.posts && data?.posts.length > 0}
            <RecentPosts posts={data.posts} />
        {/if}
    </div>
</PageTransition>
