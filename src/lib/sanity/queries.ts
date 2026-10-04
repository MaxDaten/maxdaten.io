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
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          "reference": reference-> {
            _type,
            slug
          }
        }
      },
      _type == "portableImage" => {
        "dimensions": image.asset->metadata.dimensions,
        // A blurred placeholder would show through transparent images.
        "lqip": select(image.asset->metadata.hasAlpha => null, image.asset->metadata.lqip)
      }
    },
    date,
    lastModified,
    _updatedAt,
    hidden,
    keywords,
    outroText,
    seo {
      metaTitle,
      metaDescription,
      noIndex,
      ogImage
    },
    author-> {
      "id": slug.current,
      name,
      tagline,
      bio,
      email,
      "avatarUrl": avatar.asset->url,
      "avatarAlt": avatar.alt,
      socialLinks,
      calendarBookingUrl
    },
    tags[]-> {
      name,
      "slug": slug.current
    },
    coverImage {
      alt,
      caption,
      asset,
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
      asset,
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  }
`);

/**
 * GROQ query for the sitemap: listed posts that editors haven't marked "No Index".
 */
export const sitemapPostsQuery = defineQuery(`
  *[_type == "post" && !hidden && seo.noIndex != true] | order(date desc) {
    "slug": slug.current,
    lastModified,
    _updatedAt,
    date
  }
`);

/**
 * GROQ query for fetching all posts for RSS feed (and llms.txt).
 * Includes full body for HTML rendering. Leaves out hidden and "No Index" posts.
 * Sorted by date descending.
 */
export const rssPostsQuery = defineQuery(`
  *[_type == "post" && !hidden && seo.noIndex != true] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    date,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          "reference": reference-> {
            _type,
            slug
          }
        }
      }
    },
    tags[]-> { name },
    author-> { name },
    coverImage { "url": asset->url }
  }
`);

/**
 * GROQ query for fetching all post slugs including hidden posts.
 * Used by the [slug] route's entries() to ensure all posts are prerendered.
 */
export const allPostSlugsQuery = defineQuery(`
  *[_type == "post"] { "slug": slug.current }
`);

/**
 * GROQ query for fetching all gems.
 * Sorted alphabetically by title.
 */
export const allGemsQuery = defineQuery(`
  *[_type == "gem"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    url,
    description,
    tags[]-> {
      name,
      "slug": slug.current
    },
    coverImage {
      alt,
      asset,
      "url": asset->url,
      "lqip": asset->metadata.lqip
    }
  }
`);

const authorProjection = `{
    "slug": slug.current,
    name,
    jobTitle,
    tagline,
    bio,
    specialties,
    email,
    "avatarUrl": avatar.asset->url,
    "avatarAlt": avatar.alt,
    socialLinks,
    calendarBookingUrl
}`;

/** One author by slug (the site author is "jloos"). */
export const authorBySlugQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] ${authorProjection}
`);

/** Slugs of all authors, for prerendering /about/[authorId]. */
export const authorSlugsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)].slug.current
`);
