<!--suppress JSUnusedGlobalSymbols -->
<script module lang="ts">
    // components available for a blog article, can be used in rehype
    export { default as Callout } from '$components/molecules/Callout.svelte';
    export { default as CodeBlock } from '$components/molecules/CodeBlock.svelte';
    // Export MarkdownImage as the img element replacement for markdown images
    export { default as img } from '$components/atoms/MarkdownImage.svelte';
</script>

<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { BlogPost } from '$utils/types';

    interface Props {
        post: BlogPost;
        children: Snippet;
    }

    let { post: _, children }: Props = $props();
</script>

{@render children()}
