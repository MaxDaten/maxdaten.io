<script lang="ts">
    import type { BlockComponentProps } from '@portabletext/svelte';
    import type { Snippet } from 'svelte';
    import { headingSlug } from '#lib/sanity/heading-anchors.js';

    interface Props {
        portableText: BlockComponentProps;
        children: Snippet;
    }

    let { portableText, children }: Props = $props();
    let value = $derived(portableText.value);

    // Extract heading level from style (h1, h2, h3, etc.)
    let level = $derived((value.style as string) || 'h2');

    // Unique per page, assigned by the post load; headings nested in other blocks fall back
    // to their own text.
    let slug = $derived.by(() => {
        const anchor = (value as { _anchor?: unknown })._anchor;
        if (typeof anchor === 'string') return anchor;
        const children = value.children as Array<{ text?: string }> | undefined;
        return headingSlug(
            children?.map((child) => child.text || '').join('') ?? ''
        );
    });

    // Copy anchor URL to clipboard
    async function copyAnchorUrl() {
        const url = `${window.location.origin}${window.location.pathname}#${slug}`;
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // Fallback: do nothing if clipboard fails
        }
    }
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- Anchor link -->
<svelte:element this={level} id={slug} class="heading-with-anchor">
    <a
        href="#{slug}"
        class="heading-link"
        title="Permalink"
        aria-hidden="true"
        tabindex="-1"
        onclick={copyAnchorUrl}
    ></a>
    {@render children()}
</svelte:element>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
    .heading-with-anchor {
        position: relative;

        .heading-link {
            color: var(--color-accent);
            text-decoration: none;
            margin-right: var(--space-inline);
            position: absolute;
            translate: -120% 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            cursor: pointer;

            /* Drawn by CSS so the '#' stays out of the heading's text, which crawlers extract. */
            &::before {
                content: '#';
            }
        }

        &:hover .heading-link {
            opacity: 1;
        }
    }
</style>
