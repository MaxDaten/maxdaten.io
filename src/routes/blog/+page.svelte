<script lang="ts">
    import BlogPostCard from '#lib/components/molecules/BlogPostCard.svelte';
    import ContentSection from '#lib/components/organisms/ContentSection.svelte';
    import type { ListingPost } from './+page.server';
    import { PageTransition } from 'ssgoi';

    interface Props {
        data: {
            posts: ListingPost[];
        };
    }

    let { data }: Props = $props();

    const posts = $derived(data.posts);

    // Mirrors the .grid layout below: one column up to 900px, then a repeating
    // 6-card pattern spanning 6, 3, 3, 2, 2 and 2 of 6 columns (max ~1016px wide).
    const SPAN_WIDTHS = [1016, 500, 500, 330, 330, 330];
    const coverSizes = (index: number) =>
        `(max-width: 900px) calc(100vw - 2rem), ${SPAN_WIDTHS[index % 6]}px`;
</script>

<PageTransition>
    <div class="container">
        <ContentSection title="All Blog Posts">
            <div class="grid">
                {#each posts as post, index (post.slug)}
                    <BlogPostCard {post} sizes={coverSizes(index)} />
                {/each}
            </div>
        </ContentSection>
    </div>
</PageTransition>

<style>
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 20px;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }

        @media (min-width: 901px) {
            /* Select every 6 elements, starting from position 1 */
            /* And make it take up 6 columns */
            > :global(:nth-child(6n + 1)) {
                grid-column: span 6;
            }
            /* Select every 6 elements, starting from position 2 */
            /* And make it take up 3 columns */
            > :global(:nth-child(6n + 2)) {
                grid-column: span 3;
            }
            /* Select every 6 elements, starting from position 3 */
            /* And make it take up 3 columns */
            > :global(:nth-child(6n + 3)) {
                grid-column: span 3;
            }
            /* Select every 6 elements, starting from position 4, 5 and 6 */
            /* And make it take up 2 columns */
            > :global(:nth-child(6n + 4)),
            :global(:nth-child(6n + 5)),
            :global(:nth-child(6n + 6)) {
                grid-column: span 2;
            }
        }
    }
</style>
