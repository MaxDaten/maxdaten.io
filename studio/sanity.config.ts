import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
    name: 'default',
    title: 'maxdaten.io',

    projectId,
    dataset,

    plugins: [structureTool(), visionTool()],

    schema: {
        types: [],
    },
});
