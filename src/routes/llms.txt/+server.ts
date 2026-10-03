import { client } from '#lib/sanity/client.js';
import { getAuthor, SITE_AUTHOR } from '#lib/sanity/author.js';
import { rssPostsQuery } from '#lib/sanity/queries.js';
import { renderLlmsTxt, type LlmsPost } from '#lib/server/llms.js';

export const prerender = true;

export async function GET() {
    const posts: LlmsPost[] = await client.fetch(rssPostsQuery);
    const author = await getAuthor(SITE_AUTHOR);
    if (!author) throw new Error(`Sanity author "${SITE_AUTHOR}" not found`);
    return new Response(renderLlmsTxt(posts, author), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
