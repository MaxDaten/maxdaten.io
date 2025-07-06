<script lang="ts">
    import { dev } from '$app/environment';
    import type { HTMLImgAttributes } from 'svelte/elements';

    interface Props extends HTMLImgAttributes {
        src: string;
        fullBleed?: boolean | undefined;
        formats?: string[];
        widths?: string[] | undefined;
        [key: string]: unknown;
    }

    let {
        src,
        fullBleed = undefined,
        formats = ['avif', 'webp', 'png'],
        widths = undefined,
        ...rest
    }: Props = $props();

    let fileName = $derived(src.split('.')[0]);

    function buildSrcset() {
        if (dev) return;

        let srcset = '';

        if (widths) {
            for (let i = 0; i < widths.length; i++) {
                srcset += `${fileName}-${widths[i]}.${formats[0]} ${widths[i]}w`;

                if (i < widths.length - 1) {
                    srcset += ', ';
                }
            }
        } else {
            for (let i = 0; i < formats.length; i++) {
                srcset += `${fileName}.${formats[i]}`;

                if (i < formats.length - 1) {
                    srcset += ', ';
                }
            }
        }

        return srcset;
    }
</script>

<img
    srcset={buildSrcset()}
    {src}
    loading="lazy"
    decoding="async"
    class:full-bleed={fullBleed}
    {...rest}
/>

<style lang="scss">
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
