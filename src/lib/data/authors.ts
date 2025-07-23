import type { Author } from '$lib/utils/types';

export const authors: Record<string, Author> = {
    jloos: {
        id: 'jloos',
        name: 'Jan-Philip Loos',
        tagline: 'functional & automated',
        role: 'DevOps, Fullstack, Cloud Engineer',
        bio: 'Software engineer and DevOps consultant from Hamburg, Germany. Helping businesses build robust, scalable infrastructure.',
        specialties: [
            'Kubernetes',
            'Google Cloud Platform',
            'Infrastructure as Code',
            'CI/CD Automation',
        ],
        socials: {
            github: 'https://github.com/MaxDaten',
            linkedin: 'https://www.linkedin.com/in/maxdaten',
            email: 'mailto:jloos@maxdaten.com',
        },
    },
};

export const getAuthor = (id: string): Author | undefined => {
    return authors[id];
};
