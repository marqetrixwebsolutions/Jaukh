import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.origin,
      priority: 1,
    },
    {
      url: new URL("/menu", siteUrl).toString(),
      priority: 0.8,
    },
    {
      url: new URL("/contact", siteUrl).toString(),
      priority: 0.5,
    },
  ];
}
