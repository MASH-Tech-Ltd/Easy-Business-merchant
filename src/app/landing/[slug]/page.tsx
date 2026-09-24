import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { contentMap } from '@/data/landingContent';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | MASH ECO`,
    description: `Read about MashEco's ${title}. Launch, manage, and scale your online business with our multi-tenant e-commerce platform.`,
    icons: {
      icon: '/MEasy.png',
      apple: '/MEasy.png',
    },
    openGraph: {
      title: `${title} | MASH ECO`,
      description: `Read about MashEco's ${title}. Launch, manage, and scale your online business.`,
      url: `https://www.masheco.com/landing/${slug}`,
      siteName: 'MASH ECO',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.masheco.com/landing/${slug}`,
    }
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
