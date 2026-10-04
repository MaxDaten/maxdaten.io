<script lang="ts">
    import ProfileCard from '#lib/components/molecules/ProfileCard.svelte';
    import Button from '#lib/components/atoms/Button.svelte';
    import Sparkles from '#lib/components/atoms/Sparkles.svelte';
    import CalendarIcon from '#lib/icons/calendar.svelte';
    import GitHubIcon from '#lib/icons/socials/github.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale } from '#lib/i18n/index.js';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());
</script>

<section id="hero">
    <div class="hero-grid">
        <!-- Left Column: Value Proposition -->
        <div class="content">
            <span class="badge">{t(locale, 'hero.badge')}</span>
            <h1 class="headline">
                {t(locale, 'hero.headline')}.
                <span class="accent">{t(locale, 'hero.headlineAccent')}</span>.
            </h1>
            <p class="subheadline">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted i18n string -->
                {@html t(locale, 'hero.subheadline')}
            </p>
            <div class="ctas">
                <Sparkles>
                    <Button
                        size="medium"
                        style="solid"
                        color="primary"
                        href="https://calendar.app.google/KhVdEThcwSEBCjat5"
                    >
                        {#snippet icon()}
                            <CalendarIcon />
                        {/snippet}
                        {t(locale, 'hero.ctaBook')}
                    </Button>
                </Sparkles>
                <Button
                    size="medium"
                    style="ghost"
                    color="secondary"
                    href="https://github.com/MaxDaten"
                >
                    {#snippet icon()}
                        <GitHubIcon />
                    {/snippet}
                    {t(locale, 'hero.ctaProjects')}
                </Button>
            </div>
            <div class="tech-ticker">
                <span>K8s at Scale</span>
                <span class="dot"></span>
                <span>Multi-Cloud</span>
                <span class="dot"></span>
                <span>GitOps</span>
                <span class="dot"></span>
                <span>Full-Stack Architectures</span>
                <span class="dot"></span>
                <span>{t(locale, 'hero.techTag5')}</span>
            </div>
        </div>

        <!-- Right Column: Trading Card -->
        <div class="card-column">
            <ProfileCard />
        </div>
    </div>
</section>

<style>
    #hero {
        padding: var(--space-page) 0;

        @media (max-width: 900px) {
            padding: var(--space-section) 0;
        }
    }

    .hero-grid {
        display: grid;
        /* minmax(0, …): a plain 1fr track can't shrink below the 450px card, which squeezed the
           headline between 900 and 1100px */
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-section);
        align-items: center;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            gap: var(--space-group);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: var(--space-block);

        @media (max-width: 900px) {
            align-items: center;
            text-align: center;
            order: 2;
        }
    }

    .badge {
        font-family: var(--font--mono), monospace;
        font-size: var(--text-small);
        padding: var(--space-inline) var(--space-stack);
        border: 1px solid
            rgba(var(--color-accent-rgb), var(--opacity-border));
        border-radius: var(--radius-full);
        color: var(--color-accent);
        background: var(--color-well);
        width: fit-content;
    }

    .headline {
        font-size: var(--text-display);
        line-height: var(--text-heading-leading);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
        text-wrap: balance;

        @media (max-width: 767px) {
            font-size: var(--text-display-compact);
        }

        .accent {
            background: var(--color-accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    }

    .subheadline {
        font-size: var(--text-large);
        line-height: var(--text-body-leading);
        color: var(--color-text-lead);
        margin: 0;
        max-width: 540px;
    }

    .ctas {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-tight);

        @media (max-width: 900px) {
            justify-content: center;
        }
    }

    .tech-ticker {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-tight);
        font-family: var(--font--mono), monospace;
        font-size: var(--text-caption);
        color: var(--color-text-dim);
        margin-top: var(--space-block);

        @media (max-width: 900px) {
            justify-content: center;
        }

        .dot {
            width: 4px;
            height: 4px;
            border-radius: var(--radius-full);
            background-color: var(--color-accent);
            opacity: 0.8;
        }
    }

    .card-column {
        display: flex;
        justify-content: center;
        /* The card scales to this container (ProfileCard's container query); the padding makes
           room for the holo card's own inner padding, which sits outside the scaled area */
        padding-inline: var(--space-block);
        container-type: inline-size;

        @media (max-width: 900px) {
            order: 1;
        }
    }
</style>
