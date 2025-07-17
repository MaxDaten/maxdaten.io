<script lang="ts">
    import { FxReveal as Img } from '@zerodevx/svelte-img';
    import { getPostImageByPath } from '$utils/image-loader';

    interface Props {
        src: string;
        alt?: string;
        title?: string;
        class?: string;
        loading?: 'lazy' | 'eager';
    }

    let {
        src: originalSrc,
        alt = '',
        title = undefined,
        class: className = '',
        loading = 'lazy',
    }: Props = $props();

    const src = getPostImageByPath(originalSrc);
</script>

<Img {src} {alt} {title} {loading} class="markdown-image {className}" />

<style>
    .markdown-image {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1rem auto;
        border-radius: var(--radius-3);
    }
</style>
