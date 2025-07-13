<script lang="ts">
    interface Props {
        filename: string;
        showLineNumbers: boolean;
        lang: string;
        fullBleed?: boolean | undefined;
        children?: import('svelte').Snippet;
    }

    let { filename, showLineNumbers = true, lang, fullBleed = undefined, children }: Props = $props();
</script>

<div class="code-block" class:full-bleed={fullBleed} class:show-line-numbers={showLineNumbers}>
    <figure>
        {#if filename}
            <figcaption class="filename-container">
                <div class="filename">{filename}</div>
                <div class="lang">{lang}</div>
            </figcaption>
        {/if}
        {@render children?.()}
    </figure>
</div>

<style lang="scss">
    @use '../../scss/variables' as *;

    figure {
        margin: 1.5em 0;
        position: relative;

        figcaption + :global(pre.shiki) {
            border-top-left-radius: 0;
        }
    }

    .code-block figcaption.filename-container {
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

        .filename {
            font-family: var(--font--mono), monospace;
            font-size: 14px;
        }

        .lang {
            display: none;
        }
    }

    :global(pre.shiki) {
        font-family: var(--font--mono),monospace;
        font-size: 14px;
        border-radius: 8px;
        // scrollbar
        overflow-x: auto;
        scrollbar-color: var(--color--primary) var(--color--primary-tint);
        scrollbar-width: thin;
        padding: 1em 1em 20px;

        margin: 0;
        line-height: 1.6;
        border: 0.5px solid rgba(var(--color--primary-rgb), 0.5);

        code {
            width: fit-content;
            min-width: 100%;
            display: block;
        }

        .line {
            display: inline-block;
            padding-left: 0.75em;
            min-height: 1.5em;
        }
    }

</style>