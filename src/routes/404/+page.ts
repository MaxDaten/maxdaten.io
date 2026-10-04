// A prerendered page that exists only to be shown for missing URLs: never a search result.
export const load = () => ({
    pageMetaTags: Object.freeze({ robots: 'noindex,follow' }),
});
