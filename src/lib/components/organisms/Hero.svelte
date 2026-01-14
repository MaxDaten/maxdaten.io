<script>
    import BlogIcon from '$lib/icons/blog.svelte';
    import HeartIcon from '$lib/icons/heart.svelte';
    import ExperienceIcon from '$lib/icons/experience.svelte';
    import GitHubIcon from '$lib/icons/socials/github.svelte';
    import Button from '$lib/components/atoms/Button.svelte';
    import Sparkles from '../atoms/Sparkles.svelte';
</script>

<section id="hero">
    <h1 class="hello">I help engineering teams ship faster</h1>
    <div class="intro">
        <span class="left">by building infrastructure that scales</span>
        <hr />
        <span class="right">DevOps • Fullstack • Cloud</span>
    </div>
    <div class="ctas">
        <Button color="secondary" href="https://github.com/MaxDaten">
            {#snippet icon()}
                <GitHubIcon />
            {/snippet}
            Projects
        </Button>
        <Button size="medium" color="secondary" href="/blog">
            {#snippet icon()}
                <BlogIcon />
            {/snippet}
            Blog
        </Button>
        <Button size="medium" color="secondary" href="/gems">
            {#snippet icon()}
                <HeartIcon />
            {/snippet}
            Gems
        </Button>
        <Sparkles>
            <Button size="medium" href="https://cv.maxdaten.io">
                {#snippet icon()}
                    <ExperienceIcon />
                {/snippet}
                Résumé
            </Button>
        </Sparkles>
    </div>
</section>

<style lang="scss">
    @use '$lib/scss/breakpoints.scss';

    #hero {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
        position: relative;
        padding: 80px 0;

        @include breakpoints.for-phone-only {
            padding: 40px 0 50px;
        }

        .hello {
            text-align: center;
        }

        .intro {
            font-weight: 500;
            font-size: 1.4rem;
            line-height: 2.5rem;
            width: min(100%, 440px);
            display: flex;
            flex-direction: column;
            color: rgba(var(--color--text-shade-rgb), 0.7);

            .left {
                text-align: left;
            }
            .right {
                text-align: right;
            }

            @include breakpoints.for-phone-only {
                display: none;
            }

            hr {
                border: 0;
                margin: 0 auto;
                border-top: 1px solid rgba(var(--color--text-shade-rgb), 0.1);
                width: 80%;
            }
        }

        .ctas {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
        }
    }
</style>
