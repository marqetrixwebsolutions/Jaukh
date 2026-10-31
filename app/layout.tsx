import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./editorial.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "JOUKH — A Taste Beyond Ordinary",
    template: "%s | JOUKH",
  },
  description:
    "Rooted in tradition. Made for today. Discover the warmth of Indian hospitality and the soul of authentic flavour at JOUKH.",
  applicationName: "JOUKH",
  authors: [{ name: "JOUKH" }],
  creator: "JOUKH",
  publisher: "JOUKH",
  keywords: [
    "JOUKH",
    "Indian restaurant",
    "Indian cuisine",
    "Indian food",
    "curries",
    "biryani",
    "grilled food",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JOUKH — A Taste Beyond Ordinary",
    description:
      "Rooted in tradition. Made for today. Discover the warmth of Indian hospitality and the soul of authentic flavour at JOUKH.",
    url: "/",
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
    title: "JOUKH — A Taste Beyond Ordinary",
    description:
      "Rooted in tradition. Made for today. Discover the warmth of Indian hospitality and the soul of authentic flavour at JOUKH.",
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#100e0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
