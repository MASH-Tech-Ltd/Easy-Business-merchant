import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  Tag,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
  author: string;
  authorRole?: string;
  readTime: string;
  views: number;
  publishedAt?: string;
  createdAt?: string;
}

const FALLBACK_ARTICLES: Record<string, Partial<IBlogPost>> = {
  "courier-automation-fast-delivery-bangladesh": {
    title: "কুরিয়ার অটোমেশন: ম্যানুয়াল এন্ট্রি ছাড়া দ্রুত পার্সেল ডেলিভারি",
    slug: "courier-automation-fast-delivery-bangladesh",
    excerpt:
      "পাঠাও, রেডএক্স ও স্টিডফাস্ট কুরিয়ারের সাথে ওয়ান-ক্লিক অটোমেশন। কাস্টমার অ্যাড্রেস স্বয়ংক্রিয়ভাবে সাবমিট ও ট্র্যাক করুন।",
    content: `## বাংলাদেশে ই-কমার্স ডেলিভারির আধুনিক সমাধান

অনলাইন ব্যবসায় সবচেয়ে বেশি সময় ও শ্রম অপচয় হয় পার্সেল হ্যান্ডলিং এবং কুরিয়ার এন্ট্রিতে। প্রতিটি অর্ডারের নাম, ঠিকানা এবং ফোন নাম্বার কপি-পেস্ট করে কুরিয়ার ওয়েবসাইটে বসাতে গিয়ে প্রতিদিন ঘণ্টার পর ঘণ্টা নষ্ট হয়।

### কুরিয়ার অটোমেশনের সুবিধা

**MASH ECO** নিয়ে এসেছে সরাসরি শীর্ষস্থানীয় কুরিয়ার সার্ভিসের সাথে গভীর ইন্টিগ্রেশন:
- **পাঠাও কুরিয়ার (Pathao Courier):** ঢাকা ও ঢাকার বাইরে দ্রুত ডেলিভারি ও রিয়েলটাইম পার্সেল ট্র্যাকিং।
- **স্টিডফাস্ট কুরিয়ার (Steadfast Courier):** ৬৪ জেলায় ক্যাশ অন ডেলিভারি এবং দ্রুত পেমেন্ট ডিসবার্সমেন্ট।
- **রেডএক্স (RedX Logistics):** ডোরস্টেপ পিকআপ এবং এন্ড-টু-এন্ড অটোমেটেড রিটার্ন ট্র্যাকিং।

### এক ক্লিকে পার্সেল বুকিং

অর্ডার আসার সাথে সাথে ড্যাশবোর্ড থেকে শুধু **"Send to Courier"** চাপলেই সম্পূর্ণ বিবরণ স্বয়ংক্রিয়ভাবে কুরিয়ারে চলে যাবে এবং সরাসরি ইনভয়েস ও বারকোড লেবেল প্রিন্ট করা যাবে।`,
    category: "Product Update",
    tags: ["কুরিয়ার", "অটোমেশন", "লজিস্টিকস"],
    author: "MASH ECO Team",
    authorRole: "Product & Engineering",
    readTime: "৪ মিনিট",
    views: 342,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "how-to-reduce-abandoned-checkout-leads-bangla": {
    title: "অর্ডারের ড্রপ-আউট কমিয়ে বিক্রয় দ্বিগুণ করার সহজ উপায়",
    slug: "how-to-reduce-abandoned-checkout-leads-bangla",
    excerpt:
      "চেকআউট পেজে কাস্টমার এসে কেন ড্রপ আউট হয়? লিড ক্যাপচার করে হোয়াটসঅ্যাপে ফলো-আপ করে হারিয়ে যাওয়া সেল ফিরিয়ে আনুন।",
    content: `## এব্যান্ডনড চেকআউট থেকে সেলস রিকভারি

বাংলাদেশে প্রায় ৬৫% এর বেশি ক্রেতা কার্টে প্রোডাক্ট যোগ করে ঠিকানা লেখা শুরু করার পরও অর্ডার কনফার্ম না করেই পেজ বন্ধ করে দেন। এই ক্রেতারা কিন্তু আগ্রহ নিয়েই এসেছিলেন।

### কেন কাস্টমার অর্ডার অসম্পূর্ণ রাখে?

- শেষ ধাপে ডেলিভারি চার্জ দেখে দ্বিধা তৈরি হওয়া।
- ক্যাশ অন ডেলিভারিতে প্রোডাক্ট আসল হবে কিনা তা নিয়ে সংশয়।
- নেটওয়ার্কের সমস্যা বা অন্য কোনো কাজে মনোযোগ সরে যাওয়া।

### MASH ECO লিড ক্যাপচার সিস্টেমের কৌশল

কাস্টমার চেকআউট ফর্মে নাম ও মোবাইল নম্বর টাইপ করার সাথে সাথেই ব্যাকএন্ডে লিড সেভ হয়ে যায়।
- **৩০ মিনিটের ভেতর হোয়াটসঅ্যাপ ফলো-আপ:** কাস্টমারকে বন্ধুত্বপূর্ণ একটি মেসেজ দিলে ২৫% থেকে ৩০% অর্ডার সাথে সাথে কনফার্ম হয়।
- **ফ্রি ডেলিভারি অফার:** নির্দিষ্ট পরিমাণের অর্ডারে ফ্রি ডেলিভারি অফার ক্রেতার দ্বিধা দূর করে।`,
    category: "E-commerce Tips",
    tags: ["চেকআউট", "সেলস", "টিপস"],
    author: "সাব্বির আহমেদ",
    authorRole: "Growth Strategist",
    readTime: "৫ মিনিট",
    views: 489,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "top-5-strategies-to-scale-online-store-bangla": {
    title: "অনলাইন স্টোর দ্রুত স্কেল করার ৫টি কার্যকর কৌশল",
    slug: "top-5-strategies-to-scale-online-store-bangla",
    excerpt:
      "ফেসবুক পেজ নির্ভরতা কাটিয়ে নিজের ব্র্যান্ডেড ডোমেইন, মেটা পিক্সেল ট্র্যাকিং এবং রিটার্ন পার্সেল কমানোর সেরা কৌশল।",
    content: `## ফেসবুকে মেসেজ নেওয়া থেকে ব্র্যান্ডেড ই-কমার্সে রূপান্তর

শুধু ফেসবুক পেজে মেসেজের মাধ্যমে ব্যবসা পরিচালনা করলে বেশি ভলিউম হ্যান্ডেল করা অসম্ভব হয়ে পড়ে। শত শত মেসেজের উত্তর দেওয়া, স্টক হিসাব রাখা এবং ভুল অর্ডার পাঠানো থেকে বাঁচতে নিজস্ব অনলাইন স্টোর অপরিহার্য।

### ৫টি মূল স্তম্ভ:
1. **নিজস্ব ব্র্যান্ডেড ডোমেইন:** yourstore.com ক্রেতার মনে বিশ্বাস ও সম্মান বৃদ্ধি করে।
2. **সার্ভার-সাইড মেটা পিক্সেল (CAPI):** iOS আপডেটের পরও নিখুঁত পারচেজ ট্র্যাকিং নিশ্চিত করে অ্যাড অপ্টিমাইজ করা।
3. **ফ্রড স্কোরিং ও ভুয়া অর্ডার রোধ:** যেসব কাস্টমার অতীতে একাধিক দোকানে পার্সেল ফেরত দিয়েছে তাদের শুরুতেই শনাক্ত করা।
4. **স্বয়ংক্রিয় স্টক ম্যানেজমেন্ট:** শেষ হয়ে যাওয়া প্রোডাক্ট যাতে কাস্টমার অর্ডার না করতে পারে।
5. **মাল্টিপল পেমেন্ট মেথড:** ক্যাশ অন ডেলিভারি, বিকাশ এবং নগদ ম্যানুয়াল ভেরিফিকেশন।`,
    category: "Business Growth",
    tags: ["গ্রোথ", "স্ট্র্যাটেজি", "বিজনেস"],
    author: "মোহাম্মদ মহসিন",
    authorRole: "Business Advisory",
    readTime: "৬ মিনিট",
    views: 512,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "complete-guide-to-setting-up-cod-and-fraud-prevention-bangla": {
    title: "রিটার্ন পার্সেল (RTO) ও ডেলিভারি লস কমানোর গাইড",
    slug: "complete-guide-to-setting-up-cod-and-fraud-prevention-bangla",
    excerpt:
      "ক্যাশ অন ডেলিভারিতে ফেক অর্ডার শনাক্ত করা ও কাস্টমার ফ্রড স্কোরিংয়ের মাধ্যমে ডেলিভারি চার্জের ক্ষতি বাঁচান।",
    content: `## ক্যাশ অন ডেলিভারিতে লোকসান ঠেকানোর নিয়ম

বাংলাদেশে ই-কমার্সে ৮০% এর বেশি অর্ডার ক্যাশ অন ডেলিভারিতে হয়। কিন্তু কাস্টমার যদি পার্সেল রিসিভ না করে, তবে আপ-ডাউন উভয় ডেলিভারি চার্জ মার্চেন্টকেই বহন করতে হয়।

### ক্ষতি কমানোর কার্যকর উপায়:
- **১১ ডিজিটের সঠিক ফোন নম্বর যাচাই:** ইনভ্যালিড নম্বর দিয়ে অর্ডার করা বন্ধ করা।
- **অর্ডার কনফার্মেশন কল বা এসএমএস:** অর্ডারের সাথে সাথেই স্বয়ংক্রিয় এসএমএস বা দ্রুত কনফার্মেশন কল ৩০% রিটার্ন কমায়।
- **হাই-ভ্যালু অর্ডারে ডেলিভারি চার্জ অগ্রিম:** ৩,০০০ টাকার বেশি অর্ডারে ন্যূনতম ডেলিভারি চার্জ বিকাশে অগ্রিম গ্রহণ করা।`,
    category: "Guides",
    tags: ["ক্যাশ অন ডেলিভারি", "ফ্রড প্রতিরোধ", "গাইড"],
    author: "MASH ECO Team",
    authorRole: "Security & Operations",
    readTime: "৪ মিনিট",
    views: 298,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "facebook-page-to-branded-ecommerce-store": {
    title: "ফেসবুক পেজ থেকে প্রফেশনাল অনলাইন শপ চালুর নিয়ম",
    slug: "facebook-page-to-branded-ecommerce-store",
    excerpt:
      "কোনো কোডিং ছাড়া মাত্র ৫ মিনিটে লাইভ করুন আপনার ই-কমার্স ওয়েবসাইট। কাস্টম ডোমেইন ও প্রিমিয়াম থিম রেডি।",
    content: `## কীভাবে ৫ মিনিটে স্টোর চালু করবেন

MASH ECO প্ল্যাটফর্মে কোডিংয়ের কোনো ঝামেলা নেই। অ্যাকাউন্ট তৈরি করে লোগো, প্রোডাক্ট এবং দাম আপলোড করলেই সম্পূর্ণ স্টোর প্রস্তুত।

### প্রধান ফিচারসমূহ:
- ৫টি আধুনিক ও কনভার্সন অপ্টিমাইজড থিম
- ফ্রি সাবডোমেন অথবা নিজস্ব ডোমেইন সংযোগ
- মোবাইল ফ্রেন্ডলি দ্রুত লোডিং চেকআউট`,
    category: "Tutorial",
    tags: ["টিউটোরিয়াল", "স্টোর সেটআপ"],
    author: "MASH ECO Team",
    authorRole: "Product & Support",
    readTime: "৩ মিনিট",
    views: 180,
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "bkash-nagad-manual-payment-verification-automation": {
    title: "বিকাশ ও নগদ মার্চেন্ট পেমেন্ট অটোমেশন",
    slug: "bkash-nagad-manual-payment-verification-automation",
    excerpt:
      "ম্যানুয়াল স্ক্রিনশট চেক করার ঝামেলা শেষ। ট্রানজেকশন আইডি (TrxID) দিয়ে নিমিষেই অর্ডার কনফার্মেশন।",
    content: `## পেমেন্ট ভেরিফিকেশনের আধুনিক রূপ

অনেক সময় কাস্টমার ফেক পেমেন্ট স্ক্রিনশট পাঠিয়ে অর্ডার দাবি করে। MASH ECO এর TrxID ভেরিফিকেশন সিস্টেম মার্চেন্টকে রিয়েলটাইমে পেমেন্ট স্ট্যাটাস যাচাইয়ের সুবিধা দেয়।`,
    category: "Case Study",
    tags: ["পেমেন্ট", "বিকাশ", "নগদ"],
    author: "সাব্বির আহমেদ",
    authorRole: "FinTech Specialist",
    readTime: "৪ মিনিট",
    views: 220,
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

async function getArticleBySlug(slug: string): Promise<IBlogPost | null> {
  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, "");
      apiUrl = clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
    }

    const urlPrimary = `${apiUrl}/blogs/public-blogs/${slug}`.replace("localhost", "127.0.0.1");
    const urlAlt = `${apiUrl}/blogs/public-blogs/${slug}`;

    let res = await fetch(urlPrimary, { cache: "no-store" }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(urlAlt, { cache: "no-store" }).catch(() => null);
    }

    if (res && res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch (err) {
    console.error("[Article SSR] Error fetching article by slug:", err);
  }

  // Fallback to local memory if present
  if (FALLBACK_ARTICLES[slug]) {
    return FALLBACK_ARTICLES[slug] as IBlogPost;
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | MASH ECO Blog",
    };
  }

  return {
    title: `${article.title} | MASH ECO Blog`,
    description: article.excerpt,
    keywords: ["MASH ECO Blog", article.category, ...(article.tags || [])].join(", "),
    openGraph: {
      title: `${article.title} | MASH ECO`,
      description: article.excerpt,
      url: `https://www.masheco.com/landing/blog/${slug}`,
      siteName: "MASH ECO",
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author || "MASH ECO Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      canonical: `https://www.masheco.com/landing/blog/${slug}`,
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail || "https://www.masheco.com/masheco-logo.png",
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.publishedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: article.author || "MASH ECO Team",
    },
    publisher: {
      "@type": "Organization",
      name: "MASH ECO",
      logo: {
        "@type": "ImageObject",
        url: "https://www.masheco.com/masheco-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.masheco.com/landing/blog/${article.slug}`,
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.masheco.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.masheco.com/landing/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://www.masheco.com/landing/blog/${article.slug}`,
      },
    ],
  };

  // Convert inline markdown formatting (***bold italic***, **bold**, *italic*, `code`) into styled elements
  const renderInlineFormatting = (text: string): React.ReactNode => {
    if (!text) return "";
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            <em>{part.slice(3, -3)}</em>
          </strong>
        );
      }
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={i} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-sky-700 font-mono text-[11px] sm:text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Convert markdown paragraphs and headings into HTML blocks
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3" />;

      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-sm sm:text-base font-bold text-slate-900 mt-6 mb-2 tracking-tight"
          >
            {renderInlineFormatting(trimmed.replace(/^###\s+/, ""))}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-base sm:text-lg font-bold text-slate-900 mt-8 mb-3 tracking-tight border-b border-slate-100 pb-1.5"
          >
            {renderInlineFormatting(trimmed.replace(/^##\s+/, ""))}
          </h2>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="text-lg sm:text-xl font-bold text-slate-900 mt-8 mb-3 tracking-tight"
          >
            {renderInlineFormatting(trimmed.replace(/^#\s+/, ""))}
          </h1>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed ml-5 list-disc mb-1">
            {renderInlineFormatting(trimmed.replace(/^[-*]\s+/, ""))}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(trimmed)) {
        return (
          <li key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed ml-5 list-decimal mb-1">
            {renderInlineFormatting(trimmed.replace(/^\d+\.\s+/, ""))}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <article className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-400 mb-6 overflow-x-auto pb-1 scrollbar-none">
            <Link href="/" className="hover:text-[#0284c7] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/landing/blog" className="hover:text-[#0284c7] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-700 truncate max-w-xs">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {article.category}
              </span>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Clock className="w-3 h-3" />
                <span>{article.readTime || "4 min read"}</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Eye className="w-3 h-3" />
                <span>{(article.views || 0).toLocaleString()} views</span>
              </div>
            </div>

            {/* Clean compact Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
              {article.title}
            </h1>

            {/* Author bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#122846] via-[#0369a1] to-[#0284c7] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(article.author || "M").charAt(0)}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{article.author || "MASH ECO Team"}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  {article.authorRole || "Editorial Team"} •{" "}
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recent"}
                </p>
              </div>
            </div>
          </header>

          {/* Featured Cover / Gradient Banner */}
          <div className="rounded-2xl overflow-hidden mb-8 shadow-xs border border-slate-200">
            {article.thumbnail ? (
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full max-h-[360px] object-cover"
              />
            ) : (
              <div className="h-44 sm:h-56 w-full bg-gradient-to-br from-[#122846] via-[#0369a1] to-[#0284c7] flex items-center justify-center p-6 text-white text-center">
                <div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-sky-200 mb-2 opacity-90" />
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-sky-200 font-semibold block mb-1">
                    MASH ECO Official Article
                  </span>
                  <p className="text-sm sm:text-base font-bold max-w-md leading-snug">
                    {article.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Excerpt Lead Box */}
          <div className="bg-sky-50/70 border-l-3 border-[#0284c7] rounded-r-xl p-3.5 sm:p-4 mb-8 text-slate-800 text-xs sm:text-sm font-medium leading-relaxed italic">
            "{article.excerpt}"
          </div>

          {/* Main Article Content */}
          <div className="prose prose-slate max-w-none mb-10">
            {renderFormattedContent(article.content)}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-4 border-t border-slate-100 mb-8">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Box */}
          <div className="rounded-2xl bg-gradient-to-br from-[#122846] to-[#0369a1] p-5 sm:p-7 text-white text-center shadow-sm">
            <h3 className="text-base sm:text-lg font-bold">
              Ready to automate your online store?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-md mx-auto">
              Join hundreds of Bangladeshi merchants using MASH ECO for courier automation, fraud prevention, and lightning fast checkouts.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Start Free Trial
              </Link>
              <Link
                href="/landing/blog"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
              >
                Browse More Articles
              </Link>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-8 text-center sm:text-left">
            <Link
              href="/landing/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
