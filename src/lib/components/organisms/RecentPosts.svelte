<script lang="ts">
    import BlogPostCard from '#lib/components/molecules/BlogPostCard.svelte';
    import ContentSection from '#lib/components/organisms/ContentSection.svelte';
    import type { ListingPost } from '#lib/sanity/listing.js';
    import Button from '#lib/components/atoms/Button.svelte';
    import { getContext } from 'svelte';
    import { t, type Locale } from '#lib/i18n/index.js';

    interface Props {
        posts: ListingPost[];
    }

    let { posts }: Props = $props();

    const getLocale: () => Locale = getContext('locale');
    let locale = $derived(getLocale());
</script>

<ContentSection
    id="recent-posts"
    title={t(locale, 'recentPosts.title')}
    description={t(locale, 'recentPosts.description')}
    align="left"
>
    {#snippet button()}
        <div>
            <Button href="/blog">{t(locale, 'recentPosts.viewMore')}</Button>
        </div>
    {/snippet}
    <!-- Posts are written in English, also on the German home page. -->
    <div class="grid" lang="en">
        {#each posts as post (post.slug)}
            <BlogPostCard {post} showImage={false} headingLevel="h3" />
        {/each}
    </div>
</ContentSection>

<style>
    .grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: var(--space-block);

        @media (max-width: 767px) {
            grid-template-columns: 1fr;
        }
    }
</style>
