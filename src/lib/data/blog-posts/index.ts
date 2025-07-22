import { filterPosts, importPosts } from './utils';

export const allPosts = await importPosts();
export const filteredPosts = filterPosts(allPosts);
