import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const locale = event.url.pathname.startsWith('/en') ? 'en' : 'de';
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('lang="en"', `lang="${locale}"`),
    });
};
