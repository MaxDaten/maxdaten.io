<script lang="ts">
    import FileIcon from '#lib/components/atoms/FileIcon.svelte';
    import CopyIcon from '#lib/icons/copy.svelte';
    import CheckIcon from '#lib/icons/check.svelte';
    import XIcon from '#lib/icons/x.svelte';

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
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    const announcements = {
        idle: '',
        success: 'Copied to clipboard',
        failure: 'Copy failed',
    } as const;

    let codeText = $derived.by(() => {
        const preElement = codeBlockElement?.querySelector('pre');
        return preElement?.textContent || '';
    });

    // Repeat clicks are ignored rather than disabling the button: a disabled button drops
    // keyboard focus while the result shows.
    async function copyToClipboard() {
        if (copyButtonState !== 'idle') return;
        try {
            await navigator.clipboard.writeText(codeText);
            copyButtonState = 'success';
        } catch (error) {
            console.error('Failed to copy code:', error);
            copyButtonState = 'failure';
        } finally {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                copyButtonState = 'idle';
            }, 2000);
        }
    }

    $effect(() => () => clearTimeout(resetTimer));
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
        <span class="visually-hidden" role="status"
            >{announcements[copyButtonState]}</span
        >
        <button
            class="copy-button {copyButtonState}"
            onclick={copyToClipboard}
            aria-label="Copy {filename ?? 'code'} to clipboard"
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

<style>
    .code-block {
        figure {
            margin: var(--space-block) 0;
            position: relative;
            border-radius: var(--radius-block);
            overflow: hidden;
            border: 0.5px solid
                rgba(var(--color-text-rgb), var(--opacity-tint));

            figcaption + :global(pre.shiki) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-top: none;
                margin-top: 0;
            }

            :global(pre.shiki .line) {
                display: inline-block;
                position: relative;
                padding-left: var(--space-tight);
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
                color: var(--color-code-line-number);
                user-select: none;
                -webkit-user-select: none;
            }
        }

        figure .copy-button {
            position: absolute;
            bottom: var(--space-tight);
            right: var(--space-tight);
            z-index: 2;
            opacity: var(--opacity-half);
            transition: opacity 150ms ease-out;
            background: rgba(var(--color-text-rgb), var(--opacity-tint));
            border: none;
            padding: var(--space-tight);
            border-radius: var(--radius-block);
            cursor: pointer;
            color: rgba(var(--color-text-rgb), var(--opacity-text-muted));
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover,
            &:focus-visible {
                opacity: 0.9;
                background: rgba(
                    var(--color-text-rgb),
                    var(--opacity-tint)
                );
            }

            &.success,
            &.failure {
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
            background-color: var(--color-code-surface);
            border-bottom: 0.5px solid rgba(var(--color-text-rgb), 0.06);
            border-radius: var(--radius-block) var(--radius-block) 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-tight) var(--space-stack);
            margin: 0;

            .filename-content {
                display: flex;
                align-items: center;
                gap: var(--space-inline);
            }

            .filename {
                font-family: var(--font--mono), monospace;
                font-size: var(--text-small);
            }

            :global(.file-icon) {
                flex-shrink: 0;
            }

            .lang {
                font-family: var(--font--mono), monospace;
                font-size: var(--text-caption);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--color-text-muted);
            }
        }
    }
</style>
