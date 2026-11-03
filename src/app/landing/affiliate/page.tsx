import type { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AffiliateLandingContent, {
  AffiliatePublicConfig,
} from '@/components/landing/AffiliateLandingContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  applicationName: 'MASH ECO',
  title: {
    absolute:
      'MASH ECO Affiliate Partner Program | Earn 30% Recurring Commission (affiliate.masheco.com)',
  },
  description:
    'Join the MASH ECO Affiliate Partner Program at affiliate.masheco.com. Refer e-commerce merchants in Bangladesh and earn 30% recurring commission for 6 months on every subscription payment with fast bKash, Nagad, Rocket & Bank payouts.',
  keywords: [
    'MASH ECO Affiliate',
    'MashEco Affiliate Program',
    'affiliate.masheco.com',
    'MASH ECO Partner Program',
    'ecommerce affiliate program Bangladesh',
    'earn recurring commission Bangladesh',
    'bKash affiliate payout Bangladesh',
    'refer and earn Bangladesh',
    'MASH ECO',
    'MashEco',
  ],
  openGraph: {
    title: 'MASH ECO Affiliate Partner Program — Earn 30% Recurring Commission',
    description:
      'Refer merchants to MASH ECO and earn 30% recurring commission for 6 months on every subscription payment. Instant payouts via bKash, Nagad, Rocket & Bank at affiliate.masheco.com.',
    url: 'https://www.masheco.com/landing/affiliate',
    siteName: 'MASH ECO',
    images: [
      {
        url: 'https://www.masheco.com/masheco-logo.png',
        width: 1200,
        height: 630,
        alt: 'MASH ECO Affiliate Partner Program',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MASH ECO Affiliate Partner Program — Earn 30% Recurring Commission',
    description:
      'Refer e-commerce merchants in Bangladesh and earn 30% recurring commission for 6 months. Register free at affiliate.masheco.com.',
    images: ['https://www.masheco.com/masheco-logo.png'],
    site: '@masheco',
  },
  alternates: {
    canonical: 'https://www.masheco.com/landing/affiliate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getAffiliatePublicConfig(): Promise<AffiliatePublicConfig> {
  const fallback: AffiliatePublicConfig = {
    defaultCommissionRate: 30,
    commissionDurationMonths: 6,
    minimumWithdrawalAmount: 100,
    extraTrialDaysForReferredMerchant: 10,
  };

  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl =
      process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, '');
      apiUrl = clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
    }

    const fetchUrl = `${apiUrl}/affiliates/public-config`.replace('localhost', '127.0.0.1');
    const res = await fetch(fetchUrl, {
      next: { revalidate: 300 },
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; MashEcoLanding/1.0)',
      },
    });

    if (!res.ok) return fallback;
    const json = await res.json();
    if (json?.data) {
      return {
        defaultCommissionRate:
          Number(json.data.defaultCommissionRate) || fallback.defaultCommissionRate,
        commissionDurationMonths:
          Number(json.data.commissionDurationMonths) || fallback.commissionDurationMonths,
        minimumWithdrawalAmount:
          Number(json.data.minimumWithdrawalAmount) || fallback.minimumWithdrawalAmount,
        extraTrialDaysForReferredMerchant:
          Number(json.data.extraTrialDaysForReferredMerchant) ||
          fallback.extraTrialDaysForReferredMerchant,
      };
    }
  } catch {
    // Graceful fallback during build or if backend is unreachable
  }

  return fallback;
}

export default async function MerchantAffiliateLandingPage() {
  const config = await getAffiliatePublicConfig();
  const affiliateBaseUrl =
    process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://affiliate.masheco.com';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'MASH ECO',
        item: 'https://www.masheco.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Affiliate Partner Program',
        item: 'https://www.masheco.com/landing/affiliate',
      },
    ],
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'MASH ECO Affiliate Partner Program',
    serviceType: 'E-Commerce SaaS Affiliate Program',
    provider: {
      '@type': 'Organization',
      name: 'MASH ECO',
      url: 'https://www.masheco.com',
      logo: 'https://www.masheco.com/masheco-logo.png',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    url: 'https://affiliate.masheco.com',
    description: `Earn ${config.defaultCommissionRate}% recurring commission for ${config.commissionDurationMonths} months on every referred merchant subscription payment at MASH ECO. Minimum withdrawal ৳${config.minimumWithdrawalAmount} via bKash, Nagad, Rocket, and Bank.`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the MASH ECO Affiliate Partner Program work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Register for free at https://affiliate.masheco.com/register to get your unique referral link and code. Whenever a referred merchant pays for a subscription plan during their first ${config.commissionDurationMonths} months, you earn ${config.defaultCommissionRate}% recurring commission automatically.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Do referred merchants receive any bonus trial days?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, every new merchant who signs up using an affiliate referral link or code receives +${config.extraTrialDaysForReferredMerchant} extra free trial days.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How can I withdraw my affiliate commission in Bangladesh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Once your available balance reaches ৳${config.minimumWithdrawalAmount}, you can request a payout via bKash, Nagad, Rocket, or Bank transfer directly from your Affiliate Partner Dashboard at https://affiliate.masheco.com.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        <AffiliateLandingContent
          initialConfig={config}
          affiliateBaseUrl={affiliateBaseUrl}
        />
      </main>

      <Footer />
    </div>
  );
}

