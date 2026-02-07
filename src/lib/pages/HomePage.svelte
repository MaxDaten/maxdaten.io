<script lang="ts">
    import Hero from '$components/organisms/Hero.svelte';
    import RecentPosts from '$components/organisms/RecentPosts.svelte';
    import { PageTransition } from 'ssgoi';
    import Bubbles from '$components/organisms/Bubbles.svelte';
    import type { ListingPost } from '$routes/blog/+page.server';

    interface Props {
        posts: ListingPost[];
    }

    let { posts }: Props = $props();
</script>

<PageTransition>
    <Bubbles />
    <div class="container">
        <Hero />
        {#if posts && posts.length > 0}
            <RecentPosts {posts} />
        {/if}
    </div>
</PageTransition>
