import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection, { IPackage, FALLBACK_PACKAGES } from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import TrialPromoModal from "@/components/landing/TrialPromoModal";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  applicationName: "MASH ECO",
  title: { absolute: "MASH ECO | Launch Your E-Commerce Store – Zero Coding Required" },
  description:
    "MASH ECO (MashEco / Mash Eco) — Bangladesh's leading all-in-one e-commerce store builder. Create your branded online store in minutes with seller verification, courier automation, fraud protection, and beautiful premium themes.",
  keywords: [
    "MASH ECO",
    "MashEco",
    "Mash Eco",
    "masheco bangladesh",
    "ecommerce SaaS Bangladesh",
    "all in one ecommerce platform",
    "online store builder Bangladesh",
    "sell online Bangladesh",
    "ecommerce platform",
  ],
  icons: {
    icon: "/masheco-logo.png",
    apple: "/masheco-logo.png",
  },
  openGraph: {
    title: "MASH ECO — All-in-One E-Commerce Store Builder",
    description:
      "Scale your business online with MASH ECO. Seller verification, courier automation, fraud detection, and premium themes — all in one platform.",
    url: "https://www.masheco.com/",
    siteName: "MASH ECO",
    images: [
      {
        url: "https://www.masheco.com/masheco-logo.png",
        width: 1200,
        height: 630,
        alt: "MASH ECO - E-Commerce Platform Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MASH ECO - E-Commerce Platform for Bangladesh",
    description:
      "Launch and scale your store today with MASH ECO. Zero coding required.",
    images: [
      "https://www.masheco.com/masheco-logo.png",
    ],
    site: "@masheco",
  },
  alternates: {
    canonical: "https://www.masheco.com/",
  },
};

import { headers as getNextHeaders } from "next/headers";

async function getPublicPackages(): Promise<IPackage[]> {
  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, "");
      apiUrl = clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
    }

    const headersInit: Record<string, string> = {
      "Content-Type": "application/json",
    };
    try {
      const reqHeaders = await getNextHeaders();
      const clientIp =
        reqHeaders.get("cf-connecting-ip") ||
        reqHeaders.get("x-forwarded-for") ||
        reqHeaders.get("x-real-ip") ||
        "";
      const host =
        reqHeaders.get("host") || reqHeaders.get("x-forwarded-host") || "";

      if (clientIp) {
        const firstIp = clientIp.includes(",")
          ? clientIp.split(",")[0].trim()
          : clientIp;
        headersInit["x-tenant-client-ip"] = firstIp;
        headersInit["cf-connecting-ip"] = firstIp;
        headersInit["x-forwarded-for"] = clientIp;
        headersInit["x-real-ip"] = firstIp;
      }
      if (host) headersInit["x-forwarded-host"] = host;
      const userAgent = reqHeaders.get("user-agent") || "";
      if (userAgent) {
        headersInit["user-agent"] = userAgent;
      } else {
        headersInit["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
      }
    } catch {
      headersInit["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    }

    const fetchUrlPrimary = `${apiUrl}/packages/public-packages`.replace('localhost', '127.0.0.1');
    const fetchUrlAlt = `${apiUrl}/packages/public-packages`;

    let res = await fetch(fetchUrlPrimary, {
      cache: "no-store",
      headers: headersInit,
    }).catch(() => null);

    if (!res || !res.ok) {
      res = await fetch(fetchUrlAlt, {
        cache: "no-store",
        headers: headersInit,
      }).catch(() => null);
    }

    if (res && res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.error("[LandingPage SSR] Error fetching packages:", err);
  }
  return [];
}

export default async function LandingPage() {
  const backendPackages = await getPublicPackages();
  const packages = backendPackages && backendPackages.length > 0 ? backendPackages : FALLBACK_PACKAGES;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MASH ECO",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: "https://www.masheco.com",
    image: "https://www.masheco.com/masheco-logo.png",
    offers: packages.map((pkg) => {
      const label = pkg.billingCycle === "yearly" ? "Yearly" : pkg.billingCycle === "monthly" ? "Monthly" : "";
      return {
        "@type": "Offer",
        name: label ? `${pkg.name} (${label})` : pkg.name,
        price: pkg.price.toString(),
        priceCurrency: "BDT",
        url: "https://www.masheco.com/#pricing",
      };
    }),
    description:
      "MASH ECO is an all-in-one platform for Bangladeshi merchants to build, manage, and scale an online store with inventory, courier automation, and fraud checks, no coding required.",
  };



  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MASH ECO",
    alternateName: ["MashEco", "Mash Eco"],
    url: "https://www.masheco.com",
    logo: "https://www.masheco.com/masheco-logo.png",
    description:
      "MASH ECO is an all-in-one e-commerce store builder and business platform for merchants in Bangladesh.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Bengali"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Badda Link Road",
      addressLocality: "Gulshan",
      addressRegion: "Dhaka",
      addressCountry: "BD",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <TrialPromoModal />
      <Navbar />

      <main>
        <HeroSection packages={packages} />
        <FeaturesSection />
        <PricingSection packages={packages} />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
