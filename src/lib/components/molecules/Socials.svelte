<script lang="ts">
    import { resolve } from '$app/paths';
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
    import EmailIcon from '$lib/icons/socials/email.svelte';

    type Props = {
        github?: string;
        linkedin?: string;
        email?: string;
        size?: 'small' | 'medium' | 'large';
    };

    let { github, linkedin, email, size = 'medium' }: Props = $props();
</script>

<div class="socials {size}">
    {#if github}
        <a
            href={resolve(github)}
            target="_blank"
            rel="noopener noreferrer"
            title="See my GitHub profile"
        >
            <GitHubIcon />
        </a>
    {/if}
    {#if linkedin}
        <a
            href={resolve(linkedin)}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect on LinkedIn"
        >
            <LinkedInIcon />
        </a>
    {/if}
    {#if email}
        <a
            href={resolve(email)}
            target="_blank"
            rel="noopener noreferrer"
            title="Send an email"
        >
            <EmailIcon />
        </a>
    {/if}
</div>

<style lang="scss">
    @use '../../scss/breakpoints.scss';
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

        @include breakpoints.for-phone-only {
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
