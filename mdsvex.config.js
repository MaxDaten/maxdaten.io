import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { escapeSvelte } from 'mdsvex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const theme = 'ayu-dark';
const highlighter = await createHighlighter({
    themes: [theme],
    langs: ['html', 'css', 'js', 'ts', 'hcl', 'nix', 'yaml', 'bash', 'text'],
});

/** @type import("mdsvex").MdsvexOptions */
const config = {
    layout: join(
        __dirname,
        'src/lib/components/organisms/MdsvexWrapper.svelte',
    ),
    extensions: ['.svx', '.md'],
    highlight: {
        highlighter: async (code, lang = 'text') => {
            const html = escapeSvelte(
                highlighter.codeToHtml(code, { lang, theme }),
            );
            return `<Components.CodeBlock lang="${lang}">{@html \`${html}\`}</Components.CodeBlock>`;
        },
    },
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
