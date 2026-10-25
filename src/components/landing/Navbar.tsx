'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isBlog = pathname?.startsWith('/landing/blog');
  const isContact = pathname?.startsWith('/landing/contact');

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/masheco-logo.png" alt="MASH ECO" className="w-9 h-9 sm:w-13 sm:h-13 object-contain" />
            <span className="text-2xl sm:text-3xl font-righteous text-black tracking-tight">
              MASH ECO
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`relative py-1 text-sm transition-colors ${
                isHome ? "text-[#0284c7] font-bold" : "text-gray-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span>Home</span>
              {isHome && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#0284c7] rounded-full shadow-xs shadow-[#0284c7]/40" />
              )}
            </Link>

            <Link
              href="/#features"
              className="relative py-1 text-sm font-medium text-gray-600 hover:text-slate-900 transition-colors"
            >
              <span>Features</span>
            </Link>

            <Link
              href="/#pricing"
              className="relative py-1 text-sm font-medium text-gray-600 hover:text-slate-900 transition-colors"
            >
              <span>Pricing</span>
            </Link>

            <Link
              href="/landing/blog"
              className={`relative py-1 text-sm transition-colors ${
                isBlog ? "text-[#0284c7] font-bold" : "text-gray-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span>Blog</span>
              {isBlog && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#0284c7] rounded-full shadow-xs shadow-[#0284c7]/40" />
              )}
            </Link>

            <Link
              href="/landing/contact"
              className={`relative py-1 text-sm transition-colors ${
                isContact ? "text-[#0284c7] font-bold" : "text-gray-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span>Contact</span>
              {isContact && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2.5px] bg-[#0284c7] rounded-full shadow-xs shadow-[#0284c7]/40" />
              )}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" prefetch={false} className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">
              Merchant Login
            </Link>
            <Link href="/register" prefetch={false} className="btn-primary py-2 px-5 shadow-lg shadow-[hsl(var(--accent-primary))]/20 hover:shadow-[hsl(var(--accent-primary))]/40">
              Become a Merchant
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[hsl(var(--accent-primary))] focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-base transition-colors ${
                isHome ? "bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]" : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}
            >
              Home
            </Link>
            <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50">Features</Link>
            <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50">Pricing</Link>
            <Link
              href="/landing/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-base transition-colors ${
                isBlog ? "bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]" : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}
            >
              Blog
            </Link>
            <Link
              href="/landing/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl text-base transition-colors ${
                isContact ? "bg-sky-50 text-[#0284c7] font-bold border-l-4 border-[#0284c7]" : "text-gray-700 hover:bg-gray-50 font-medium"
              }`}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link href="/login" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">
              Merchant Login
            </Link>
            <Link href="/register" prefetch={false} onClick={() => setIsMobileMenuOpen(false)} className="w-full btn-primary py-3 px-5 text-center">
              Become a Merchant
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
