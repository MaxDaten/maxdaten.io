<script lang="ts">
    import type { MarkComponentProps } from '@portabletext/svelte';
    import type { Snippet } from 'svelte';
    import {
        internalLinkPath,
        type InternalLinkReference,
    } from '#lib/sanity/internal-link.js';

    interface InternalLinkValue {
        reference?: InternalLinkReference;
    }

    interface Props {
        portableText: MarkComponentProps<InternalLinkValue>;
        children: Snippet;
    }

    let { portableText, children }: Props = $props();
    let value = $derived(portableText.value);

    let href = $derived(internalLinkPath(value.reference));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- Portable text internal link -->
{#if href}
    <a {href}>
        {@render children()}
    </a>
{:else}
    <span>
        {@render children()}
    </span>
{/if}
<!-- eslint-enable svelte/no-navigation-without-resolve -->
