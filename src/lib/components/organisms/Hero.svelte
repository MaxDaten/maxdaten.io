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
        padding: var(--raw-space-80) 0;

        @media (max-width: 900px) {
            padding: var(--raw-space-48) 0;
        }
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--raw-space-48);
        align-items: center;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
            gap: var(--raw-space-32);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-24);

        @media (max-width: 900px) {
            align-items: center;
            text-align: center;
            order: 2;
        }
    }

    .badge {
        font-family: var(--font--mono), monospace;
        font-size: var(--raw-text-sm);
        padding: var(--raw-space-8) var(--raw-space-16);
        border: 1px solid
            rgba(var(--color-accent-rgb), var(--raw-opacity-muted));
        border-radius: var(--raw-radius-full);
        color: var(--color-accent);
        background: var(--color-well);
        width: fit-content;
    }

    .headline {
        font-size: var(--raw-text-4xl);
        line-height: var(--raw-leading-tight);
        font-weight: 700;
        color: var(--color-text);
        margin: 0;
        text-wrap: balance;

        @media (max-width: 767px) {
            font-size: var(--raw-text-3xl);
        }

        .accent {
            background: var(--color-accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    }

    .subheadline {
        font-size: var(--raw-text-lg);
        line-height: var(--raw-leading-relaxed);
        color: var(--color-text-lead);
        margin: 0;
        max-width: 540px;
    }

    .ctas {
        display: flex;
        flex-wrap: wrap;
        gap: var(--raw-space-12);

        @media (max-width: 900px) {
            justify-content: center;
        }
    }

    .tech-ticker {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--raw-space-12);
        font-family: var(--font--mono), monospace;
        font-size: 13px;
        color: var(--color-text-dim);
        margin-top: var(--raw-space-24);

        @media (max-width: 900px) {
            justify-content: center;
        }

        .dot {
            width: 4px;
            height: 4px;
            border-radius: var(--raw-radius-full);
            background-color: var(--color-accent);
            opacity: 0.8;
        }
    }

    .card-column {
        display: flex;
        justify-content: center;

        @media (max-width: 900px) {
            order: 1;
            /* Constrain container width with padding */
            padding-inline: var(--raw-space-24);
            /* Enable container queries for dynamic card scaling */
            container-type: inline-size;
        }
    }
</style>
