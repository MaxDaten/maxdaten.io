<script lang="ts">
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
        {#if filename || lang}
            <figcaption class="filename-container">
                <div class="filename-content">
                    {#if filename}
                        <FileIcon {lang} size={16} class="file-icon" />
                        <div data-testid="code-filename" class="filename">
                            {filename}
                        </div>
                    {/if}
                </div>
                <div data-testid="code-lang" class="lang">{lang}</div>
            </figcaption>
        {/if}
        {@render children?.()}
        <button
            class="copy-button {copyButtonState}"
            disabled={copyButtonState !== 'idle'}
            onclick={copyToClipboard}
            aria-label="Copy code to clipboard"
            title={copyButtonState === 'idle'
                ? 'Copy'
                : copyButtonState === 'success'
                  ? 'Copied!'
                  : 'Error'}
        >
            {#if copyButtonState === 'idle'}
                <CopyIcon width="16px" height="16px" />
            {:else if copyButtonState === 'success'}
                <CheckIcon width="16px" height="16px" />
            {:else if copyButtonState === 'failure'}
                <XIcon width="16px" height="16px" />
            {/if}
        </button>
    </figure>
</div>

<style lang="scss">
    .code-block {
        figure {
            margin: 1.5em 0;
            position: relative;
            border-radius: 12px;
            overflow: hidden;

            box-shadow: var(--code-box-shaow);

            figcaption + :global(pre.shiki) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }

            .copy-button {
                position: absolute;
                bottom: 12px;
                right: 12px;
                z-index: 2;
                opacity: 0.4;
                transition: opacity 0.2s ease-in-out;
                background: transparent;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                }

                &:disabled {
                    cursor: default;
                }

                &.success {
                    color: #4ade80;
                    opacity: 1;
                }

                &.failure {
                    color: #f87171;
                    opacity: 1;
                }

                @media (hover: none) {
                    opacity: 0.7;
                }
            }
        }

        figcaption.filename-container {
            width: 100%;
            background-color: #1a1a1a;
            border: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75em 1em;
            position: relative;
            z-index: 1;

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
                font-family: var(--font--mono), monospace;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>
