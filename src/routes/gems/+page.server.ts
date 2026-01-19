import { client } from '$lib/sanity/client';
import { allGemsQuery } from '$lib/sanity/queries';

export async function load({ setHeaders }) {
    setHeaders({
        // 12 hours
        'cache-control': 'public, max-age=43200',
    });

    const gems = await client.fetch(allGemsQuery);

    // Rotate array by day of week (preserve existing behavior)
    const day = new Date().getDay();
    const rotated = rotateArray(gems, day);

    return { gems: rotated };
}

function rotateArray<T>(arr: T[], count: number) {
    if (arr.length === 0) return arr;
    const clippedCount = count % arr.length;
    return arr
        .slice(clippedCount, arr.length)
        .concat(arr.slice(0, clippedCount));
}
