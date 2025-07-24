<svelte:options css="injected" />

<script lang="ts">
    import type { Author } from '$utils/types';

    type Props = {
        author: Author;
        profileImageSrc?: string;
    };

    let { author, profileImageSrc }: Props = $props();
</script>

<div class="og-card">
    {#if profileImageSrc}
        <div class="profile-image-container">
            <img src={profileImageSrc} alt="" class="profile-image" />
        </div>
    {/if}

    <div class="content">
        <div class="header">
            <h1 class="name">{author.name}</h1>
            <p class="tagline">{author.tagline}</p>
            <p class="role">{author.role}</p>
        </div>

        {#if author.bio}
            <p class="bio">{author.bio}</p>
        {/if}

        <div class="footer">
            <div class="specialties">
                {#if author.specialties?.length}
                    {#each author.specialties.slice(0, 3) as specialty, i (i)}
                        <span class="specialty">{specialty}</span>
                    {/each}
                {/if}
            </div>

            <div class="branding">
                <span class="site-name">maxdaten.io</span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    /* Note: Only Satori-compatible CSS (mainly flexbox) */
    /* No CSS variable support */
    @use '$lib/scss/_themes.scss' as *;

    $font-default: 'Inter', sans-serif;
    $font-title: 'Merriweather', serif;
    $font-logo: 'Baloo-2', sans-serif;

    .og-card {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        background-color: $color-page-background;
        border: 8px solid $color-secondary-tint;
        font-family: $font-default;
    }

    .profile-image-container {
        display: flex;
        width: 35%;
        height: 100%;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            rgba($color-primary, 0.1),
            rgba($color-secondary, 0.1)
        );
    }

    .profile-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px;
        margin: 16px;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 24px 24px;
        background-color: $color-page-background;
        justify-content: space-between;
        gap: 24px;
    }

    .header {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .name {
        font-size: 4.5rem;
        font-weight: 700;
        line-height: 1.1;
        color: $color-text;
        font-family: $font-title;
        margin: 0;
    }

    .tagline {
        font-size: 2.1rem;
        font-weight: 500;
        color: $color-primary;
        font-style: italic;
        margin: 0;
    }

    .role {
        font-size: 2rem;
        font-weight: 600;
        color: $color-text-shade;
        margin: 0;
    }

    .bio {
        font-size: 1.8rem;
        line-height: 1.4;
        color: $color-text;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .footer {
        display: flex;
        flex-direction: column;
    }

    .specialties {
        display: flex;
        position: absolute;
        bottom: 20px;
        gap: 12px;
        flex-wrap: wrap;
    }

    .specialty {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background-color: rgba($color-primary, 0.15);
        border: 2px solid rgba($color-primary, 0.2);
        border-radius: 10px;
        font-size: 1.8rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        color: $color-text;
    }

    .branding {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .site-name {
        font-family: $font-logo;
        font-size: 3.5rem;
        font-weight: 800;
        color: $color-primary;
    }
</style>
