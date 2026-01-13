import { getPostBySlug, getAllPostsSlugs } from "@/lib/sanity/client";
import { notFound } from "next/navigation";
import { urlForImage } from "@/lib/sanity/image";
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

function generateJsonLd(post) {
  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.src : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://blog.diabolai.com/${post.slug.current}#article`,
        "headline": post.title,
        "description": post.excerpt || post.directAnswer || "",
        "datePublished": post.publishedAt || post._createdAt,
        "dateModified": post._updatedAt || post.publishedAt || post._createdAt,
        "author": {
          "@type": "Person",
          "name": post.author?.name || "Diabol AI",
          ...(post.author?.slug?.current && {
            "url": `https://blog.diabolai.com/author/${post.author.slug.current}`
          }),
          ...(post.author?.linkedinUrl && {
            "sameAs": [post.author.linkedinUrl]
          })
        },
        "publisher": {
          "@type": "Organization",
          "name": "Diabol AI",
          "url": "https://www.diabolai.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.diabolai.com/logo.png"
          }
        },
        ...(imageUrl && {
          "image": {
            "@type": "ImageObject",
            "url": imageUrl
          }
        }),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://blog.diabolai.com/${post.slug.current}`
        }
      }
    ]
  };

  return jsonLd;
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Post post={post} loading={false} />
    </>
  );
}

export const revalidate = 60;
