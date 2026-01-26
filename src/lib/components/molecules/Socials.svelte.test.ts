import { expect, test, describe } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Socials from './Socials.svelte';

describe('Socials Component', () => {
    test('renders GitHub link with correct external URL', async () => {
        const githubUrl = 'https://github.com/MaxDaten';
        const screen = render(Socials, {
            github: githubUrl,
        });

        const link = screen.getByRole('link', { name: /github/i });
        await expect.element(link).toBeInTheDocument();
        await expect.element(link).toHaveAttribute('href', githubUrl);
    });

    test('renders LinkedIn link with correct external URL', async () => {
        const linkedinUrl = 'https://www.linkedin.com/in/maxdaten';
        const screen = render(Socials, {
            linkedin: linkedinUrl,
        });

        const link = screen.getByRole('link', { name: /linkedin/i });
        await expect.element(link).toBeInTheDocument();
        await expect.element(link).toHaveAttribute('href', linkedinUrl);
    });

    test('renders email link with correct mailto URL', async () => {
        const emailUrl = 'mailto:jloos@maxdaten.com';
        const screen = render(Socials, {
            email: emailUrl,
        });

        const link = screen.getByRole('link', { name: /email/i });
        await expect.element(link).toBeInTheDocument();
        await expect.element(link).toHaveAttribute('href', emailUrl);
    });

    test('renders Signal link with correct URL', async () => {
        const signalUrl =
            'https://signal.me/#eu/ZhTXMlQRJW4dZM1cEdqRWraCLE-YPKtv_1grKZ6bXQlQqzTGMnhJJp9mrHYeblqp';
        const screen = render(Socials, {
            signal: signalUrl,
        });

        const link = screen.getByRole('link', { name: /signal/i });
        await expect.element(link).toBeInTheDocument();
        await expect.element(link).toHaveAttribute('href', signalUrl);
    });

    test('external URLs are not mangled by resolve()', async () => {
        const screen = render(Socials, {
            github: 'https://github.com/MaxDaten',
            linkedin: 'https://www.linkedin.com/in/maxdaten',
            email: 'mailto:jloos@maxdaten.com',
        });

        const githubLink = screen.getByRole('link', { name: /github/i });
        const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
        const emailLink = screen.getByRole('link', { name: /email/i });

        // Verify URLs start with correct protocol (not mangled like ./ttps:/)
        await expect
            .element(githubLink)
            .toHaveAttribute('href', 'https://github.com/MaxDaten');
        await expect
            .element(linkedinLink)
            .toHaveAttribute('href', 'https://www.linkedin.com/in/maxdaten');
        await expect
            .element(emailLink)
            .toHaveAttribute('href', 'mailto:jloos@maxdaten.com');
    });

    test('links open in new tab with security attributes', async () => {
        const screen = render(Socials, {
            github: 'https://github.com/MaxDaten',
        });

        const link = screen.getByRole('link', { name: /github/i });
        await expect.element(link).toHaveAttribute('target', '_blank');
        await expect
            .element(link)
            .toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('only renders provided social links', async () => {
        const screen = render(Socials, {
            github: 'https://github.com/MaxDaten',
        });

        const githubLink = screen.getByRole('link', { name: /github/i });
        await expect.element(githubLink).toBeInTheDocument();

        // LinkedIn and email should not be rendered
        const links = screen.container.querySelectorAll('a');
        expect(links.length).toBe(1);
    });
});
