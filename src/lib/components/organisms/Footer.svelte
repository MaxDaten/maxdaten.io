<script lang="ts">
    import { page } from '$app/state';
    import { siteHref } from '#lib/i18n/index.js';
    import Socials from '#lib/components/molecules/Socials.svelte';
    import RssLink from '#lib/components/atoms/RssLink.svelte';
    import type { Author } from '#lib/utils/types.js';

    let { author }: { author: Author } = $props();
</script>

<footer>
    <div class="footer-content">
        <div class="legal">
            <!-- eslint-disable svelte/no-navigation-without-resolve -- the legal pages live on maxdaten.de -->
            <a href={siteHref('/impressum', page.url.origin)}>Impressum</a>
            <a href={siteHref('/datenschutz', page.url.origin)}>Datenschutz</a>
            <!-- eslint-enable svelte/no-navigation-without-resolve -->
            <span class="copyright">© {new Date().getFullYear()}</span>
        </div>
        <div class="socials">
            <Socials {...author.socials} />
            <RssLink />
        </div>
    </div>
</footer>

<style>
    footer {
        width: 100%;
        background: linear-gradient(
            60deg,
            var(--color-bar-start) 0%,
            var(--color-bar-end) 100%
        );
        border-top: 1px solid var(--color-bar-start);
        padding: var(--space-block) 0;

        .footer-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 var(--space-stack);

            @media (max-width: 767px) {
                flex-direction: column;
                gap: var(--space-stack);
            }
        }

        .legal {
            display: flex;
            align-items: center;
            gap: var(--space-stack);
            font-size: var(--text-ui);

            a {
                display: inline-flex;
                align-items: center;
                min-height: var(--size-tap-target);
            }
        }

        .socials {
            display: flex;
            align-items: center;
            gap: var(--space-block);
        }

        a {
            &:hover {
                filter: drop-shadow(0px 0px 3px var(--color-accent));
            }
        }
    }
</style>
