import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { authors } from '$lib/data/authors';
import { loadProfileImageUrl } from '../profile-image';

export const prerender = 'auto';

export const load: PageLoad = async ({ url }) => {
    try {
        const author = authors.jloos;
        const avatarUrl = await loadProfileImageUrl(url);

        return {
            author,
            avatarUrl,
        };
    } catch (err) {
        console.error('Failed to load data for profile OG preview', err);
        error(500, 'Failed to load profile OG preview data');
    }
};
