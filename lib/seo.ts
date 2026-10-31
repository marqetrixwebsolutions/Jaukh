import type { Metadata } from "next";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const pageTitle = `${title} | JOUKH`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      siteName: "JOUKH",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/images/hero.jpg",
          alt: "JOUKH Indian Restaurant",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ["/images/hero.jpg"],
    },
  };
}
