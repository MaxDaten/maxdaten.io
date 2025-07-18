<script lang="ts">
    import GemCard from '$components/molecules/GemCard.svelte';
    import ContentSection from '$components/organisms/ContentSection.svelte';
    import { PageTransition } from 'ssgoi';
    import type { GemEntry } from '$utils/types';

    interface Props {
        data: {
            gems: GemEntry[];
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
                        coverImage={gem.coverImage}
                        excerpt={gem.description}
                        href={gem.link}
                        tags={gem.tags}
                    />
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
