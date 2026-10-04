import { localeDomains } from '#lib/i18n/index.js';

export const prerender = true;

/**
 * Answer engines' search crawlers and the fetchers that act for a user's question. The wildcard
 * group already allows them; naming them keeps them allowed should the wildcard ever narrow.
 * Training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot, …) fall under the wildcard.
 */
const answerEngineAgents = [
    'OAI-SearchBot',
    'ChatGPT-User',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
];

export async function GET(): Promise<Response> {
    const body = [
        'User-agent: *',
        'Allow: /',
        '',
        ...answerEngineAgents.map((agent) => `User-agent: ${agent}`),
        'Allow: /',
        '',
        `Sitemap: ${localeDomains.en}/sitemap.xml`,
    ].join('\n');

    const headers = {
        'Content-Type': 'text/plain',
    };

    return new Response(body, { headers });
}
