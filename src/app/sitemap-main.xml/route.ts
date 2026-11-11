import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://www.masheco.com";

const PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/register", changefreq: "weekly", priority: "0.9" },
  { path: "/landing/affiliate", changefreq: "weekly", priority: "0.9" },
  { path: "/landing/about-us", changefreq: "monthly", priority: "0.85" },
  { path: "/landing/contact", changefreq: "monthly", priority: "0.85" },
  { path: "/landing/blog", changefreq: "weekly", priority: "0.85" },
  { path: "/landing/documentation", changefreq: "weekly", priority: "0.8" },
  { path: "/landing/book-a-demo", changefreq: "monthly", priority: "0.7" },
  { path: "/landing/terms-of-service", changefreq: "monthly", priority: "0.7" },
  { path: "/landing/privacy-policy", changefreq: "monthly", priority: "0.7" },
  { path: "/landing/cookie-policy", changefreq: "monthly", priority: "0.6" },
  { path: "/landing/account-deletion", changefreq: "monthly", priority: "0.6" },
];

/** Platform (masheco.com) pages only. Tenant stores are listed in the global sitemap index. */
export async function GET() {
  const now = new Date().toISOString();
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${BASE}${p.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

