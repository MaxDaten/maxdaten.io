import type { Author } from '$lib/utils/types';

export const authors: Record<string, Author> = {
    jloos: {
        id: 'jloos',
        name: 'Jan-Philip Loos',
    },
};

export const getAuthor = (id: string): Author | undefined => {
    return authors[id];
};
