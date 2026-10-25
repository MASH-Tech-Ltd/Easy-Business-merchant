'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Trash2, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Server, 
  Truck, 
  RefreshCw,
  Mail,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface LegalPolicyViewerProps {
  policyType: 'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'account-deletion';
}

export default function LegalPolicyViewer({ policyType }: LegalPolicyViewerProps) {
  const [lang, setLang] = useState<'bn' | 'en'>('en');

  return (
    <div className="space-y-8 text-left text-gray-700 w-full max-w-5xl mx-auto">
      {/* Top Header Controls: Quick Nav Pills & Language Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        {/* Quick Nav Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/landing/privacy-policy"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              policyType === 'privacy-policy'
                ? 'bg-sky-100 text-[#0284c7] border border-sky-200 shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </Link>
          <Link
            href="/landing/terms-of-service"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              policyType === 'terms-of-service'
                ? 'bg-sky-100 text-[#0284c7] border border-sky-200 shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
          </Link>
          <Link
            href="/landing/cookie-policy"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              policyType === 'cookie-policy'
                ? 'bg-sky-100 text-[#0284c7] border border-sky-200 shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang === 'bn' ? 'কুকি পলিসি' : 'Cookie Policy'}
          </Link>
          <Link
            href="/landing/account-deletion"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              policyType === 'account-deletion'
                ? 'bg-red-100 text-red-700 border border-red-200 shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {lang === 'bn' ? 'অ্যাকাউন্ট ডিলিটেশন' : 'Account Deletion'}
          </Link>
        </div>

        {/* Compact Language Toggle */}
        <div className="inline-flex items-center p-1 bg-gray-100 border border-gray-200 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => setLang('bn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              lang === 'bn'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <span>🇧🇩</span> বাংলা
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              lang === 'en'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <span>🌐</span> English
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. PRIVACY POLICY */}
      {/* ========================================================= */}
      {policyType === 'privacy-policy' && (
        lang === 'bn' ? (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                আইনি নথি
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO গোপনীয়তা নীতি (Privacy Policy)</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬ | সংস্করণ ২.৪</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              MASH ECO ("আমরা", "আমাদের", বা "প্ল্যাটফর্ম") একটি আধুনিক মাল্টি-টেন্যান্ট SaaS ই-কমার্স প্ল্যাটফর্ম। আমাদের সিস্টেমে নিবন্ধিত মার্চেন্ট, স্টোর এডমিন, তাদের গ্রাহক এবং প্ল্যাটফর্ম ভিজিটরদের তথ্যের সর্বোচ্চ নিরাপত্তা, গোপনীয়তা এবং সুরক্ষা নিশ্চিত করা আমাদের প্রধান দায়িত্ব। এই গোপনীয়তা নীতিতে বিস্তারিত ব্যাখ্যা করা হয়েছে আমরা কীভাবে আপনার ব্যক্তিগত এবং ব্যবসায়িক ডেটা সংগ্রহ, প্রক্রিয়া, সংরক্ষণ এবং সুরক্ষিত রাখি।
            </p>

            <div className="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#0284c7] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">ডেটা আইসোলেশন অঙ্গীকার</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  আমাদের ডেটাবেজে প্রতিটি মার্চেন্টের ডেটা লজিক্যাল <code>tenantId</code> দ্বারা সম্পূর্ণরূপে পৃথক রাখা হয়। এক মার্চেন্টের কোনো পণ্য, গ্রাহক বা অর্ডার ডেটা অপর কোনো মার্চেন্ট দেখতে পারেন না।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ১. আমরা যেসব তথ্য সংগ্রহ করি
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">ক. মার্চেন্ট ও ব্যবসায়িক পরিচিতি</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  মার্চেন্ট অ্যাকাউন্ট তৈরির সময় আপনার নাম, ব্যবসার নাম, অফিসিয়াল ফোন নম্বর, ইমেইল ঠিকানা, পাসওয়ার্ড (Bcrypt দ্বারা হ্যাশকৃত), জাতীয় পরিচয়পত্র/ট্রেড লাইসেন্স বিবরণ (ভেরিফিকেশনের জন্য) এবং আপনার নির্বাচিত সাবডোমেন বা কাস্টম ডোমেন বিবরণ।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">খ. স্টোরফ্রন্ট কনফিগারেশন ও ক্যাটালগ ডেটা</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  আপনার স্টোরের পণ্য তালিকা, ক্যাটাগরি, মূল্য, স্টক/ইনভেন্টরি তথ্য, স্টোর লোগো ও ব্যানার (Cloudinary-তে সংরক্ষিত), থিম প্রিফারেন্স এবং স্টোর মোড (অনলাইন বা অফলাইন স্ট্যাটাস)।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">গ. গ্রাহকদের অর্ডার ও লেনদেন ডেটা</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  আপনার স্টোরে আসা গ্রাহকদের নাম, ডেলিভারি ঠিকানা, ফোন নম্বর, অর্ডারকৃত পণ্যের বিস্তারিত, পেমেন্ট মেথড (ক্যাশ অন ডেলিভারি, bKash, Nagad ইত্যাদি), এবং পার্সেল ট্র্যাকিং কনসাইনমেন্ট আইডি।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">ঘ. লজিস্টিকস ও কুরিয়ার এপিআই ক্রেডেনশিয়ালস</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  মার্চেন্টের নিজস্ব কুরিয়ার অ্যাকাউন্ট (যেমন Steadfast API Key, Pathao Client ID/Secret, REDX Token) যা এন্ড-টু-এন্ড এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে এবং শুধুমাত্র স্বয়ংক্রিয় পার্সেল বুকিংয়ের জন্য ব্যবহৃত হয়।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">ঙ. ফ্রড অ্যানালিটিক্স ও সিকিউরিটি লগস</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  জাল অর্ডার ও রিটার্ন ফ্রড প্রতিরোধে ক্রেতার পূর্ববর্তী ডেলিভারি সাকসেস রেট, ফোন নম্বর প্যাটার্ন, আইপি অ্যাড্রেস এবং ব্রাউজার ইউজার-এজেন্ট ডেটা।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. তথ্যের ব্যবহার
            </h2>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li>আপনার নিজস্ব ব্র্যান্ডেড অনলাইন স্টোর এবং মার্চেন্ট ড্যাশবোর্ড ২৪/৭ পরিচালনা ও মনিটরিং করা।</li>
              <li>Steadfast, Pathao এবং REDX কুরিয়ার এপিআই-এর সাথে স্বয়ংক্রিয় পার্সেল ডিসপ্যাচ ও ট্র্যাকিং সিঙ্ক করা।</li>
              <li>ইনবিল্ট ফ্রড-ডিটেকশন অ্যালগরিদমের মাধ্যমে ক্ষতিকর ও ভুয়া অর্ডার শনাক্ত করা।</li>
              <li>প্যাকেজ কোটা (যেমন প্রোডাক্ট লিমিট, স্টাফ একাউন্ট সংখ্যা) ও সাবস্ক্রিপশন নবায়ন তদারকি করা।</li>
              <li>সিস্টেম সুরক্ষা ও প্ল্যাটফর্মের নিয়ম প্রয়োগ (Active, Inactive, Suspended, Banned স্ট্যাটাস নিয়ন্ত্রণ)।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৩. তৃতীয় পক্ষের সাথে তথ্য আদান-প্রদান
            </h2>
            <p className="leading-relaxed">
              আমরা কখনো আপনার বা আপনার গ্রাহকদের বাণিজ্যিক ডেটা কোনো তৃতীয় পক্ষের কাছে বিক্রি বা অপব্যবহার করি না। শুধুমাত্র প্রয়োজনীয় সেবা কার্যকর করতে নির্দিষ্ট অংশীদারদের সাথে সংযোগ করা হয়:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>লজিস্টিকস পার্টনার (Steadfast, Pathao, REDX):</strong> পার্সেল ডেলিভারি ও রিয়েলটাইম লোকেশন ট্র্যাকিংয়ের উদ্দেশ্যে ডেলিভারি ঠিকানা ও ফোন নম্বর প্রদান।</li>
              <li><strong>পেমেন্ট গেটওয়ে পার্টনার:</strong> সাবস্ক্রিপশন ফি ও অনলাইন পেমেন্ট প্রক্রিয়াকরণে ব্যাংক গ্রেড এনক্রিপ্টেড চ্যানেলের মাধ্যমে লেনদেন।</li>
              <li><strong>ক্লাউড ইনফ্রাস্ট্রাকচার ও সিডিএন (Cloudflare, Cloudinary, AWS/VPS):</strong> ডোমেনের ফ্রি SSL সার্টিফিকেট প্রদান, DDoS সাইবার আক্রমণ প্রতিহতকরণ এবং পণ্যের ইমেজ ক্যাশিং।</li>
            </ul>

            {/* CRITICAL: ACCOUNT DELETATION SECTION */}
            <div id="account-deletion-section" className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 text-red-700">
                <Trash2 className="w-7 h-7 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  ৪. অ্যাকাউন্ট ডিলিটেশন এবং ডেটা মুছে ফেলার প্রক্রিয়া (Account Deletion & Data Purge)
                </h2>
              </div>

              <p className="leading-relaxed text-gray-800 font-medium">
                MASH ECO-তে প্রতিটি মার্চেন্টের তাদের অ্যাকাউন্ট এবং সম্পূর্ণ স্টোর ডেটা স্থায়ীভাবে ডিলিট করার পূর্ণ অধিকার রয়েছে। আপনার অ্যাকাউন্ট মুছে ফেলার প্রক্রিয়াটি সম্পূর্ণ স্বচ্ছ এবং সুনির্দিষ্ট নিয়মে পরিচালিত হয়:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ধাপ ১: ডিলিটেশন রিকোয়েস্ট
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    মার্চেন্ট তাদের ড্যাশবোর্ড থেকে অথবা সরাসরি নিবন্ধিত ইমেইল থেকে <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">support@masheco.com</code>-এ অ্যাকাউন্ট ডিলিটেশনের আবেদন করতে পারেন।
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ধাপ ২: প্রাক-শর্ত যাচাই
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    চলমান কোনো অবিলিকৃত কাস্টমার অর্ডার, পেন্ডিং রিফান্ড বা বকেয়া সাবস্ক্রিপশন ইনভয়েস থাকলে তা নিষ্পত্তি করতে হবে।
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-amber-600" /> ধাপ ৩: ১৪ দিনের সুরক্ষা গ্রেস পিরিয়ড
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    ভুলবশত ডিলিট হওয়া রোধে এবং সিকিউরিটি সুরক্ষায় প্রাথমিক রিকোয়েস্টের পর ১৪ দিনের একটি কুলিং-অফ পিরিয়ড থাকে। এই সময়ে আপনি সিদ্ধান্ত পরিবর্তন করলে সাপোর্ট টিমের মাধ্যমে রিকোয়েস্ট বাতিল করতে পারেন।
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <Trash2 className="w-4 h-4 text-red-600" /> ধাপ ৪: ক্যাসকেডিং ডেটা ইরেজার (স্থায়ী মুছে ফেলা)
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    যাচাইকরণ সম্পন্ন হওয়ার পর আমাদের ডেটাবেজে ACID ট্রানজ্যাকশনের মাধ্যমে আপনার স্টোর, সকল পণ্য, ক্যাটাগরি, কুরিয়ার এপিআই কি, অর্ডার এবং Cloudinary-র সকল ছবি সার্ভার থেকে স্থায়ীভাবে চিরতরে ধ্বংস করা হয়।
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-4 rounded-xl border border-red-200 text-xs text-gray-700 space-y-1">
                <p className="font-bold text-red-900">আইনগতভাবে সংরক্ষিত তথ্যের ব্যতিক্রম:</p>
                <p>
                  বাংলাদেশের অর্থ আইন ও জাতীয় রাজস্ব বোর্ডের (NBR) অডিট নীতিমালা অনুযায়ী, পরিশোধিত ট্যাক্স/ভ্যাট ইনভয়েস ও আর্থিক লেনদেনের সারসংক্ষেপ নির্দিষ্ট আইনি সময়সীমা পর্যন্ত অপরিবর্তনীয় নিরীক্ষা লগে সংরক্ষিত থাকবে।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৫. ডেটা সুরক্ষা ও নিরাপত্তা
            </h2>
            <p className="leading-relaxed">
              আমরা সর্বাধুনিক TLS 1.3 এনক্রিপশন, ফায়ারওয়াল প্রটেকশন, নিয়মিত স্বয়ংক্রিয় ব্যাকআপ এবং রোল-বেসড অ্যাক্সেস কন্ট্রোল ব্যবহার করি। তবে মার্চেন্ট হিসেবে আপনার পাসওয়ার্ড ও টু-ফ্যাক্টর নিরাপত্তা বজায় রাখা আপনার দায়িত্ব।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৬. যোগাযোগ ও প্রাইভেসি সাপোর্ট
            </h2>
            <p className="leading-relaxed">
              প্রাইভেসি পলিসি বা ডেটা অপসারণ সম্পর্কিত যেকোনো প্রয়োজনে আমাদের ডেটা প্রটেকশন টিমের সাথে যোগাযোগ করুন:
            </p>
            <div className="p-4 bg-gray-50 rounded-xl text-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <p className="font-bold text-gray-900">MASH ECO</p>
                <p className="text-gray-600">১৭০৪, জাতীয় বিশ্ববিদ্যালয়, গাজীপুর, বাংলাদেশ</p>
              </div>
              <div>
                <p className="text-gray-600">ইমেইল: <a href="mailto:support@masheco.com" className="text-[#0284c7] font-bold">support@masheco.com</a></p>
                <p className="text-gray-600">হটলাইন: <span className="font-bold text-gray-900">(+৮৮০) ১৮৮০৮৪০৮৪৯</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                Legal Document
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO Privacy Policy</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Last Updated: October 2026 | Version 2.4</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              MASH ECO ("we", "us", or "our") operates an all-in-one cloud e-commerce platform and merchant infrastructure designed for businesses, retailers, and online merchants in Bangladesh. We are deeply committed to protecting the privacy, security, and integrity of your merchant data, your customers' transactions, and your administrative credentials. This Privacy Policy details the exact lifecycle of data collected, processed, and safeguarded on our platform.
            </p>

            <div className="bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#0284c7] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Tenant Isolation Guarantee</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Every merchant store runs in a strictly partitioned logical environment governed by indexed <code>tenantId</code> constraints. Your product catalog, customer records, and order history are completely isolated from all other stores.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">A. Merchant Account & KYC Information</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  When onboarding, we collect your full legal name, business brand name, official phone number, email address, password (stored using one-way salted bcrypt hashing), NID/trade license verification documents, and chosen subdomain or custom domain.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">B. Store Configuration & Media Assets</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Product descriptions, inventory levels, SKUs, category hierarchies, store logos, theme preferences (Design 01 through 05), custom domain DNS mappings, and storefront operating modes (Online/Offline).
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">C. Customer & End-User Transaction Data</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Orders submitted through your storefront contain buyer names, delivery addresses, contact numbers, order totals, chosen payment channels (Cash on Delivery, bKash, Nagad), and tracking numbers.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">D. Logistics & Courier Credentials</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Encrypted merchant API credentials for integrated delivery partners (Steadfast API key & secret, Pathao Client ID & secret, REDX tokens) used exclusively for automated parcel forwarding and live consignment tracking.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                <h3 className="font-bold text-gray-900 mb-1">E. Fraud Prevention & Security Telemetry</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Historical delivery fulfillment rates, phone number risk patterns, IP geolocation, and device fingerprints processed by our automated fraud score calculator to detect return abuse and fraudulent checkouts.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. How We Use and Process Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li>To provide, maintain, and securely host your branded e-commerce storefront and merchant portal.</li>
              <li>To synchronize automated courier dispatch and tracking updates via Steadfast, Pathao, and REDX.</li>
              <li>To evaluate order risk through algorithmic fraud scoring (flagging high-risk vs. safe orders).</li>
              <li>To manage multi-tier subscription quotas (product upload limits, staff permissions, custom domain bindings).</li>
              <li>To enforce platform compliance and govern account states (Active, Inactive, Suspended Read-Only, or Banned).</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              3. Data Sharing & Third-Party Integrations
            </h2>
            <p className="leading-relaxed">
              We never sell, rent, or monetize your store data or your customers' contact information. Data is shared exclusively with critical infrastructure partners necessary to deliver core platform services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Courier Partners (Steadfast, Pathao, REDX):</strong> Customer recipient names, delivery addresses, and phone numbers dispatched for parcel delivery.</li>
              <li><strong>Payment Gateways (bKash, Nagad, SSLCommerz):</strong> Encrypted transaction tokens used for subscription billing and online buyer checkouts.</li>
              <li><strong>Cloud & Security Providers (Cloudflare, Cloudinary, AWS/VPS):</strong> Edge CDN caching, automated SSL certificate issuance, DDoS mitigation, and optimized image hosting.</li>
            </ul>

            {/* CRITICAL: ACCOUNT DELETATION SECTION */}
            <div id="account-deletion-section" className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 text-red-700">
                <Trash2 className="w-7 h-7 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  4. Account Deletion & Permanent Data Purge Process
                </h2>
              </div>

              <p className="leading-relaxed text-gray-800 font-medium">
                We believe in complete merchant sovereignty. You retain full ownership of your data and possess the unequivocal right to request permanent account closure and data eradication at any time. Our deletion procedure is systematic, secure, and permanent:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step 1: Submitting Request
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A merchant owner may initiate deletion from the merchant dashboard settings or by sending a verified request from their registered email to <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">support@masheco.com</code>.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step 2: Pre-requisites & Verification
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    The store owner must ensure there are no unfulfilled orders, unresolved customer disputes, or outstanding billing invoices before proceeding.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-amber-600" /> Step 3: 14-Day Safety Grace Period
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    To prevent accidental loss from compromised credentials, a mandatory 14-day cooling-off window is activated. The storefront is placed offline. During this window, the owner can cancel deletion upon identity re-verification.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-red-100 shadow-2xs">
                  <span className="font-bold text-red-900 text-sm flex items-center gap-1.5 mb-1">
                    <Trash2 className="w-4 h-4 text-red-600" /> Step 4: ACID Cascading Data Eradication
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Upon final execution, our database executes a sequential transactional purge: the Tenant profile, all staff user accounts, product catalogs, categories, order logs, courier API keys, and all Cloudinary image assets are permanently eradicated.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-4 rounded-xl border border-red-200 text-xs text-gray-700 space-y-1">
                <p className="font-bold text-red-900">Statutory Tax & Regulatory Audit Exception:</p>
                <p>
                  In compliance with Bangladesh financial laws, the Income Tax Act, and National Board of Revenue (NBR) audit guidelines, historical transaction invoices and tax receipts are archived in an immutable ledger for legally mandated statutory retention periods before final disposal.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              5. Data Security & Storage Standards
            </h2>
            <p className="leading-relaxed">
              We employ enterprise-grade security practices, including TLS 1.3 transit encryption, AES-256 data-at-rest protection for sensitive API credentials, strict session token timeouts, and automated hourly database backups.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              6. Contact & Data Protection Inquiries
            </h2>
            <p className="leading-relaxed">
              If you have any questions regarding your privacy rights, data export, or account closure, please contact our Data Compliance Officer:
            </p>
            <div className="p-4 bg-gray-50 rounded-xl text-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <p className="font-bold text-gray-900">MASH ECO</p>
                <p className="text-gray-600">Badda Link Road, Gulshan, Dhaka, Bangladesh</p>
              </div>
              <div>
                <p className="text-gray-600">Email: <a href="mailto:support@masheco.com" className="text-[#0284c7] font-bold hover:underline">support@masheco.com</a></p>
                <p className="text-gray-600">Hotline: <span className="font-bold text-gray-900">(+880) 1880840849</span></p>
              </div>
            </div>
          </div>
        )
      )}

      {/* ========================================================= */}
      {/* 2. TERMS OF SERVICE */}
      {/* ========================================================= */}
      {policyType === 'terms-of-service' && (
        lang === 'bn' ? (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                আইনি চুক্তি
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO ব্যবহারের শর্তাবলী (Terms of Service)</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬ | সংস্করণ ২.৪</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              MASH ECO প্ল্যাটফর্ম, মার্চেন্ট ড্যাশবোর্ড, এপিআই বা স্টোরফ্রন্ট হোস্টিং সেবা ব্যবহারের মাধ্যমে আপনি এই ব্যবহারের শর্তাবলীতে আইনগতভাবে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলি মেনে নিতে অসম্মত হন, তবে প্ল্যাটফর্মের যেকোনো সেবা ব্যবহার অবিলম্বে বন্ধ করুন।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ১. প্ল্যাটফর্ম যোগ্যতা ও মার্চেন্ট নিবন্ধন
            </h2>
            <p className="leading-relaxed">
              মার্চেন্ট হিসেবে নিবন্ধনের জন্য আপনার বয়স ন্যূনতম ১৮ বছর হতে হবে এবং বাংলাদেশে বৈধ ব্যবসা পরিচালনার আইনগত কর্তৃত্ব থাকতে হবে। আপনি নিশ্চিত করছেন যে আপনার দেওয়া সমস্ত তথ্য, ফোন নম্বর, ট্রেড লাইসেন্স বা জাতীয় পরিচয়পত্র সঠিক ও নির্ভুল।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. অ্যাকাউন্ট স্টেটাস ও সুপার এডমিন শাসনব্যবস্থা
            </h2>
            <p className="leading-relaxed mb-3">
              MASH ECO প্ল্যাটফর্মের ক্রেতা, বিক্রেতা ও সিস্টেমের স্থিতিশীলতা রক্ষায় সুনির্দিষ্ট নিয়মমালা প্রয়োগ করে। প্ল্যাটফর্ম সুপার এডমিনিস্ট্রেটরদের মার্চেন্ট অ্যাকাউন্ট স্টেটাস ও স্টোর মোড পরিচালনার পূর্ণ এখতিয়ার রয়েছে:
            </p>
            <div className="grid gap-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Status (সক্রিয় অবস্থা)
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  স্টোর ওয়েবসাইটটি ক্রেতাদের জন্য সম্পূর্ণ লাইভ থাকবে এবং কেনাকাটা করা যাবে। মার্চেন্ট ড্যাশবোর্ডে পূর্ণ Read-Write অ্যাক্সেস পাবেন (পণ্য তৈরি, অর্ডার প্রসেসিং, কুরিয়ার ফরোয়ার্ড)।
                </p>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="font-bold text-blue-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Inactive / Pending Status (নিষ্ক্রিয় / অপেক্ষমাণ)
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  স্টোর ওয়েবসাইটটি জনসাধারণের জন্য অফলাইন থাকবে। মার্চেন্ট স্টোর সেটআপ, ক্যাটালগ আপলোড, ভেরিফিকেশন বা সাবস্ক্রিপশন বাছাইয়ের জন্য ড্যাশবোর্ড ব্যবহার করতে পারবেন।
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Suspended Status (স্থগিত - Read-Only Mode)
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  মেয়াদী সাবস্ক্রিপশন বিল পরিশোধ না করা বা নীতি পর্যালোচনার কারণে অ্যাকাউন্ট স্থগিত হলে পাবলিক স্টোরসাইট অফলাইন হয়ে যাবে। মার্চেন্টের ড্যাশবোর্ড <strong>Read-Only Mode (শুধুমাত্র দেখার মোড)</strong>-এ পরিবর্তিত হবে—যেখানে মার্চেন্ট আগের সেলস রিপোর্ট, কাস্টমার ডেটা দেখতে পারবেন এবং সাপোর্ট টিকিট পাঠাতে বা সাবস্ক্রিপশন রিনিউ করতে পারবেন, কিন্তু নতুন প্রোডাক্ট তৈরি বা এডিট করা নিষিদ্ধ থাকবে।
                </p>
              </div>

              <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
                <span className="font-bold text-red-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" /> Banned Status (স্থায়ীভাবে নিষিদ্ধ)
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  মারাত্মক নীতি লঙ্ঘন, জালিয়াতি, নকল পণ্য বিক্রি বা সাইবার অপব্যবহারে জড়িত অ্যাকাউন্ট চিরতরে নিষিদ্ধ (Banned) করা হবে এবং ড্যাশবোর্ড ও স্টোর অ্যাক্সেস অবিলম্বে বাতিল করা হবে।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৩. নিষিদ্ধ পণ্য ও গ্রহণযোগ্য ব্যবহার নীতি
            </h2>
            <p className="leading-relaxed">
              মার্চেন্টরা তাদের স্টোরে পণ্য তালিকাভুক্ত করার জন্য পূর্ণভাবে দায়ী। নিম্নলিখিত পণ্য বা কার্যক্রম কঠোরভাবে নিষিদ্ধ:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              <li>নকল ব্র্যান্ডেড ইলেকট্রনিক্স, কপি পণ্য, বা পাইরেটেড গ্যাজেট বিক্রি করা।</li>
              <li>অননুমোদিত মাদক, তামাক, আগ্নেয়াস্ত্র বা ঝুঁকিপূর্ণ রাসায়নিক বিক্রি।</li>
              <li>বাংলাদেশের ডিজিটাল নিরাপত্তা ও সাইবার আইন বিরোধী কনটেন্ট প্রচার।</li>
              <li>প্ল্যাটফর্ম এপিআই, সার্ভার বা কুরিয়ার সিস্টেমে অটোমেটেড অ্যাটাক বা রিভার্স ইঞ্জিনিয়ারিং চালানো।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৪. সাবস্ক্রিপশন, বিলিং ও রিফান্ড নীতিমালা
            </h2>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li><strong>প্যাকেজ কোটা:</strong> আপনার প্ল্যান অনুযায়ী পণ্যের সংখ্যা, স্টাফ একাউন্ট সংখ্যা এবং কাস্টম ডোমেন সুবিধা সীমাবদ্ধ থাকবে। কোটা শেষ হলে পরবর্তী প্ল্যানে আপগ্রেড করতে হবে।</li>
              <li><strong>বিলিং সাইকেল:</strong> সাবস্ক্রিপশন ফি মাসিক বা বার্ষিক ভিত্তিতে অগ্রিম প্রদেয়।</li>
              <li><strong>রিফান্ড পলিসি:</strong> SaaS সেবা ব্যবহারের লাইসেন্স ফি অপরিশোধযোগ্য (Non-refundable)। তবে প্রযুক্তিগত ত্রুটির কারণে সেবা বন্ধ থাকলে সমানুপাতিক সার্ভিস ক্রেডিট দেওয়া হতে পারে।</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৫. কুরিয়ার অটোমেশন ও ডেলিভারি সংক্রান্ত দায়িত্ব
            </h2>
            <p className="leading-relaxed">
              MASH ECO প্ল্যাটফর্মে Steadfast, Pathao ও REDX কুরিয়ার এপিআই সংযোগ সুবিধা প্রদান করে। অর্ডার কুরিয়ারে ফরওয়ার্ড করার পর পার্সেল হস্তান্তর, ক্যাশ কালেকশন (COD) এবং ডেলিভারি প্রক্রিয়ার জন্য সংশ্লিষ্ট কুরিয়ার কোম্পানি ও মার্চেন্ট দায়ী থাকবেন। কুরিয়ারের নিজস্ব বিলম্ব বা পার্সেল হারানোর দায় MASH ECO বহন করবে না।
            </p>

            {/* CRITICAL: ACCOUNT TERMINATION / DELETION SECTION IN TERMS */}
            <div id="account-deletion-section" className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-red-700">
                <Trash2 className="w-7 h-7 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  ৬. মার্চেন্ট অ্যাকাউন্ট বাতিল ও ডিলিট করার নিয়মাবলী (Account Deletion & Termination)
                </h2>
              </div>

              <p className="text-gray-800 leading-relaxed font-medium">
                মার্চেন্ট যেকোনো সময় তার নিজস্ব ইচ্ছায় MASH ECO প্ল্যাটফর্ম থেকে স্টোর বন্ধ ও অ্যাকাউন্ট ডিলিট করতে পারেন:
              </p>

              <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-700 leading-relaxed">
                <li>
                  <strong>স্বেচ্ছায় ডিলিটেশন আবেদন:</strong> ড্যাশবোর্ডের Settings মেনু থেকে অথবা রেজিস্টার্ড ইমেইল থেকে <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-bold">support@masheco.com</code>-এ অফিসিয়াল রিকোয়েস্ট পাঠাতে হবে।
                </li>
                <li>
                  <strong>অর্ডার ও ব্যালেন্স ক্লিয়ারেন্স:</strong> অ্যাকাউন্ট ডিলিট কার্যকর হওয়ার পূর্বে সকল ডেলিভারি পেন্ডিং অর্ডার সম্পন্ন করতে হবে এবং যেকোনো কাস্টমার ক্লেম সমাধান করতে হবে।
                </li>
                <li>
                  <strong>অনিবার্য ডেটা অপসারণ:</strong> অ্যাকাউন্ট মুছে ফেলার পর আপনার স্টোরের কোনো প্রোডাক্ট, সেলস রেকর্ড বা কাস্টমার কন্টাক্ট ডেটা পুনরুদ্ধার করা সম্ভব নয়।
                </li>
                <li>
                  <strong>স্থায়ী ক্যাসকেডিং ডিলিট:</strong> আবেদন নিশ্চিত হওয়ার পর সাবডোমেন অবমুক্ত করা হবে, কাস্টম ডোমেনের SSL সার্টিফিকেট টার্মিনেট করা হবে এবং ডেটাবেজ থেকে মার্চেন্টের সকল স্টোর ডেটা স্থায়ীভাবে মুছে ফেলা হবে।
                </li>
              </ol>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৭. দায়বদ্ধতার সীমা (Limitation of Liability)
            </h2>
            <p className="leading-relaxed">
              MASH ECO সর্বোচ্চ ৯৯.৯% আপটাইম বজায় রাখতে প্রতিশ্রুতিবদ্ধ। তবে ইন্টারনেট অবকাঠামো বিভ্রাট, কুরিয়ার ডাউনটাইম বা সাইবার হামলার ফলে উদ্ভূত কোনো প্রত্যক্ষ বা পরোক্ষ ব্যবসায়িক ক্ষতির জন্য MASH ECO দায়ী থাকবে না। প্ল্যাটফর্মের আর্থিক দায় পূর্ববর্তী তিন মাসে মার্চেন্ট কর্তৃক প্রদত্ত ফি-এর পরিমাণের মধ্যে সীমাবদ্ধ থাকবে।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৮. পরিচালনা আইন ও বিচারিক এখতিয়ার
            </h2>
            <p className="leading-relaxed">
              এই ব্যবহারের শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত হবে। কোনো বিরোধ দেখা দিলে তা ঢাকার বিজ্ঞ আদালত কর্তৃক নিষ্পত্তিযোগ্য হবে।
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                Legal Contract
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO Terms of Service</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Last Updated: October 2026 | Version 2.4</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              By accessing, registering for, or using the MASH ECO platform, merchant dashboard, storefront hosting services, or integrated APIs, you enter into a legally binding agreement governed by these Terms of Service. If you do not consent to all conditions specified herein, you must immediately terminate access to the platform.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              1. Platform Eligibility & Merchant Onboarding
            </h2>
            <p className="leading-relaxed">
              To operate a merchant store on MASH ECO, you must be at least 18 years old and possess the legal authority to conduct commercial business under applicable laws. You warrant that all information submitted during onboarding—including trade registration, contact details, and banking information—is true, current, and verifiable.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. Account Statuses & Super Admin Governance
            </h2>
            <p className="leading-relaxed mb-3">
              MASH ECO enforces an automated store lifecycle management system to protect consumers, merchants, and platform integrity.Administrators maintain systemic authority over merchant store states:
            </p>
            <div className="grid gap-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Status
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Your storefront is fully public, indexed, and accepting buyer checkouts. The merchant retains unrestricted read-write access to add products, modify themes, dispatch courier orders, and process payments.
                </p>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="font-bold text-blue-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> Inactive / Pending Status
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  The public storefront is offline. The merchant retains access to the dashboard to configure settings, upload products, map domains, and select an active subscription package before launch.
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Suspended Status (Read-Only Mode)
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Triggered by subscription expiration or policy investigation. The public storefront is taken offline. The merchant dashboard operates in <strong>Read-Only Mode</strong>: the merchant can view past orders, customer databases, download reports, contact support, and settle invoices, but creating or updating products and order dispatch is strictly locked.
                </p>
              </div>

              <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl">
                <span className="font-bold text-red-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" /> Banned Status
                </span>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Enforced for severe compliance infractions, fraud, counterfeit electronics, or platform abuse. All access to the merchant dashboard and public storefront is revoked immediately and permanently.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              3. Prohibited Products & Acceptable Use Policy
            </h2>
            <p className="leading-relaxed">
              Merchants are strictly liable for items listed on their store. Selling or promoting any of the following will lead to immediate store suspension or ban:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
              <li>Counterfeit electronics, knock-off hardware, or pirated software/firmware.</li>
              <li>Unauthorized hazardous chemicals, unlicensed weapons, or illicit pharmaceuticals.</li>
              <li>Material that infringes third-party copyright, trademarks, or violates national cybersecurity laws.</li>
              <li>Performing automated scraping, denial-of-service attempts, or reverse-engineering platform source code.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              4. Subscription Plans, Quotas & Financial Terms
            </h2>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li><strong>Quotas & Features:</strong> Product catalog caps, staff permissions, and custom domain mapping are determined by your active plan tier.</li>
              <li><strong>Billing & Renewals:</strong> Subscriptions are billed in advance on recurring monthly or annual billing terms.</li>
              <li><strong>No-Refund Policy:</strong> Software-as-a-Service fees are non-refundable once an active billing cycle has begun. Pro-rata credits may be issued under catastrophic platform downtime.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              5. Integrated Logistics & Courier Automation
            </h2>
            <p className="leading-relaxed">
              MASH ECO provides direct API connectivity with logistics partners including Steadfast, Pathao, and REDX. Once an order is forwarded to a courier, parcel handling, cash-on-delivery (COD) collection, and delivery fulfillment are managed between the merchant and the logistics provider. MASH ECO assumes no liability for courier transit delays, damaged goods, or courier fee disputes.
            </p>

            {/* CRITICAL: ACCOUNT TERMINATION / DELETION SECTION IN TERMS */}
            <div id="account-deletion-section" className="bg-red-50/80 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-red-700">
                <Trash2 className="w-7 h-7 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  6. Voluntary Account Deletion & Termination Procedure
                </h2>
              </div>

              <p className="text-gray-800 leading-relaxed font-medium">
                Merchants retain the right to terminate their store subscription and permanently delete their account at any time:
              </p>

              <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-700 leading-relaxed">
                <li>
                  <strong>Submission of Request:</strong> Initiation can be requested via Dashboard Account Settings or by written notice from the verified owner email to <code className="bg-white px-1.5 py-0.5 rounded text-red-600 font-bold">support@masheco.com</code>.
                </li>
                <li>
                  <strong>Settlement of Pending Transactions:</strong> The merchant must deliver all open customer orders, resolve return requests, and settle outstanding subscription fees prior to final deletion.
                </li>
                <li>
                  <strong>Permanent Data Erasure:</strong> Account deletion is permanent and irreversible. All products, order records, and store configurations will be permanently erased and cannot be restored.
                </li>
                <li>
                  <strong>Irrevocable Cascading Deletion:</strong> Upon authorization, the custom domain mapping and SSL cert are released, subdomains are unassigned, and database records across products, categories, orders, staff, and Cloudinary media are permanently eradicated.
                </li>
              </ol>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              7. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              MASH ECO provides its e-commerce platform and cloud services on an "as-is" and "as-available" basis with a 99.9% uptime objective. In no event shall MASH ECO be liable for lost profits, indirect damages, courier delays, or payment gateway outages. Total liability under any circumstance is capped at the total subscription fees paid by the merchant in the preceding 3 months.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              8. Governing Law & Dispute Resolution
            </h2>
            <p className="leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.
            </p>
          </div>
        )
      )}

      {/* ========================================================= */}
      {/* 3. COOKIE POLICY */}
      {/* ========================================================= */}
      {policyType === 'cookie-policy' && (
        lang === 'bn' ? (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                কুকি নির্দেশিকা
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO কুকি পলিসি (Cookie Policy)</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬ | সংস্করণ ২.৪</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              এই কুকি পলিসিতে বিস্তারিত ব্যাখ্যা করা হয়েছে কীভাবে MASH ECO প্ল্যাটফর্ম কুকি, ব্রাউজার লোকাল স্টোরেজ ও সেশন টোকেন ব্যবহার করে মার্চেন্ট ড্যাশবোর্ড নিরাপদে পরিচালনা করে এবং ক্রেতাদের নিরবচ্ছিন্ন কেনাকাটার অভিজ্ঞতা প্রদান করে।
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ১. আমরা যেসব কুকি ও লোকাল স্টোরেজ প্রযুক্তি ব্যবহার করি
            </h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0284c7]" /> অপরিহার্য অথেন্টিকেশন ও সেশন টোকেন (Strictly Necessary)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  মার্চেন্ট লগইন সেশন নিশ্চিত করতে এবং সুরক্ষিত JWT টোকেন নিরাপদে ধারণ করতে ব্যবহৃত হয়। এটি বন্ধ করলে মার্চেন্ট ড্যাশবোর্ডে লগইন করা বা অর্ডার ব্যবস্থাপনা করা সম্ভব নয়।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> সিকিউরিটি ও সাইবার প্রতিরক্ষা কুকি (Security & Protection)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cloudflare ও অভ্যন্তরীণ সিকিউরিটি লেয়ার দ্বারা পরিচালিত কুকি, যা সাইবার বট আক্রমণ, ব্রুট-ফোর্স পাসওয়ার্ড অ্যাটাক এবং CSRF জালিয়াতি প্রতিহত করতে সাহায্য করে।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" /> ড্যাশবোর্ড পছন্দ ও স্টেটাস কুকি (UI Preferences)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  মার্চেন্টের সাইডবার কোল্যাপ্স/এক্সপ্যান্ড স্টেট, ভাষা নির্বাচন (বাংলা বা ইংরেজি), নির্বাচিত থিম প্রিভিউ এবং টেবিল পেজিনেশন ফিল্টার মনে রাখতে ব্যবহৃত হয়।
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> ফ্রড চেক ও চেকআউট লিডস ট্র্যাকিং
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  স্টোরফ্রন্টে ড্রপ-অফ হওয়া চেকআউট লিড (অসমাপ্ত অর্ডার) শনাক্ত করতে এবং জাল অর্ডার যাচাই করতে ফ্রড স্কোরের সহায়ক সাময়িক ব্রাউজার সেশন ব্যবহার করা হয়।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. কুকি নিয়ন্ত্রণ ও পরিচালনা
            </h2>
            <p className="leading-relaxed">
              আপনি আপনার ব্রাউজার সেটিংসের মাধ্যমে যেকোনো সময় কুকি মুছে ফেলতে বা ব্লক করতে পারেন। তবে মনে রাখবেন, প্রয়োজনীয় সিকিউরিটি ও অথেন্টিকেশন কুকি বন্ধ করে দিলে মার্চেন্ট ড্যাশবোর্ডে প্রবেশের নিরাপত্তা ব্যাহত হবে।
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-sky-50 text-[#0284c7] text-xs font-bold rounded-full mb-2">
                Cookie Guidelines
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO Cookie Policy</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Last Updated: October 2026 | Version 2.4</p>
            </div>

            <p className="leading-relaxed text-base sm:text-lg">
              This Cookie Policy describes how MASH ECO utilizes cookies, HTML5 local storage, and secure authentication tokens to verify merchant identities, enforce cross-tenant security, and ensure seamless e-commerce performance.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              1. Categories of Cookies We Deploy
            </h2>
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0284c7]" /> Strictly Necessary Authentication Tokens
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Cryptographically signed JSON Web Tokens (JWT) maintaining your merchant administrative session. Disabling these cookies prevents secure dashboard authentication and order management.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security & Cloudflare Edge Protection
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Edge firewall cookies deployed via Cloudflare to distinguish genuine merchant requests from malicious automated bots, DDoS attacks, and CSRF attempts.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" /> UI State & Preference Storage
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Persistent local storage keys that remember your dashboard navigation state, collapsed sidebar status, preferred language (English / Bengali), and theme customization choices.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Checkout Leads & Fraud Telemetry
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Temporary session storage keys on the storefront capturing abandoned checkout customer leads and feeding telemetry to the algorithmic fraud check module.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. Cookie Management & Browser Controls
            </h2>
            <p className="leading-relaxed">
              You can adjust your cookie preferences through your web browser settings (Chrome, Firefox, Safari, Edge). Please note that disabling strictly necessary cookies will render the merchant dashboard inoperable.
            </p>
          </div>
        )
      )}

      {/* ========================================================= */}
      {/* 4. ACCOUNT DELETION (DEDICATED FULL VIEW) */}
      {/* ========================================================= */}
      {policyType === 'account-deletion' && (
        lang === 'bn' ? (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
                ডেটা ও অ্যাকাউন্ট অপসারণ নির্দেশিকা
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO মার্চেন্ট অ্যাকাউন্ট ডিলিটেশন প্রক্রিয়া</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">পূর্ণ স্বচ্ছতা ও আন্তর্জাতিক প্রাইভেসী নীতিমালার অধীনে পরিচালিত</p>
            </div>

            <div className="bg-red-50/70 border border-red-200 p-5 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-950 text-base">সতর্কবার্তা: অ্যাকাউন্ট ডিলিটেশন একটি অপরিবর্তনীয় প্রক্রিয়া</h4>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  আপনার অ্যাকাউন্ট একবার স্থায়ীভাবে মুছে ফেলা হলে আপনার পণ্য, ক্যাটালগ, গ্রাহকদের ডেটা, কুরিয়ার এপিআই কি এবং স্টোরের যাবতীয় ছবি চিরতরে মুছে যাবে। এটি পরবর্তীতে পুনরুদ্ধার করা সম্ভব নয়।
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-2">
              ১. ডিলিট করার পূর্বশর্তসমূহ (Pre-requisite Checklist)
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>পেন্ডিং অর্ডার ডেলিভারি সম্পন্ন করুন:</strong> আপনার স্টোরে গ্রাহকের দেওয়া সকল অর্ডার হয় ডেলিভারি সম্পন্ন করুন অথবা রিফান্ড নিশ্চিত করুন।
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>বকেয়া বিল পরিশোধ করুন:</strong> কোনো সাবস্ক্রিপশন ইনভয়েস বকেয়া থাকলে তা পরিশোধ করুন।
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ২. অ্যাকাউন্ট ডিলিটেশনের ৪টি পর্যায়
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">ধাপ ১: রিকোয়েস্ট সাবমিট করা</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  মার্চেন্ট ওনার তার ড্যাশবোর্ড থেকে Settings &gt; General &gt; Delete Store এ গিয়ে রিকোয়েস্ট জমা দিতে পারেন, অথবা রেজিস্টার্ড ইমেইল থেকে <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-red-600">support@masheco.com</code>-এ ইমেইল পাঠাতে পারেন।
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">ধাপ ২: ওনারশিপ ও ওটিপি ভেরিফিকেশন</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  হ্যাকিং বা অনিচ্ছাকৃত ডিলিটেশন প্রতিহত করতে স্টোরের মূল মালিকের মোবাইল নম্বরে এবং ইমেইলে একটি ভেরিফিকেশন কোড পাঠানো হবে।
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">ধাপ ৩: ১৪ দিনের কুলিং-অফ পিরিয়ড (Cooling-off Period)</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  রিকোয়েস্ট অনুমোদনের সাথে সাথে আপনার পাবলিক স্টোরফ্রন্ট অফলাইন হয়ে যাবে। পরবর্তী ১৪ দিন পর্যন্ত আপনি চাইলে সাপোর্ট টিমের সাথে কথা বলে অ্যাকাউন্টটি পুনরায় সক্রিয় করতে পারবেন।
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">ধাপ ৪: স্বয়ংক্রিয় ক্যাসকেডিং ডেটা ডিলিটেশন</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ১৪ দিন অতিক্রান্ত হলে আমাদের ক্লাউড ডেটাবেজে ACID ট্রানজ্যাকশনের মাধ্যমে নিচের সকল ডেটা স্বয়ংক্রিয়ভাবে চিরতরে ডিলিট করা হবে:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-xs text-gray-600">
                  <li>স্টোর প্রোফাইল এবং সাবডোমেন/কাস্টম ডোমেন বাইন্ডিং।</li>
                  <li>স্টোর ওনার এবং সকল স্টাফ ইউজার অ্যাকাউন্ট।</li>
                  <li>সকল প্রোডাক্ট, ক্যাটাগরি এবং ইনভেন্টরি লগ।</li>
                  <li>গ্রাহকদের অর্ডার হিস্ট্রি এবং ফ্রড চেক হিস্ট্রি।</li>
                  <li>সংরক্ষিত কুরিয়ার এপিআই ক্রেডেনশিয়ালস (Steadfast, Pathao, REDX)।</li>
                  <li>Cloudinary ক্লাউড স্টোরেজ থেকে সকল প্রোডাক্ট ও ব্যানার ইমেজ সম্পূর্ণ পার্জ (Purge)।</li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              ৩. জাতীয় কর ও অডিট আইনের ব্যতিক্রম
            </h2>
            <p className="leading-relaxed text-sm">
              বাংলাদেশের আয়কর আইন ও আর্থিক অডিট নীতিমালার বাধ্যবাধকতা অনুযায়ী পূর্বে পরিশোধিত সাবস্ক্রিপশন ইনভয়েস ও ট্যাক্স রেকর্ড আইনত নির্ধারিত সময়সীমা পর্যন্ত অপরিবর্তনীয় সিস্টেমে সংরক্ষিত থাকবে।
            </p>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                অ্যাকাউন্ট ডিলিটেশন সম্পর্কে সরাসরি কথা বলতে চাইলে যোগাযোগ করুন: <a href="mailto:support@masheco.com" className="text-[#0284c7] font-bold">support@masheco.com</a> অথবা হটলাইন: <span className="font-bold text-gray-900">(+৮৮০) ১৮৮০৮৪০৮৪৯</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-2">
                Merchant Offboarding & Data Deletion
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900">MASH ECO Account Deletion Process</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Conforming to GDPR standards and Bangladesh Data Privacy Guidelines</p>
            </div>

            <div className="bg-red-50/70 border border-red-200 p-5 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-950 text-base">Irreversible Action Notice</h4>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Permanent account deletion is an irrevocable action. Once executed, your merchant dashboard access, product listings, order records, customer databases, courier credentials, and media files will be permanently purged from our infrastructure.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-2">
              1. Pre-Deletion Checklist
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Complete Pending Orders:</strong> Fulfill all outstanding customer shipments or process immediate full refunds.
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Settle Invoices:</strong> Ensure there are no outstanding recurring subscription invoices.
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              2. The 4-Stage Deletion Procedure
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">Stage 1: Formal Request Submission</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The verified store owner submits an account deletion request via Dashboard Settings or by emailing <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-red-600">support@masheco.com</code> from the registered owner email address.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">Stage 2: Identity & Ownership Verification</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To prevent unauthorized destruction from compromised staff accounts, a two-factor verification OTP is delivered to the registered store owner's primary mobile phone and email.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">Stage 3: 14-Day Safety Grace Window</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upon verification, the storefront is immediately toggled offline to prevent new orders. A 14-day security grace period begins. During this window, the store owner may reverse the request by contacting support.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base mb-1">Stage 4: ACID Cascading Data Eradication</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  When the 14-day grace window expires, our cloud database executes a sequential transactional purge deleting:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-xs text-gray-600">
                  <li>Tenant record and release of custom domain / subdomain mappings.</li>
                  <li>Owner credentials and all associated staff accounts.</li>
                  <li>All products, categories, tags, and inventory records.</li>
                  <li>Complete order logs and fraud detection histories.</li>
                  <li>Stored courier credentials (Steadfast, Pathao, REDX).</li>
                  <li>Permanent API-driven deletion of all hosted media and product images from Cloudinary CDN.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pt-4 border-t border-gray-100">
              3. Regulatory Audit & Statutory Retention
            </h2>
            <p className="leading-relaxed text-sm">
              In adherence to Bangladesh National Board of Revenue (NBR) audit requirements and fiscal compliance laws, historical tax invoices and financial settlement receipts are retained in an immutable ledger for statutory accounting timeframes.
            </p>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Need immediate assistance regarding account deletion? Email our compliance team at <a href="mailto:support@masheco.com" className="text-[#0284c7] font-bold">support@masheco.com</a> or call <span className="font-bold text-gray-900">(+880) 1880840849</span>.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
