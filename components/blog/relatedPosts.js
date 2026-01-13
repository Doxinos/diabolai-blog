import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import { format, parseISO } from "date-fns";
import CategoryLabel from "./category";

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Related Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 6).map((post) => (
          <RelatedPostCard key={post.slug.current} post={post} />
        ))}
      </div>
    </div>
  );
}

function RelatedPostCard({ post }) {
  const imageProps = post?.image ? urlForImage(post.image) : null;

  return (
    <div className="group">
      <Link href={`/${post.slug.current}`}>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          {imageProps ? (
            <Image
              src={imageProps.src}
              alt={post.image?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder={post.image?.blurDataURL ? "blur" : "empty"}
              blurDataURL={post.image?.blurDataURL}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3">
        {post.categories && post.categories.length > 0 && (
          <div className="mb-2">
            <CategoryLabel categories={post.categories} nomargin />
          </div>
        )}
        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <Link href={`/${post.slug.current}`}>
            {post.title}
          </Link>
        </h3>
        {post.date && (
          <time className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(post.date), "MMMM dd, yyyy")}
          </time>
        )}
      </div>
    </div>
  );
}
