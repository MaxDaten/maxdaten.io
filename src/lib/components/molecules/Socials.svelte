<script>
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
    import EmailIcon from '$lib/icons/socials/email.svelte';
</script>

<div class="socials">
    <!-- 
	<a href="#" target="_blank" rel="noopener noreferrer" title="Say Hi on Telegram">
		<TelegramIcon />
	</a>
	<a href="#" target="_blank" rel="me noreferrer" title="Say Hi on Mastodon">
		<MastodonIcon />
	</a>
	-->
    <a
        href="https://github.com/MaxDaten"
        target="_blank"
        rel="noopener noreferrer"
        title="See my GitHub profile"
    >
        <GitHubIcon />
    </a>
    <a
        href="https://www.linkedin.com/in/maxdaten"
        target="_blank"
        rel="noopener noreferrer"
        title="Connect on LinkedIn"
    >
        <LinkedInIcon />
    </a>
    <a
        href="mailto:jloos@maxdaten.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Send an email"
    >
        <EmailIcon />
    </a>
</div>

<style lang="scss">
    @use '../../scss/breakpoints.scss';
    .socials {
        display: flex;
        align-items: center;
        gap: 20px;

        a {
            transition: all 0.2s ease-in-out;
            width: 24px;
            color: var(--color--text);
            fill: var(--color--text);

            &:hover {
                color: var(--color--primary);
                fill: var(--color--primary);
                filter: drop-shadow(0px 0px 3px var(--color--primary));
            }
        }
    }
</style>
