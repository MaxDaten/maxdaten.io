import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { loadConfig } from '@sveltejs/load-config';

const loaded = await loadConfig('./', { traverse: false });
if (loaded && 'error' in loaded) throw loaded.error;
const svelteConfig = loaded?.config;

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...svelte.configs['flat/recommended'],
    ...storybook.configs['flat/recommended'],
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2017,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.svelte'],
                svelteConfig,
            },
        },
    },
    {
        ignores: [
            'build/',
            '.svelte-kit/',
            'dist/',
            'studio/dist/',
            'studio/.sanity/',
            'node_modules/',
            '.histoire/',
            'storybook-static/',
            'coverage/',
            'playwright-report/',
            'test-results/',
            '.vercel/',
        ],
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
];
