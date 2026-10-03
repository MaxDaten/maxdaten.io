import type { Author } from '#lib/utils/types.js';

export const authors: Record<string, Author> = {
    jloos: {
        id: 'jloos',
        name: 'Jan-Philip Loos',
        tagline: 'Freelance Platform & Product Engineer',
        bio: 'Jan-Philip Loos is a freelance platform and product engineer in Hamburg. For 15+ years he has built products and the platforms they run on — from co-founding Briends GmbH, the company behind Papego, to scaling systems at 100M+ requests a day. He writes about platform engineering, Nix and continuous delivery.',
        specialties: [
            'Platform Engineering',
            'Continuous Delivery',
            'Nix & devenv',
            'Kubernetes',
            'Product Engineering',
            'Developer Experience',
        ],
        socials: {
            github: 'https://github.com/MaxDaten',
            linkedin: 'https://www.linkedin.com/in/maxdaten',
            cv: 'https://cv.maxdaten.io',
            email: 'mailto:jloos@maxdaten.com',
            signal: 'https://signal.me/#eu/ZhTXMlQRJW4dZM1cEdqRWraCLE-YPKtv_1grKZ6bXQlQqzTGMnhJJp9mrHYeblqp',
        },
    },
};

export const getAuthor = (id: string): Author | undefined => {
    return authors[id];
};
