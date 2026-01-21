import type { Author } from '$lib/utils/types';

export const authors: Record<string, Author> = {
    jloos: {
        id: 'jloos',
        name: 'Jan-Philip Loos',
        tagline: 'functional & automated',
        role: 'DevOps • Fullstack • Cloud Engineer',
        bio: 'Software engineer and DevOps consultant from Hamburg, Germany. Helping businesses build robust, scalable products and their infrastructure.',
        specialties: [
            'Kubernetes',
            'DevOps Transformation',
            'CI/CD Automation',
        ],
        socials: {
            github: 'https://github.com/MaxDaten',
            linkedin: 'https://www.linkedin.com/in/maxdaten',
            cv: 'https://cv.maxdaten.io',
            email: 'mailto:jloos@maxdaten.com',
        },
    },
};

export const getAuthor = (id: string): Author | undefined => {
    return authors[id];
};
