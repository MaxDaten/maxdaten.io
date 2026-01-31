import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
    plugins: [sveltekit(), imagetools()],
    build: {
        rollupOptions: {
            onLog(level, log, defaultHandler) {
                // Suppress misplaced @__PURE__ annotation warnings from dependencies
                if (log.code === 'INVALID_ANNOTATION') return;
                defaultHandler(level, log);
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
                        provider: playwright({
                            contextOptions: {
                                // https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions
                                permissions: [
                                    'clipboard-write',
                                    'clipboard-read',
                                ],
                            },
                        }),
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
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
