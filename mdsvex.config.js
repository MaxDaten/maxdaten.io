import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type import("mdsvex").MdsvexOptions */
const config = {
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
