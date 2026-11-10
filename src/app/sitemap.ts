import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours cache

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.masheco.com";

  // Google requires that all URLs in a sitemap belong to the exact same host (www.masheco.com).
  // Tenant store URLs belong in their respective store sitemaps (https://[store].masheco.com/sitemap.xml).
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    { url: `${base}/register`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${base}/landing/affiliate`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${base}/landing/about-us`, changeFrequency: "monthly", priority: 0.85, lastModified: new Date() },
    { url: `${base}/landing/contact`, changeFrequency: "monthly", priority: 0.85, lastModified: new Date() },
    { url: `${base}/landing/blog`, changeFrequency: "weekly", priority: 0.85, lastModified: new Date() },
    { url: `${base}/landing/documentation`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
    { url: `${base}/landing/book-a-demo`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/terms-of-service`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/privacy-policy`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/cookie-policy`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
    { url: `${base}/landing/account-deletion`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
  ];
}
