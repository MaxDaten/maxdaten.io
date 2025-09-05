<script lang="ts">
    import { FxReveal as Img } from '@zerodevx/svelte-img';
    import { getPostImageByPath } from '$utils/image-loader';
    import type { HTMLImgAttributes } from 'svelte/elements';

    interface Props extends HTMLImgAttributes {
        src: string;
        [key: string]: unknown;
    }

    let { src: originalSrc, ...rest }: Props = $props();

    const resolved = getPostImageByPath(originalSrc);
</script>

{#if typeof resolved === 'string'}
    <img src={resolved} {...rest} />
{:else if resolved?.img}
    <Img src={resolved} {...rest} />
{:else}
    <img src={originalSrc} {...rest} />
{/if}
