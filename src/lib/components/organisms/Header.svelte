<script lang="ts">
    import Logo from '$lib/components/atoms/Logo.svelte';
    import RssLink from '$lib/components/atoms/RssLink.svelte';

    interface Props {
        showBackground?: boolean;
    }

    let { showBackground = false }: Props = $props();
</script>

<header class:has-background={showBackground}>
    <nav class="container">
        <a class="logo" href="/" aria-label="Site logo">
            <Logo />
        </a>
        <div class="links">
            <a href="/blog">Blog</a>
            <a href="/gems">Gems</a>
            <RssLink />
        </div>
    </nav>
</header>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    header {
        position: relative;
        padding: 30px 0;
        border-bottom: 1px solid var(--color--waves-start);

        @include breakpoints.for-phone-only {
            padding: 20px 0;
        }

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

            @include breakpoints.for-phone-only {
                .links {
                    a {
                        display: none;
                    }
                }
            }
        }

        .logo {
            height: 44px;
            flex: 1;
        }

        a {
            color: var(--color--text);
        }

        .links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 30px;

            a {
                text-decoration: none;

                &:hover {
                    color: var(--color--primary);
                    filter: drop-shadow(0px 0px 3px var(--color--primary));
                }
            }
        }
    }
</style>
