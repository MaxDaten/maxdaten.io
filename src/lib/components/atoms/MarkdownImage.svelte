<script lang="ts">
    import { FxReveal as Img } from '@zerodevx/svelte-img';
    import { getPostImageByPath } from '$utils/image-loader';
    import type { HTMLImgAttributes } from 'svelte/elements';

    interface Props extends HTMLImgAttributes {
        src: string;
        [key: string]: unknown;
    }

    let { src: originalSrc, ...rest }: Props = $props();

    const src = getPostImageByPath(originalSrc);
</script>

<Img {src} {...rest} />
