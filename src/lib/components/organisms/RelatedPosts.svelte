<script lang="ts">
    import type { BlogPost } from '$lib/utils/types';
    import BlogPostCard from '$lib/components/molecules/BlogPostCard.svelte';
    import ContentSection from '$lib/components/organisms/ContentSection.svelte';

    interface Props {
        posts: BlogPost[];
    }

    let { posts }: Props = $props();
</script>

<ContentSection id="related-posts" title="Related Posts">
    <div class="simple-grid">
        {#each posts as post (post.slug)}
            <BlogPostCard {post} showImage={false} />
        {/each}
    </div>
</ContentSection>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .simple-grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 20px;

        @media (max-width: 1070px) {
            grid-template-columns: 1fr 1fr;
        }

        @include breakpoints.for-tablet-portrait-down {
            grid-template-columns: 1fr;
        }
    }
</style>
