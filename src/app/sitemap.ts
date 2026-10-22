import type { MetadataRoute } from "next";

interface ActiveStore {
  name: string;
  slug: string;
  domain?: string | null;
  customDomain?: string | null;
  domainStatus?: string | null;
  updatedAt?: string;
  description?: string;
}

export const revalidate = 3600; // Revalidate sitemap every hour

async function fetchActiveStores(): Promise<ActiveStore[]> {
  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, "");
      apiUrl = clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
    }

    const fetchUrl = `${apiUrl}/system/active-stores`.replace("localhost", "127.0.0.1");
    const res = await fetch(fetchUrl, {
      next: { revalidate: 3600 },
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; MashEcoSitemap/1.0)",
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    // Fail gracefully during static build or if backend is offline
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.masheco.com";

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    { url: `${base}/register`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${base}/login`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
    { url: `${base}/landing/documentation`, changeFrequency: "weekly", priority: 0.85, lastModified: new Date() },
    { url: `${base}/landing/about-us`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
    { url: `${base}/landing/contact`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
    { url: `${base}/landing/blog`, changeFrequency: "weekly", priority: 0.75, lastModified: new Date() },
    { url: `${base}/landing/book-a-demo`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/terms-of-service`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/privacy-policy`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/landing/cookie-policy`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
    { url: `${base}/landing/account-deletion`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
  ];

  // Fetch all active merchant stores from backend for autonomous Google crawl discovery
  const activeStores = await fetchActiveStores();

  const storeRoutes: MetadataRoute.Sitemap = activeStores.flatMap((store) => {
    // If merchant has an active, verified custom domain, point Google to custom domain
    // If not, point Google to their tenant subdomain: https://${subdomain}.masheco.com
    const hasActiveCustomDomain =
      store.customDomain &&
      store.domainStatus === "active" &&
      store.customDomain.trim() !== "";

    const cleanCustomDomain = store.customDomain
      ? store.customDomain.trim().toLowerCase().replace(/^www\./, "")
      : "";

    // Direct 'domain' field from database is the merchant's subdomain
    const rawDomain = (store.domain || store.slug || "").toLowerCase().trim();
    if (!rawDomain && !hasActiveCustomDomain) return [];

    const subdomain = rawDomain
      .replace(/\.masheco\.com$/, "")
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .trim();

    const storeOrigin = hasActiveCustomDomain
      ? `https://${cleanCustomDomain}`
      : `https://${subdomain}.masheco.com`;

    const lastMod = store.updatedAt ? new Date(store.updatedAt) : new Date();

    return [
      {
        url: `${storeOrigin}/`,
        lastModified: lastMod,
        changeFrequency: "daily" as const,
        priority: 0.85,
      },
      {
        url: `${storeOrigin}/products`,
        lastModified: lastMod,
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${storeOrigin}/categories`,
        lastModified: lastMod,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      },
      {
        url: `${storeOrigin}/sitemap.xml`,
        lastModified: lastMod,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];
  });

  return [...staticPaths, ...storeRoutes];
}
