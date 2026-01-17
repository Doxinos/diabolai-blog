import { NextRequest, NextResponse } from "next/server";
import { writeClient, isWriteClientConfigured } from "@/lib/sanity/writeClient";
import fs from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "assets/blog-images");
const USED_IMAGES_FILE = path.join(IMAGES_DIR, "used-images.json");

interface UsedImagesData {
  description: string;
  used: string[];
}

/**
 * Get the list of available (unused) images
 */
function getAvailableImages(): string[] {
  // Read all image files
  const allFiles = fs.readdirSync(IMAGES_DIR).filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  // Read used images
  let usedImages: string[] = [];
  try {
    const data: UsedImagesData = JSON.parse(
      fs.readFileSync(USED_IMAGES_FILE, "utf-8")
    );
    usedImages = data.used || [];
  } catch {
    // File doesn't exist or is invalid, assume no images used
  }

  // Return unused images
  return allFiles.filter((file) => !usedImages.includes(file));
}

/**
 * Mark an image as used
 */
function markImageAsUsed(filename: string): void {
  let data: UsedImagesData = {
    description: "Tracks which images have been used in blog posts",
    used: [],
  };

  try {
    data = JSON.parse(fs.readFileSync(USED_IMAGES_FILE, "utf-8"));
  } catch {
    // File doesn't exist, use default
  }

  if (!data.used.includes(filename)) {
    data.used.push(filename);
    fs.writeFileSync(USED_IMAGES_FILE, JSON.stringify(data, null, 2));
  }
}

/**
 * Upload image to Sanity and return the asset reference
 */
async function uploadImageToSanity(
  imagePath: string,
  filename: string
): Promise<{ _ref: string; url: string }> {
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer]);

  const asset = await writeClient.assets.upload("image", blob, {
    filename,
  });

  return {
    _ref: asset._id,
    url: asset.url,
  };
}

/**
 * GET /api/next-image
 *
 * Returns the next available image, uploads it to Sanity, and marks it as used.
 *
 * Query params:
 *   - peek=true: Just return info about next image without uploading/marking used
 *
 * Response:
 * {
 *   "success": true,
 *   "image": {
 *     "filename": "ai-abstract-scene.jpg",
 *     "sanityRef": "image-xxx",
 *     "url": "https://cdn.sanity.io/..."
 *   },
 *   "remaining": 20
 * }
 */
export async function GET(request: NextRequest) {
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

  // Check if just peeking
  const peek = request.nextUrl.searchParams.get("peek") === "true";

  try {
    const availableImages = getAvailableImages();

    if (availableImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No available images. All images have been used.",
          remaining: 0,
        },
        { status: 404 }
      );
    }

    // Pick the first available image (could randomize if preferred)
    const nextImage = availableImages[0];
    const imagePath = path.join(IMAGES_DIR, nextImage);

    if (peek) {
      // Just return info without uploading
      return NextResponse.json({
        success: true,
        image: {
          filename: nextImage,
          sanityRef: null,
          url: null,
        },
        remaining: availableImages.length,
      });
    }

    // Check Sanity is configured
    if (!isWriteClientConfigured()) {
      return NextResponse.json(
        { error: "Server not configured: SANITY_WRITE_TOKEN not set" },
        { status: 500 }
      );
    }

    // Upload to Sanity
    const { _ref, url } = await uploadImageToSanity(imagePath, nextImage);

    // Mark as used
    markImageAsUsed(nextImage);

    return NextResponse.json({
      success: true,
      image: {
        filename: nextImage,
        sanityRef: _ref,
        url: url,
      },
      remaining: availableImages.length - 1,
    });
  } catch (error) {
    console.error("Failed to get next image:", error);
    return NextResponse.json(
      {
        error: "Failed to get next image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/next-image
 *
 * Same as GET but allows specifying a preferred image filename.
 *
 * Body:
 * {
 *   "filename": "ai-abstract-scene.jpg" // optional, uses next available if not specified
 * }
 */
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

  if (!isWriteClientConfigured()) {
    return NextResponse.json(
      { error: "Server not configured: SANITY_WRITE_TOKEN not set" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const requestedFilename = body.filename as string | undefined;

    const availableImages = getAvailableImages();

    if (availableImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No available images. All images have been used.",
          remaining: 0,
        },
        { status: 404 }
      );
    }

    // Use requested filename or pick next available
    let selectedImage: string;
    if (requestedFilename && availableImages.includes(requestedFilename)) {
      selectedImage = requestedFilename;
    } else if (requestedFilename) {
      return NextResponse.json(
        {
          success: false,
          error: `Image "${requestedFilename}" not found or already used`,
          available: availableImages,
        },
        { status: 404 }
      );
    } else {
      selectedImage = availableImages[0];
    }

    const imagePath = path.join(IMAGES_DIR, selectedImage);

    // Upload to Sanity
    const { _ref, url } = await uploadImageToSanity(imagePath, selectedImage);

    // Mark as used
    markImageAsUsed(selectedImage);

    return NextResponse.json({
      success: true,
      image: {
        filename: selectedImage,
        sanityRef: _ref,
        url: url,
      },
      remaining: availableImages.length - 1,
    });
  } catch (error) {
    console.error("Failed to process image request:", error);
    return NextResponse.json(
      {
        error: "Failed to process image request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
