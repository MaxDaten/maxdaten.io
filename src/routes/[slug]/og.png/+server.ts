import OgCard from '$routes/[slug]/og.png/OgCard.svelte';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { render } from 'svelte/server';
import { html as toReactNode } from 'satori-html';
import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { decode } from 'html-entities';
import type { BlogPost } from '$utils/types';
import { importPostBySlug } from '$lib/server/posts';

export const prerender = false;

const baloo2Font = await read(
    (
        await import(
            '@fontsource/baloo-2/files/baloo-2-latin-800-normal.woff?inline'
        )
    ).default
).arrayBuffer();
const merriweatherFont = await read(
    (
        await import(
            '@fontsource/merriweather/files/merriweather-latin-700-normal.woff?inline'
        )
    ).default
).arrayBuffer();
const interFont = await read(
    (await import('@fontsource/inter/files/inter-latin-400-normal.woff?inline'))
        .default
).arrayBuffer();

const size = {
    width: 1200,
    height: 630,
};

const options: SatoriOptions = {
    ...size,
    // debug: true,
    fonts: [
        {
            name: 'Inter',
            data: interFont,
            style: 'normal',
            weight: 400,
        },
        {
            name: 'Merriweather',
            data: merriweatherFont,
            style: 'normal',
            weight: 700,
        },
        {
            name: 'Baloo-2',
            data: baloo2Font,
            style: 'normal',
            weight: 800,
        },
    ],
};

export const GET: RequestHandler = async ({ params, url }) => {
    const { slug } = params;

    try {
        // Get the blog post data
        const post = await importPostBySlug(slug);
        const coverImageSrc = await loadCoverImage(slug, url);

        const element = renderCardToHtml({ post, coverImageSrc });

        // Generate the OG image using the rendered Svelte component
        // @ts-expect-error for VNode to match ReactNode
        const svg = await satori(element, options);

        const pngBuffer = svgToPng(svg);

        return new Response(pngBuffer, {
            headers: {
                'content-type': 'image/png',
                'content-length': Buffer.byteLength(pngBuffer).toString(),
                // cache for 10 minutes, shared cache (proxies, cdn) 7 days
                'cache-control': 'public, max-age=600, s-maxage=604800',
            },
        });
    } catch (err) {
        console.error(`Failed to generate OG image for slug: ${slug}`, err);
        error(500, 'Failed to generate OG image');
    }
};

async function loadCoverImage(slug: string, url: URL) {
    const coverImageSrc = (
        await import(`$assets/images/posts/${slug}/cover.png?url`)
    ).default;
    return coverImageSrc.startsWith('http')
        ? coverImageSrc
        : new URL(coverImageSrc, url.origin).href;
}

function renderCardToHtml(props: { post: BlogPost; coverImageSrc: string }) {
    const result = render(OgCard, { props });

    return toReactNode(
        // unescape special characters: https://github.com/natemoo-re/satori-html/issues/20
        `<head>${result.head}</head>${decode(result.body)}`
    );
}

function svgToPng(svg: string) {
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: size.width },
    });
    return resvg.render().asPng();
}
