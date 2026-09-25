import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  applicationName: 'MASH ECO',
  title: {
    default: 'MASH ECO | Multi-Tenant E-Commerce Platform for Merchants',
    template: '%s | MASH ECO',
  },
  description: 'MASH ECO (also known as MashEco or Mash Eco) is a premium multi-tenant SaaS e-commerce platform. Launch your business store with authentic seller verification, courier automation, fraud checks, and premium themes.',
  keywords: [
    'MASH ECO', 'MashEco', 'Mash Eco', 'mashe co', 'mash eco platform',
    'multi-tenant ecommerce', 'SaaS ecommerce Bangladesh', 'merchant dashboard',
    'online store builder', 'ecommerce platform Bangladesh', 'sell online Bangladesh',
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
  icons: {
    icon: '/MEasy.png',
    apple: '/MEasy.png',
    shortcut: '/MEasy.png',
  },
  openGraph: {
    title: 'MASH ECO | Multi-Tenant E-Commerce Platform',
    description: 'Launch and scale your business with MASH ECO. Zero coding required. Premium themes, courier automation & fraud protection.',
    url: 'https://www.masheco.com',
    siteName: 'MASH ECO',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASH ECO - E-Commerce Platform',
    description: 'Launch your online store with MASH ECO. Zero coding required.',
    site: '@masheco',
  },
  alternates: {
    canonical: 'https://www.masheco.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
