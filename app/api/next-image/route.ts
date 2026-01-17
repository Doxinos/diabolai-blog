import { NextRequest, NextResponse } from "next/server";
import { writeClient, isWriteClientConfigured } from "@/lib/sanity/writeClient";

// List of all available stock images (pre-generated Midjourney images)
// These must match the actual filenames in public/blog-images/
const ALL_STOCK_IMAGES = [
  "ai-3d-car-emerging-holographic-wireframe.jpg",
  "ai-abstract-audio-wave-flowing.jpg",
  "ai-abstract-digital-artwork-inspired-siren-melthea.jpg",
  "ai-abstract-face-paint-details.jpg",
  "ai-abstract-scene-glowing-lightbulb-dark-night.jpg",
  "ai-animated-cinematic-poster-bear-old-man.jpg",
  "ai-ascii-style-art-barista-coffee.jpg",
  "ai-astronaut-woman-futuristic-suit.jpg",
  "ai-campfire-colorful-flames-glowing.jpg",
  "ai-close-up-black-panther.jpg",
  "ai-dark-medallion-head-of-dragon.jpg",
  "ai-f1-inspired-track-at-night.jpg",
  "ai-macro-shot-mosquito-flying-mid-air.jpg",
  "ai-minimalist-apple-mac-workspace.jpg",
  "ai-nervous-system-black-background-artistic.jpg",
  "ai-realistic-digital-art-black-woman-dollar-bills.jpg",
  "ai-retro-futuristic-sci-fi-bedroom-interior.jpg",
  "ai-santa-klaus-gifts-futuristik.jpg",
  "ai-throne-red-poker-cards-flying.jpg",
  "ai-turntable-needle-song.jpg",
  "ai-woman-robot-futuristic.jpg",
  "ai-wooden-surfboard-carved-and-painted-hawaiian.jpg",
];

/**
 * Get list of images already used in Sanity (by checking originalFilename)
 */
async function getUsedImageFilenames(): Promise<string[]> {
  const query = `*[_type == "sanity.imageAsset" && originalFilename match "ai-*"]{originalFilename}`;
  const assets = await writeClient.fetch(query);
  return assets.map((a: { originalFilename: string }) => a.originalFilename);
}

/**
 * Get the list of available (unused) images
 */
async function getAvailableImages(): Promise<string[]> {
  const usedFilenames = await getUsedImageFilenames();
  return ALL_STOCK_IMAGES.filter((file) => !usedFilenames.includes(file));
}

/**
 * Upload image to Sanity from the public assets URL
 */
async function uploadImageToSanity(
  filename: string
): Promise<{ _ref: string; url: string }> {
  // Fetch the image from the public assets URL
  const imageUrl = `https://blog.diabolai.com/blog-images/${filename}`;

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();

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
    const availableImages = await getAvailableImages();

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

    // Upload to Sanity (this also marks it as "used" since it's now in Sanity)
    const { _ref, url } = await uploadImageToSanity(nextImage);

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

    const availableImages = await getAvailableImages();

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

    // Upload to Sanity (this also marks it as "used" since it's now in Sanity)
    const { _ref, url } = await uploadImageToSanity(selectedImage);

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
