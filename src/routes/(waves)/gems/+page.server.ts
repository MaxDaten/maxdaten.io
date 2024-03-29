import { gems } from '$lib/data/gems';

export async function load() {
	const day = new Date().getDay();
	return {
		gems: rotateArray(gems, day)
	};
}

function rotateArray(arr: [], count: number) {
	const clippedCount = count % arr.length;
	return arr.slice(clippedCount).concat(arr.slice(0, clippedCount));
}
