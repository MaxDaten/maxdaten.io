<script lang="ts">
    import type { MarkComponentProps } from '@portabletext/svelte';
    import type { Snippet } from 'svelte';

    interface ExternalLinkValue {
        href: string;
    }

    interface Props {
        portableText: MarkComponentProps<ExternalLinkValue>;
        children: Snippet;
    }

    let { portableText, children }: Props = $props();
    let value = $derived(portableText.value);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- External URL from CMS -->
<a href={value.href} target="_blank" rel="noopener">
    {@render children()}
</a>
<!-- eslint-enable svelte/no-navigation-without-resolve -->
