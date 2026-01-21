import Author from "./author";

import { getAllAuthorsSlugs, getAuthorPostsBySlug } from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllAuthorsSlugs();
}

async function getAuthor(slug) {
  const posts = await getAuthorPostsBySlug(slug);
  return posts?.[0]?.author || {};
}

export async function generateMetadata({ params }) {
  const { author } = await params;
  const authorData = await getAuthor(author);
  return { title: authorData.title };
}

export default async function AuthorPage({ params }) {
  const { author } = await params;
  const posts = await getAuthorPostsBySlug(author);
  const authorData = await getAuthor(author);
  return <Author posts={posts} author={authorData} />;
}

// export const revalidate = 60;
