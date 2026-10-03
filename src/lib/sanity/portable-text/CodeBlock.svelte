<script lang="ts">
    import type { CustomBlockComponentProps } from '@portabletext/svelte';
    import CodeBlockUI from '$components/molecules/CodeBlock.svelte';

    interface CodeBlockValue {
        code: string;
        language?: string;
        filename?: string;
        showLineNumbers?: boolean;
        /** Shiki HTML added at build time by `highlightCodeBlocks` (src/lib/server/highlight.ts). */
        highlightedHtml?: string;
    }

    interface Props {
        portableText: CustomBlockComponentProps<CodeBlockValue>;
    }

    let { portableText }: Props = $props();
    let value = $derived(portableText.value);
</script>

<CodeBlockUI
    filename={value.filename ?? null}
    showLineNumbers={value.showLineNumbers ?? false}
    lang={value.language ?? null}
>
    {#if value.highlightedHtml}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- Shiki output generated at build time -->
        {@html value.highlightedHtml}
    {:else}
        <pre class="shiki"><code>{value.code}</code></pre>
    {/if}
</CodeBlockUI>
