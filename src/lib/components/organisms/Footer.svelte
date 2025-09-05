<script>
    import Socials from '$lib/components/molecules/Socials.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';
    import { authors } from '$lib/data/authors';

    // Get the main site author's socials
    const mainAuthor = authors.jloos;
</script>

<footer>
    <div class="content">
        <div class="legal">
            <a href="/impressum">Impressum</a>
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

        display: grid;
        grid-template-rows: 120px 1fr;

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            font-weight: 600;
            text-align: center;

            .socials {
                display: flex;
                align-items: center;
                gap: 20px;
            }
        }

        a {
            &:hover {
                filter: drop-shadow(0px 0px 3px var(--color--primary));
            }
        }
    }
</style>
