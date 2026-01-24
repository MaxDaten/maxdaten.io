<script>
    import { resolve } from '$app/paths';
    import Socials from '$lib/components/molecules/Socials.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';
    import { authors } from '$lib/data/authors';

    // Get the main site author's socials
    const mainAuthor = authors.jloos;
</script>

<footer>
    <div class="footer-content">
        <div class="legal">
            <a href={resolve('/impressum')}>Impressum</a>
            <span class="copyright">&copy; {new Date().getFullYear()}</span>
        </div>
        <div class="socials">
            <Socials {...mainAuthor.socials} />
            <RssLink />
        </div>
    </div>
</footer>

<style>
    footer {
        width: 100%;
        background: linear-gradient(
            60deg,
            var(--color--waves-start) 0%,
            var(--color--waves-end) 100%
        );
        border-top: 1px solid var(--color--waves-start);
        padding: var(--raw-space-24) 0;

        .footer-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 var(--raw-space-16);

            @media (max-width: 767px) {
                flex-direction: column;
                gap: var(--raw-space-16);
            }
        }

        .legal {
            display: flex;
            align-items: center;
            gap: var(--raw-space-16);
            font-size: var(--raw-text-base);
        }

        .socials {
            display: flex;
            align-items: center;
            gap: var(--raw-space-24);
        }

        a {
            &:hover {
                filter: drop-shadow(0px 0px 3px var(--color-accent));
            }
        }
    }
</style>
