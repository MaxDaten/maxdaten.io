import { render } from 'svelte/server';
import { html as toReactNode } from 'satori-html';
import satori, { type SatoriOptions } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { read } from '$app/server';
import { decode } from 'html-entities';
import type { Component } from 'svelte';

// Load fonts once at module level
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

/**
 * Convert SVG to PNG buffer
 */
export function svgToPng(svg: string): Uint8Array {
    const resvg = new Resvg(svg, {
        fitTo: { mode: 'width', value: OG_SIZE.width },
    });
    return resvg.render().asPng();
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
): Promise<Uint8Array> {
    const element = renderCardToHtml(component, props);

    // Generate the OG image using the rendered Svelte component
    // @ts-expect-error for VNode to match ReactNode
    const svg = await satori(element, SATORI_OPTIONS);

    return svgToPng(svg);
}

/**
 * Create standard OG image response
 */
export function createOgImageResponse(pngBuffer: Uint8Array): Response {
    return new Response(pngBuffer, {
        headers: {
            'content-type': 'image/png',
            'content-length': Buffer.byteLength(pngBuffer).toString(),
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
