import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.masheco.com";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/landing/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/landing/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
