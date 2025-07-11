import { gems } from '$lib/data/gems';

export async function load({ setHeaders }) {
    const day = new Date().getDay();

    setHeaders({
        // 12 hours
        'cache-control': 'public, max-age=43200',
    });
    return {
        gems: rotateArray(gems, day),
    };
}

function rotateArray<T>(arr: T[], count: number) {
    const clippedCount = count % arr.length;
    return arr
        .slice(clippedCount, arr.length)
        .concat(arr.slice(0, clippedCount));
}
