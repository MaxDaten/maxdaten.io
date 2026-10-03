import { client } from '#lib/sanity/client.js';
import { rssPostsQuery } from '#lib/sanity/queries.js';
import { renderLlmsTxt, type LlmsPost } from '#lib/server/llms.js';

export const prerender = true;

export async function GET() {
    const posts: LlmsPost[] = await client.fetch(rssPostsQuery);
    return new Response(renderLlmsTxt(posts), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
