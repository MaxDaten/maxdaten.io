import type { MetaTagsProps } from 'svelte-meta-tags';
import type { ItemList, WithContext } from 'schema-dts';
import { client } from '#lib/sanity/client.js';
import { allGemsQuery } from '#lib/sanity/queries.js';
import { canonicalUrl } from '#lib/i18n/index.js';
import { createBreadcrumbSchema } from '#lib/data/meta.js';

const title = 'Gems of Precious Friends';
const description =
    'Projects and channels by friends of Jan-Philip Loos: tools, tutorials and videos worth your time.';

type Gem = { title: string; url: string; description: string };

export async function load({ setHeaders }) {
    setHeaders({
        // 12 hours
        'cache-control': 'public, max-age=43200',
    });

    const gems = await client.fetch(allGemsQuery);

    // Rotate array by day of week (preserve existing behavior)
    const day = new Date().getDay();
    const rotated = rotateArray(gems, day);

    // Without its own tags, /gems inherited the English home page's title and description.
    const pageMetaTags = Object.freeze({
        title,
        description,
        openGraph: { title, description },
        twitter: { title, description },
    }) satisfies MetaTagsProps;

    return {
        gems: rotated,
        pageMetaTags,
        pageSchema: [
            gemListSchema(gems),
            createBreadcrumbSchema([
                ['Home', canonicalUrl('/en')],
                ['Gems', canonicalUrl('/gems')],
            ]),
        ],
    };
}

/** The gems in a stable (alphabetical) order, unlike the rotated page. */
function gemListSchema(gems: Gem[]): WithContext<ItemList> {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        description,
        url: canonicalUrl('/gems'),
        numberOfItems: gems.length,
        itemListElement: gems.map((gem, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: gem.title,
            description: gem.description,
            url: gem.url,
        })),
    };
}

function rotateArray<T>(arr: T[], count: number) {
    if (arr.length === 0) return arr;
    const clippedCount = count % arr.length;
    return arr
        .slice(clippedCount, arr.length)
        .concat(arr.slice(0, clippedCount));
}
