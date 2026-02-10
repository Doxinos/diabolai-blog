#!/usr/bin/env npx tsx

/**
 * CLI Script for Updating Existing Blog Posts in Sanity
 *
 * Usage:
 *   npx tsx scripts/update-post.ts
 *
 * Or add to package.json scripts:
 *   "update": "tsx scripts/update-post.ts"
 *
 * The script reads from scripts/update-post.json and updates the specified post.
 * Only fields present in the JSON will be updated — others remain unchanged.
 *
 * Required field: postId (the Sanity document ID)
 * Optional fields: title, excerpt, directAnswer, tldr, body, featured, cta
 *
 * If "bodyFile" is specified instead of "body", the body content will be read
 * from that file path (relative to scripts/).
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local BEFORE importing Sanity modules
config({ path: ".env.local" });

interface UpdateInput {
  postId: string;
  title?: string;
  excerpt?: string;
  directAnswer?: string;
  tldr?: string[];
  body?: string;
  bodyFile?: string; // Path to markdown file (relative to scripts/)
  featured?: boolean;
  cta?: {
    text: string;
    url: string;
  };
}

const UPDATE_FILE = path.join(process.cwd(), "scripts", "update-post.json");

async function main() {
  console.log("\n📝 Blog Post Updater\n");

  // Dynamic imports AFTER env vars are loaded
  const { updatePost } = await import("../lib/sanity/publishPost");

  // Check for update file
  if (!fs.existsSync(UPDATE_FILE)) {
    console.error(`❌ No update file found at ${UPDATE_FILE}`);
    console.log("\nCreate an update-post.json file with this structure:\n");
    console.log(
      JSON.stringify(
        {
          postId: "your-sanity-document-id",
          excerpt: "Updated excerpt text",
          body: "Updated markdown body content",
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  // Read update file
  const updateContent = fs.readFileSync(UPDATE_FILE, "utf-8");
  let input: UpdateInput;

  try {
    input = JSON.parse(updateContent);
  } catch {
    console.error("❌ Invalid JSON in update-post.json");
    process.exit(1);
  }

  // Validate required fields
  if (!input.postId) {
    console.error("❌ Missing required field: postId");
    process.exit(1);
  }

  // If bodyFile is specified, read body from that file
  if (input.bodyFile && !input.body) {
    const bodyPath = path.join(process.cwd(), "scripts", input.bodyFile);
    if (!fs.existsSync(bodyPath)) {
      console.error(`❌ Body file not found: ${bodyPath}`);
      process.exit(1);
    }
    input.body = fs.readFileSync(bodyPath, "utf-8");
    console.log(`📄 Body loaded from: ${input.bodyFile}`);
  }

  // Show what will be updated
  console.log(`🔧 Updating post: ${input.postId}`);
  const fields: string[] = [];
  if (input.title) fields.push("title");
  if (input.excerpt) fields.push("excerpt");
  if (input.directAnswer) fields.push("directAnswer");
  if (input.tldr) fields.push("tldr");
  if (input.body) fields.push("body");
  if (input.featured !== undefined) fields.push("featured");
  if (input.cta) fields.push("cta");
  console.log(`📋 Fields to update: ${fields.join(", ")}`);
  console.log("");

  // Build updates object (exclude postId and bodyFile)
  const { postId, bodyFile, ...updates } = input;

  // Run update
  console.log("🚀 Pushing update to Sanity...");
  try {
    await updatePost(postId, updates);
    console.log("\n✅ Post updated successfully!");
    console.log(`   ID: ${postId}`);
  } catch (err) {
    console.error(`\n❌ Failed to update: ${err}`);
    process.exit(1);
  }
}

main();
