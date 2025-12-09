#!/usr/bin/env npx tsx

/**
 * Delete all test posts, keeping only the original one
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { writeClient } from "../lib/sanity/writeClient";

const KEEP_POST_TITLE = "Beyond ChatGPT: Why SMBs Need Strategic AI Transformation Now";

async function main() {
  console.log("\n🧹 Cleaning up test posts...\n");

  // Get all posts
  const posts = await writeClient.fetch(`
    *[_type == "post"] {
      _id,
      title,
      "slug": slug.current
    }
  `);

  const toDelete = posts.filter((p: { title: string }) => p.title !== KEEP_POST_TITLE);

  if (toDelete.length === 0) {
    console.log("No test posts to delete.");
    return;
  }

  console.log(`Found ${toDelete.length} test posts to delete:\n`);

  for (const post of toDelete) {
    console.log(`🗑️  Deleting: ${post.title}`);
    await writeClient.delete(post._id);
    console.log(`   ✓ Deleted`);
  }

  console.log(`\n✅ Cleaned up ${toDelete.length} test posts.`);
  console.log(`📄 Kept: "${KEEP_POST_TITLE}"`);
}

main();
