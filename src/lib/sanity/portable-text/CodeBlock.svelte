<script lang="ts">
    import type { CustomBlockComponentProps } from '@portabletext/svelte';
    import CodeBlockUI from '$components/molecules/CodeBlock.svelte';
    import { codeToHtml } from 'shiki';
    import { transformerMetaHighlight } from '@shikijs/transformers';

    interface CodeBlockValue {
        code: string;
        language?: string;
        filename?: string;
        showLineNumbers?: boolean;
        highlightedLines?: string;
    }

    interface Props {
        portableText: CustomBlockComponentProps<CodeBlockValue>;
    }

    let { portableText }: Props = $props();
    let value = $derived(portableText.value);

    // Server-side syntax highlighting with Shiki
    let highlightedHtml = $state<string>('');

    $effect(() => {
        const code = value.code || '';
        const lang = value.language || 'text';

        codeToHtml(code, {
            lang,
            theme: 'ayu-dark',
            transformers: [
                transformerMetaHighlight({
                    className: 'highlighted',
                }),
            ],
            meta: value.highlightedLines
                ? { __raw: value.highlightedLines }
                : undefined,
        }).then((html) => {
            highlightedHtml = html;
        });
    });
</script>

<CodeBlockUI
    filename={value.filename ?? null}
    showLineNumbers={value.showLineNumbers ?? false}
    lang={value.language ?? null}
>
    {#if highlightedHtml}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- Shiki output is trusted -->
        {@html highlightedHtml}
    {:else}
        <pre class="shiki"><code>{value.code}</code></pre>
    {/if}
</CodeBlockUI>
