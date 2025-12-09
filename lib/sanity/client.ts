import { apiVersion, dataset, projectId, useCdn } from "./config";
import {
  postquery,
  limitquery,
  paginatedquery,
  configQuery,
  singlequery,
  pathquery,
  allauthorsquery,
  authorsquery,
  postsbyauthorquery,
  postsbycatquery,
  catpathquery,
  catquery,
  searchquery,
  bestToolsSlugsQuery,
  bestToolsBySlugQuery
} from "./groq";
import { createClient } from "next-sanity";

/**
 * Create client instance with hardcoded values
 */
const client = createClient({ projectId, dataset, apiVersion, useCdn });

export const fetcher = async ([query, params]) => {
  return client.fetch(query, params);
};

export async function getAllPosts() {
  return (await client.fetch(postquery)) || [];
}

export async function getSettings() {
  return (await client.fetch(configQuery)) || [];
}

export async function getPostBySlug(slug) {
  return (await client.fetch(singlequery, { slug })) || {};
}

export async function getAllPostsSlugs() {
  const slugs = (await client.fetch(pathquery)) || [];
  return slugs.map(slug => ({ slug }));
}
// Author
export async function getAllAuthorsSlugs() {
  
    const slugs = (await client.fetch(authorsquery)) || [];
    return slugs.map(slug => ({ author: slug }));

}

export async function getAuthorPostsBySlug(slug) {
  
    return (await client.fetch(postsbyauthorquery, { slug })) || {};

}

export async function getAllAuthors() {
  
    return (await client.fetch(allauthorsquery)) || [];

}

// Category

export async function getAllCategories() {
  
    const slugs = (await client.fetch(catpathquery)) || [];
    return slugs.map(slug => ({ category: slug }));

}

export async function getPostsByCategory(slug) {
  
    return (await client.fetch(postsbycatquery, { slug })) || {};

}

export async function getTopCategories() {
  
    return (await client.fetch(catquery)) || [];

}

export async function getPaginatedPosts({ limit, pageIndex = 0 }) {
  
    return (
      (await client.fetch(paginatedquery, {
        pageIndex: pageIndex,
        limit: limit
      })) || []
    );

}

export async function searchPosts(searchTerm = "") {
    return (
      (await client.fetch(searchquery, {
        query: searchTerm
      } as Record<string, string>)) || []
    );
}

// Best Tools helpers
export async function getAllBestToolsSlugs() {
  
    const slugs = (await client.fetch(bestToolsSlugsQuery)) || [];
    return slugs.map(slug => ({ slug }));

}

export async function getBestToolsBySlug(slug: string) {
    return (await client.fetch(bestToolsBySlugQuery, { slug })) || null;
}
