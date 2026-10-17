import Link from 'next/link';

const footerNavigation = {
  platform: [
    { name: 'About Us', href: '/landing/about-us' },
    { name: 'Blog', href: '/landing/blog' },
    { name: 'Contact', href: '/landing/contact' },
  ],
  merchant: [
    { name: 'Become a Partner', href: '/register' },
    { name: 'Merchant Login', href: '/login' },
    { name: 'Documentation', href: '/landing/documentation' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/landing/privacy-policy' },
    { name: 'Terms of Service', href: '/landing/terms-of-service' },
    { name: 'Cookie Policy', href: '/landing/cookie-policy' },
    { name: 'Account Deletion', href: '/landing/account-deletion' },
  ],
};

export interface SocialLinkConfig {
  url?: string;
  isActive?: boolean;
}

export interface SocialLinksMap {
  facebook?: SocialLinkConfig;
  instagram?: SocialLinkConfig;
  twitter?: SocialLinkConfig;
  linkedin?: SocialLinkConfig;
  youtube?: SocialLinkConfig;
  [key: string]: SocialLinkConfig | undefined;
}

async function getPublicSocialLinks(): Promise<SocialLinksMap | null> {
  try {
    const internalUrl = process.env.BACKEND_INTERNAL_URL || process.env.INTERNAL_API_URL;
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    if (internalUrl) {
      const clean = internalUrl.replace(/\/$/, '');
      apiUrl = clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
    }

    const fetchUrl = `${apiUrl}/system/public-settings`.replace('localhost', '127.0.0.1');
    const res = await fetch(fetchUrl, {
      next: { revalidate: 300 }, // ISR: Cache for 5 minutes, safe for static pre-rendering
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.socialLinks || null;
  } catch {
    // Fail gracefully during static build or if backend is offline
    return null;
  }
}

export default async function Footer({ socialLinks: propSocialLinks }: { socialLinks?: SocialLinksMap | null } = {}) {
  const socialLinks = propSocialLinks ?? (await getPublicSocialLinks());

  const platforms = [
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'youtube', name: 'YouTube' },
  ];

  // Conditional filtering: only display if configured by admin, isActive === true, and valid non-empty URL
  const activeSocialList = platforms
    .map(p => {
      const config = socialLinks?.[p.id];
      const url = config?.url?.trim() || '';
      const isActive = config ? config.isActive !== false : false;
      return {
        name: p.name,
        href: url,
        isActive: isActive && url !== '' && url !== '#' && !url.startsWith('javascript:'),
      };
    })
    .filter(item => item.isActive);

  return (
    <footer className="bg-gray-900 pt-8 pb-4 sm:pt-16 sm:pb-8 border-t border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-8 sm:mb-12">
          <div className="space-y-6 sm:space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/masheco-logo.png" alt="MASH ECO" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
              <span className="text-2xl sm:text-3xl font-righteous text-white tracking-tight">MASH ECO</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Making e-commerce simple, accessible, and powerful for businesses of all sizes.
            </p>

            {/* Conditional Rendering: Only rendered server-side when admin has configured and enabled active social links */}
            {activeSocialList.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {activeSocialList.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 xl:mt-0 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Platform</h3>
              <ul role="list" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {footerNavigation.platform.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Merchant</h3>
              <ul role="list" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {footerNavigation.merchant.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
              <ul role="list" className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MASH ECO. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-400">
            <span className="font-medium">A product of <span className="text-white">Mash Tech</span></span>
            <span className="hidden sm:inline-block text-gray-600">•</span>
            <span>Made with ❤️ for merchants</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
