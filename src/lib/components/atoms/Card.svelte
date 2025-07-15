<script lang="ts">
    import { HttpRegex } from '$lib/utils/regex';
    import type { ClassValue, HTMLAnchorAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    interface Props extends HTMLAnchorAttributes {
        class: ClassValue;
        href?: string;
        image?: Snippet;
        content?: Snippet;
        footer?: Snippet;

        [key: string]: unknown;
    }

    let {
        class: propsClass,
        href,
        image,
        content,
        footer,
        ...rest
    }: Props = $props();

    const isExternalLink = $derived(!!href && HttpRegex.test(href));
    let tag = $derived(href ? 'a' : 'article');
    let linkProps = $derived({
        href,
        target: isExternalLink ? '_blank' : undefined,
        rel: isExternalLink ? 'noopener noreferrer' : undefined,
    });
</script>

<div class="card-wrapper">
    <svelte:element
        this={tag}
        data-sveltekit-preload-data=""
        class="card {propsClass}"
        {...linkProps}
        {...rest}
    >
        {#if image}
            <div class="image">
                {@render image?.()}
            </div>
        {/if}
        <div class="body">
            <div class="content">
                {@render content?.()}
            </div>
            {#if footer}
                <div class="footer">
                    {@render footer?.()}
                </div>
            {/if}
        </div>
    </svelte:element>
</div>

<style lang="scss">
    .card-wrapper {
        container-type: inline-size;
        height: 100%;
        width: 100%;
    }

    .card {
        background: var(--color--card-background);
        box-shadow: var(--card-shadow);
        color: var(--color--text);
        border-radius: 10px;
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;

        text-decoration: none;

        &[href],
        &[onclick] {
            cursor: pointer;

            &:hover {
                box-shadow: var(--card-shadow-hover);
                transform: scale(1.01);
            }
        }

        .body {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px 20px;
            flex-grow: 1;

            .content {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
        }

        .image {
            position: relative;
            flex: 0 1 auto;
        }

        @container (min-width: 550px) {
            flex-direction: row;

            .image {
                flex: 1 1 50%;
                aspect-ratio: auto;
            }

            .body {
                flex: 1 1 50%;
            }
        }
    }
</style>
