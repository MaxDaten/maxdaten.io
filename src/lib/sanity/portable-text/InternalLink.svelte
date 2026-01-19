<script lang="ts">
    import type { MarkComponentProps } from '@portabletext/svelte';
    import type { Snippet } from 'svelte';

    interface InternalLinkValue {
        reference?: {
            _type: 'post' | 'gem';
            slug: { current: string };
        };
    }

    interface Props {
        portableText: MarkComponentProps<InternalLinkValue>;
        children: Snippet;
    }

    let { portableText, children }: Props = $props();
    let value = $derived(portableText.value);

    // Resolve reference to URL at render time
    let href = $derived.by(() => {
        if (!value.reference) return '#';
        const { _type, slug } = value.reference;
        return _type === 'post' ? `/${slug.current}` : `/gems#${slug.current}`;
    });
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- Portable text internal link -->
{#if value.reference}
    <a {href}>
        {@render children()}
    </a>
{:else}
    <span>
        {@render children()}
    </span>
{/if}
<!-- eslint-enable svelte/no-navigation-without-resolve -->
