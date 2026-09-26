import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { contentMap } from '@/data/landingContent';
import type { Metadata } from 'next';

// Curated per-page descriptions for better SEO
const pageDescriptions: Record<string, string> = {
  'about-us': 'Learn about MASH ECO — Bangladesh\'s leading multi-tenant SaaS e-commerce platform. Our mission is to empower every merchant to launch and grow their online business.',
  'blog': 'Read the latest articles, guides, and news from MASH ECO. Tips on e-commerce, selling online, and growing your business in Bangladesh.',
  'contact': 'Get in touch with the MASH ECO team. We\'re here to help you launch and scale your online store. Reach us via email, phone, or our contact form.',
  'documentation': 'Explore the MASH ECO merchant documentation. Step-by-step guides on setting up your store, managing products, orders, and courier integrations.',
  'privacy-policy': 'Read the MASH ECO Privacy Policy. We are committed to protecting your data and ensuring secure, transparent use of your personal information.',
  'terms-of-service': 'Review the MASH ECO Terms of Service. Understand your rights and responsibilities as a merchant on our platform.',
  'cookie-policy': 'Read the MASH ECO Cookie Policy. Learn how we use cookies to improve your experience on our platform.',
  'careers': 'Join the MASH ECO team. We are hiring passionate engineers, designers, and e-commerce enthusiasts. View open positions and apply today.',
  'enterprise': 'Enterprise-grade e-commerce solutions from MASH ECO. Custom plans, dedicated support, and advanced features for large-scale merchants.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const description = pageDescriptions[slug]
    ?? `Learn about ${title} at MASH ECO — the multi-tenant e-commerce platform built for merchants in Bangladesh.`;

  return {
    title: `${title} | MASH ECO`,
    description,
    keywords: ['MASH ECO', 'MashEco', title, 'ecommerce Bangladesh', 'merchant platform'].join(', '),
    openGraph: {
      title: `${title} | MASH ECO`,
      description,
      url: `https://www.masheco.com/landing/${slug}`,
      siteName: 'MASH ECO',
      images: [
        {
          url: 'https://www.masheco.com/MEasy.png',
          width: 512,
          height: 512,
          alt: 'MASH ECO Logo',
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: `${title} | MASH ECO`,
      description,
      site: '@masheco',
    },
    alternates: {
      canonical: `https://www.masheco.com/landing/${slug}`,
    },
  };
}

export default async function LandingContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const content = contentMap[slug] || (
    <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm inline-block">
      <p className="text-gray-500 mb-4">Detailed content for <strong>{title}</strong> is coming soon.</p>
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Content pending</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12">
            {title}
          </h1>
          <div className="prose prose-lg mx-auto text-gray-600 w-full max-w-none">
            {content}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
