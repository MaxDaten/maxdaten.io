<script lang="ts">
    import ContentSection from '#lib/components/organisms/ContentSection.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale, type TranslationKeys } from '#lib/i18n/index.js';

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());

    const services = ['platform', 'delivery', 'product'] as const;

    // Names, dates and roles read the same in both languages; only the outcome is translated.
    const results: {
        company: string;
        years: string;
        role: string;
        text: keyof TranslationKeys;
    }[] = [
        {
            company: 'Klingel Gruppe',
            years: '2021–2023',
            role: 'Senior DevOps Engineer',
            text: 'results.klingel',
        },
        {
            company: 'Fielmann AG',
            years: '2018–2020',
            role: 'Tech Lead',
            text: 'results.fielmann',
        },
        {
            company: 'Briends GmbH (Papego)',
            years: '2012–2023',
            role: 'Co-Founder',
            text: 'results.papego',
        },
    ];
</script>

<ContentSection
    id="services"
    title={t(locale, 'services.title')}
    description={t(locale, 'services.description')}
>
    <ul class="cards">
        {#each services as service (service)}
            <li class="card">
                <h3>{t(locale, `services.${service}.title`)}</h3>
                <p>{t(locale, `services.${service}.text`)}</p>
            </li>
        {/each}
    </ul>
</ContentSection>

<ContentSection
    id="results"
    title={t(locale, 'results.title')}
    description={t(locale, 'results.description')}
>
    <ul class="cards">
        {#each results as result (result.company)}
            <li class="card">
                <h3>{result.company}</h3>
                <p class="meta">
                    {result.role} · <span class="years">{result.years}</span>
                </p>
                <p>{t(locale, result.text)}</p>
            </li>
        {/each}
    </ul>
</ContentSection>

<style>
    .cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--raw-space-24);
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .card {
        display: flex;
        flex-direction: column;
        gap: var(--raw-space-8);
        padding: var(--raw-space-24);
        border-radius: var(--radius-card);
        background-color: var(--color-surface-elevated);

        h3 {
            font-size: var(--raw-text-lg);
            margin: 0;
        }

        p {
            margin: 0;
            color: var(--color-text-muted);
            line-height: var(--raw-leading-relaxed);
        }

        .meta {
            font-family: var(--font--mono), monospace;
            font-size: var(--raw-text-sm);
            color: var(--color-accent-text);

            .years {
                white-space: nowrap;
            }
        }
    }
</style>
