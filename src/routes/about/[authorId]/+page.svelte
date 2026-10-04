<script lang="ts">
    import type { PageProps } from './$types';
    import ProfileCard from '#lib/components/molecules/ProfileCard.svelte';
    import Tag from '#lib/components/atoms/Tag.svelte';
    import Button from '#lib/components/atoms/Button.svelte';
    import CalendarIcon from '#lib/icons/calendar.svelte';

    let { data }: PageProps = $props();
    const author = $derived(data.author);
</script>

<section class="about container">
    <div class="about-grid">
        <div class="content">
            <h1 class="name">{author.name}</h1>
            <p class="role">{author.jobTitle}</p>
            <p class="bio">{author.bio}</p>
            {#if author.specialties?.length}
                <ul class="expertise" aria-label="Expertise">
                    {#each author.specialties as specialty (specialty)}
                        <li><Tag>{specialty}</Tag></li>
                    {/each}
                </ul>
            {/if}
            <div class="ctas">
                <Button
                    size="medium"
                    style="solid"
                    color="primary"
                    href="https://calendar.app.google/KhVdEThcwSEBCjat5"
                >
                    {#snippet icon()}
                        <CalendarIcon />
                    {/snippet}
                    Book a Call
                </Button>
            </div>
        </div>

        <div class="card-column">
            <ProfileCard />
        </div>
    </div>
</section>

<style>
    /* Mirrors the front-page hero: text left, profile card right. */
    /* Block padding only: the inline padding comes from .container. */
    .about {
        padding-block: var(--space-page);

        @media (max-width: 900px) {
            padding-block: var(--space-section);
        }
    }

    .about-grid {
        display: grid;
        /* minmax(0, …) lets the card column shrink instead of squeezing the text */
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

    .name {
        font-size: var(--text-display);
        line-height: var(--text-heading-leading);
        margin: 0;

        @media (max-width: 767px) {
            font-size: var(--text-display-compact);
        }
    }

    .role {
        font-family: var(--font--mono), monospace;
        font-size: var(--text-body);
        color: var(--color-accent-text);
        margin: 0;
    }

    .bio {
        font-size: var(--text-large);
        line-height: var(--text-body-leading);
        color: var(--color-text-muted);
        margin: 0;
        max-width: 540px;
    }

    .expertise {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-inline);
        list-style: none;
        padding: 0;
        margin: 0;

        @media (max-width: 900px) {
            justify-content: center;
        }
    }

    .ctas {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-tight);
    }

    .card-column {
        display: flex;
        justify-content: center;
        padding-inline: var(--space-block);
        /* Lets ProfileCard scale down below its 450px width. */
        container-type: inline-size;

        @media (max-width: 900px) {
            order: 1;
        }
    }
</style>
