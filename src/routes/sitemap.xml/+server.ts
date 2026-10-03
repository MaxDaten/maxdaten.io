import * as sitemap from 'super-sitemap/sveltekit';
import { client } from '#lib/sanity/client.js';
import { allPostsQuery } from '#lib/sanity/queries.js';
import { canonicalUrl } from '#lib/i18n/index.js';
import { authors } from '#lib/data/authors.js';

export const prerender = true;

/** Paths that exist in both German (/) and English (/en/) versions. */
const translatedPaths = new Set(['/']);

export async function GET({ url }) {
    // Get all blog posts from Sanity with lastmod data for parameterized routes
    const sanityPosts = await client.fetch(allPostsQuery);

    const blogPostParams = sanityPosts.map(
        (post: { slug: string; lastModified?: string; date: string }) => ({
            values: [post.slug],
            lastmod: post.lastModified || post.date,
        })
    );

    const response = await sitemap.response({
        origin: url.origin,
        excludeRoutePatterns: [
            /\/preview/, // Exclude all preview routes
            /\/og-preview/, // Exclude OG preview routes
            /\/og\.jpg\/preview/, // Exclude OG image preview routes
            /\/404/, // Exclude 404 error page
        ],
        paramValues: {
            '/about/[authorId]': Object.keys(authors),
            '/[slug]': blogPostParams, // Provide slugs with lastmod for dynamic blog post routes
        },
        additionalPaths: ['/en'],
        processPaths: (paths) =>
            paths.map((p) => {
                if (translatedPaths.has(p.path) || p.path === '/en') {
                    return {
                        ...p,
                        alternates: [
                            { hreflang: 'de', path: '/' },
                            { hreflang: 'en', path: '/en' },
                        ],
                    };
                }
                return p;
            }),
        sort: 'alpha', // Optional: sort URLs alphabetically
    });

    // super-sitemap prefixes every path with one origin, but German and English pages live
    // on different hosts. Rewrite each URL to its final (non-redirecting) URL.
    const body = (await response.text()).replaceAll(
        new RegExp(`${RegExp.escape(url.origin)}(/[^<"]*)`, 'g'),
        (_, path: string) => canonicalUrl(path)
    );
    return new Response(body, { headers: response.headers });
}
