<script lang="ts">
    import GitHubIcon from '#lib/icons/socials/github.svelte';
    import LinkedInIcon from '#lib/icons/socials/linkedin.svelte';
    import CvIcon from '#lib/icons/socials/cv.svelte';
    import EmailIcon from '#lib/icons/socials/email.svelte';
    import TwitterIcon from '#lib/icons/socials/twitter.svelte';
    import SignalIcon from '#lib/icons/socials/signal.svelte';

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
</script>

<!-- External links - resolve() must NOT be used on external URLs -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="socials {size}">
    {#if github}
        <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            title="See my GitHub profile"
        >
            <GitHubIcon />
        </a>
    {/if}
    {#if linkedin}
        <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect on LinkedIn"
        >
            <LinkedInIcon />
        </a>
    {/if}
    {#if cv}
        <a
            href={cv}
            target="_blank"
            rel="noopener noreferrer"
            title="View my CV"
        >
            <CvIcon />
        </a>
    {/if}
    {#if email}
        <a
            href={email}
            target="_blank"
            rel="noopener noreferrer"
            title="Send an email"
        >
            <EmailIcon />
        </a>
    {/if}
    {#if twitter}
        <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on X (Twitter)"
        >
            <TwitterIcon />
        </a>
    {/if}
    {#if signal}
        <a
            href={signal}
            target="_blank"
            rel="noopener noreferrer"
            title="Contact me on Signal"
        >
            <SignalIcon />
        </a>
    {/if}
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
