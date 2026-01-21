import { getPostBySlug, getAllPostsSlugs } from "@/lib/sanity/client";
import { notFound } from "next/navigation";
import { urlForImage } from "@/lib/sanity/image";
import Post from "./default";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.src : null;

  return {
    title: post?.title || "Blog Post",
    description: post?.excerpt || post?.metaDescription,
    openGraph: {
      title: post?.title,
      description: post?.excerpt || post?.directAnswer,
      type: "article",
      publishedTime: post?.publishedAt || post?._createdAt,
      authors: post?.author?.name ? [post.author.name] : ["Diabol AI"],
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post?.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title,
      description: post?.excerpt || post?.directAnswer,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

function generateJsonLd(post, slug) {
  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.src : null;
  const postSlug = post?.slug?.current || slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://blog.diabolai.com/${postSlug}#article`,
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
          "@id": `https://blog.diabolai.com/${postSlug}`
        }
      }
    ]
  };

  return jsonLd;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, slug);

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
