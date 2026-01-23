import SearchInput from "@/components/ui/search";
import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import Label from "@/components/ui/label";
import DateTime from "@/components/ui/time";
import SidebarCta from "@/components/sidebarCta";

export default function Sidebar(props) {
  return (
    <div className="mt-5 font-sans">
      <Searchbar />

      {props.related && (
        <RelatedPosts
          related={props.related}
          pathPrefix={props.pathPrefix}
        />
      )}

      {/* Service-specific CTA */}
      {props.serviceCta && (
        <div className="mt-10">
          <SidebarCta
            headline={props.serviceCta.headline}
            body={props.serviceCta.body}
            buttonText={props.serviceCta.buttonText}
            buttonUrl={props.serviceCta.buttonUrl}
            variant="primary"
          />
        </div>
      )}

      {props.categories && (
        <Categories categories={props.categories} />
      )}

      {/* Generic CTA (book a call) */}
      {props.genericCta && props.genericCta.headline && (
        <div className="mt-10">
          <SidebarCta
            headline={props.genericCta.headline}
            body={props.genericCta.body}
            buttonText={props.genericCta.buttonText}
            buttonUrl={props.genericCta.buttonUrl}
            variant="secondary"
          />
        </div>
      )}
    </div>
  );
}

function Searchbar() {
  return (
    <div>
      <h3 className="text-2xl font-bold dark:text-white">
        Search Posts
      </h3>
      <form action="/search" method="GET" className="mt-4">
        <SearchInput placeholder="Search" />
      </form>
    </div>
  );
}

function RelatedPosts({ related, pathPrefix }) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold dark:text-white">Related</h3>
      <div className="grid gap-6 mt-6">
        {related.slice(0, 3).map((item, index) => {
          const imageProps = item?.image ? urlForImage(item.image) : null;
          return (
            <Link
              key={index}
              href={`/${pathPrefix ? `${pathPrefix}/` : ""}${
                item.slug.current
              }`}>
              <div className="flex gap-5">
                <div className="relative w-24 h-20 overflow-hidden rounded-md shrink-0">
                  {imageProps ? (
                    <Image
                      src={imageProps.src}
                      loader={imageProps.loader}
                      alt={item.title || "Thumbnail"}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    <DateTime date={item.date} />
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Categories({ categories }) {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold dark:text-white">
        Categories
      </h3>
      <ul className="grid mt-4">
        {categories.map((item, index) => (
          <li key={item._id}>
            <Link
              href={`/category/${item.slug.current}`}
              className="flex items-center justify-between py-2">
              <h4 className="text-gray-800 dark:text-gray-400">
                {item.title}
              </h4>
              <Label pill={true} color={item.color}>
                {item.count}
              </Label>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
