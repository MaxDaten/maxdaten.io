import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { escapeSvelte } from 'mdsvex';
import { transformerCodeBlock } from './src/lib/shiki/transformerCodeBlock.js';
import {
    transformerMetaHighlight,
    transformerMetaWordHighlight,
} from '@shikijs/transformers';
import relativeImages from 'mdsvex-relative-images';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const theme = 'ayu-dark';
const highlighter = await createHighlighter({
    themes: [theme],
    langs: [
        'bash',
        'css',
        'haskell',
        'hcl',
        'hcl',
        'html',
        'http',
        'js',
        'kotlin',
        'nix',
        'svelte',
        'terraform',
        'text',
        'ts',
        'yaml',
        'docker',
        'scss',
        'python',
        'nginx',
        'java',
    ],
});

/** @type import("mdsvex").MdsvexOptions */
const config = {
    // Wrapper providing blog relevant data fields like metadata (see: `BlogPost`)
    // and components to be used in the blog post.
    layout: join(
        __dirname,
        'src/lib/components/organisms/MdsvexWrapper.svelte'
    ),
    extensions: ['.svx', '.md'],
    highlight: {
        highlighter: async (code, lang = 'text', meta) => {
            const html = escapeSvelte(
                highlighter.codeToHtml(code, {
                    lang,
                    theme: theme,
                    meta: { __raw: meta },
                    transformers: [
                        transformerMetaWordHighlight(),
                        transformerMetaHighlight(),
                        transformerCodeBlock(),
                    ],
                })
            );
            return `<Components.CodeBlock ${meta} lang="${lang}">{@html \`${html}\`}</Components.CodeBlock>`;
        },
    },
    remarkPlugins: [relativeImages],
    rehypePlugins: [
        rehypeUnwrapImages, // Unwrapping images, so we can use MarkdownImage
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
