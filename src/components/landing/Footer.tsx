import Link from 'next/link';

const footerNavigation = {
  platform: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  merchant: [
    { name: 'Become a Partner', href: '#' },
    { name: 'Merchant Login', href: '/login' },
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  social: [
    { name: 'Facebook', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-12">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/MEasy.png" alt="MashEasy" className="w-10 h-10 object-contain brightness-0 invert" />
              <span className="text-xl font-bold text-white">MashEasy</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Making e-commerce simple, accessible, and powerful for businesses of all sizes.
            </p>
            <div className="flex flex-wrap gap-4">
              {footerNavigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Platform</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.platform.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Merchant</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.merchant.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-400 hover:text-white transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Get the app</h3>
                <div className="mt-4 space-y-4 flex flex-col items-start">
                  <a href="#" className="inline-block transition-transform hover:scale-105">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on App Store" className="h-10" />
                  </a>
                  <a href="#" className="inline-block transition-transform hover:scale-105">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} Mash-Tech Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <span>Made with ❤️ for merchants</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
