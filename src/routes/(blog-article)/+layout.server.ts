// This layout server is no longer needed as we're using [slug] route
// The post loading is now handled by [slug]/+layout.server.ts
export async function load() {
    return {
        post: null,
    };
}
