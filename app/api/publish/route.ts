import { NextRequest, NextResponse } from "next/server";
import {
  createPost,
  uploadImageFromUrl,
  getAuthorIdBySlug,
  getCategoryIdsBySlugs,
  PostInput,
} from "@/lib/sanity/publishPost";
import { isWriteClientConfigured } from "@/lib/sanity/writeClient";

/**
 * API endpoint for publishing blog posts
 *
 * POST /api/publish
 *
 * Headers:
 *   Authorization: Bearer <API_SECRET>
 *
 * Body:
 * {
 *   title: string,
 *   excerpt: string,
 *   directAnswer: string,
 *   tldr: string[],
 *   body: string (markdown),
 *   authorSlug?: string,
 *   categorySlug?: string | string[],
 *   imageUrl?: string,
 *   imageAlt?: string,
 *   cta?: { text: string, url: string },
 *   featured?: boolean
 * }
 */

interface PublishRequest {
  title: string;
  excerpt: string;
  directAnswer: string;
  tldr: string[];
  body: string;
  authorSlug?: string;
  categorySlug?: string | string[];
  imageUrl?: string;
  imageAlt?: string;
  cta?: {
    text: string;
    url: string;
  };
  featured?: boolean;
  keywords?: string[];
}

function validateRequest(data: unknown): data is PublishRequest {
  if (!data || typeof data !== "object") return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.title === "string" &&
    d.title.length > 0 &&
    typeof d.excerpt === "string" &&
    typeof d.directAnswer === "string" &&
    Array.isArray(d.tldr) &&
    typeof d.body === "string"
  );
}

export async function POST(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.PUBLISH_API_SECRET;

  if (!expectedToken) {
    return NextResponse.json(
      { error: "Server not configured: PUBLISH_API_SECRET not set" },
      { status: 500 }
    );
  }

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check Sanity write client
  if (!isWriteClientConfigured()) {
    return NextResponse.json(
      { error: "Server not configured: SANITY_WRITE_TOKEN not set" },
      { status: 500 }
    );
  }

  // Parse and validate request
  let data: PublishRequest;
  try {
    const body = await request.json();
    if (!validateRequest(body)) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          required: ["title", "excerpt", "directAnswer", "tldr", "body"],
        },
        { status: 400 }
      );
    }
    data = body;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  try {
    // Resolve author ID
    let authorId: string | undefined;
    if (data.authorSlug) {
      authorId = (await getAuthorIdBySlug(data.authorSlug)) || undefined;
    }

    // Resolve category IDs
    let categoryIds: string[] | undefined;
    if (data.categorySlug) {
      const slugs = Array.isArray(data.categorySlug)
        ? data.categorySlug
        : [data.categorySlug];
      categoryIds = await getCategoryIdsBySlugs(slugs);
    }

    // Upload image if provided
    let mainImage: PostInput["mainImage"];
    if (data.imageUrl) {
      const filename = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 50);
      const asset = await uploadImageFromUrl(
        data.imageUrl,
        `${filename}.jpg`
      );
      mainImage = {
        asset,
        alt: data.imageAlt || data.title,
      };
    }

    // Create the post
    const postInput: PostInput = {
      title: data.title,
      excerpt: data.excerpt,
      directAnswer: data.directAnswer,
      tldr: data.tldr,
      body: data.body,
      authorId,
      categoryIds,
      mainImage,
      cta: data.cta,
      featured: data.featured,
      keywords: data.keywords,
    };

    const result = await createPost(postInput);

    return NextResponse.json({
      success: true,
      postId: result._id,
      slug: result.slug,
      url: `https://blog.diabolai.com/${result.slug}`,
    });
  } catch (error) {
    console.error("Failed to publish post:", error);
    return NextResponse.json(
      {
        error: "Failed to publish post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    configured: {
      sanityWriteToken: isWriteClientConfigured(),
      publishApiSecret: !!process.env.PUBLISH_API_SECRET,
    },
  });
}
