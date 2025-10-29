import { getPostBySlug, getAllPostsSlugs } from "@/lib/sanity/client";
import { notFound } from "next/navigation";
import Post from "./default";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return { 
    title: post?.title || "Blog Post", 
    description: post?.excerpt || post?.metaDescription 
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  return <Post post={post} loading={false} />;
}

export const revalidate = 60;
