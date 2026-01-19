import { createClient } from '@sanity/client';
import {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
} from '$env/static/public';

const projectId = PUBLIC_SANITY_PROJECT_ID;
const dataset = PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2025-02-19';

/**
 * Sanity client for fetching published content via CDN.
 * Use this for all public-facing data fetching.
 */
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
});

/**
 * Preview client for fetching draft content.
 * Use this only in preview mode with a valid token.
 * Token should be set via SANITY_API_TOKEN environment variable.
 */
export const previewClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'previewDrafts',
    // Token is intentionally not included here - it should be passed per-request
    // to avoid exposing it in client bundles
});

/**
 * Get the appropriate client based on preview mode.
 */
export function getClient(preview = false) {
    return preview ? previewClient : client;
}
