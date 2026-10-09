import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.masheco.com";
  
  const staticPaths = [
    { url: "/", changeFrequency: "weekly", priority: 1 },
    { url: "/register", changeFrequency: "monthly", priority: 0.8 },
    { url: "/login", changeFrequency: "monthly", priority: 0.8 },
    { url: "/landing/about-us", changeFrequency: "monthly", priority: 0.7 },
    { url: "/landing/contact", changeFrequency: "monthly", priority: 0.7 },
    { url: "/landing/book-a-demo", changeFrequency: "monthly", priority: 0.7 },
    { url: "/landing/privacy-policy", changeFrequency: "monthly", priority: 0.5 },
    { url: "/landing/cookie-policy", changeFrequency: "monthly", priority: 0.5 },
  ] as const;

  return staticPaths.map((route) => ({
    url: `${base}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
