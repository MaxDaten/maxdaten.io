import { defineQuery } from 'groq';

/**
 * GROQ query for fetching a single post by slug.
 * Returns full content including body for rendering.
 */
export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    date,
    lastModified,
    hidden,
    keywords,
    author-> {
      name,
      "image": image.asset->url
    },
    tags[]-> {
      name,
      "slug": slug.current
    },
    coverImage {
      alt,
      caption,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions,
      hotspot,
      crop
    }
  }
`);

/**
 * GROQ query for fetching all published posts for listing.
 * Excludes hidden posts and body content (not needed in listings).
 * Sorted by date descending.
 */
export const allPostsQuery = defineQuery(`
  *[_type == "post" && !hidden] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    date,
    tags[]-> {
      name,
      "slug": slug.current
    },
    coverImage {
      alt,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  }
`);
