import { description, siteBaseUrl, title } from '$lib/data/meta';
import type { BlogPost } from '$lib/utils/types';
import {
    filterPosts,
    getPostHtml,
    importPosts,
} from '$lib/data/blog-posts/utils';
import { getCoverBySlug } from '$utils/image-loader';

export const prerender = true;

export async function GET() {
    const allPosts = importPosts();
    const filteredPosts = filterPosts(allPosts);

    const body = xml(filteredPosts);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };
    return new Response(body, { headers });
}

const escapeXml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const xml = (posts: BlogPost[]) => `
<rss version="2.0"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <atom:link href="${siteBaseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <title>${escapeXml(title)}</title>
    <link>${siteBaseUrl}</link>
    <description>${escapeXml(description)}</description>
    <image>
      <url>${siteBaseUrl}/favicons/favicon-32x32.png</url>
      <title>${escapeXml(title)}</title>
      <link>${siteBaseUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${posts
        .map(
            (post) => `
        <item>
          <guid>${siteBaseUrl}/${post.slug}</guid>
          <title>${escapeXml(post.title)}</title>
          <description>${escapeXml(post.excerpt)}</description>
          <link>${siteBaseUrl}/${post.slug}</link>
					<pubDate>${new Date(post.date).toUTCString()}</pubDate>
          ${post.tags ? post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('') : ''}
          <content:encoded><![CDATA[
            <div style="margin: 50px 0; font-style: italic;">
              If anything looks wrong, 
              <strong>
                <a href="${siteBaseUrl}/${post.slug}">
                  read on the site!
                </a>
              </strong>
            </div>

            ${getPostHtml(post)}
          ]]></content:encoded>
          ${
              post.coverImage
                  ? `<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${siteBaseUrl}${getCoverBySlug(post.slug)}"/>`
                  : ''
          }
          ${
              post.coverImage
                  ? `<media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${siteBaseUrl}${getCoverBySlug(post.slug)}"/>`
                  : ''
          }          
        </item>
      `
        )
        .join('')}
  </channel>
</rss>`;
