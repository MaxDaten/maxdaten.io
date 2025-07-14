<script lang="ts">
    import Button from '$components/atoms/Button.svelte';
    import FileIcon from '$components/atoms/FileIcon.svelte';
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
                <div class="filename-content">
                    <FileIcon {lang} size={16} class="file-icon" />
                    <div data-testid="code-filename" class="filename">
                        {filename}
                    </div>
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

<style lang="scss">
    .code-block {
        figure {
            margin: 1.5em 0;
            position: relative;

            figcaption + :global(pre.shiki) {
                border-top-left-radius: 0;
            }

            &:hover :global(.copy-button) {
                opacity: 0.4;
            }

            :global(.copy-button) {
                position: absolute;
                top: 8px;
                right: 8px;
                z-index: 2;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
                width: 20ch;

                &:hover {
                    opacity: 0.7 !important;
                }
            }

            &:has(figcaption.filename-container) :global(.copy-button) {
                top: 42px;
            }
        }

        figcaption.filename-container {
            background: var(--color--primary-tint);
            border: 0.5px solid rgba(var(--color--primary-rgb), 0.5);
            border-bottom: 0;
            border-radius: 8px 8px 0 0;
            display: inline-block;
            padding: 0.5em 1em;
            position: relative;
            top: 0.5px; /* To sit on top of the pre border */
            z-index: 1;
            margin-bottom: -0.5px;

            .filename-content {
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            .filename {
                font-family: var(--font--mono), monospace;
                font-size: 14px;
            }

            :global(.file-icon) {
                flex-shrink: 0;
            }

            .lang {
                display: none;
            }
        }
    }
</style>
