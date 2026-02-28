import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { urlForImage } from "@/lib/sanity/image";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import AuthorCard from "@/components/blog/authorCard";
import Sidebar from "@/components/sidebar";
import TableOfContents from "@/components/tableOfContents";

export default function Post(props) {
  const { loading, post, categories, serviceCta, genericCta } = props;

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
      <div className="relative z-0 flex min-h-[calc(100vh-30vh)] items-center overflow-hidden">
        {imageProps && (
          <div className="absolute inset-0 -z-10 before:absolute before:inset-0 before:z-10 before:bg-black/30">
            <Image
              src={imageProps.src}
              alt={post.mainImage?.alt || "Thumbnail"}
              loading="eager"
              fill
              sizes="(max-width: 1536px) 100vw, 1536px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mx-auto max-w-screen-lg px-5 py-20 text-center">
          <h1 className="text-brand-primary mb-3 mt-2 text-3xl font-semibold tracking-tight text-white lg:text-5xl lg:leading-tight">
            {post.title}
          </h1>

          <div className="mt-8 flex justify-center space-x-3 text-gray-500 ">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex gap-3">
                <div className="relative h-5 w-5 flex-shrink-0">
                  {AuthorimageProps && (
                    post?.author?.slug?.current ? (
                      <Link href={`/author/${post.author.slug.current}`}>
                        <Image
                          src={AuthorimageProps.src}
                          alt={post?.author?.name || "Author"}
                          className="rounded-full object-cover"
                          fill
                          sizes="20px"
                        />
                      </Link>
                    ) : (
                      <Image
                        src={AuthorimageProps.src}
                        alt={post?.author?.name || "Author"}
                        className="rounded-full object-cover"
                        fill
                        sizes="20px"
                      />
                    )
                  )}
                </div>
                <p className="text-gray-100 ">
                  {post?.author?.slug?.current ? (
                    <Link href={`/author/${post.author.slug.current}`}>
                      {post?.author?.name}
                    </Link>
                  ) : (
                    <span>{post?.author?.name || "Unknown author"}</span>
                  )}
                  <span className="hidden pl-2 md:inline"> ·</span>
                </p>
              </div>

              <div>
                <div className="flex flex-wrap space-x-2 text-sm md:flex-row md:items-center">
                  <time
                    className="text-gray-100 "
                    dateTime={post?.publishedAt || post._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post._createdAt),
                      "MMMM dd, yyyy"
                    )}
                  </time>
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <>
                      <span className="text-gray-100">·</span>
                      <span className="text-gray-300">
                        Updated{" "}
                        <time dateTime={post.updatedAt}>
                          {format(parseISO(post.updatedAt), "MMMM yyyy")}
                        </time>
                      </span>
                    </>
                  )}
                  <span className="text-gray-100">
                    · {post.estReadingTime || "5"} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {post?.mainImage && <MainImage image={post.mainImage} />} */}
      <div className="mx-auto mt-14 flex max-w-screen-2xl flex-col gap-5 px-5 lg:flex-row">
        {/* Left sidebar - Table of Contents */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents body={post.body} />
          </div>
        </aside>

        {/* Main article content */}
        <article className="flex-1 min-w-0">
          {/* Direct Answer for AI/SEO */}
          {post.directAnswer && (
            <div className="prose prose-lg mx-auto mb-6 dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {post.directAnswer}
              </p>
            </div>
          )}

          {/* TL;DR Section */}
          {post.tldr && post.tldr.length > 0 && (
            <div className="prose prose-lg mx-auto mb-8 border-l-4 border-orange bg-orange/5 pl-4 dark:prose-invert">
              <h2 className="mt-0 text-xl font-bold text-gray-900 dark:text-white">
                Key Takeaways
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

          <div className="prose prose-lg mx-auto my-3 dark:prose-invert prose-a:text-blue-500">
            {post.body && <PortableText value={post.body} />}
          </div>

          {/* Sources / Citations */}
          {post.sources && post.sources.length > 0 && (
            <div className="prose prose-lg mx-auto mt-10 border-t border-gray-200 pt-6 dark:border-gray-700 dark:prose-invert">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sources
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                {post.sources.map((source, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400">
                      {source.title}
                    </a>
                    {source.domain && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        — {source.domain}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-7 mt-7 flex justify-center">
            <Link
              href="/"
              className="bg-orange/10 rounded-full px-5 py-2 text-sm text-orange font-display font-semibold hover:bg-orange/20 transition-colors">
              ← View all posts
            </Link>
          </div>
          {post.author && <AuthorCard author={post.author} />}
        </article>

        {/* Right sidebar - CTAs */}
        <aside className="w-full self-start lg:w-80 shrink-0">
          <div className="sticky top-24">
            <Sidebar
              categories={categories}
              pathPrefix="sidebar"
              related={post.related.filter(
                item => item.slug.current !== slug
              )}
              serviceCta={serviceCta}
              genericCta={genericCta}
            />
          </div>
        </aside>
      </div>
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
