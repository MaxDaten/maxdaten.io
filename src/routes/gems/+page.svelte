<script lang="ts">
    import GemCard from '$components/molecules/GemCard.svelte';
    import ContentSection from '$components/organisms/ContentSection.svelte';
    import { PageTransition } from 'ssgoi';

    interface SanityGem {
        _id: string;
        title: string;
        slug: string;
        url: string;
        description: string;
        tags?: Array<{ name: string; slug: string }>;
        coverImage?: {
            url?: string;
            alt?: string;
            lqip?: string;
        };
    }

    interface Props {
        data: {
            gems: SanityGem[];
        };
    }

    let { data }: Props = $props();

    let { gems } = data;
</script>

<PageTransition>
    <div class="container">
        <ContentSection title="Gems of Precious Friends">
            <div class="grid">
                {#each gems as gem, index (index)}
                    <GemCard
                        title={gem.title}
                        coverImage={gem.coverImage || ''}
                        excerpt={gem.description}
                        href={gem.url}
                        tags={gem.tags?.map((t) => t.name)}
                    />
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
