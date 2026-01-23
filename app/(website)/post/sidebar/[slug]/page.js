import PostPage from "./sidebar";

import {
  getAllPostsSlugs,
  getPostBySlug,
  getTopCategories,
  getServiceCta,
  getGenericCta,
} from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post.title };
}

export default async function PostDefault({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const categories = await getTopCategories();

  // Get CTAs for sidebar
  const categoryIds = post.categories?.map(cat => cat._id) || [];
  const [serviceCta, genericCta] = await Promise.all([
    getServiceCta(categoryIds),
    getGenericCta()
  ]);

  return <PostPage post={post} categories={categories} serviceCta={serviceCta} genericCta={genericCta} />;
}

// export const revalidate = 60;
