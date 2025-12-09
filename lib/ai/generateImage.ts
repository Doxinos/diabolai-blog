/**
 * Image Generation Module using Replicate Flux
 *
 * Generates blog hero images using the Flux model on Replicate.
 */

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";

// Flux Schnell - fast, good quality (~$0.003/image)
const FLUX_SCHNELL = "black-forest-labs/flux-schnell";

// Flux Dev - higher quality, slower (~$0.025/image)
const FLUX_DEV = "black-forest-labs/flux-dev";

// Flux Pro - highest quality (~$0.055/image)
const FLUX_PRO = "black-forest-labs/flux-1.1-pro";

export type FluxModel = "schnell" | "dev" | "pro";

interface GenerateImageOptions {
  prompt: string;
  model?: FluxModel;
  aspectRatio?: "1:1" | "16:9" | "21:9" | "3:2" | "2:3" | "4:5" | "5:4" | "9:16" | "9:21";
  outputFormat?: "webp" | "jpg" | "png";
}

interface ReplicatePrediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string;
}

function getModelId(model: FluxModel): string {
  switch (model) {
    case "schnell":
      return FLUX_SCHNELL;
    case "dev":
      return FLUX_DEV;
    case "pro":
      return FLUX_PRO;
    default:
      return FLUX_SCHNELL;
  }
}

/**
 * Generate an image using Flux on Replicate
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    throw new Error(
      "REPLICATE_API_TOKEN not set. Add it to .env.local"
    );
  }

  const model = options.model || "schnell";
  const modelId = getModelId(model);

  // Blog hero images use 16:9 aspect ratio (matches existing blog images)
  const aspectRatio = options.aspectRatio || "16:9";
  const outputFormat = options.outputFormat || "webp";

  // Enhance prompt for blog hero images
  const enhancedPrompt = `${options.prompt}, professional blog header image, high quality, modern design, clean composition`;

  console.log(`🎨 Generating image with Flux ${model}...`);
  console.log(`   Prompt: ${options.prompt.slice(0, 60)}...`);

  // Create prediction
  const createResponse = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Prefer: "wait", // Wait for result (up to 60s)
    },
    body: JSON.stringify({
      model: modelId,
      input: {
        prompt: enhancedPrompt,
        aspect_ratio: aspectRatio,
        output_format: outputFormat,
        output_quality: 90,
      },
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Replicate API error: ${error}`);
  }

  let prediction: ReplicatePrediction = await createResponse.json();

  // Poll for completion if not using Prefer: wait or if still processing
  while (prediction.status === "starting" || prediction.status === "processing") {
    console.log(`   Status: ${prediction.status}...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pollResponse = await fetch(
      `${REPLICATE_API_URL}/${prediction.id}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    prediction = await pollResponse.json();
  }

  if (prediction.status === "failed") {
    throw new Error(`Image generation failed: ${prediction.error}`);
  }

  if (prediction.status === "canceled") {
    throw new Error("Image generation was canceled");
  }

  // Get the output URL
  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;

  if (!imageUrl) {
    throw new Error("No image URL in response");
  }

  console.log(`   ✓ Image generated successfully`);

  return imageUrl;
}

/**
 * Generate a blog hero image with sensible defaults
 */
export async function generateBlogHeroImage(prompt: string): Promise<string> {
  return generateImage({
    prompt,
    model: "schnell", // Fast and cheap for blog images
    aspectRatio: "16:9", // Matches existing blog images (2912x1632)
    outputFormat: "webp",
  });
}
