<script lang="ts">
    import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
    import ContentSection from '$lib/components/organisms/ContentSection.svelte';
    import type { ListingPost } from '$routes/blog/+page.server';
    import Button from '$lib/components/atoms/Button.svelte';

    interface Props {
        posts: ListingPost[];
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
        <div>
            <Button href="/blog">View More</Button>
        </div>
    {/snippet}
    <div class="grid">
        {#each posts as post (post.slug)}
            <BlogPostCard {post} showImage={false} />
        {/each}
    </div>
</ContentSection>

<style>
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;

        @media (max-width: 767px) {
            grid-template-columns: 1fr;
        }
    }
</style>
