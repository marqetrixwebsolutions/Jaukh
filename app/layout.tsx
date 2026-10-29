import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./editorial.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOUKH — A Taste Beyond Ordinary",
  description:
    "Rooted in tradition. Made for today. Discover the warmth of Indian hospitality and the soul of authentic flavour at JOUKH.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body>{children}</body>
    </html>
  );
}
