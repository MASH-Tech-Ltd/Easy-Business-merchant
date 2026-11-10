import type { Metadata } from 'next';
import { Inter, Righteous } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from '@/context/SocketContext';
import PlatformTrackingScripts from '@/components/landing/PlatformTrackingScripts';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const righteous = Righteous({ weight: '400', subsets: ['latin'], variable: '--font-righteous' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.masheco.com'),
  applicationName: 'MASH ECO',
  title: {
    default: 'MASH ECO | All-in-One E-Commerce Store Builder for Merchants',
    template: '%s | MASH ECO',
  },
  description: 'MASH ECO is an all-in-one e-commerce store builder and business platform. Launch your branded online store with authentic seller verification, courier automation, fraud checks, and premium themes.',
  keywords: [
    'MASH ECO', 'MashEco', 'Mash Eco', 'mashe co', 'mash eco platform',
    'all in one ecommerce', 'online store builder', 'SaaS ecommerce Bangladesh', 'merchant dashboard',
    'ecommerce website builder', 'ecommerce platform Bangladesh', 'sell online Bangladesh',
    'mash eco merchant', 'masheco', 'mash eco store'
  ],
  authors: [{ name: 'MASH TECH LTD', url: 'https://www.masheco.com' }],
  creator: 'MASH TECH LTD',
  publisher: 'MASH ECO',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googlee9d71bb183a3b7f7',
  },
  alternates: {
    canonical: 'https://www.masheco.com/',
  },
  appleWebApp: {
    title: 'MASH ECO',
    capable: true,
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/masheco-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/masheco-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    title: 'MASH ECO | All-in-One E-Commerce Store Builder',
    description: 'Launch and scale your business with MASH ECO. Zero coding required. Premium themes, courier automation & fraud protection.',
    siteName: 'MASH ECO',
    url: 'https://www.masheco.com/',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASH ECO - E-Commerce Platform',
    description: 'Launch your online store with MASH ECO. Zero coding required.',
    site: '@masheco',
  },
};

const platformGraphSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.masheco.com/#website',
      url: 'https://www.masheco.com/',
      name: 'MASH ECO',
      alternateName: [
        'Mash Eco',
        'MashEco',
        'masheco',
        'MASH ECO Bangladesh',
        'MASH ECO Store Builder',
        'MASH TECH LTD',
      ],
      inLanguage: 'en-US',
      publisher: {
        '@id': 'https://www.masheco.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.masheco.com/landing/blog?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.masheco.com/#organization',
      name: 'MASH ECO',
      legalName: 'MASH TECH LTD',
      alternateName: ['Mash Eco', 'MashEco', 'masheco', 'MASH ECO Platform'],
      url: 'https://www.masheco.com/',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://www.masheco.com/#logo',
        url: 'https://www.masheco.com/masheco-logo.png',
        contentUrl: 'https://www.masheco.com/masheco-logo.png',
        width: 512,
        height: 512,
        caption: 'MASH ECO',
      },
      image: {
        '@id': 'https://www.masheco.com/#logo',
      },
      description:
        'MASH ECO is an all-in-one e-commerce store builder and business platform for merchants in Bangladesh.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English', 'Bengali'],
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Badda Link Road',
        addressLocality: 'Gulshan',
        addressRegion: 'Dhaka',
        postalCode: '1212',
        addressCountry: 'BD',
      },
    },
  ],
};

const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Become a Merchant',
      description: 'Register as a merchant on MASH ECO. Create your branded online store in minutes with zero coding required.',
      url: 'https://www.masheco.com/register',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: 'MASH ECO Affiliate Partner Program',
      description: 'Join the official MASH ECO Affiliate Partner Program at affiliate.masheco.com and earn 30% recurring commission.',
      url: 'https://www.masheco.com/landing/affiliate',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: 'About Us',
      description: 'Learn about MASH ECO — Bangladesh’s leading all-in-one e-commerce store builder and merchant platform.',
      url: 'https://www.masheco.com/landing/about-us',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: 'Contact',
      description: 'Get in touch with the MASH ECO team. We are here to help you launch and scale your online store.',
      url: 'https://www.masheco.com/landing/contact',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 5,
      name: 'Blog & E-Commerce Guides',
      description: 'Insights, updates, courier strategies, and proven tactics to scale your online store in Bangladesh.',
      url: 'https://www.masheco.com/landing/blog',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 6,
      name: 'Documentation',
      description: 'Platform documentation, custom domain DNS guide, and courier automation setup.',
      url: 'https://www.masheco.com/landing/documentation',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 7,
      name: 'Terms of Service',
      description: 'Review the MASH ECO Terms of Service and merchant governance policies.',
      url: 'https://www.masheco.com/landing/terms-of-service',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 8,
      name: 'Privacy Policy',
      description: 'MASH ECO Privacy Policy, data protection, and account deletion procedures.',
      url: 'https://www.masheco.com/landing/privacy-policy',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${righteous.variable} h-full antialiased`}>
      <head>
        {/* Explicit Favicons for Googlebot-Image, Google Favicon & Browsers */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/masheco-logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/masheco-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/masheco-logo.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(platformGraphSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <PlatformTrackingScripts />
        <Toaster position="top-right" />
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}

