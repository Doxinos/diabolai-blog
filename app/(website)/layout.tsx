import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Poppins, Roboto } from "next/font/google";
import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import GetNavbar from "@/components/getnavbar";
import { urlForImage } from "@/lib/sanity/image";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"]
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500"]
});

async function sharedMetaData(params: any) {
  const settings = await getSettings();
  const siteUrl = process.env.SITE_URL || settings?.url || "http://localhost:3000";

  return {
    // enable this for resolving opengraph images
    metadataBase: new URL(siteUrl),
    title: {
      default:
        settings?.title ||
        "Stablo Pro - Blog Template for Next.js & Sanity CMS",
      template: "%s | Stablo"
    },
    description:
      settings?.description ||
      "Pro version of Stablo, popular open-source next.js and sanity blog template",
    keywords: ["Next.js", "Sanity", "Tailwind CSS"],
    authors: [{ name: "Surjith" }],
    canonical: settings?.url,
    openGraph: {
      images: [
        {
          url:
            urlForImage(settings?.openGraphImage)?.src ||
            "/img/opengraph.jpg",
          width: 800,
          height: 600
        }
      ]
    },
    twitter: {
      title: settings?.title || "Stablo Template",
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata({ params }: any) {
  return await sharedMetaData(params);
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any;
}) {
  const settings = await getSettings();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(poppins.variable, roboto.variable)}>
      <body className="text-gray-800 antialiased dark:bg-dark-background dark:text-gray-400">
        <Providers>
          <GetNavbar {...settings} />
          <main>{children}</main>
          <Footer {...settings} />
        </Providers>
      </body>
    </html>
  );
}

export const revalidate = 86400;
