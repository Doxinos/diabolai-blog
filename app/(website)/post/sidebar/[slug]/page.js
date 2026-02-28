import PostPage from "./sidebar";

import {
  getAllPostsSlugs,
  getPostBySlug,
  getTopCategories,
  getServiceCta,
  getGenericCta,
} from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.src : null;

  return {
    title: post?.title || "Blog Post",
    description: post?.excerpt || post?.directAnswer,
    keywords: post?.keywords || [],
    openGraph: {
      title: post?.title,
      description: post?.excerpt || post?.directAnswer,
      type: "article",
      publishedTime: post?.publishedAt || post?._createdAt,
      ...(post?.updatedAt && { modifiedTime: post.updatedAt }),
      authors: post?.author?.name ? [post.author.name] : ["Diabol AI"],
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post?.mainImage?.alt || post?.title,
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

function extractFaqFromBody(body) {
  if (!body || !Array.isArray(body)) return [];

  const faqs = [];
  let inFaqSection = false;
  let currentQuestion = null;

  for (const block of body) {
    const text = block.children?.map(c => c.text).join("") || "";

    if (block.style === "h2" && text.toLowerCase().includes("frequently asked questions")) {
      inFaqSection = true;
      continue;
    }

    if (inFaqSection && block.style === "h2") {
      break;
    }

    if (inFaqSection && block.style === "h3") {
      if (currentQuestion) {
        faqs.push(currentQuestion);
      }
      currentQuestion = { question: text, answer: "" };
    } else if (inFaqSection && currentQuestion && block.style === "normal") {
      if (currentQuestion.answer) currentQuestion.answer += " ";
      currentQuestion.answer += text;
    }
  }

  if (currentQuestion) {
    faqs.push(currentQuestion);
  }

  return faqs;
}

function generateJsonLd(post, slug) {
  const imageUrl = post?.mainImage ? urlForImage(post.mainImage)?.src : null;
  const postSlug = post?.slug?.current || slug;

  const graph = [
    {
      "@type": "Article",
      "@id": `https://blog.diabolai.com/post/sidebar/${postSlug}#article`,
      "headline": post.title,
      "description": post.excerpt || post.directAnswer || "",
      "datePublished": post.publishedAt || post._createdAt,
      "dateModified": post.updatedAt || post.publishedAt || post._createdAt,
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
        "@id": `https://blog.diabolai.com/post/sidebar/${postSlug}`
      }
    }
  ];

  const faqs = extractFaqFromBody(post.body);
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `https://blog.diabolai.com/post/sidebar/${postSlug}#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
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

  const jsonLd = generateJsonLd(post, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostPage post={post} categories={categories} serviceCta={serviceCta} genericCta={genericCta} />
    </>
  );
}

// export const revalidate = 60;
