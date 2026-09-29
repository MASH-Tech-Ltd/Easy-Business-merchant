'use client';

import Link from 'next/link';
import { Headphones, HelpCircle } from 'lucide-react';

export default function AuthSupportButton() {

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="https://www.masheco.com/landing/contact"
        target="_self"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        title="Need help or facing login issues? Contact Support"
      >
        <Headphones className="w-5 h-5 transition-transform group-hover:rotate-12" />
        <span className="text-sm font-semibold tracking-wide pr-1">Need Help?</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
      </Link>
    </div>
  );
}
