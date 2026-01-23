import { groq } from "next-sanity";

// Get all posts
export const postquery = groq`
*[_type == "post"]
| order(coalesce(publishedAt, _createdAt) desc, _createdAt desc) {
  _type,
  _id,
  _createdAt,
  "publishedAt": coalesce(publishedAt, _createdAt),
  mainImage{..., "blurDataURL":asset->metadata.lqip, "ImageColor": asset->metadata.palette.dominant.background},
  featured,
  "excerpt": select(
    _type == "post" => summary,
    _type == "bestToolsContent" => metaDescription
  ),
  slug,
  title,
  author->{ _id, image, slug, name, title, linkedinUrl, twitterUrl },
  categories[]->
}
`;
// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->
}
`;
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->
}
`;

// Get Site Config
export const configQuery = groq`
*[_type == "settings"][0] {
  ...,
}
`;

// Single Post
export const singlequery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ...,
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  author->,
  categories[]->,
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "related": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedAt desc, _createdAt desc) [0...6] {
    title,
    slug,
    "date": coalesce(publishedAt,_createdAt),
    "image": mainImage{..., "blurDataURL":asset->metadata.lqip},
    categories[]->
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;
export const catpathquery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`;
export const authorsquery = groq`
*[_type == "author" && defined(slug.current)][].slug.current
`;

// Get Posts by Authors
export const postsbyauthorquery = groq`
*[_type == "post" && $slug match author->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "post" && $slug in categories[]->slug.current ] {
  ...,
  author->,
  categories[]->,
}
`;

// Get top 5 categories
export const catquery = groq`*[_type == "category"] {
  ...,
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc) [0...5]`;

export const searchquery = groq`*[_type == "post" && _score > 0]
| score(title match $query || excerpt match $query || pt::text(body) match $query)
| order(_score desc)
{
  _score,
  _id,
  _createdAt,
  mainImage,
  author->,
  categories[]->,
   title,
   slug
}`;

// Get all Authors
export const allauthorsquery = groq`
*[_type == "author"] {
 ...,
 'slug': slug.current,
}
`;

// Best Tools singleton (first document)
export const bestToolsQuery = groq`
*[_type == "bestToolsContent"][0]{
  title,
  "slug": slug.current,
  metaDescription,
  introContent,
  rankingCriteriaContent,
  conclusionContent,
  bestTools[]{
    id,
    bestFor,
    features,
    pricing,
    content
  }
}
`;

// Best Tools: paths for SSG
export const bestToolsSlugsQuery = groq`
*[_type == "bestToolsContent" && defined(slug.current)][].slug.current
`;

// Best Tools: single by slug
export const bestToolsBySlugQuery = groq`
*[_type == "bestToolsContent" && slug.current == $slug][0]{
  title,
  metaDescription,
  introContent,
  rankingCriteriaContent,
  conclusionContent,
  bestTools[]{
    id,
    bestFor,
    features,
    pricing,
    content
  }
}
`;

// Get service CTA matching post categories (or default)
export const servicectaquery = groq`
*[_type == "serviceCta" && (
  count(categories[@._ref in $categoryIds]) > 0 || isDefault == true
)] | order(isDefault asc) [0] {
  headline,
  body,
  buttonText,
  buttonUrl
}
`;

// Get generic CTA from site settings
export const genericctaquery = groq`
*[_type == "settings"][0] {
  "headline": genericCtaHeadline,
  "body": genericCtaBody,
  "buttonText": genericCtaButtonText,
  "buttonUrl": genericCtaButtonUrl
}
`;
