import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./config";

/**
 * Sanity client with write access for publishing posts
 * Requires SANITY_WRITE_TOKEN environment variable
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false, // Write operations cannot use CDN
});

/**
 * Check if write client is properly configured
 */
export function isWriteClientConfigured(): boolean {
  return !!process.env.SANITY_WRITE_TOKEN;
}
