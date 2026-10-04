<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import Logo from '#lib/components/atoms/Logo.svelte';
    import RssLink from '#lib/components/atoms/RssLink.svelte';
    import LanguageSwitcher from '#lib/components/molecules/LanguageSwitcher.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale } from '#lib/i18n/index.js';

    interface Props {
        showBackground?: boolean;
    }

    let { showBackground = false }: Props = $props();

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    function isActive(href: string): boolean {
        const pathname = page.url.pathname;
        // Exact match for the section root
        if (pathname === href) return true;
        // Section match for nested routes (e.g., /blog/my-post matches /blog)
        if (pathname.startsWith(href + '/')) return true;
        return false;
    }
</script>

<header class:has-background={showBackground}>
    <nav class="container">
        <a class="logo" href={resolve('')} aria-label="maxdaten.io">
            <Logo />
        </a>
        <div class="links">
            <a
                href={resolve('blog')}
                class:active={isActive('/blog')}
                aria-current={isActive('/blog') ? 'page' : undefined}
                >{t(locale, 'nav.blog')}</a
            >
            <a
                href={resolve('gems')}
                class:active={isActive('/gems')}
                aria-current={isActive('/gems') ? 'page' : undefined}
                >{t(locale, 'nav.gems')}</a
            >
            <LanguageSwitcher />
            <span class="rss"><RssLink /></span>
        </div>
    </nav>
</header>

<style>
    header {
        position: relative;
        padding: var(--raw-space-24) 0;
        border-bottom: 1px solid var(--color-bar-start);

        &.has-background {
            background: linear-gradient(
                60deg,
                var(--color-bar-start) 0%,
                var(--color-bar-end) 100%
            );
        }

        .container {
            display: flex;
            align-items: center;
            gap: var(--raw-space-32);
        }

        .logo {
            flex: 1 1 50%;
            min-width: 100px;
            max-width: 300px;
        }

        .links {
            flex: 1 1 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: var(--raw-space-32);

            a {
                position: relative;
                padding: var(--raw-space-8) 0;
                color: var(--color-text);
                text-decoration: none;

                /* Active state: orange underline */
                &.active {
                    color: var(--color-accent);

                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: calc(-1 * var(--raw-space-4));
                        height: 2px;
                        background: var(--color-accent);
                    }
                }

                /* Hover only on non-active links */
                &:not(.active):hover {
                    color: var(--color-accent);
                    filter: drop-shadow(0px 0px 3px var(--color-accent));
                }
            }
        }

        .rss {
            display: flex;
        }

        @media (max-width: 767px) {
            padding: var(--raw-space-16) 0;

            .container {
                gap: var(--raw-space-16);
            }

            .logo {
                min-width: auto;
            }

            /* Too narrow for every link at 320px; the footer carries the same feed link */
            .rss {
                display: none;
            }

            .links {
                gap: var(--raw-space-8);

                a {
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
