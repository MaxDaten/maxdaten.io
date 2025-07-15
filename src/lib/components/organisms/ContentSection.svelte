<script lang="ts">
    interface Props {
        id?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        align?: 'left' | 'top' | 'right';
        children?: import('svelte').Snippet;
    }

    let {
        id = undefined,
        title = undefined,
        description = undefined,
        align = 'top',
        children,
    }: Props = $props();
</script>

<section {id} class="content-section {align}">
    <div class="title-area">
        {#if title || description}
            <div class="text">
                {#if title}
                    <h2>
                        {title}
                    </h2>
                {/if}
                {#if description}
                    <p>
                        {description}
                    </p>
                {/if}
            </div>
        {/if}
    </div>
    <div class="content-area">
        {@render children?.()}
    </div>
</section>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    .content-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        padding: 50px 0;

        .title-area {
            flex: 2;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 15px;

            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
            }
        }
        .content-area {
            width: 100%;
            flex: 5;

            display: grid;
            place-items: center;
        }

        @include breakpoints.for-tablet-landscape-up {
            &.left {
                .title-area {
                    order: 1;
                }
                .content-area {
                    order: 2;
                }
            }
            &.right {
                .title-area {
                    order: 2;
                }
                .content-area {
                    order: 1;
                }
            }
            &.top {
                flex-direction: column;
                .title-area {
                    order: 1;
                    max-width: 600px;
                }
                .content-area {
                    order: 2;
                    width: 100%;
                }
            }
        }
        @include breakpoints.for-tablet-portrait-down {
            flex-direction: column;
        }
    }
</style>
