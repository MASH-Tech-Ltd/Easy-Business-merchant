import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MashEasy | Electronics Multi-Tenant E-Commerce Platform',
  description: 'Launch your electronics e-commerce store with MashEasy. We offer authentic seller verification, courier automation, advanced fraud checks, and premium themes.',
  openGraph: {
    title: 'MashEasy - Premium Electronics E-Commerce Platform',
    description: 'Scale your electronics business online with zero coding. Unlimited products, custom domains, and built-in addons.',
    url: 'https://www.masheasy.com',
    siteName: 'MashEasy',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'MashEasy Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MashEasy - E-Commerce for Electronics',
    description: 'Launch and scale your electronics store today. Zero coding required.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://www.masheasy.com',
  },
};

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MashEasy',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BDT',
    },
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
        <PricingSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
