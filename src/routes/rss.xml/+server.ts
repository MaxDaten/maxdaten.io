import { description, siteBaseUrl, title } from '$lib/data/meta';
import { client } from '$lib/sanity/client';
import { allPostsQuery } from '$lib/sanity/queries';
import { toPlainText } from '@portabletext/svelte';
import { encode } from 'html-entities';

export const prerender = true;

type SanityPostForRss = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: Array<{ name: string }>;
    body: unknown[];
    coverImage?: {
        url?: string;
    };
};

export async function GET() {
    const posts: SanityPostForRss[] = await client.fetch(allPostsQuery);

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
    const postDescription =
        post.excerpt ?? toPlainText(post.body).slice(0, 200);
    const coverImageUrl = post.coverImage?.url;

    // Convert Portable Text to plain text for RSS content
    // Full rich content is available on the website
    const plainTextContent = toPlainText(post.body);

    return `
        <item>
          <guid>${siteBaseUrl}/${post.slug}</guid>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(postDescription)}</description>
          <link>${siteBaseUrl}/${post.slug}</link>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
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
            <p>${escapeXml(plainTextContent)}</p>
          ]]></content:encoded>
          ${
              coverImageUrl
                  ? `<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${coverImageUrl}"/>`
                  : ''
          }
          ${
              coverImageUrl
                  ? `<media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${coverImageUrl}"/>`
                  : ''
          }
        </item>
      `;
}
