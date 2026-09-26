import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merchant Login | MASH ECO',
  description: 'Sign in to your MASH ECO merchant dashboard to manage your store, products, orders, and courier integrations.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
