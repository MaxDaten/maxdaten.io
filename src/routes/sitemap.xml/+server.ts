import * as sitemap from 'super-sitemap';
import { allPosts } from '$lib/server/posts';

export const prerender = true;

export async function GET({ url }) {
    // Get all blog posts with lastmod data for parameterized routes
    const blogPostParams = allPosts
        .filter((post) => !post.hidden)
        .map((post) => ({
            values: [post.slug],
            lastmod: post.updated || post.date, // Use updated date if available, otherwise use date
        }));

    return await sitemap.response({
        origin: url.origin,
        excludeRoutePatterns: [
            '.*\\/preview.*', // Exclude all preview routes
            '.*\\/og-preview.*', // Exclude OG preview routes
            '.*\\/og\\.jpg\\/preview.*', // Exclude OG image preview routes
            '.*\\/about\\/.*', // Exclude about routes
        ],
        paramValues: {
            '/[slug]': blogPostParams, // Provide slugs with lastmod for dynamic blog post routes
        },
        sort: 'alpha', // Optional: sort URLs alphabetically
    });
}
