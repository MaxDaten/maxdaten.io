import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit/types').Config} */
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
            $assets: './src/lib/assets',
        },
    },
    vitePlugin: { inspector: true },
    preprocess: [vitePreprocess({ script: true }), mdsvex(mdsvexConfig)],
    extensions: ['.svelte', '.svx', '.md'],
};

export default config;
