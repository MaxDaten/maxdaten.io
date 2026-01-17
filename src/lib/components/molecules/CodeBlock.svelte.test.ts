import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CodeBlock from './CodeBlock.svelte';

describe('CodeBlock Component', () => {
    // Mock the clipboard writeText method
    beforeEach(() => {
        vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    });

    test('renders code block with filename', async () => {
        const screen = render(CodeBlock, {
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
        const screen = render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        await expect
            .element(screen.getByRole('button', { name: /copy/i }))
            .toBeInTheDocument();
    });

    test('copy button shows success state when clicked', async () => {
        const screen = render(CodeBlock, {
            filename: 'example.js',
            lang: 'javascript',
            showLineNumbers: true,
        });

        const copyButton = screen.getByRole('button', { name: /copy/i });

        // Initially shows "Copy"
        await expect.element(copyButton).toHaveTextContent('Copy');

        await copyButton.click();

        // After clicking, button should show success state briefly
        await expect.element(screen.getByText(/copied/i)).toBeInTheDocument();
    });
});
