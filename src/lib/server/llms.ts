/**
 * llms.txt (https://llmstxt.org) and llms-full.txt: plain-Markdown entry points for answer
 * engines. Built only from text the site already publishes, so they never say more than the
 * pages do.
 */
import {
    portableTextToMarkdown,
    type PortableTextRenderers,
} from '@portabletext/markdown';
import type { ArbitraryTypedObject } from '@portabletext/types';
import { authors } from '#lib/data/authors.js';
import { canonicalUrl, localeDomains, t } from '#lib/i18n/index.js';

export type LlmsPost = {
    title: string;
    slug: string;
    excerpt?: string;
    date: string;
    body: ArbitraryTypedObject[];
};

const author = authors.jloos;
const fullTextUrl = `${localeDomains.en}/llms-full.txt`;

const renderers: Partial<PortableTextRenderers> = {
    types: {
        codeBlock: ({ value }) =>
            `\`\`\`${value.language ?? ''}\n${value.code ?? ''}\n\`\`\``,
        callout: ({ value }) =>
            toMarkdown(value.content ?? [])
                .split('\n')
                .map((line) => (line ? `> ${line}` : '>'))
                .join('\n'),
        portableImage: ({ value }) =>
            value.alt ? `[Image: ${value.alt}]` : '',
        youtubeEmbed: ({ value }) => (value.url ? `[Video: ${value.url}]` : ''),
    },
    marks: {
        internalLink: ({ children, value }) => {
            const slug = value?.reference?.slug?.current;
            return slug
                ? `[${children}](${canonicalUrl(`/${slug}`)})`
                : children;
        },
    },
};

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

function toMarkdown(body: LlmsPost['body']): string {
    return portableTextToMarkdown(body, renderers);
}

function header(): string {
    return [
        `# ${author.name}`,
        '',
        `> ${author.tagline} from Hamburg, Germany. ${t('en', 'meta.description')}`,
        '',
        author.bio,
        '',
        `Expertise: ${author.specialties?.join(', ')}.`,
    ].join('\n');
}

/** Public profile links: not mailto: or the Signal contact link. */
function profiles(): string[] {
    return Object.entries(author.socials ?? {})
        .filter(
            ([, url]) =>
                url.startsWith('https://') && !url.includes('signal.me')
        )
        .map(([name, url]) => `- [${name}](${url})`);
}

export function renderLlmsTxt(posts: LlmsPost[]): string {
    return [
        header(),
        '',
        '## Blog posts',
        '',
        ...posts.map(
            (post) =>
                `- [${post.title}](${canonicalUrl(`/${post.slug}`)})${post.excerpt ? `: ${oneLine(post.excerpt)}` : ''}`
        ),
        '',
        '## Profiles',
        '',
        ...profiles(),
        '',
        '## Optional',
        '',
        `- [Full text of all posts](${fullTextUrl}): every post body as Markdown`,
        '',
    ].join('\n');
}

export function renderLlmsFullTxt(posts: LlmsPost[]): string {
    const sections = posts.map((post) =>
        [
            `# ${post.title}`,
            '',
            `URL: ${canonicalUrl(`/${post.slug}`)}`,
            `Published: ${post.date.slice(0, 10)}`,
            `Author: ${author.name}`,
            '',
            toMarkdown(post.body),
        ].join('\n')
    );
    return [header(), ...sections].join('\n\n---\n\n') + '\n';
}
