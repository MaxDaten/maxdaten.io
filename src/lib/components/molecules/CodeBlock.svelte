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
                <CopyIcon width="18px" height="18px" />
            {:else if copyButtonState === 'success'}
                <CheckIcon width="18px" height="18px" />
            {:else if copyButtonState === 'failure'}
                <XIcon width="18px" height="18px" />
            {/if}
        </button>
    </figure>
</div>

<style lang="scss">
    .code-block {
        figure {
            margin: var(--raw-space-24) 0;
            position: relative;
            border-radius: var(--raw-radius-sm);
            overflow: hidden;
            border: 0.5px solid
                rgba(var(--color-text-rgb), var(--raw-opacity-subtle));

            figcaption + :global(pre.shiki) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-top: none;
                margin-top: 0;
            }

            :global(pre.shiki .line) {
                display: inline-block;
                position: relative;
                padding-left: var(--raw-space-12);
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
                color: rgba(var(--color-text-rgb), var(--raw-opacity-muted));
                user-select: none;
                -webkit-user-select: none;
            }
        }

        figure .copy-button {
            position: absolute;
            bottom: var(--raw-space-12);
            right: var(--raw-space-12);
            z-index: 2;
            opacity: var(--raw-opacity-medium);
            transition: opacity 150ms ease-out;
            background: rgba(var(--color-text-rgb), var(--raw-opacity-subtle));
            border: none;
            padding: var(--raw-space-12);
            border-radius: var(--raw-radius-sm);
            cursor: pointer;
            color: rgba(var(--color-text-rgb), var(--raw-opacity-strong));
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                opacity: 0.9;
                background: rgba(
                    var(--color-text-rgb),
                    var(--raw-opacity-subtle)
                );
            }

            &:disabled {
                cursor: default;
            }

            &.success {
                color: var(--color-success);
                opacity: 0.9;
            }

            &.failure {
                color: var(--color-error);
                opacity: 0.9;
            }

            @media (hover: none) {
                opacity: 0.6;
            }
        }

        figcaption.filename-container {
            width: 100%;
            background-color: var(--raw-color-gray-850);
            border-bottom: 0.5px solid rgba(var(--color-text-rgb), 0.06);
            border-radius: var(--raw-radius-sm) var(--raw-radius-sm) 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--raw-space-12) var(--raw-space-16);
            margin: 0;

            .filename-content {
                display: flex;
                align-items: center;
                gap: var(--raw-space-8);
            }

            .filename {
                font-family: var(--font--mono), monospace;
                font-size: var(--raw-text-sm);
            }

            :global(.file-icon) {
                flex-shrink: 0;
            }

            .lang {
                font-family: var(--font--mono), monospace;
                font-size: var(--raw-text-xs);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: rgba(var(--color-text-rgb), 0.4);
            }
        }
    }
</style>
