import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection, { IPackage } from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MASH ECO | Electronics Multi-Tenant E-Commerce Platform',
  description: 'Launch your electronics e-commerce store with MASH ECO. We offer authentic seller verification, courier automation, advanced fraud checks, and premium themes.',
  openGraph: {
    title: 'MASH ECO - Premium Electronics E-Commerce Platform',
    description: 'Scale your electronics business online with zero coding. Unlimited products, custom domains, and built-in addons.',
    url: 'https://www.MASH ECO.com',
    siteName: 'MASH ECO',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MASH ECO Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASH ECO - E-Commerce for Electronics',
    description: 'Launch and scale your electronics store today. Zero coding required.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.MASH ECO.com',
  },
};

async function getPublicPackages(): Promise<IPackage[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const res = await fetch(`${apiUrl}/packages/public-packages`, {
      next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
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
    description: 'A comprehensive multi-tenant e-commerce platform specifically optimized for electronics merchants.',
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
