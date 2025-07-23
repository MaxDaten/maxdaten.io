import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { authors } from '$lib/data/authors';

export const prerender = 'auto';

export const load: PageLoad = async ({ url }) => {
    try {
        // Get the author data (Jan-Philip Loos)
        const author = authors.jloos;
        const profileImageSrc = await _loadProfileImage(url);

        return {
            author,
            profileImageSrc,
            title: 'Jan-Philip Loos',
            tagline: 'functional & automated',
            role: 'DevOps, Fullstack, Cloud Engineer',
            bio: 'Software engineer and DevOps consultant from Hamburg, Germany. Helping businesses build robust, scalable infrastructure.',
            specialties: [
                'Kubernetes',
                'Google Cloud Platform',
                'Infrastructure as Code',
                'CI/CD Automation',
            ],
        };
    } catch (err) {
        console.error('Failed to load data for profile OG preview', err);
        error(500, 'Failed to load profile OG preview data');
    }
};

async function _loadProfileImage(url: URL) {
    try {
        const profileImageSrc = (
            await import(`$assets/images/authors/jloos.png?url`)
        ).default;
        return profileImageSrc.startsWith('http')
            ? profileImageSrc
            : new URL(profileImageSrc, url.origin).href;
    } catch (_err) {
        console.warn(
            'Profile image not found for preview, proceeding without image'
        );
        return undefined;
    }
}
