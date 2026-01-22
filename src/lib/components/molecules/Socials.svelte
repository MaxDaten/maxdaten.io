<script lang="ts">
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
    import CvIcon from '$lib/icons/socials/cv.svelte';
    import EmailIcon from '$lib/icons/socials/email.svelte';
    import TwitterIcon from '$lib/icons/socials/twitter.svelte';

    type Props = {
        github?: string;
        linkedin?: string;
        cv?: string;
        email?: string;
        twitter?: string;
        size?: 'small' | 'medium' | 'large';
    };

    let {
        github,
        linkedin,
        cv,
        email,
        twitter,
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
</div>

<!-- eslint-enable svelte/no-navigation-without-resolve -->

<style>
    .socials {
        display: inline-flex;
        align-items: stretch;
        justify-content: space-between;
        gap: 12px;

        &.small {
            a {
                width: 18px;
            }
        }

        &.medium {
            a {
                width: 20px;
            }
        }

        &.large {
            a {
                width: 24px;
            }
        }

        a {
            transition: all 0.2s ease-in-out;
            color: var(--color--text);
            fill: var(--color--text);

            &:hover {
                color: var(--color--primary);
                fill: var(--color--primary);
                filter: drop-shadow(0px 0px 3px var(--color--primary));
            }
        }

        @media (max-width: 767px) {
            &.small {
                gap: 10px;
            }
            &.medium {
                gap: 12px;
            }
            &.large {
                gap: 16px;
            }
        }
    }
</style>
