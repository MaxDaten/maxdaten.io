<script lang="ts">
    import { HttpRegex } from '$lib/utils/regex';
    import type { Snippet } from 'svelte';
    import type { ClassValue } from 'svelte/elements';

    interface Props {
        color?: 'primary' | 'secondary';
        style?: 'solid' | 'understated' | 'clear' | 'ghost';
        size?: 'small' | 'medium' | 'large';
        href?: string | undefined;
        class?: ClassValue;
        target?: '_self' | '_blank';
        rel?: string;
        icon?: Snippet;
        children?: Snippet;
        onclick?: (event: Event) => void;

        [key: string]: unknown;
    }

    let {
        color = 'primary',
        style = 'solid',
        size = 'medium',
        href = undefined,
        icon = undefined,
        children = undefined,
        class: propsClass = '',
        onclick = undefined,
        ...rest
    }: Props = $props();

    const isExternalLink = $derived(!!href && HttpRegex.test(href));
    let tag = $derived(href ? 'a' : 'button');
    let linkProps = $derived({
        href,
        target: isExternalLink ? '_blank' : undefined,
    });
</script>

<svelte:element
    this={tag}
    {...linkProps}
    class={[
        'button',
        `style--${style}`,
        `size--${size}`,
        `color--${color}`,
        propsClass,
    ].join(' ')}
    data-sveltekit-preload-data=""
    {onclick}
    {...rest}
>
    {#if icon}
        <div class="icon">
            {@render icon?.()}
        </div>
    {/if}
    {@render children?.()}
</svelte:element>

<style>
    .button {
        --main-color: var(--color-accent-rgb);
        --light-color: var(--color-accent-rgb);
        --contrast-color: var(--color-text);

        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--raw-space-4);

        border: none;
        border-radius: var(--raw-radius-xl);
        font-weight: 700;

        .icon {
            width: 24px;
            height: 24px;
            position: relative;
            top: -1px;
        }

        &:disabled {
            cursor: not-allowed;

            &:hover {
                box-shadow: none !important;
            }
        }

        &.color--primary {
            --main-color: var(--color-accent-rgb);
            --light-color: var(--color-accent-rgb);
            --contrast-color: var(--color-surface);
        }

        &.color--secondary {
            --main-color: var(--color-text-rgb);
            --light-color: var(--color-text-rgb);
            --contrast-color: var(--color-surface);
        }

        &.style--solid {
            background-color: rgb(var(--main-color));
            color: var(--contrast-color);

            &:hover {
                box-shadow: 0 0 1px 7px
                    rgba(var(--main-color), var(--raw-opacity-muted));
            }
        }

        &.style--understated {
            background-color: rgba(var(--main-color), var(--raw-opacity-light));
            color: rgb(var(--main-color));

            &:hover {
                box-shadow: 0 0 1px 7px
                    rgba(var(--main-color), var(--raw-opacity-muted));
            }
        }

        &.style--clear {
            background-color: transparent;
            color: rgb(var(--main-color));

            &:hover {
                background-color: rgba(
                    var(--main-color),
                    var(--raw-opacity-light)
                );
            }
        }

        &.style--ghost {
            background-color: transparent;
            color: rgb(var(--main-color));
            border: 1px solid rgba(var(--main-color), var(--raw-opacity-muted));

            &:hover {
                border-color: rgba(
                    var(--main-color),
                    var(--raw-opacity-medium)
                );
                background-color: rgba(
                    var(--main-color),
                    var(--raw-opacity-subtle)
                );
            }
        }

        &.size--small {
            padding: var(--raw-space-4) var(--raw-space-12);
            font-size: var(--raw-text-xs);

            .icon {
                width: 20px;
                height: 20px;
            }
        }

        &.size--medium {
            padding: var(--raw-space-12) var(--space-button-x);
            font-size: var(--raw-text-base);
        }

        &.size--large {
            padding: var(--raw-space-16) var(--raw-space-32);
            font-size: var(--raw-text-lg);

            .icon {
                width: 28px;
                height: 28px;
            }
        }
    }
</style>
