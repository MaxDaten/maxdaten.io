import { client } from '#lib/sanity/client.js';
import { authorBySlugQuery, authorSlugsQuery } from '#lib/sanity/queries.js';
import type { Author } from '#lib/utils/types.js';

export { SITE_AUTHOR } from './site-author.js';

type SanityAuthor = {
    slug: string;
    name: string;
    jobTitle?: string;
    tagline?: string;
    bio?: string;
    specialties?: string[];
    email?: string;
    avatarUrl?: string;
    avatarAlt?: string;
    calendarBookingUrl?: string;
    socialLinks?: Omit<NonNullable<Author['socials']>, 'email'>;
};

export function toAuthor(author: SanityAuthor): Author {
    const { slug, email, socialLinks, ...rest } = author;
    return {
        id: slug,
        ...rest,
        socials: {
            ...socialLinks,
            ...(email && { email: `mailto:${email}` }),
        },
    };
}

export async function getAuthor(slug: string): Promise<Author | undefined> {
    const author: SanityAuthor | null = await client.fetch(authorBySlugQuery, {
        slug,
    });
    return author ? toAuthor(author) : undefined;
}

export async function getAuthorSlugs(): Promise<string[]> {
    return client.fetch(authorSlugsQuery);
}
