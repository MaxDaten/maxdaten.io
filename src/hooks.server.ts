import type { Handle } from '@sveltejs/kit/hooks';
import { getLocaleFromPath } from '#lib/i18n/index.js';

export const handle: Handle = async ({ event, resolve }) => {
    const locale = getLocaleFromPath(event.url.pathname);
    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('lang="en"', `lang="${locale}"`),
    });
};
