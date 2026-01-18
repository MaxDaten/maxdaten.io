// Object types
import { codeBlockType } from './objects/codeBlock';
import { calloutType } from './objects/callout';
import { portableImageType } from './objects/portableImage';
import { youtubeEmbedType } from './objects/youtubeEmbed';
import { seoType } from './objects/seo';

// Document types
import { tagType } from './documents/tag';
import { authorType } from './documents/author';
import { seriesType } from './documents/series';
import { postType } from './documents/post';
import { gemType } from './documents/gem';

export const schemaTypes = [
    // Object types (must be registered before documents that use them)
    codeBlockType,
    calloutType,
    portableImageType,
    youtubeEmbedType,
    seoType,
    // Document types
    tagType,
    authorType,
    seriesType,
    postType,
    gemType,
];
