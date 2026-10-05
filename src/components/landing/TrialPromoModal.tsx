'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, MessageSquareCheck } from 'lucide-react';

export default function TrialPromoModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    // 1. Check if user already saw the modal in a previous session (within 1 hour)
    try {
      const itemStr = localStorage.getItem('hasSeenTrialPromoModal');
      if (itemStr) {
        const item = JSON.parse(itemStr);
        const now = Date.now();
        // If shown in a previous visit (> 5s ago) and still within 1hr expiry, do not open
        if (now < item.expiry && (now - item.timestamp) > 5000) {
          setIsOpen(false);
          return;
        }
      }
    } catch {
      // Storage restricted fallback
    }

    // 2. Open modal and start 1-hour TTL
    setIsOpen(true);
    setProgress(100);

    const now = Date.now();
    const TTL_MS = 60 * 60 * 1000; // 1 hour
    try {
      localStorage.setItem('hasSeenTrialPromoModal', JSON.stringify({
        value: 'true',
        timestamp: now,
        expiry: now + TTL_MS,
      }));
    } catch {
      // Storage restricted fallback
    }

    // 3. 3-second countdown timer and progress bar animation
    const DURATION = 5000; // 5 seconds
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remainingPercent);

      if (elapsed >= DURATION) {
        clearInterval(timer);
        setIsOpen(false);
      }
    }, 16);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden border border-purple-100 transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
      >
        {/* Top Solid Accent Bar */}
        <div className="h-2.5 bg-purple-600" />

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 p-2.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-10 md:p-12 text-center sm:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-purple-100 text-purple-700 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>বিশেষ অফার (Special Offer)</span>
          </div>

          {/* Heading */}
          <h2 
            id="promo-modal-title" 
            className="text-3xl sm:text-4xl md:text-[2.5rem] font-black text-gray-900 leading-tight mb-5"
          >
            অ্যাকাউন্ট খুললেই পেয়ে যাবেন <br className="hidden sm:inline" />
            <span className="text-purple-600">৫ দিনের ফ্রি ট্রায়াল!</span>
          </h2>

          {/* Subtext */}
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 font-medium">
            আপনার ব্যবসার ধরন আমাদের জানান, আমরা আপনাকে পরামর্শ দিব কোনটা ভালো হবে।
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/landing/contact?topic=Business Consultation (ব্যবসার পরামর্শ)"
              onClick={() => setIsOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-purple-200 text-lg sm:text-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <MessageSquareCheck className="w-6 h-6" />
              <span>পরামর্শ নিতে যোগাযোগ করুন</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 overflow-hidden">
          <div 
            className="bg-purple-600 h-full transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
