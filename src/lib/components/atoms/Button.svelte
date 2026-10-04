<script lang="ts">
    import { isExternalHref } from '#lib/i18n/index.js';
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

    const isExternalLink = $derived(!!href && isExternalHref(href));
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
        --contrast-color: var(--color-text);

        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        text-decoration: none;
        transition-property: color, background-color, border-color, box-shadow;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-hairline);

        border: none;
        border-radius: var(--radius-button);
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
            --contrast-color: var(--color-surface);
        }

        &.color--secondary {
            --main-color: var(--color-text-rgb);
            --contrast-color: var(--color-surface);
        }

        &.style--solid {
            background-color: rgb(var(--main-color));
            color: var(--contrast-color);

            &:hover {
                box-shadow: 0 0 1px 7px
                    rgba(var(--main-color), var(--opacity-border));
            }
        }

        &.style--understated {
            background-color: rgba(var(--main-color), var(--opacity-wash));
            color: rgb(var(--main-color));

            &:hover {
                box-shadow: 0 0 1px 7px
                    rgba(var(--main-color), var(--opacity-border));
            }
        }

        &.style--clear {
            background-color: transparent;
            color: rgb(var(--main-color));

            &:hover {
                background-color: rgba(var(--main-color), var(--opacity-wash));
            }
        }

        &.style--ghost {
            background-color: transparent;
            color: rgb(var(--main-color));
            border: 1px solid rgba(var(--main-color), var(--opacity-border));

            &:hover {
                border-color: rgba(var(--main-color), var(--opacity-half));
                background-color: rgba(var(--main-color), var(--opacity-tint));
            }
        }

        &.size--small {
            padding: var(--space-hairline) var(--space-tight);
            font-size: var(--text-caption);

            .icon {
                width: 20px;
                height: 20px;
            }
        }

        &.size--medium {
            padding: var(--space-tight) var(--space-button-x);
            font-size: var(--text-ui);
        }

        &.size--large {
            padding: var(--space-stack) var(--space-group);
            font-size: var(--text-large);

            .icon {
                width: 28px;
                height: 28px;
            }
        }
    }
</style>
