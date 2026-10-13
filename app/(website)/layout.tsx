import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import GetNavbar from "@/components/getnavbar";
import { urlForImage } from "@/lib/sanity/image";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-WLJQP76D6X";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

// Appended to every page title, e.g. "Why Voice AI Latency Matters | Diabol AI".
// Kept short on purpose: Google truncates titles at roughly 60 characters.
const SITE_NAME = "Diabol AI";

async function sharedMetaData(params: any) {
  const settings = await getSettings();
  const siteUrl = process.env.SITE_URL || settings?.url || "http://localhost:3000";

  return {
    // enable this for resolving opengraph images
    metadataBase: new URL(siteUrl),
    title: {
      default: settings?.title || "Diabol AI Blog",
      template: `%s | ${SITE_NAME}`
    },
    description:
      settings?.description ||
      "AI insights for ambitious founders. Tools, workflows and lessons learned, shared as I build.",
    keywords: ["AI", "artificial intelligence", "automation", "AI voice agents", "business automation", "AI tools for SMBs"],
    authors: [{ name: SITE_NAME }],
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
      title: settings?.title || "Diabol AI Blog",
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
      className={cx(inter.variable, jetbrains.variable)}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="font-display text-near-black antialiased bg-westar dark:bg-dark-background dark:text-gray-400">
        <Providers>
          <GetNavbar {...settings} />
          <main className="pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export const revalidate = 86400;
