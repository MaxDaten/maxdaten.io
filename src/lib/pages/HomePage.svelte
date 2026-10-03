<script lang="ts">
    import Hero from '#lib/components/organisms/Hero.svelte';
    import RecentPosts from '#lib/components/organisms/RecentPosts.svelte';
    import Services from '#lib/components/organisms/Services.svelte';
    import { PageTransition } from 'ssgoi';
    import Bubbles from '#lib/components/organisms/Bubbles.svelte';
    import type { ListingPost } from '#lib/sanity/listing.js';

    interface Props {
        posts: ListingPost[];
    }

    let { posts }: Props = $props();
</script>

<PageTransition>
    <Bubbles />
    <div class="container">
        <Hero />
        <Services />
        {#if posts && posts.length > 0}
            <RecentPosts {posts} />
        {/if}
    </div>
</PageTransition>
