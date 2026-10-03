import sharp from 'sharp';

// The profile OG card shows the portrait at 370x360 inside a fixed 1200x630 image.
const SIZE = 400;

let cached: Promise<string> | undefined;

/**
 * The profile portrait as a small JPEG data URI for satori, fetched once through
 * SvelteKit's `fetch` (same-origin requests are served internally). satori >= 0.35
 * refuses to fetch image URLs on local addresses (SSRF protection), and embedding also
 * saves it a network round-trip in production.
 */
export function profileAvatarDataUri(
    fetch: typeof globalThis.fetch,
    portraitUrl: string
): Promise<string> {
    cached ??= (async () => {
        const response = await fetch(portraitUrl);
        if (!response.ok)
            throw new Error(`portrait ${portraitUrl}: HTTP ${response.status}`);
        const resized = await sharp(Buffer.from(await response.arrayBuffer()))
            .resize(SIZE, SIZE, { fit: 'cover' })
            .jpeg({ quality: 85 })
            .toBuffer();
        return `data:image/jpeg;base64,${resized.toString('base64')}`;
    })();
    cached.catch(() => (cached = undefined)); // retry on the next request after a failure
    return cached;
}
