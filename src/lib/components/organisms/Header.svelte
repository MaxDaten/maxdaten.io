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

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    header {
        position: relative;
        padding: 20px 0;
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
            gap: 30px;
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
            gap: 30px;

            a {
                position: relative;
                color: var(--color--text);
                text-decoration: none;

                // Active state: orange underline
                &.active {
                    color: var(--color--primary);

                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -4px;
                        height: 2px;
                        background: var(--color--primary);
                    }
                }

                // Hover only on non-active links
                &:not(.active):hover {
                    color: var(--color--primary);
                    filter: drop-shadow(0px 0px 3px var(--color--primary));
                }
            }
        }

        @include breakpoints.for-phone-only {
            padding: 15px 0;

            .links {
                gap: 15px;
            }
        }
    }
</style>
