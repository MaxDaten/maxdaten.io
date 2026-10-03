import { createClient } from '@sanity/client';
import {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
} from '$app/env/public';

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
