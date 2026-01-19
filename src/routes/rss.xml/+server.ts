import { description, siteBaseUrl, title } from '$lib/data/meta';
import { client } from '$lib/sanity/client';
import { rssPostsQuery } from '$lib/sanity/queries';
import { toHTML } from '@portabletext/to-html';
import type {
    PortableTextBlock,
    PortableTextMarkDefinition,
} from '@portabletext/types';
import { encode } from 'html-entities';

export const prerender = true;

type SanityPostForRss = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: Array<{ name: string }>;
    body: PortableTextBlock[];
    author?: { name: string };
    coverImage?: {
        url?: string;
    };
};

/**
 * Custom Portable Text components for RSS HTML rendering.
 * These must produce clean HTML suitable for RSS readers.
 */
const rssComponents = {
    types: {
        codeBlock: ({
            value,
        }: {
            value: { code: string; language?: string; filename?: string };
        }) => {
            const escaped = encode(value.code || '');
            return `<pre><code>${escaped}</code></pre>`;
        },
        portableImage: ({
            value,
        }: {
            value: { asset?: { url?: string }; alt?: string; caption?: string };
        }) => {
            const url = value.asset?.url;
            if (!url) return '';
            const alt = encode(value.alt || '');
            return `<figure><img src="${url}" alt="${alt}" /></figure>`;
        },
        callout: ({
            value,
        }: {
            value: { type?: string; content?: PortableTextBlock[] };
        }) => {
            // Recursively render callout content
            const innerHtml = value.content
                ? toHTML(value.content, { components: rssComponents })
                : '';
            return `<blockquote>${innerHtml}</blockquote>`;
        },
    },
    marks: {
        internalLink: ({
            children,
            value,
        }: {
            children: string;
            value?: PortableTextMarkDefinition & {
                reference?: { _type: string; slug?: { current: string } };
            };
        }) => {
            const slug = value?.reference?.slug?.current || '';
            return `<a href="${siteBaseUrl}/${slug}">${children}</a>`;
        },
        link: ({
            children,
            value,
        }: {
            children: string;
            value?: PortableTextMarkDefinition & { href?: string };
        }) => {
            const href = encode(value?.href || '');
            return `<a href="${href}">${children}</a>`;
        },
    },
};

export async function GET() {
    const posts: SanityPostForRss[] = await client.fetch(rssPostsQuery);

    const body = await xml(posts);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };
    return new Response(body, { headers });
}

const escapeXml = (unsafe: string) => {
    return encode(unsafe);
};

async function xml(posts: SanityPostForRss[]) {
    const renderedPosts = await Promise.all(
        posts.map(async (post) => await renderPost(post))
    );
    return `
<rss version="2.0"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <atom:link href="${siteBaseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <title>${title}</title>
    <link>${siteBaseUrl}</link>
    <description>${escapeXml(description)}</description>
    <image>
      <url>${siteBaseUrl}/favicons/favicon-32x32.png</url>
      <title>${escapeXml(title)}</title>
      <link>${siteBaseUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${renderedPosts.join('')}
  </channel>
</rss>`;
}

async function renderPost(post: SanityPostForRss) {
    const tags = post.tags ?? [];
    const postDescription = post.excerpt ?? '';
    const coverImageUrl = post.coverImage?.url;
    const authorName = post.author?.name || 'Unknown';

    // Convert Portable Text to HTML for rich RSS content
    const htmlContent = toHTML(post.body, { components: rssComponents });

    return `
        <item>
          <guid>${siteBaseUrl}/${post.slug}</guid>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(postDescription)}</description>
          <link>${siteBaseUrl}/${post.slug}</link>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <dc:creator>${escapeXml(authorName)}</dc:creator>
          ${tags.map((tag) => `<category>${escapeXml(tag.name)}</category>`).join('')}
          <content:encoded><![CDATA[
            <div style="margin: 50px 0; font-style: italic;">
              If anything looks wrong,
              <strong>
                <a href="${siteBaseUrl}/${post.slug}">
                  read on the site!
                </a>
              </strong>
            </div>
            ${htmlContent}
          ]]></content:encoded>
          ${coverImageUrl ? `<media:thumbnail url="${coverImageUrl}"/>` : ''}
          ${
              coverImageUrl
                  ? `<media:content medium="image" url="${coverImageUrl}"/>`
                  : ''
          }
        </item>
      `;
}
