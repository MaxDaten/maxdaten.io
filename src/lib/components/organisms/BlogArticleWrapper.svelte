<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { BlogPost } from '$utils/types';

    interface Props {
        post: BlogPost;
        children: Snippet;
    }

    let { post: _, children }: Props = $props();
</script>

<script module lang="ts">
    import Callout from '$components/molecules/Callout.svelte';
    import CodeBlock from '$components/molecules/CodeBlock.svelte';
    import Image from '$components/atoms/Image.svelte';
    // eslint-disable-next-line no-import-assign
    export { Callout, CodeBlock, Image }
</script>

{@render children()}
