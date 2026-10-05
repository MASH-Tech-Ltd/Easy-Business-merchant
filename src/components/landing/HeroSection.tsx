'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, BarChart3, ArrowRight } from 'lucide-react';
import { IPackage } from '@/components/landing/PricingSection';

interface HeroSectionProps {
  packages?: IPackage[];
}

export default function HeroSection({ packages: initialPackages = [] }: HeroSectionProps) {
  const [packages, setPackages] = useState<IPackage[]>(initialPackages);

  useEffect(() => {
    if (initialPackages.length > 0) {
      setPackages(initialPackages);
    } else {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== "undefined" && window.location.hostname.includes("masheco.com")
          ? "https://backapi.masheco.com/api/v1"
          : "http://localhost:8000/api/v1");
      fetch(`${apiUrl}/packages/public-packages`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
          if (list.length > 0) {
            setPackages(list);
          }
        })
        .catch(() => {});
    }
  }, [initialPackages]);

  const minPrice = packages && packages.length > 0
    ? Math.min(...packages.map((p) => p.price))
    : 299;

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-24 lg:pt-28 pb-12 sm:pb-20 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[hsl(var(--accent-primary))]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Lowest Price Highlight Badge */}
        <div className="inline-flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 text-gray-900 text-xs sm:text-sm font-semibold mb-6 shadow-sm hover:scale-105 transition-transform cursor-pointer max-w-full">
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#5022C3] to-purple-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
            Lowest Price Guaranteed
          </span>
          <span className="text-purple-950 font-bold text-xs sm:text-sm">
            Full E-Commerce Platform Starting at Only <span className="text-[#5022C3] font-black text-xs sm:text-base">৳{minPrice}/month</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-tight">
          One Platform <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent-primary))] to-purple-600">
            Thousands of Success Stories
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-xl text-gray-600 mb-8 sm:mb-10">
          Take your business online at the <strong className="text-purple-900 font-bold">lowest price in Bangladesh</strong>. Setup your automated e-commerce store with just a few clicks. No coding required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" prefetch={false} className="w-full sm:w-auto btn-primary py-2 px-4 sm:py-4 sm:px-8 text-sm sm:text-lg group">
            Start Free Trial 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/landing/book-a-demo" className="w-full sm:w-auto px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-lg font-medium text-gray-700 bg-white border border-gray-200 rounded-[var(--radius-md)] hover:bg-gray-50 transition-colors">
            Book a Demo
          </Link>
        </div>

        <div className="mt-20 flex justify-center">
          <div className="glass-panel p-2 w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl relative">
            <div className="flex absolute -top-4 -left-2 sm:-top-8 sm:-left-8 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 items-center gap-3 sm:gap-4 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg text-green-600">
                <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">New Order</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">৳ 12350.00</p>
              </div>
            </div>
            
            <div className="flex absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-8 bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 items-center gap-3 sm:gap-4 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg text-blue-600">
                <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Weekly Sales</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">+45.2%</p>
              </div>
            </div>

            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-xl md:rounded-2xl shadow-sm object-cover max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
