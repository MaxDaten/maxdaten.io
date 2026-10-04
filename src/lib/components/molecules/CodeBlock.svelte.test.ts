import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CodeBlock from './CodeBlock.svelte';

describe('CodeBlock Component', () => {
    // Mock the clipboard writeText method
    beforeEach(() => {
        vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    });

    test('renders code block with filename', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await expect
            .element(screen.getByTestId('code-filename'))
            .toHaveTextContent('example.js');
        await expect
            .element(screen.getByTestId('code-lang'))
            .toHaveTextContent('javascript');

        // Check that file icon is rendered when filename is provided
        const fileIcon = screen.container.querySelector('.file-icon');
        expect(fileIcon).toBeTruthy();
    });

    test('renders copy button', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await expect
            .element(screen.getByRole('button', { name: /copy/i }))
            .toBeInTheDocument();
    });

    test('copy button shows success state when clicked', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        const copyButton = screen.getByRole('button', { name: /copy/i });

        // Initially has "Copy" title (icon-only button)
        await expect.element(copyButton).toHaveAttribute('title', 'Copy');

        await copyButton.click();

        // After clicking, button should show success state via title
        await expect.element(copyButton).toHaveAttribute('title', 'Copied!');
    });

    test('announces the copy result to screen readers', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await screen.getByRole('button', { name: /copy/i }).click();

        await expect
            .element(screen.getByRole('status'))
            .toHaveTextContent('Copied to clipboard');
    });

    test('keeps the button enabled and focused after copying', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        const copyButton = screen.getByRole('button', { name: /copy/i });
        await copyButton.click();

        await expect.element(copyButton).toHaveAttribute('title', 'Copied!');
        await expect.element(copyButton).toBeEnabled();
        await expect.element(copyButton).toHaveFocus();
    });

    test('names the button after the file', async () => {
        const screen = await render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await expect
            .element(screen.getByRole('button', { name: 'Copy example.js to clipboard' }))
            .toBeInTheDocument();
    });
});
