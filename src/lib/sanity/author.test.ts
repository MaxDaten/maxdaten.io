import { describe, expect, it } from 'vitest';
import { toAuthor } from './author';

describe('toAuthor()', () => {
    it('maps the Sanity author to the site Author shape', () => {
        expect(
            toAuthor({
                slug: 'jloos',
                name: 'Jan-Philip Loos',
                jobTitle: 'Freelance Platform & Product Engineer',
                tagline: 'I build your product.',
                bio: 'Bio.',
                specialties: ['Nix & devenv'],
                email: 'jloos@maxdaten.com',
                avatarUrl: 'https://cdn.sanity.io/a.png',
                avatarAlt: 'Avatar',
                calendarBookingUrl: 'https://calendar.app.google/x',
                socialLinks: {
                    github: 'https://github.com/MaxDaten',
                    cv: 'https://cv.maxdaten.io',
                },
            })
        ).toEqual({
            id: 'jloos',
            name: 'Jan-Philip Loos',
            jobTitle: 'Freelance Platform & Product Engineer',
            tagline: 'I build your product.',
            bio: 'Bio.',
            specialties: ['Nix & devenv'],
            avatarUrl: 'https://cdn.sanity.io/a.png',
            avatarAlt: 'Avatar',
            calendarBookingUrl: 'https://calendar.app.google/x',
            socials: {
                github: 'https://github.com/MaxDaten',
                cv: 'https://cv.maxdaten.io',
                email: 'mailto:jloos@maxdaten.com',
            },
        });
    });

    it('leaves out email when the author has none', () => {
        expect(
            toAuthor({ slug: 'x', name: 'X' }).socials?.email
        ).toBeUndefined();
    });
});
