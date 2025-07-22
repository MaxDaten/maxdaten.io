import { description, siteBaseUrl, title } from '$lib/data/meta';
import type { BlogPost } from '$lib/utils/types';
import {
    filterPosts,
    getPostHtml,
    importPosts,
} from '$lib/data/blog-posts/utils';
import { getCoverBySlug } from '$utils/image-loader';
import { encode } from 'html-entities';

export const prerender = true;

export async function GET() {
    const allPosts = await importPosts();
    const filteredPosts = filterPosts(allPosts);

    const body = await xml(filteredPosts);
    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };
    return new Response(body, { headers });
}

const escapeXml = (unsafe: string) => {
    return encode(unsafe);
};

async function xml(posts: BlogPost[]) {
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

async function renderPost(post: BlogPost) {
    const postHtml = await getPostHtml(post);
    const coverImageSrc = getCoverBySlug(post.slug)?.img.src;
    return `
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
            ${postHtml}
          ]]></content:encoded>
          ${
              post.coverImage
                  ? `<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="${coverImageSrc}"/>`
                  : ''
          }
          ${
              post.coverImage
                  ? `<media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="${coverImageSrc}"/>`
                  : ''
          }          
        </item>
      `;
}
