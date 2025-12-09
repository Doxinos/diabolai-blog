#!/usr/bin/env npx tsx

/**
 * CLI Script for Publishing Blog Posts to Sanity
 *
 * Usage:
 *   npx tsx scripts/publish-post.ts
 *
 * Or add to package.json scripts:
 *   "publish": "tsx scripts/publish-post.ts"
 *
 * The script reads from scripts/draft-post.json and publishes to Sanity.
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Import after env vars are loaded
import {
  createPost,
  uploadImageFromUrl,
  uploadImageFromFile,
  getAuthorIdBySlug,
  getCategoryIdsBySlugs,
  type PostInput,
} from "../lib/sanity/publishPost";
import { generateBlogHeroImage } from "../lib/ai/generateImage";

// Local blog images folder
const BLOG_IMAGES_DIR = path.join(process.cwd(), "assets", "blog-images");
const USED_IMAGES_FILE = path.join(BLOG_IMAGES_DIR, "used-images.json");

/**
 * Mark an image as used so it won't be picked again
 */
function markImageAsUsed(filename: string): void {
  let data = { description: "Tracks which images have been used in blog posts", used: [] as string[] };

  if (fs.existsSync(USED_IMAGES_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(USED_IMAGES_FILE, "utf-8"));
    } catch {
      // If file is corrupted, start fresh
    }
  }

  if (!data.used.includes(filename)) {
    data.used.push(filename);
    fs.writeFileSync(USED_IMAGES_FILE, JSON.stringify(data, null, 2));
  }
}

interface DraftPost {
  title: string;
  excerpt: string;
  directAnswer: string;
  tldr: string[];
  body: string;
  authorSlug?: string;
  categorySlug?: string[];
  image?: string; // Filename from assets/blog-images/ OR full URL
  imagePrompt?: string; // Generate image from prompt if no image
  imageAlt?: string;
  cta?: {
    text: string;
    url: string;
  };
  featured?: boolean;
}

const DRAFT_FILE = path.join(process.cwd(), "scripts", "draft-post.json");

async function main() {
  console.log("\n📝 Blog Post Publisher\n");

  // Check for draft file
  if (!fs.existsSync(DRAFT_FILE)) {
    console.error(`❌ No draft found at ${DRAFT_FILE}`);
    console.log("\nCreate a draft-post.json file with this structure:\n");
    console.log(
      JSON.stringify(
        {
          title: "What is the best way to automate blog posts?",
          excerpt:
            "Learn how to automate your blog publishing workflow with AI.",
          directAnswer:
            "The best way to automate blog posts is using an AI pipeline...",
          tldr: [
            "Use AI to structure content for SEO/GEO",
            "Generate hero images automatically",
            "Publish directly to your CMS via API",
          ],
          body: "## How Does Blog Automation Work?\n\nBlog automation combines...",
          authorSlug: "pete",
          categorySlug: ["ai", "automation"],
          image: "my-hero-image.png",
          imageAlt: "Blog automation workflow diagram",
          cta: {
            text: "Try our automation tool",
            url: "/contact",
          },
          featured: false,
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  // Read draft
  const draftContent = fs.readFileSync(DRAFT_FILE, "utf-8");
  let draft: DraftPost;

  try {
    draft = JSON.parse(draftContent);
  } catch {
    console.error("❌ Invalid JSON in draft-post.json");
    process.exit(1);
  }

  // Validate required fields
  const required = ["title", "excerpt", "directAnswer", "tldr", "body"];
  const missing = required.filter(
    (field) => !draft[field as keyof DraftPost]
  );
  if (missing.length > 0) {
    console.error(`❌ Missing required fields: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(`📄 Title: ${draft.title}`);
  console.log(`✍️  Author: ${draft.authorSlug || "none"}`);
  console.log(`🏷️  Categories: ${draft.categorySlug?.join(", ") || "none"}`);
  console.log(`🖼️  Image: ${draft.image ? "provided" : draft.imagePrompt ? "will generate" : "none"}`);
  console.log("");

  // Build post input
  const postInput: PostInput = {
    title: draft.title,
    excerpt: draft.excerpt,
    directAnswer: draft.directAnswer,
    tldr: draft.tldr,
    body: draft.body,
    cta: draft.cta,
    featured: draft.featured,
  };

  // Resolve author
  if (draft.authorSlug) {
    console.log(`🔍 Looking up author: ${draft.authorSlug}`);
    const authorId = await getAuthorIdBySlug(draft.authorSlug);
    if (authorId) {
      postInput.authorId = authorId;
      console.log(`   ✓ Found author: ${authorId}`);
    } else {
      console.log(`   ⚠️  Author not found, skipping`);
    }
  }

  // Resolve categories
  if (draft.categorySlug && draft.categorySlug.length > 0) {
    console.log(`🔍 Looking up categories: ${draft.categorySlug.join(", ")}`);
    const categoryIds = await getCategoryIdsBySlugs(draft.categorySlug);
    if (categoryIds.length > 0) {
      postInput.categoryIds = categoryIds;
      console.log(`   ✓ Found ${categoryIds.length} categories`);
    } else {
      console.log(`   ⚠️  No categories found, skipping`);
    }
  }

  // Handle image: local file, URL, or generate from prompt
  let imageAsset: { _ref: string } | null = null;

  if (draft.image) {
    // Check if it's a URL or a local filename
    const isUrl = draft.image.startsWith("http://") || draft.image.startsWith("https://");

    if (isUrl) {
      // Upload from URL
      console.log(`🖼️  Uploading image from URL...`);
      try {
        imageAsset = await uploadImageFromUrl(draft.image, `hero-${Date.now()}.webp`);
        console.log(`   ✓ Image uploaded`);
      } catch (err) {
        console.log(`   ⚠️  Image upload failed: ${err}`);
      }
    } else {
      // Local file from assets/blog-images/
      const localPath = path.join(BLOG_IMAGES_DIR, draft.image);
      if (fs.existsSync(localPath)) {
        console.log(`🖼️  Uploading local image: ${draft.image}`);
        try {
          imageAsset = await uploadImageFromFile(localPath);
          markImageAsUsed(draft.image);
          console.log(`   ✓ Image uploaded`);
        } catch (err) {
          console.log(`   ⚠️  Image upload failed: ${err}`);
        }
      } else {
        console.log(`   ⚠️  Local image not found: ${localPath}`);
      }
    }
  } else if (draft.imagePrompt) {
    // Generate image from prompt using Flux
    console.log(`🎨 Generating image from prompt...`);
    try {
      const generatedUrl = await generateBlogHeroImage(draft.imagePrompt);
      console.log(`   ✓ Image generated`);
      imageAsset = await uploadImageFromUrl(generatedUrl, `hero-${Date.now()}.webp`);
      console.log(`   ✓ Image uploaded`);
    } catch (err) {
      console.log(`   ⚠️  Image generation failed: ${err}`);
    }
  }

  // Attach image to post
  if (imageAsset) {
    postInput.mainImage = {
      asset: imageAsset,
      alt: draft.imageAlt || draft.title,
    };
  }

  // Create post
  console.log(`\n🚀 Publishing to Sanity...`);
  try {
    const result = await createPost(postInput);
    console.log(`\n✅ Post published successfully!`);
    console.log(`   ID: ${result._id}`);
    console.log(`   Slug: ${result.slug}`);
    console.log(`   URL: https://blog.diabolai.com/post/${result.slug}`);

    // Optionally rename draft file to indicate it's been published
    const publishedFile = DRAFT_FILE.replace(
      "draft-post.json",
      `published-${Date.now()}.json`
    );
    fs.renameSync(DRAFT_FILE, publishedFile);
    console.log(`\n📁 Draft moved to: ${path.basename(publishedFile)}`);
  } catch (err) {
    console.error(`\n❌ Failed to publish: ${err}`);
    process.exit(1);
  }
}

main();
