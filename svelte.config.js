import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const config = {
	kit: {
		adapter: adapter(),
		prerender: { handleHttpError: 'warn' },
		alias: {
			$components: './src/lib/components',
			$lib: './src/lib',
			$stores: './src/lib/stores',
			$styles: './src/lib/scss',
			$utils: './src/lib/utils',
			$routes: './src/routes',
		}
	},
	vitePlugin: { inspector: true },
	preprocess: [
		vitePreprocess({ script: true }),
		mdsvex({
			extensions: ['.svx', '.md'],
			rehypePlugins: [
				rehypeExternalLinks, // Adds 'target' and 'rel' to external links
				rehypeSlug, // Adds 'id' attributes to Headings (h1,h2,etc)
				[
					rehypeAutolinkHeadings,
					{
						// Adds hyperlinks to the headings, requires rehypeSlug
						behavior: 'prepend',
						properties: { className: ['heading-link'], title: 'Permalink', ariaHidden: 'true' },
						content: {
							type: 'element',
							tagName: 'span',
							properties: {},
							children: [{ type: 'text', value: '#' }]
						}
					}
				]
			]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
