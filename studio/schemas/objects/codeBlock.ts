import { defineType, defineField } from 'sanity';
import { CodeIcon } from 'lucide-react';

/**
 * Code block object for Portable Text.
 * Captures language, filename, and line number metadata for syntax highlighting.
 * Language list matches current Shiki setup in mdsvex.config.js.
 */
export const codeBlockType = defineType({
    name: 'codeBlock',
    title: 'Code Block',
    type: 'object',
    icon: CodeIcon,
    fields: [
        defineField({
            name: 'code',
            title: 'Code',
            type: 'text',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: [
                    { title: 'Bash', value: 'bash' },
                    { title: 'CSS', value: 'css' },
                    { title: 'Docker', value: 'docker' },
                    { title: 'Haskell', value: 'haskell' },
                    { title: 'HCL/Terraform', value: 'hcl' },
                    { title: 'HTML', value: 'html' },
                    { title: 'HTTP', value: 'http' },
                    { title: 'Java', value: 'java' },
                    { title: 'JavaScript', value: 'js' },
                    { title: 'Kotlin', value: 'kotlin' },
                    { title: 'Nginx', value: 'nginx' },
                    { title: 'Nix', value: 'nix' },
                    { title: 'Python', value: 'python' },
                    { title: 'SCSS', value: 'scss' },
                    { title: 'Svelte', value: 'svelte' },
                    { title: 'Terraform', value: 'terraform' },
                    { title: 'Text', value: 'text' },
                    { title: 'TypeScript', value: 'ts' },
                    { title: 'YAML', value: 'yaml' },
                ],
            },
            initialValue: 'text',
        }),
        defineField({
            name: 'filename',
            title: 'Filename',
            type: 'string',
            description: 'Optional filename to display above code block',
        }),
        defineField({
            name: 'showLineNumbers',
            title: 'Show Line Numbers',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'highlightedLines',
            title: 'Highlighted Lines',
            type: 'string',
            description:
                'Comma-separated line numbers to highlight, e.g., "1,3-5,10"',
        }),
    ],
    preview: {
        select: {
            code: 'code',
            language: 'language',
            filename: 'filename',
        },
        prepare({ code, language, filename }) {
            return {
                title: filename || `${language || 'Code'} block`,
                subtitle: code?.slice(0, 50) + (code?.length > 50 ? '...' : ''),
            };
        },
    },
});
