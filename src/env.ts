import { defineEnvVars } from '@sveltejs/kit/env';

// SANITY_PREVIEW_SECRET falls back to '' when unset, which leaves draft preview disabled.
export const variables = defineEnvVars({
    SANITY_PREVIEW_SECRET: { schema: (input) => input ?? '' },
    PUBLIC_SANITY_PROJECT_ID: { public: true, static: true },
    PUBLIC_SANITY_DATASET: { public: true, static: true },
});
