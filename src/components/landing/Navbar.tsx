'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/MEasy.png" alt="MashEasy" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-black">
              MashEasy
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Home</Link>
            <Link href="/#features" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Pricing</Link>
            <Link href="/landing/contact" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))] transition-colors">
              Merchant Login
            </Link>
            <Link href="/register" className="btn-primary py-2 px-5 shadow-lg shadow-[hsl(var(--accent-primary))]/20 hover:shadow-[hsl(var(--accent-primary))]/40">
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
          <div className="flex flex-col space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">Home</Link>
            <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">Features</Link>
            <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">Pricing</Link>
            <Link href="/landing/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">Contact</Link>
          </div>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-700 hover:text-[hsl(var(--accent-primary))]">
              Merchant Login
            </Link>
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full btn-primary py-3 px-5 text-center">
              Become a Merchant
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
