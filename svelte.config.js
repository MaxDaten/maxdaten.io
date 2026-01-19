import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit/types').Config} */
const config = {
    kit: {
        adapter: adapter(),
        prerender: {
            handleHttpError: 'warn',
            origin: process.env.VERCEL_PROJECT_PRODUCTION_URL
                ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
                : undefined,
        },
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
    preprocess: [vitePreprocess({ script: true })],
    extensions: ['.svelte'],
};

export default config;
