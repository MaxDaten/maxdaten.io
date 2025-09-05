import { redirect } from '@sveltejs/kit';

export const load = () => {
    // Keep Impressum DRY: serve the content via the blog post template
    // (src/content/blog/00-impressum.md) so it shares the same styles and layout
    // as all blog posts. This route only redirects to that canonical slug.
    throw redirect(308, '/00-impressum');
};
