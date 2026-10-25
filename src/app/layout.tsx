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
    icon: '/masheco-logo.png',
    apple: '/masheco-logo.png',
    shortcut: '/masheco-logo.png',
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.masheco.com/#organization',
  name: 'MASH ECO',
  legalName: 'MASH TECH',
  url: 'https://www.masheco.com/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.masheco.com/masheco-logo.png',
    width: 512,
    height: 512,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.masheco.com/#website',
  name: 'MASH ECO',
  alternateName: ['MashEco', 'Mash Eco'],
  url: 'https://www.masheco.com/',
  publisher: {
    '@id': 'https://www.masheco.com/#organization',
  },
};

const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Become a Merchant',
      description: 'Get your branded e-commerce website up and running in minutes.',
      url: 'https://www.masheco.com/register',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: 'Merchant Login',
      description: 'Log in to your MASH ECO merchant dashboard.',
      url: 'https://www.masheco.com/login',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: 'Documentation',
      description: 'Platform documentation, custom domain DNS guide, and courier automation.',
      url: 'https://www.masheco.com/landing/documentation',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: 'Contact Us',
      description: 'Get in touch with the MASH ECO support and sales team.',
      url: 'https://www.masheco.com/landing/contact',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 5,
      name: 'About Us',
      description: 'Learn about MASH ECO — Bangladesh all-in-one e-commerce store builder and business platform.',
      url: 'https://www.masheco.com/landing/about-us',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 6,
      name: 'Terms of Service',
      description: 'Review the MASH ECO Terms of Service and merchant governance policies.',
      url: 'https://www.masheco.com/landing/terms-of-service',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 7,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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

