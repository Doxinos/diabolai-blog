#!/usr/bin/env npx tsx

/**
 * Appends FAQ sections to existing blog posts without replacing the body.
 *
 * Usage:
 *   npx tsx scripts/append-faq.ts
 *
 * Reads from scripts/faq-batch.json:
 * [
 *   {
 *     "postId": "abc123",
 *     "faqFile": "faq-post-name.md",
 *     "keywords": ["keyword1", "keyword2"],  // optional
 *     "sources": [{ "title": "...", "url": "...", "domain": "..." }]  // optional
 *   }
 * ]
 *
 * The FAQ markdown should contain H2 "Frequently Asked Questions" with H3 questions.
 * It will be appended to the existing body content.
 */

import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

interface FaqEntry {
  postId: string;
  faqFile: string;
  keywords?: string[];
  sources?: { title: string; url: string; domain?: string }[];
}

const BATCH_FILE = path.join(process.cwd(), "scripts", "faq-batch.json");

async function main() {
  console.log("\n📝 FAQ Batch Appender\n");

  const { writeClient } = await import("../lib/sanity/writeClient");
  const { markdownToBlocks } = await import("../lib/sanity/markdownToBlocks");

  if (!fs.existsSync(BATCH_FILE)) {
    console.error(`❌ No batch file found at ${BATCH_FILE}`);
    process.exit(1);
  }

  const entries: FaqEntry[] = JSON.parse(fs.readFileSync(BATCH_FILE, "utf-8"));
  console.log(`Found ${entries.length} posts to update\n`);

  for (const entry of entries) {
    try {
      // Read FAQ markdown
      const faqPath = path.join(process.cwd(), "scripts", "faqs", entry.faqFile);
      if (!fs.existsSync(faqPath)) {
        console.error(`  ❌ FAQ file not found: ${entry.faqFile}`);
        continue;
      }
      const faqMarkdown = fs.readFileSync(faqPath, "utf-8");

      // Fetch existing post body
      const post = await writeClient.fetch(
        `*[_id == $id][0] { title, body }`,
        { id: entry.postId }
      );

      if (!post) {
        console.error(`  ❌ Post not found: ${entry.postId}`);
        continue;
      }

      console.log(`🔧 ${post.title}`);

      // Check if FAQ already exists in body
      const hasFaq = post.body?.some(
        (block: any) =>
          block.style === "h2" &&
          block.children?.some((child: any) =>
            child.text?.toLowerCase().includes("frequently asked questions")
          )
      );

      if (hasFaq) {
        console.log(`  ⏭️  Already has FAQ section, skipping body update`);
      } else {
        // Convert FAQ markdown to blocks and append
        const faqBlocks = markdownToBlocks(faqMarkdown);
        const updatedBody = [...(post.body || []), ...faqBlocks];

        await writeClient.patch(entry.postId).set({
          body: updatedBody,
          updatedAt: new Date().toISOString(),
        }).commit();

        console.log(`  ✅ FAQ appended (${faqBlocks.length} blocks)`);
      }

      // Add keywords if provided and post doesn't have them
      if (entry.keywords && entry.keywords.length > 0) {
        await writeClient.patch(entry.postId).set({
          keywords: entry.keywords,
        }).commit();
        console.log(`  ✅ Keywords added (${entry.keywords.length})`);
      }

      // Add sources if provided and post doesn't have them
      if (entry.sources && entry.sources.length > 0) {
        await writeClient.patch(entry.postId).set({
          sources: entry.sources.map((s, i) => ({
            _type: "object",
            _key: `source-${i}`,
            title: s.title,
            url: s.url,
            ...(s.domain && { domain: s.domain }),
          })),
        }).commit();
        console.log(`  ✅ Sources added (${entry.sources.length})`);
      }

      console.log("");
    } catch (err) {
      console.error(`  ❌ Failed: ${err}`);
      console.log("");
    }
  }

  console.log("Done!");
}

main();
