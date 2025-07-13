<script lang="ts">
    import Button from '$components/atoms/Button.svelte';
    import CopyIcon from '$lib/icons/copy.svelte';
    import CheckIcon from '$lib/icons/check.svelte';
    import XIcon from '$lib/icons/x.svelte';

    interface Props {
        filename: string | null;
        showLineNumbers: boolean;
        lang: string | null;
        fullBleed?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        filename = null,
        showLineNumbers = true,
        lang = null,
        fullBleed = false,
        children,
    }: Props = $props();

    let codeBlockElement: HTMLElement;
    let copyButtonState: 'idle' | 'success' | 'failure' = $state('idle');

    let codeText = $derived.by(() => {
        const preElement = codeBlockElement?.querySelector('pre');
        return preElement?.textContent || '';
    });

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(codeText);
            copyButtonState = 'success';
        } catch (error) {
            console.error('Failed to copy code:', error);
            copyButtonState = 'failure';
        } finally {
            setTimeout(() => {
                copyButtonState = 'idle';
            }, 2000);
        }
    }
</script>

<div
    class="code-block"
    class:full-bleed={fullBleed}
    class:show-line-numbers={showLineNumbers}
    bind:this={codeBlockElement}
>
    <figure>
        {#if filename}
            <figcaption class="filename-container">
                <div data-testid="code-filename" class="filename">
                    {filename}
                </div>
                <div data-testid="code-lang" class="lang">{lang}</div>
            </figcaption>
        {/if}
        {@render children?.()}
        <Button
            class="copy-button {copyButtonState}"
            size="small"
            color="secondary"
            disabled={copyButtonState !== 'idle'}
            onclick={copyToClipboard}
        >
            {#snippet icon()}
                {#if copyButtonState === 'idle'}
                    <CopyIcon width="20px" height="20px" />
                {:else if copyButtonState === 'success'}
                    <CheckIcon />
                {:else if copyButtonState === 'failure'}
                    <XIcon width="20px" height="20px" />
                {/if}
            {/snippet}
            {#if copyButtonState === 'idle'}
                Copy to clipboard
            {:else if copyButtonState === 'success'}
                Copied!
            {:else if copyButtonState === 'failure'}
                Error
            {/if}
        </Button>
    </figure>
</div>
