import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & E-Commerce Guides | MASH ECO",
  description:
    "The Merchant's Journal — Insights, updates, courier strategies, and proven tactics to help you scale your online store in Bangladesh.",
  keywords: [
    "MASH ECO Blog",
    "ecommerce tips Bangladesh",
    "courier automation",
    "online business guides",
    "sell online Bangladesh",
  ],
  openGraph: {
    title: "Blog & E-Commerce Guides | MASH ECO",
    description:
      "Insights, updates, courier strategies, and proven tactics to help you scale your online store in Bangladesh.",
    url: "https://www.masheco.com/landing/blog",
    siteName: "MASH ECO",
    type: "website",
  },
  alternates: {
    canonical: "https://www.masheco.com/landing/blog",
  },
};

interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  author: string;
  authorRole?: string;
  readTime: string;
  views: number;
  publishedAt?: string;
  featured?: boolean;
}

interface BlogApiResponse {
  data: IBlogPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const FALLBACK_BLOGS: IBlogPost[] = [
  {
    _id: "fb-1",
    title: "কুরিয়ার অটোমেশন: ম্যানুয়াল এন্ট্রি ছাড়া দ্রুত পার্সেল ডেলিভারি",
    slug: "courier-automation-fast-delivery-bangladesh",
    excerpt:
      "পাঠাও, রেডএক্স ও স্টিডফাস্ট কুরিয়ারের সাথে ওয়ান-ক্লিক অটোমেশন। কাস্টমার অ্যাড্রেস স্বয়ংক্রিয়ভাবে সাবমিট ও ট্র্যাক করুন।",
    category: "Product Update",
    author: "MASH ECO Team",
    authorRole: "Product & Engineering",
    readTime: "৪ মিনিট",
    views: 342,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  },
  {
    _id: "fb-2",
    title: "অর্ডারের ড্রপ-আউট কমিয়ে বিক্রয় দ্বিগুণ করার সহজ উপায়",
    slug: "how-to-reduce-abandoned-checkout-leads-bangla",
    excerpt:
      "চেকআউট পেজে কাস্টমার এসে কেন ড্রপ আউট হয়? লিড ক্যাপচার করে হোয়াটসঅ্যাপে ফলো-আপ করে হারিয়ে যাওয়া সেল ফিরিয়ে আনুন।",
    category: "E-commerce Tips",
    author: "সাব্বির আহমেদ",
    authorRole: "Growth Strategist",
    readTime: "৫ মিনিট",
    views: 489,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
  },
  {
    _id: "fb-3",
    title: "অনলাইন স্টোর দ্রুত স্কেল করার ৫টি কার্যকর কৌশল",
    slug: "top-5-strategies-to-scale-online-store-bangla",
    excerpt:
      "ফেসবুক পেজ নির্ভরতা কাটিয়ে নিজের ব্র্যান্ডেড ডোমেইন, মেটা পিক্সেল ট্র্যাকিং এবং রিটার্ন পার্সেল কমানোর সেরা কৌশল।",
    category: "Business Growth",
    author: "মোহাম্মদ মহসিন",
    authorRole: "Business Advisory",
    readTime: "৬ মিনিট",
    views: 512,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
  {
    _id: "fb-4",
    title: "রিটার্ন পার্সেল (RTO) ও ডেলিভারি লস কমানোর গাইড",
    slug: "complete-guide-to-setting-up-cod-and-fraud-prevention-bangla",
    excerpt:
      "ক্যাশ অন ডেলিভারিতে ফেক অর্ডার শনাক্ত করা ও কাস্টমার ফ্রড স্কোরিংয়ের মাধ্যমে ডেলিভারি চার্জের ক্ষতি বাঁচান।",
    category: "Guides",
    author: "MASH ECO Team",
    authorRole: "Security & Operations",
    readTime: "৪ মিনিট",
    views: 298,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
  {
    _id: "fb-5",
    title: "ফেসবুক পেজ থেকে প্রফেশনাল অনলাইন শপ চালুর নিয়ম",
    slug: "facebook-page-to-branded-ecommerce-store",
    excerpt:
      "কোনো কোডিং ছাড়া মাত্র ৫ মিনিটে লাইভ করুন আপনার ই-কমার্স ওয়েবসাইট। কাস্টম ডোমেইন ও প্রিমিয়াম থিম রেডি।",
    category: "Tutorial",
    author: "MASH ECO Team",
    authorRole: "Product & Support",
    readTime: "৩ মিনিট",
    views: 180,
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
  {
    _id: "fb-6",
    title: "বিকাশ ও নগদ মার্চেন্ট পেমেন্ট অটোমেশন",
    slug: "bkash-nagad-manual-payment-verification-automation",
    excerpt:
      "ম্যানুয়াল স্ক্রিনশট চেক করার ঝামেলা শেষ। ট্রানজেকশন আইডি (TrxID) দিয়ে নিমিষেই অর্ডার কনফার্মেশন।",
    category: "Case Study",
    author: "সাব্বির আহমেদ",
    authorRole: "FinTech Specialist",
    readTime: "৪ মিনিট",
    views: 220,
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
  },
];

const CATEGORIES = [
  "All",
  "Product Update",
  "E-commerce Tips",
  "Business Growth",
  "Guides",
  "Tutorial",
  "Case Study",
];

async function fetchPublicBlogs(
  page = 1,
  limit = 6,
  category = "All",
  search = ""
): Promise<BlogApiResponse> {
  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, "");
      apiUrl = clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
    }

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (category && category !== "All") params.append("category", category);
    if (search.trim()) params.append("search", search.trim());

    const urlPrimary = `${apiUrl}/blogs/public-blogs?${params.toString()}`.replace("localhost", "127.0.0.1");
    const urlAlt = `${apiUrl}/blogs/public-blogs?${params.toString()}`;

    let res = await fetch(urlPrimary, { cache: "no-store" }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(urlAlt, { cache: "no-store" }).catch(() => null);
    }

    if (res && res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data) && json.data.length > 0) {
        return {
          data: json.data,
          meta: json.meta || {
            page,
            limit,
            total: json.data.length,
            totalPages: Math.ceil(json.data.length / limit),
          },
        };
      }
    }
  } catch (err) {
    console.error("[Blog SSR] Error fetching public blogs:", err);
  }

  // Filter fallback blogs if search or category is active
  let filteredFallback = [...FALLBACK_BLOGS];
  if (category && category !== "All") {
    filteredFallback = filteredFallback.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredFallback = filteredFallback.filter(
      (b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)
    );
  }

  const total = filteredFallback.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  const paged = filteredFallback.slice(start, start + limit);

  return {
    data: paged,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(Number(resolvedParams?.page) || 1, 1);
  const currentCategory = resolvedParams?.category || "All";
  const currentSearch = resolvedParams?.search || "";

  const { data: blogs, meta } = await fetchPublicBlogs(
    currentPage,
    6,
    currentCategory,
    currentSearch
  );

  const getPageUrl = (p: number, cat = currentCategory, search = currentSearch) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (cat && cat !== "All") params.set("category", cat);
    if (search.trim()) params.set("search", search.trim());
    const str = params.toString();
    return str ? `/landing/blog?${str}` : `/landing/blog`;
  };

  const getCategoryClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "product update":
        return "bg-sky-50 text-sky-700 border-sky-200/80";
      case "e-commerce tips":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "business growth":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "guides":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "tutorial":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "case study":
        return "bg-teal-50 text-teal-700 border-teal-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/80";
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "MASH ECO",
        item: "https://www.masheco.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.masheco.com/landing/blog",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      {/* Main Container - Compact spacing directly under Navbar matching user's design */}
      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Top Filter & Search Bar - Rounded card layout */}
          <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/80 shadow-xs mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Category Filter Pills (Horizontal scrollable on mobile/xs) */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-1 px-1">
                {CATEGORIES.map((cat) => {
                  const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <Link
                      key={cat}
                      href={getPageUrl(1, cat, currentSearch)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                        isActive
                          ? "bg-[#122846] text-white border-[#122846] shadow-xs"
                          : "bg-slate-50/80 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>

              {/* Search Bar Input */}
              <form
                method="GET"
                action="/landing/blog"
                className="relative w-full md:w-64 lg:w-72 shrink-0"
              >
                {currentCategory !== "All" && (
                  <input type="hidden" name="category" value={currentCategory} />
                )}
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="search"
                  defaultValue={currentSearch}
                  placeholder="Search articles..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-colors"
                />
              </form>
            </div>

            {/* Active Filter Indicators */}
            {(currentCategory !== "All" || currentSearch) && (
              <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Active filters:</span>
                {currentCategory !== "All" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    Category: {currentCategory}
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    Search: "{currentSearch}"
                  </span>
                )}
                <Link
                  href="/landing/blog"
                  className="text-[11px] font-bold text-rose-600 hover:underline ml-1"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>

          {/* Articles Grid - Starts responsive from xs screen */}
          {blogs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
              <h3 className="text-base sm:text-lg font-bold text-slate-800">No articles found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't find any articles matching your search or category filter.
              </p>
              <Link
                href="/landing/blog"
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0284c7] text-white font-bold text-xs hover:bg-[#0369a1] transition-colors"
              >
                View all articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {blogs.map((blog, idx) => (
                <article
                  key={blog._id || idx}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  {/* Card Cover Banner */}
                  <Link href={`/landing/blog/${blog.slug}`} className="block relative overflow-hidden shrink-0">
                    <div className="h-44 sm:h-48 w-full bg-gradient-to-br from-[#122846] via-[#0369a1] to-[#0284c7] relative flex items-center justify-center p-4 group-hover:scale-102 transition-transform duration-500">
                      {blog.thumbnail ? (
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-white/95">
                          <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 mx-auto text-sky-200 mb-1.5 opacity-90" />
                          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-sky-100 font-semibold block">
                            MASH ECO JOURNAL
                          </span>
                        </div>
                      )}

                      {/* Featured Pill Badge */}
                      {blog.featured && (
                        <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 fill-current" />
                          <span>FEATURED</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category Badge & Read Time Row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryClass(
                            blog.category
                          )}`}
                        >
                          {blog.category}
                        </span>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{blog.readTime || "4 min read"}</span>
                        </div>
                      </div>

                      {/* Article Title - Compact, Crisp, Readable */}
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug tracking-tight group-hover:text-[#0284c7] transition-colors mb-2 line-clamp-2">
                        <Link href={`/landing/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      {/* Excerpt - Concise and neat */}
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Card Footer (Author & Action) */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] uppercase shrink-0">
                          {(blog.author || "M").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] sm:text-xs font-semibold text-slate-800 truncate">
                            {blog.author || "MASH ECO"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/landing/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline shrink-0"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="mt-10 sm:mt-12 bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                Page <strong className="text-slate-900 font-bold">{meta.page}</strong> of{" "}
                <strong className="text-slate-900 font-bold">{meta.totalPages}</strong> (
                {meta.total} articles)
              </div>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {/* Previous Button */}
                <Link
                  href={getPageUrl(Math.max(meta.page - 1, 1))}
                  aria-disabled={meta.page <= 1}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    meta.page <= 1
                      ? "pointer-events-none opacity-40 bg-slate-50 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Link>

                {/* Page Number Buttons */}
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => {
                  if (
                    p === 1 ||
                    p === meta.totalPages ||
                    (p >= meta.page - 1 && p <= meta.page + 1)
                  ) {
                    const isCurrent = p === meta.page;
                    return (
                      <Link
                        key={p}
                        href={getPageUrl(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-[#0284c7] text-white shadow-xs shadow-sky-500/30"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-2xs"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  }
                  if (p === meta.page - 2 || p === meta.page + 2) {
                    return (
                      <span key={p} className="text-xs text-slate-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                <Link
                  href={getPageUrl(Math.min(meta.page + 1, meta.totalPages))}
                  aria-disabled={meta.page >= meta.totalPages}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    meta.page >= meta.totalPages
                      ? "pointer-events-none opacity-40 bg-slate-50 text-slate-400 border-slate-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
