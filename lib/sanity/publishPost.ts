import { writeClient, isWriteClientConfigured } from "./writeClient";
import { markdownToBlocks } from "./markdownToBlocks";

/**
 * Post data structure for creating a new blog post
 */
export interface PostInput {
  title: string;
  excerpt: string;
  directAnswer: string;
  tldr: string[];
  body: string; // Markdown content
  authorId?: string;
  categoryIds?: string[];
  mainImage?: {
    asset: { _ref: string };
    alt: string;
  };
  cta?: {
    text: string;
    url: string;
  };
  featured?: boolean;
  publishedAt?: string;
  keywords?: string[];
}

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * Upload an image to Sanity from a URL
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<{ _ref: string }> {
  if (!isWriteClientConfigured()) {
    throw new Error("Sanity write token not configured");
  }

  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const blob = new Blob([buffer]);

  const asset = await writeClient.assets.upload("image", blob, {
    filename,
  });

  return { _ref: asset._id };
}

/**
 * Upload an image to Sanity from a local file path
 */
export async function uploadImageFromFile(
  filePath: string,
  filename?: string
): Promise<{ _ref: string }> {
  if (!isWriteClientConfigured()) {
    throw new Error("Sanity write token not configured");
  }

  const fs = await import("fs");
  const path = await import("path");

  const finalFilename = filename || path.basename(filePath);

  // Use createReadStream for Sanity client compatibility
  const stream = fs.createReadStream(filePath);

  const asset = await writeClient.assets.upload("image", stream, {
    filename: finalFilename,
  });

  return { _ref: asset._id };
}

/**
 * Create a new post in Sanity
 */
export async function createPost(input: PostInput): Promise<{
  _id: string;
  slug: string;
}> {
  if (!isWriteClientConfigured()) {
    throw new Error(
      "Sanity write token not configured. Set SANITY_WRITE_TOKEN environment variable."
    );
  }

  const slug = generateSlug(input.title);
  const now = new Date().toISOString();

  // Convert markdown body to Sanity block content
  const bodyBlocks = markdownToBlocks(input.body);

  const document = {
    _type: "post",
    title: input.title,
    slug: { _type: "slug", current: slug },
    excerpt: input.excerpt,
    directAnswer: input.directAnswer,
    tldr: input.tldr,
    body: bodyBlocks,
    publishedAt: input.publishedAt || now,
    updatedAt: now,
    featured: input.featured || false,
    ...(input.keywords &&
      input.keywords.length > 0 && {
        keywords: input.keywords,
      }),
    ...(input.authorId && {
      author: { _type: "reference", _ref: input.authorId },
    }),
    ...(input.categoryIds &&
      input.categoryIds.length > 0 && {
        categories: input.categoryIds.map((id) => ({
          _type: "reference",
          _ref: id,
          _key: id,
        })),
      }),
    ...(input.mainImage && {
      mainImage: {
        _type: "image",
        asset: input.mainImage.asset,
        alt: input.mainImage.alt,
      },
    }),
    ...(input.cta && {
      cta: {
        _type: "object",
        text: input.cta.text,
        url: input.cta.url,
      },
    }),
  };

  const result = await writeClient.create(document);

  return {
    _id: result._id,
    slug,
  };
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string,
  updates: Partial<PostInput>
): Promise<void> {
  if (!isWriteClientConfigured()) {
    throw new Error("Sanity write token not configured");
  }

  const patch: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.title) patch.title = updates.title;
  if (updates.excerpt) patch.excerpt = updates.excerpt;
  if (updates.directAnswer) patch.directAnswer = updates.directAnswer;
  if (updates.tldr) patch.tldr = updates.tldr;
  if (updates.body) patch.body = markdownToBlocks(updates.body);
  if (updates.featured !== undefined) patch.featured = updates.featured;
  if (updates.cta) patch.cta = updates.cta;
  if (updates.keywords) patch.keywords = updates.keywords;

  await writeClient.patch(postId).set(patch).commit();
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  if (!isWriteClientConfigured()) {
    throw new Error("Sanity write token not configured");
  }

  await writeClient.delete(postId);
}

/**
 * Get author ID by slug
 */
export async function getAuthorIdBySlug(
  slug: string
): Promise<string | null> {
  const result = await writeClient.fetch(
    `*[_type == "author" && slug.current == $slug][0]._id`,
    { slug }
  );
  return result || null;
}

/**
 * Get category ID by slug
 */
export async function getCategoryIdBySlug(
  slug: string
): Promise<string | null> {
  const result = await writeClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]._id`,
    { slug }
  );
  return result || null;
}

/**
 * Get multiple category IDs by slugs
 */
export async function getCategoryIdsBySlugs(
  slugs: string[]
): Promise<string[]> {
  const results = await Promise.all(slugs.map(getCategoryIdBySlug));
  return results.filter((id): id is string => id !== null);
}
