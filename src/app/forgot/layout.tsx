import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | MASH ECO',
  description: 'Reset your MASH ECO merchant account password.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
