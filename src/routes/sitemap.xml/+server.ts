import * as sitemap from 'super-sitemap';
import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';

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

    return await sitemap.response({
        origin: url.origin,
        excludeRoutePatterns: [
            '.*\\/preview.*', // Exclude all preview routes
            '.*\\/og-preview.*', // Exclude OG preview routes
            '.*\\/og\\.jpg\\/preview.*', // Exclude OG image preview routes
            '.*\\/about\\/.*', // Exclude about routes
            '.*\\/404.*', // Exclude 404 error page
        ],
        paramValues: {
            '/[slug]': blogPostParams, // Provide slugs with lastmod for dynamic blog post routes
        },
        additionalPaths: ['/en'],
        processPaths: (paths) =>
            paths.map((p) => {
                if (translatedPaths.has(p.path) || p.path === '/en') {
                    return {
                        ...p,
                        alternates: [
                            { lang: 'de', path: '/' },
                            { lang: 'en', path: '/en' },
                        ],
                    };
                }
                return p;
            }),
        sort: 'alpha', // Optional: sort URLs alphabetically
    });
}
