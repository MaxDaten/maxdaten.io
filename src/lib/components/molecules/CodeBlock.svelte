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
            margin: 24px 0;
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            border: 0.5px solid rgba(255, 255, 255, 0.08);

            figcaption + :global(pre.shiki) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-top: none;
                margin-top: 0;
            }

            :global(pre.shiki .line) {
                display: inline-block;
                position: relative;
                padding-left: 12px;
                min-height: 1.1em;
            }
        }

        &.show-line-numbers {
            :global(pre.shiki) {
                padding-left: 4em;
                counter-reset: line;
            }

            :global(pre.shiki .line) {
                counter-increment: line;
            }

            :global(pre.shiki .line::before) {
                content: counter(line);
                position: absolute;
                left: -3em;
                width: 2.5em;
                text-align: right;
                color: rgba(255, 255, 255, 0.3);
                user-select: none;
                -webkit-user-select: none;
            }
        }

        figure .copy-button {
            position: absolute;
            bottom: 12px;
            right: 12px;
            z-index: 2;
            opacity: 0.5;
            transition: opacity 150ms ease-out;
            background: transparent;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                opacity: 0.9;
                background: rgba(255, 255, 255, 0.08);
            }

            &:disabled {
                cursor: default;
            }

            &.success {
                color: #4ade80;
                opacity: 0.9;
            }

            &.failure {
                color: #f87171;
                opacity: 0.9;
            }

            @media (hover: none) {
                opacity: 0.6;
            }
        }

        figcaption.filename-container {
            width: 100%;
            background-color: #1a1a1a;
            border-bottom: 0.5px solid rgba(255, 255, 255, 0.06);
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            margin: 0;

            .filename-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .filename {
                font-family: var(--font--mono), monospace;
                font-size: 13px;
            }

            :global(.file-icon) {
                flex-shrink: 0;
            }

            .lang {
                font-family: var(--font--mono), monospace;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }
</style>
