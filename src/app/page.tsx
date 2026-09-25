import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection, { IPackage } from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MASH ECO | Launch Your E-Commerce Store – Zero Coding Required',
  description: 'MASH ECO (MashEco / Mash Eco) — Bangladesh\'s leading multi-tenant SaaS e-commerce platform. Create your branded online store in minutes with seller verification, courier automation, fraud protection, and beautiful premium themes.',
  keywords: [
    'MASH ECO', 'MashEco', 'Mash Eco', 'mashe co', 'masheco bangladesh',
    'mash eco ecommerce', 'mash eco store', 'mash eco merchant',
    'ecommerce SaaS Bangladesh', 'multi-tenant ecommerce platform',
    'online store builder Bangladesh', 'sell online Bangladesh',
    'ecommerce platform', 'merchant dashboard Bangladesh',
    'MASH TECH', 'mash tech ltd', 'courier automation ecommerce',
  ],
  icons: {
    icon: '/MEasy.png',
    apple: '/MEasy.png',
  },
  openGraph: {
    title: 'MASH ECO — Premium Multi-Tenant E-Commerce Platform',
    description: 'Scale your business online with MASH ECO. Seller verification, courier automation, fraud detection, and premium themes — all in one platform.',
    url: 'https://www.masheco.com',
    siteName: 'MASH ECO',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MASH ECO - E-Commerce Platform Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASH ECO - E-Commerce Platform for Bangladesh',
    description: 'Launch and scale your store today with MASH ECO. Zero coding required.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
    site: '@masheco',
  },
  alternates: {
    canonical: 'https://www.masheco.com',
  },
};

async function getPublicPackages(): Promise<IPackage[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/packages/public-packages`, {
      cache: 'no-store', // Always fetch fresh — package pricing changes must reflect immediately
    });

    if (!res.ok) {
      console.error('[LandingPage] Failed to fetch packages:', res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    // Backend sends: { success: true, message: '...', data: [...] }
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error('[LandingPage] Error fetching packages:', err);
    return [];
  }
}

export default async function LandingPage() {
  const packages = await getPublicPackages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MASH ECO',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: packages.map((pkg) => ({
      '@type': 'Offer',
      name: pkg.name,
      price: pkg.price.toString(),
      priceCurrency: 'BDT',
    })),
    description: 'A comprehensive multi-tenant e-commerce platform specifically optimized for merchants.',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MASH ECO',
    alternateName: ['MashEco', 'Mash Eco', 'mashe co', 'MASH TECH'],
    url: 'https://www.masheco.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.masheco.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MASH ECO',
    alternateName: ['MashEco', 'Mash Eco', 'mashe co', 'MASH TECH LTD'],
    url: 'https://www.masheco.com',
    logo: 'https://www.masheco.com/MEasy.png',
    description: 'MASH ECO is a multi-tenant SaaS e-commerce platform for merchants in Bangladesh.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Bengali'],
    },
    sameAs: [
      'https://www.masheco.com',
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection packages={packages} />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
