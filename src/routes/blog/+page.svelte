<script lang="ts">
    import BlogPostCard from '$components/molecules/BlogPostCard.svelte';
    import ContentSection from '$components/organisms/ContentSection.svelte';
    import type { BlogPost } from '$utils/types';
    import { PageTransition } from 'ssgoi';

    interface Props {
        data: {
            posts: BlogPost[];
        };
    }

    let { data }: Props = $props();

    let { posts } = data;
</script>

<PageTransition>
    <div class="container">
        <ContentSection title="All Blog Posts">
            <div class="grid">
                {#each posts as post (post.slug)}
                    <BlogPostCard {post} />
                {/each}
            </div>
        </ContentSection>
    </div>
</PageTransition>

<style lang="scss">
    @use '$styles/mixins';
    @use '$styles/breakpoints';

    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 20px;

        @include breakpoints.for-tablet-portrait-down {
            grid-template-columns: 1fr;
        }

        @include breakpoints.for-tablet-landscape-up {
            // Select every 6 elements, starting from position 1
            // And make it take up 6 columns
            > :global(:nth-child(6n + 1)) {
                grid-column: span 6;
            }
            // Select every 6 elements, starting from position 2
            // And make it take up 3 columns
            > :global(:nth-child(6n + 2)) {
                grid-column: span 3;
            }
            // Select every 6 elements, starting from position 3
            // And make it take up 3 columns
            > :global(:nth-child(6n + 3)) {
                grid-column: span 3;
            }
            // Select every 6 elements, starting from position 4, 5 and 6
            // And make it take up 2 columns
            > :global(:nth-child(6n + 4)),
            :global(:nth-child(6n + 5)),
            :global(:nth-child(6n + 6)) {
                grid-column: span 2;
            }
        }
    }
</style>
