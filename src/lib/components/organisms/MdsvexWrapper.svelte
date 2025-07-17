<!--suppress JSUnusedGlobalSymbols -->
<script module lang="ts">
    // components available for a blog article, can be used in rehype
    export { default as Callout } from '$components/molecules/Callout.svelte';
    export { default as CodeBlock } from '$components/molecules/CodeBlock.svelte';
    export { FxReveal as Img } from '@zerodevx/svelte-img';
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
