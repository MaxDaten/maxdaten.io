import type { Author } from '$lib/utils/types';

export const authors: Record<string, Author> = {
    jloos: {
        id: 'jloos',
        name: 'Jan-Philip Loos',
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
