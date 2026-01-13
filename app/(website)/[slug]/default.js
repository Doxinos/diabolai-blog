import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";

import CategoryLabel from "@/components/blog/category";
import AuthorCard from "@/components/blog/authorCard";
import RelatedPosts from "@/components/blog/relatedPosts";
import TableOfContents from "@/components/blog/tableOfContents";

export default function Post(props) {
  const { loading, post } = props;

  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = post?.mainImage
    ? urlForImage(post?.mainImage)
    : null;

  const AuthorimageProps = post?.author?.image
    ? urlForImage(post.author.image)
    : null;

  return (
    <>
      <Container className="!pt-0">
        <div className="max-w-screen-md ">
          <div className="flex justify-start">
            <CategoryLabel categories={post.categories} />
          </div>

          <h1 className="text-brand-primary mb-3 mt-2 text-left text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
            {post.title}
          </h1>

          <div className="mt-3 mb-8 flex justify-start space-x-3 text-gray-500 ">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                {AuthorimageProps && (
                  post?.author?.slug?.current ? (
                    <Link href={`/author/${post.author.slug.current}`}>
                      <Image
                        src={AuthorimageProps.src}
                        alt={post?.author?.name || "Author"}
                        className="rounded-full object-cover"
                        fill
                        sizes="40px"
                      />
                    </Link>
                  ) : (
                    <Image
                      src={AuthorimageProps.src}
                      alt={post?.author?.name || "Author"}
                      className="rounded-full object-cover"
                      fill
                      sizes="40px"
                    />
                  )
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 dark:text-gray-400">
                    {post?.author?.slug?.current ? (
                      <Link href={`/author/${post.author.slug.current}`}>
                        {post?.author?.name}
                      </Link>
                    ) : (
                      <span>{post?.author?.name || "Unknown author"}</span>
                    )}
                  </p>
                  {post?.author?.linkedinUrl && (
                    <a
                      href={post.author.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
                      aria-label={`${post.author.name} on LinkedIn`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {post?.author?.twitterUrl && (
                    <a
                      href={post.author.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white"
                      aria-label={`${post.author.name} on X`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>
                {post?.author?.title && (
                  <p className="text-sm text-gray-600 dark:text-gray-500">
                    {post.author.title}
                  </p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <time
                    className="text-gray-500 dark:text-gray-400"
                    dateTime={post?.publishedAt || post._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post._createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  <span>· {post.estReadingTime || "5"} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
        {imageProps && (
          <Image
            src={imageProps.src}
            alt={post.mainImage?.alt || "Thumbnail"}
            loading="eager"
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <Container>
        <div className="mx-auto max-w-screen-xl">
          <div className="flex gap-10 lg:gap-16">
            {/* Main article content */}
            <article className="min-w-0 max-w-screen-md flex-1">
              {/* Direct Answer for AI/SEO */}
              {post.directAnswer && (
                <div className="prose mb-6 dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    {post.directAnswer}
                  </p>
                </div>
              )}

              {/* TL;DR Section */}
              {post.tldr && post.tldr.length > 0 && (
                <div className="prose mb-8 border-l-4 border-blue-500 pl-4 dark:prose-invert">
                  <h2 id="tldr" className="mt-0 text-xl font-bold text-gray-900 dark:text-white">
                    TL;DR
                  </h2>
                  <ul className="mb-0 list-disc space-y-1 pl-5">
                    {post.tldr.map((item, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="prose my-3 dark:prose-invert prose-a:text-blue-600">
                {post.body && <PortableText value={post.body} />}
              </div>
              <div className="mb-7 mt-7 flex justify-start">
                <Link
                  href="/"
                  className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 ">
                  ← View all posts
                </Link>
              </div>
              {post.author && <AuthorCard author={post.author} />}
              {post.related && post.related.length > 0 && (
                <RelatedPosts posts={post.related} />
              )}
            </article>

            {/* Table of Contents sidebar */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <TableOfContents body={post.body} tldr={post.tldr} />
            </aside>
          </div>
        </div>
      </Container>
    </>
  );
}

const MainImage = ({ image }) => {
  return (
    <div className="mb-12 mt-12 ">
      <Image {...urlForImage(image)} alt={image.alt || "Thumbnail"} />
      <figcaption className="text-center ">
        {image.caption && (
          <span className="text-sm italic text-gray-600 dark:text-gray-400">
            {image.caption}
          </span>
        )}
      </figcaption>
    </div>
  );
};
