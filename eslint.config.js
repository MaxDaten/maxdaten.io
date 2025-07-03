import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

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
            'node_modules/',
            '.histoire/',
            'storybook-static/',
            'coverage/',
            'playwright-report/',
            'test-results/',
            '.vercel/',
            '**/*.js',
        ],
    },
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
        },
    },
];
