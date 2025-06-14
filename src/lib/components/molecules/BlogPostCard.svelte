<script lang="ts">
	import Card from '$lib/components/atoms/Card.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Image from '../atoms/Image.svelte';
	import type { BlogPost } from '$utils/types';

	type Props = {
		post: BlogPost,
		showImage?: boolean
	}

	let {
		post,
		showImage = true
	}: Props = $props()
</script>

<Card
	href="/{post.slug}"
	target="_self"
	additionalClass="blog-post-card {!showImage || !post.coverImage ? 'no-image' : ''}"
>
	{#snippet image()}
		<div class="image">
			{#if post.coverImage}
				<Image src={post.coverImage} alt="Cover image of this blog post" />
			{/if}
		</div>
	{/snippet}
	{#snippet content()}
		<div class="content">
			<p class="title">
				{post.title}
			</p>
			{#if post.readingTimeMinutes}
				<div class="note">{post.readingTimeMinutes} minutes</div>
			{/if}
			{#if post.excerpt}
				<p class="text">
					{post.excerpt}
				</p>
			{/if}
		</div>
	{/snippet}
	{#snippet footer()}
		<div class="footer">
			{#if post.tags?.length}
				<div class="tags">
					{#each post.tags.slice(0, 2) as tag}
						<Tag>{tag}</Tag>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</Card>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: flex-start;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 1.2rem;
    font-family: var(--font--title),serif;
    font-weight: 700;
  }

  .tags {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  .note {
    font-size: 0.8rem;
    color: rgba(var(--color--secondary-rgb), 0.8);
  }

  .text {
    margin-top: 5px;
    font-size: 0.9rem;
    text-align: justify;
  }

  .footer {
    margin-top: 20px;
  }

  :global(.blog-post-card .image img) {
    object-fit: cover;
  }

  :global(.blog-post-card.no-image > .image) {
    display: none;
  }
</style>
