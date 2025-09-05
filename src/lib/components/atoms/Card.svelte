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
        width: 100%;

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
                    box-shadow: 0 0 2px 0.5px var(--color--primary);
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
                z-index: 1;
                position: relative;
                flex: 0 1 auto;
                height: 350px;
            }
        }
    }
</style>
