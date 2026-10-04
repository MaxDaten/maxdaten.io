<script lang="ts">
    import GitHubIcon from '#lib/icons/socials/github.svelte';
    import LinkedInIcon from '#lib/icons/socials/linkedin.svelte';
    import CvIcon from '#lib/icons/socials/cv.svelte';
    import EmailIcon from '#lib/icons/socials/email.svelte';
    import TwitterIcon from '#lib/icons/socials/twitter.svelte';
    import SignalIcon from '#lib/icons/socials/signal.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale } from '#lib/i18n/index.js';

    type Props = {
        github?: string;
        linkedin?: string;
        cv?: string;
        email?: string;
        twitter?: string;
        signal?: string;
        size?: 'small' | 'medium' | 'large';
    };

    let {
        github,
        linkedin,
        cv,
        email,
        twitter,
        signal,
        size = 'medium',
    }: Props = $props();

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    let links = $derived(
        (
            [
                { href: github, key: 'social.github', Icon: GitHubIcon },
                { href: linkedin, key: 'social.linkedin', Icon: LinkedInIcon },
                { href: cv, key: 'social.cv', Icon: CvIcon },
                { href: email, key: 'social.email', Icon: EmailIcon },
                { href: twitter, key: 'social.twitter', Icon: TwitterIcon },
                { href: signal, key: 'social.signal', Icon: SignalIcon },
            ] as const
        ).filter((link): link is typeof link & { href: string } => !!link.href)
    );
</script>

<!-- External links - resolve() must NOT be used on external URLs -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="socials {size}">
    {#each links as { href, key, Icon } (key)}
        <!-- The icon is decorative; the link is named by its aria-label (title is only a tooltip).
             mailto: opens the mail app, so it gets no new tab. -->
        <a
            {href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            aria-label={t(locale, key)}
            title={t(locale, key)}
        >
            <Icon />
        </a>
    {/each}
</div>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
    /* Each link pads its icon to a 44px touch target; the negative margin keeps the row's outer
       edges aligned with the icons themselves. */
    .socials {
        --icon-size: 20px;
        --tap-pad: calc((var(--size-tap-target) - var(--icon-size)) / 2);

        display: inline-flex;
        align-items: stretch;
        justify-content: space-between;
        margin: calc(-1 * var(--tap-pad));

        &.small {
            --icon-size: 18px;
        }

        &.large {
            --icon-size: 24px;
        }

        a {
            box-sizing: content-box;
            width: var(--icon-size);
            min-height: var(--icon-size);
            padding: var(--tap-pad);
            display: flex;
            align-items: center;
            transition: all 0.2s ease-in-out;
            color: var(--color-text);
            fill: var(--color-text);

            &:hover {
                color: var(--color-accent);
                fill: var(--color-accent);
                filter: drop-shadow(0px 0px 3px var(--color-accent));
            }
        }
    }
</style>
