<script>
    import { resolve } from '$app/paths';
    import Socials from '$lib/components/molecules/Socials.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';
    import { authors } from '$lib/data/authors';

    // Get the main site author's socials
    const mainAuthor = authors.jloos;
</script>

<footer>
    <div class="content">
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

<style lang="scss">
    footer {
        width: 100%;
        background: linear-gradient(
            60deg,
            var(--color--waves-start) 0%,
            var(--color--waves-end) 100%
        );
        border-top: 1px solid var(--color--waves-start);
        padding: 24px 0;

        .content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 15px;

            @media (max-width: 767px) {
                flex-direction: column;
                gap: 16px;
            }
        }

        .legal {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.9rem;
        }

        .socials {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        a {
            &:hover {
                filter: drop-shadow(0px 0px 3px var(--color--primary));
            }
        }
    }
</style>
