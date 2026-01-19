<script lang="ts">
    import type { BlockComponentProps } from '@portabletext/svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        portableText: BlockComponentProps;
        children: Snippet;
    }

    let { portableText, children }: Props = $props();
    let value = $derived(portableText.value);

    // Extract heading level from style (h1, h2, h3, etc.)
    let level = $derived((value.style as string) || 'h2');

    // Generate slug from text content for anchor
    function generateSlug(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Extract text from children for slug generation
    let headingText = $derived.by(() => {
        // Get text from portable text children
        const children = value.children as Array<{ text?: string }> | undefined;
        if (!children) return '';
        return children.map((child) => child.text || '').join('');
    });

    let slug = $derived(generateSlug(headingText));

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
        onclick={copyAnchorUrl}>#</a
    >
    {@render children()}
</svelte:element>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style lang="scss">
    .heading-with-anchor {
        position: relative;

        .heading-link {
            color: var(--color--primary);
            text-decoration: none;
            margin-right: 10px;
            position: absolute;
            translate: -120% 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            cursor: pointer;
        }

        &:hover .heading-link {
            opacity: 1;
        }
    }
</style>
