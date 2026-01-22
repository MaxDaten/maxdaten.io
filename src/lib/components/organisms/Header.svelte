<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import Logo from '$lib/components/atoms/Logo.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';

    interface Props {
        showBackground?: boolean;
    }

    let { showBackground = false }: Props = $props();

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
        <a class="logo" href={resolve('/')} aria-label="Site logo">
            <Logo />
        </a>
        <div class="links">
            <a
                href={resolve('/blog')}
                class:active={isActive('/blog')}
                aria-current={isActive('/blog') ? 'page' : undefined}>Blog</a
            >
            <a
                href={resolve('/gems')}
                class:active={isActive('/gems')}
                aria-current={isActive('/gems') ? 'page' : undefined}>Gems</a
            >
            <RssLink />
        </div>
    </nav>
</header>

<style>
    header {
        position: relative;
        padding: var(--raw-space-24) 0;
        border-bottom: 1px solid var(--color--waves-start);

        &.has-background {
            background: linear-gradient(
                60deg,
                var(--color--waves-start) 0%,
                var(--color--waves-end) 100%
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

        @media (max-width: 767px) {
            padding: var(--raw-space-16) 0;

            .links {
                gap: var(--raw-space-16);

                a {
                    min-height: 44px;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
