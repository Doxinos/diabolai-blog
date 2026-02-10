import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/lib/sanity/config";
import { groq } from "next-sanity";

/**
 * API endpoint to fetch existing posts for internal linking during content generation
 *
 * GET /api/posts-for-linking
 *
 * Returns a list of posts with title, slug, excerpt, and categories
 * that can be passed to the AI content generator to create internal links.
 *
 * Query params:
 *   - limit: Max number of posts to return (default: 20)
 *   - category: Filter by category slug (optional)
 */

const client = createClient({ projectId, dataset, apiVersion, useCdn: true });

const postsForLinkingQuery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0...$limit] {
  title,
  "slug": slug.current,
  excerpt,
  directAnswer,
  "categories": categories[]->slug.current
}
`;

const postsByCategoryQuery = groq`
*[_type == "post" && $category in categories[]->slug.current] | order(publishedAt desc, _createdAt desc) [0...$limit] {
  title,
  "slug": slug.current,
  excerpt,
  directAnswer,
  "categories": categories[]->slug.current
}
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const category = searchParams.get("category");

  try {
    let posts;

    if (category) {
      posts = await client.fetch(postsByCategoryQuery, { category, limit });
    } else {
      posts = await client.fetch(postsForLinkingQuery, { limit });
    }

    // Format for AI consumption - simple structure with URL
    const formattedPosts = posts.map((post: {
      title: string;
      slug: string;
      excerpt: string;
      directAnswer: string;
      categories: string[];
    }) => ({
      title: post.title,
      url: `/post/sidebar/${post.slug}`,
      description: post.excerpt || post.directAnswer || "",
      categories: post.categories || [],
    }));

    return NextResponse.json({
      posts: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (error) {
    console.error("Failed to fetch posts for linking:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
