import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type import("mdsvex").MdsvexOptions */
const config = {
    layout: join(
        __dirname,
        'src/lib/components/organisms/BlogArticleWrapper.svelte',
    ),
    extensions: ['.svx', '.md'],
    rehypePlugins: [
        rehypeExternalLinks, // Adds 'target' and 'rel' to external links
        rehypeSlug, // Adds 'id' attributes to Headings (h1,h2,etc)
        [
            rehypeAutolinkHeadings,
            {
                // Adds hyperlinks to the headings, requires rehypeSlug
                behavior: 'prepend',
                properties: {
                    className: ['heading-link'],
                    title: 'Permalink',
                    ariaHidden: 'true',
                },
                content: {
                    type: 'element',
                    tagName: 'span',
                    properties: {},
                    children: [{ type: 'text', value: '#' }],
                },
            },
        ],
    ],
};

export default config;
