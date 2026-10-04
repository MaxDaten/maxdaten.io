<script lang="ts">
    import HoloCard from '#lib/components/molecules/HoloCard.svelte';
    import MeSrc from '#lib/assets/images/authors/jloos-v2.jpeg?enhanced';
    import { getContext } from 'svelte';
    import { t, type Locale } from '#lib/i18n/index.js';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());
</script>

<!-- The profile trading card. Its parent should set `container-type: inline-size` so the card
     can scale down below 450px. -->
<HoloCard>
    <div class="trading-card">
        <div class="card-header">
            <span class="card-title">MAXDATEN.IO</span>
            <span class="card-level">LVL 99</span>
        </div>
        <div class="avatar-container">
            <!-- Largest element above the fold (LCP): fetch it first. -->
            <enhanced:img
                src={MeSrc}
                class="avatar-image"
                alt="Jan-Philip Loos"
                loading="eager"
                fetchpriority="high"
                sizes="(max-width: 767px) 90vw, 450px"
            />
        </div>
        <div class="card-name">JAN-PHILIP</div>
        <div class="stat-rows">
            <div class="stat-row">
                <span class="stat-label">CLASS</span>
                <span class="stat-value"
                    >Freelance Platform & Product Engineer</span
                >
            </div>
            <div class="stat-row">
                <span class="stat-label">SPECIALTY</span>
                <span class="stat-value">Product Engineering</span>
            </div>
        </div>
        <div class="ability-box">
            <div class="ability-header">
                <span class="pro-badge">PRO</span>
                <span class="ability-name">Enterprise Rollouts</span>
            </div>
            <p class="ability-description">
                {t(locale, 'hero.abilityDescription')}
            </p>
        </div>
        <div class="card-footer">#001 &middot; HAMBURG, DE</div>
    </div>
</HoloCard>

<style>
    /* Trading Card Interior - 2.5:3.5 trading card ratio */
    .trading-card {
        font-family: var(--font--mono), monospace;
        display: flex;
        flex-direction: column;
        gap: var(--space-inline);
        width: 450px;
        aspect-ratio: 5 / 7;
        overflow: hidden;

        /* Dynamic scaling using container queries */
        @container (max-width: 450px) {
            /* Scale = container width / card width */
            zoom: calc(100cqi / 450px);
        }
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--text-caption);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .card-title {
        font-family: var(--font-logo), sans-serif;
        color: var(--color-text);
    }

    .card-level {
        color: var(--color-accent);
    }

    .avatar-container {
        aspect-ratio: 4 / 3;
        border-radius: var(--radius-block);
        overflow: hidden;
        background-color: rgba(
            var(--color-text-rgb),
            var(--opacity-tint)
        );

        :global(.avatar-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-name {
        font-family: var(--font-logo), sans-serif;
        font-size: var(--text-card-name);
        font-weight: 700;
        text-transform: uppercase;
        color: var(--color-text);
        letter-spacing: 0.05em;
    }

    .stat-rows {
        display: flex;
        flex-direction: column;
        gap: var(--space-inline);
    }

    .stat-row {
        display: flex;
        flex-direction: column;
        gap: var(--space-hairline);
        font-size: var(--text-caption);
    }

    .stat-label {
        font-size: var(--text-micro);
        letter-spacing: 0.05em;
        color: var(--color-text-dim);
        text-transform: uppercase;
    }

    .stat-value {
        color: var(--color-text);
        font-size: var(--text-small);
    }

    .ability-box {
        margin-top: auto;
        background: var(--color-well);
        border-radius: var(--radius-tag);
        padding: var(--space-tight);
        border-left: 3px solid var(--color-accent);
        box-shadow: inset 0 1px 0 var(--color-hairline);
        display: flex;
        flex-direction: column;
        gap: var(--space-hairline);
    }

    .ability-header {
        display: flex;
        align-items: center;
        gap: var(--space-inline);
    }

    .pro-badge {
        font-size: var(--text-micro);
        font-weight: 700;
        padding: var(--space-hairline) var(--space-inline);
        background-color: var(--color-accent);
        color: var(--color-text-inverse);
        border-radius: var(--radius-tag);
        text-transform: uppercase;
    }

    .ability-name {
        font-size: var(--text-small);
        font-weight: 600;
        color: var(--color-text);
    }

    .ability-description {
        font-size: var(--text-caption);
        color: var(--color-text-dim);
        line-height: var(--text-body-leading);
        margin: var(--space-hairline) 0 0 0;
    }

    .card-footer {
        font-size: var(--text-micro);
        font-weight: 500;
        letter-spacing: 0.05em;
        color: var(--color-text-dim);
        text-align: center;
        padding-top: var(--space-tight);
        border-top: 1px solid var(--color-hairline);
    }
</style>
