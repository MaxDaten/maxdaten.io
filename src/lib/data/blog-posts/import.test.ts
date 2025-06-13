import { describe, it, expect } from 'vitest';
import { importPosts } from './utils';

describe('importPosts', () => {
	it('should import blog posts from the filesystem', () => {
		const posts = importPosts();
		
		console.log('Found posts:', posts.length);
		console.log('Post titles:', posts.map(p => p.title));
		
		expect(posts).toBeInstanceOf(Array);
		expect(posts.length).toBeGreaterThan(0);
	});

	it('should have required metadata fields', () => {
		const posts = importPosts();
		
		if (posts.length > 0) {
			const firstPost = posts[0];
			expect(firstPost).toHaveProperty('title');
			expect(firstPost).toHaveProperty('date');
		}
	});
});