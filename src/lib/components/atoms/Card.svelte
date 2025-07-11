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

<svelte:element
    this={tag}
    data-sveltekit-preload-data=""
    class="card {propsClass}"
    {...linkProps}
    {...rest}
>
    {#if image}
        {@render image?.()}
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

<style lang="scss">
    .card {
        background: var(--color--card-background);
        box-shadow: var(--card-shadow);
        color: var(--color--text);
        border-radius: 10px;
        transition: all 0.4s ease;
        position: relative;
        overflow: hidden;
        width: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        text-decoration: none;

        &[href],
        &[onclick] {
            cursor: pointer;

            &:hover {
                box-shadow: var(--card-shadow-hover);
                transform: scale(1.01);
            }
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        padding: 20px 20px;
        flex: 1 0 50%;

        .content {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
    }

    .image {
        position: relative;
        flex: 1 0 max(50%, 330px);
        //min-height: 280px;
        max-height: 200px;
    }
</style>
