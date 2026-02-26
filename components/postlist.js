import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";

export default function PostList({
  post,
  aspect,
  pathPrefix,
  preloadImage
}) {
  const imageProps = post?.mainImage
    ? urlForImage(post.mainImage)
    : null;

  return (
    <div className="group cursor-pointer transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-lifted aspect-square">
      <div className="h-full rounded-md bg-white p-4 dark:bg-dark-background flex flex-col">
        <div
          className={cx(
            "relative overflow-hidden rounded-md",
            "aspect-3/2"
          )}>
          <Link
            href={`/${pathPrefix ? `${pathPrefix}/` : ""}${
              post.slug?.current
            }`}>
            {imageProps ? (
              <Image
                src={imageProps.src}
                {...(post.mainImage.blurDataURL && {
                  placeholder: "blur",
                  blurDataURL: post.mainImage.blurDataURL
                })}
                alt={post.mainImage?.alt || "Thumbnail"}
                priority={preloadImage ? true : false}
                className="object-cover transition-all"
                fill
                sizes="(max-width: 768px) 30vw, 33vw"
              />
            ) : (
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">
                <PhotoIcon />
              </span>
            )}
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <CategoryLabel categories={post.categories} />
          </div>
          <h2 className="mt-2 text-xl font-normal leading-snug tracking-wider text-near-black dark:text-gray-100">
            <Link
              href={`/${pathPrefix ? `${pathPrefix}/` : ""}${
                post.slug?.current
              }`}>
              <span>
                {post.title}
              </span>
            </Link>
          </h2>
          {post.excerpt && (
            <p className="mt-2 text-sm text-near-black/60 dark:text-white">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
