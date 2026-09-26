import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Merchant | MASH ECO',
  description: 'Register as a merchant on MASH ECO. Create your branded online store in minutes with zero coding required. Get started with a free trial today.',
  keywords: 'MASH ECO register, become a merchant, create online store, sell online Bangladesh, ecommerce Bangladesh',
  openGraph: {
    title: 'Become a Merchant | MASH ECO',
    description: 'Start your free trial. Create a branded online store in minutes on MASH ECO.',
    url: 'https://www.masheco.com/register',
    siteName: 'MASH ECO',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Become a Merchant | MASH ECO',
    description: 'Create your online store in minutes. Free trial available.',
    site: '@masheco',
  },
  alternates: {
    canonical: 'https://www.masheco.com/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
