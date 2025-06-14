import striptags from 'striptags';
import type { BlogPost } from '$lib/utils/types';
import { render } from 'svelte/server';

export const importPosts = () => {
	const imports = import.meta.glob('/src/routes/**/+page.md', { eager: true });

	const posts: BlogPost[] = [];
	for (const path in imports) {
		const post = imports[path] as any;
		if (post) {
			let html = render(post.default, { props: {}}).body;
			posts.push({
				...post.metadata,
				html,
				readingTimeMinutes: readingTime(striptags(striptags(html || ''))).minutes
			} as BlogPost);
		}
	}
	return posts;
};

export const filterPosts = (posts: BlogPost[]) => {
	return posts
		.filter((post) => !post.hidden)
		.sort((a, b) =>
			new Date(a.date).getTime() > new Date(b.date).getTime()
				? -1
				: new Date(a.date).getTime() < new Date(b.date).getTime()
				? 1
				: 0
		)
		.map((post) => {
			const relatedPosts = getRelatedPosts(posts, post);

			return {
				...post,
				relatedPosts: relatedPosts
			} as BlogPost;
		});
};

export const readingTime = (text: string) => {
	const words = text.split(/\s+/);
	const minutes = Math.ceil(words.length / 200);
	return {
		minutes,
		text: `${minutes} min read`
	};
}

// #region Unexported Functions

const getRelatedPosts = (posts: BlogPost[], post: BlogPost) => {
	// Get the first 3 posts that have the highest number of tags in common
	const relatedPosts = posts
		.filter((p) => !p.hidden && p.slug !== post.slug)
		.sort((a, b) => {
			const aTags = a.tags?.filter((t) => post.tags?.includes(t));
			const bTags = b.tags?.filter((t) => post.tags?.includes(t));
			return aTags?.length > bTags?.length ? -1 : aTags?.length < bTags?.length ? 1 : 0;
		});

	return relatedPosts.slice(0, 3);
};


// #endregion
