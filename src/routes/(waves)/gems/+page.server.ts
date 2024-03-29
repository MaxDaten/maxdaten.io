import { gems } from '$lib/data/gems';

export async function load() {
	return {
		gems: gems
	};
}
