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
