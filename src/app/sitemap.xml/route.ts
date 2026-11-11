import { NextResponse } from "next/server";

/**
 * GLOBAL SITEMAP INDEX  ->  https://www.masheco.com/sitemap.xml
 *
 * Lists the platform sitemap plus the sitemap of EVERY active tenant store
 * (custom domain if verified, otherwise <slug>.masheco.com). The list is built
 * live from the backend, so a newly created store appears here automatically and
 * Googlebot discovers it on its next fetch of this one file.
 *
 * NOTE: for Google to accept cross-subdomain sitemaps, `masheco.com` must be a
 * verified *Domain property* in Search Console.
 */
export const dynamic = "force-dynamic";

const PLATFORM_ORIGIN = "https://www.masheco.com";
const BASE_DOMAIN = (process.env.NEXT_PUBLIC_BASE_DOMAIN || "masheco.com").toLowerCase();

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      default: return "&quot;";
    }
  });
}

async function fetchActiveStores(): Promise<any[]> {
  const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
  let apiUrl =
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  if (internalUrl) {
    const clean = internalUrl.replace(/\/$/, "");
    apiUrl = clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
  }

  const targets = [
    `${apiUrl}/system/active-stores`.replace("localhost", "127.0.0.1"),
    `${apiUrl}/system/active-stores`,
  ];

  for (const url of targets) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "user-agent": "Mozilla/5.0 (compatible; MashEcoSitemap/1.0)" },
      });
      if (!res.ok) continue;
      const json = await res.json();
      if (Array.isArray(json?.data)) return json.data;
    } catch {
      /* try next */
    }
  }
  return [];
}

function storeOrigin(store: any): string | null {
  const customDomain = (store.customDomain || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0];

  if (customDomain && store.domainStatus === "active") {
    return `https://${customDomain}`;
  }

  const sub = String(store.domain || store.slug || "")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(new RegExp(`\\.${BASE_DOMAIN.replace(/\./g, "\\.")}$`), "")
    .replace(/\/.*$/, "");

  if (!sub || sub === "main" || sub === "www") return null;
  return `https://${sub}.${BASE_DOMAIN}`;
}

export async function GET() {
  const stores = await fetchActiveStores();
  const nowIso = new Date().toISOString();

  const seen = new Set<string>();
  const entries: string[] = [
    `  <sitemap>\n    <loc>${PLATFORM_ORIGIN}/sitemap-main.xml</loc>\n    <lastmod>${nowIso}</lastmod>\n  </sitemap>`,
  ];

  for (const store of stores) {
    const origin = storeOrigin(store);
    if (!origin || seen.has(origin)) continue;
    seen.add(origin);
    const lastmod = store.updatedAt ? new Date(store.updatedAt).toISOString() : nowIso;
    entries.push(
      `  <sitemap>\n    <loc>${escapeXml(`${origin}/sitemap.xml`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Short cache so newly created stores show up quickly.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}

