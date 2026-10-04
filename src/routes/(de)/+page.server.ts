import { getListingPosts } from '#lib/sanity/listing.js';
import { t } from '#lib/i18n/index.js';

export async function load() {
    return {
        posts: await getListingPosts(4),
        // The home page's title names the offer and stands alone, without the site-name suffix.
        pageMetaTags: { title: t('de', 'meta.title'), titleTemplate: '%s' },
    };
}
