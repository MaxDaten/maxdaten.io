import { render } from 'svelte/server';
import { html as toReactNode } from 'satori-html';
import satori, { type SatoriOptions } from 'satori';
import { read } from '$app/server';
import { decode } from 'html-entities';
import type { Component } from 'svelte';
import sharp from 'sharp';

// Load fonts once at module level
const baloo2Font = await read(
    (
        await import(
            '@fontsource/baloo-2/files/baloo-2-latin-800-normal.woff?inline'
        )
    ).default
).arrayBuffer();

const interBoldFont = await read(
    (await import('@fontsource/inter/files/inter-latin-700-normal.woff?inline'))
        .default
).arrayBuffer();

const interFont = await read(
    (await import('@fontsource/inter/files/inter-latin-400-normal.woff?inline'))
        .default
).arrayBuffer();

// Standard OG image size
export const OG_SIZE = {
    width: 1200,
    height: 630,
};

// Satori options with loaded fonts
export const SATORI_OPTIONS: SatoriOptions = {
    ...OG_SIZE,
    // debug: true,
    fonts: [
        {
            name: 'Inter',
            data: interFont,
            style: 'normal',
            weight: 400,
        },
        {
            name: 'Inter',
            data: interBoldFont,
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

/**
 * Convert SVG to JPEG buffer
 */
export async function svgToJpg(
    svg: string,
    quality: number = 90
): Promise<Uint8Array> {
    const jpegBuffer = await sharp(Buffer.from(svg))
        .resize(OG_SIZE.width, OG_SIZE.height)
        .jpeg({ quality })
        .toBuffer();

    return new Uint8Array(jpegBuffer);
}

/**
 * Render Svelte component to HTML for Satori
 */
export function renderCardToHtml<T extends Record<string, unknown>>(
    component: Component<T>,
    props: T
): unknown {
    const result = render(component, { props });

    return toReactNode(
        // unescape special characters: https://github.com/natemoo-re/satori-html/issues/20
        `<head>${result.head}</head>${decode(result.body)}`
    );
}

/**
 * Generate OG image from Svelte component
 */
export async function generateOgImage<T extends Record<string, unknown>>(
    component: Component<T>,
    props: T
): Promise<Response> {
    const element = renderCardToHtml(component, props);

    // Generate the OG image using the rendered Svelte component
    // @ts-expect-error for VNode to match ReactNode
    const svg = await satori(element, SATORI_OPTIONS);

    const imageBuffer = await svgToJpg(svg);
    return createOgImageResponse(imageBuffer);
}

/**
 * Create standard OG image response
 */
function createOgImageResponse(jpegBuffer: Uint8Array): Response {
    return new Response(Buffer.from(jpegBuffer), {
        headers: {
            'content-type': 'image/jpeg',
            // cache for 10 minutes, shared cache (proxies, cdn) 7 days
            'cache-control': 'public, max-age=600, s-maxage=604800',
        },
    });
}

/**
 * Process image URL to ensure it's absolute
 */
export function processImageUrl(imageSrc: string, baseUrl: URL): string {
    return imageSrc.startsWith('http')
        ? imageSrc
        : new URL(imageSrc, baseUrl.origin).href;
}
