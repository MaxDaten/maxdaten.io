import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { NodePackageImporter } from 'sass';
import { imagetools } from '@zerodevx/svelte-img/vite';

export default defineConfig({
    plugins: [sveltekit(), imagetools()],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                importers: [new NodePackageImporter()],
            },
        },
    },
    test: {
        projects: [
            // component tests in browser environment
            {
                extends: './vite.config.ts',
                test: {
                    name: 'browser',
                    browser: {
                        enabled: true,
                        headless: true,
                        instances: [
                            {
                                browser: 'chromium',
                                context: {
                                    // https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions
                                    permissions: [
                                        'clipboard-write',
                                        'clipboard-read',
                                    ],
                                },
                            },
                        ],
                        provider: 'playwright',
                    },
                    include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
                    exclude: ['src/lib/server/**'],
                },
            },
            // server and logic tests in node environment
            {
                extends: './vite.config.ts',
                test: {
                    name: 'server',
                    environment: 'node',
                    include: [
                        'src/**/*.{test,spec}.{js,ts}',
                        'tests/**/*.{test,spec}.{js,ts}',
                    ],
                    exclude: [
                        'src/**/*.svelte.{test,spec}.{js,ts}',
                        'tests/e2e/**/*.{test,spec}.{js,ts}',
                    ],
                },
            },
        ],
    },
});
