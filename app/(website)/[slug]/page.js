import { getAllPostsSlugs } from "@/lib/sanity/client";
import { permanentRedirect } from "next/navigation";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  permanentRedirect(`/post/sidebar/${slug}`);
}
