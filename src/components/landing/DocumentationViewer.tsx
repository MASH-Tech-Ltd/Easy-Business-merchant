'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Globe, 
  Truck, 
  ShieldAlert, 
  Trash2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Terminal, 
  AlertCircle, 
  ChevronRight, 
  Layers, 
  Key, 
  Server, 
  Sparkles,
  Info,
  Sliders,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';

type GuideId = 'getting-started' | 'custom-domains' | 'courier-automation' | 'fraud-protection' | 'account-deletion';

interface GuideMeta {
  id: GuideId;
  title: string;
  bnTitle: string;
  description: string;
  bnDescription: string;
  icon: any;
  badge: string;
}

const guidesList: GuideMeta[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    bnTitle: 'স্টোর সেটআপ ও পণ্য ব্যবস্থাপনা',
    description: 'Learn how to configure your store, set up your first product, and manage categories.',
    bnDescription: 'স্টোরের বেসিক তথ্য, ক্যাটাগরি ও প্রথম প্রোডাক্ট যুক্ত করার এবং থিম বাছাইয়ের সম্পূর্ণ গাইড।',
    icon: BookOpen,
    badge: 'Core Setup',
  },
  {
    id: 'custom-domains',
    title: 'Custom Domains',
    bnTitle: 'কাস্টম ডোমেন সংযোগ গাইড',
    description: 'Step-by-step instructions for mapping your own custom domain to your MASH ECO storefront.',
    bnDescription: 'আপনার কেনা নিজস্ব ডোমেন (যেমন www.yourstore.com) MASH ECO স্টোরে যুক্ত করার নিয়ম ও DNS রেকর্ড।',
    icon: Globe,
    badge: 'DNS & SSL',
  },
  {
    id: 'courier-automation',
    title: 'Courier Automation',
    bnTitle: 'কুরিয়ার অটোমেশন ও ডেলিভারি',
    description: 'Configure logistics integrations to automatically dispatch orders and track deliveries.',
    bnDescription: 'Steadfast, Pathao ও REDX কুরিয়ার এপিআই কানেক্ট করে ১-ক্লিকে পার্সেল বুকিং ও অটো ট্র্যাকিং।',
    icon: Truck,
    badge: 'Logistics',
  },
  {
    id: 'fraud-protection',
    title: 'Fraud Protection',
    bnTitle: 'ফ্রড চেক ও ঝুঁকি প্রতিরোধ',
    description: 'Understand how our fraud-check system scores orders and how to review flagged checkouts.',
    bnDescription: 'ভুয়া অর্ডার ও রিটার্ন ক্ষতি থেকে বাঁচতে AI ফ্রড স্কোর (০-১০০) যাচাই ও ডেলিভারি চার্জ সুরক্ষার নিয়ম।',
    icon: ShieldAlert,
    badge: 'AI Shield',
  },
  {
    id: 'account-deletion',
    title: 'Account Deletion Guide',
    bnTitle: 'অ্যাকাউন্ট ডিলিট ও ডেটা রিমুভাল',
    description: 'Step-by-step guide on account closure, data backup, and permanent data eradication.',
    bnDescription: 'মার্চেন্ট অ্যাকাউন্ট বাতিল, ডেটা এক্সপোর্ট এবং পার্মানেন্ট ডেটা মুছে ফেলার বিস্তারিত নিয়মাবলী।',
    icon: Trash2,
    badge: 'Data Privacy',
  },
];

export default function DocumentationViewer() {
  const [activeGuide, setActiveGuide] = useState<GuideId>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'bn' | 'en'>('en');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredGuides = guidesList.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.bnTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 text-left text-gray-700 w-full max-w-6xl mx-auto">
      {/* Top Banner & Language Selector */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#1e1b4b] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-purple-200 text-xs font-bold rounded-full mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {lang === 'bn' ? 'মার্চেন্ট হেল্প সেন্টার ও নলেজবেস' : 'Merchant Knowledgebase & Docs'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'bn' ? 'MASH ECO প্ল্যাটফর্ম ডকুমেন্টেশন' : 'MASH ECO Platform Documentation'}
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base mt-2 leading-relaxed">
              {lang === 'bn'
                ? 'আপনার ই-কমার্স স্টোর সেটআপ, কাস্টম ডোমেন ম্যাপিং, অটো কুরিয়ার ডিসপ্যাচ এবং ফ্রড প্রতিরোধ সম্পর্কিত সম্পূর্ণ টিউটোরিয়াল ও দিকনির্দেশনা।'
                : 'Comprehensive tutorials, step-by-step guides, DNS records, and best practices to maximize the potential of your MASH ECO merchant storefront.'}
            </p>
          </div>

          {/* Language Switcher */}
          <div className="inline-flex items-center p-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-inner self-start md:self-center">
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'bn'
                  ? 'bg-white text-[#5022C3] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🇧🇩</span> বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-[#5022C3] shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🌐</span> English
            </button>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative mt-8 max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'ডকুমেন্টেশন খুঁজুন (যেমন: DNS, Steadfast, Fraud Score, Theme)...' : 'Search documentation guides (e.g., DNS, Steadfast, Fraud score, Domain)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-indigo-200/70 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-2 focus:ring-[#5022C3] transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Guide Cards Grid (Matching the exact 4 cards requested in the screenshot + Account Deletion) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {lang === 'bn' ? 'প্রয়োজনীয় গাইডসমূহ' : 'Featured Guides'}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {filteredGuides.length} {lang === 'bn' ? 'টি গাইড উপলব্ধ' : 'guides available'}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide) => {
            const IconComponent = guide.icon;
            const isSelected = activeGuide === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => {
                  setActiveGuide(guide.id);
                  const el = document.getElementById('guide-detail-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#5022C3] bg-purple-50/50 shadow-md ring-4 ring-[#5022C3]/10'
                    : 'border-gray-200/80 bg-white hover:border-[#5022C3]/40 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#5022C3] text-white' : 'bg-gray-100 text-gray-700 group-hover:bg-[#5022C3]/10 group-hover:text-[#5022C3]'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {guide.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5022C3] transition-colors">
                    {lang === 'bn' ? guide.bnTitle : guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? guide.bnDescription : guide.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#5022C3]">
                  <span>{lang === 'bn' ? 'সম্পূর্ণ গাইড পড়ুন' : 'Read Guide'} &rarr;</span>
                  {isSelected && <span className="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">Viewing</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED GUIDE SECTION CONTAINER */}
      <div id="guide-detail-section" className="pt-6">
        {/* Navigation Tabs for quick switching */}
        <div className="flex items-center overflow-x-auto pb-3 gap-2 border-b border-gray-200 no-scrollbar">
          {guidesList.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGuide(g.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeGuide === g.id
                  ? 'bg-[#5022C3] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang === 'bn' ? g.bnTitle : g.title}
            </button>
          ))}
        </div>

        {/* GUIDE CONTENT AREA */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm mt-6">

          {/* ========================================================= */}
          {/* GUIDE 1: GETTING STARTED */}
          {/* ========================================================= */}
          {activeGuide === 'getting-started' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-[#5022C3] rounded-full">
                  Step-by-Step Tutorial
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {lang === 'bn' ? 'স্টোর সেটআপ ও প্রথম পণ্য প্রকাশের গাইড' : 'Getting Started: Store Setup & First Product'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'bn' 
                    ? 'আপনার MASH ECO স্টোরটি সম্পূর্ণ প্রস্তুত করে লাইভ করার জন্য এই ধাপগুলো অনুসরণ করুন।'
                    : 'Follow this guide to configure your store branding, add categories, create products, and go live.'}
                </p>
              </div>

              {/* Step 1 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#5022C3] text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                  {lang === 'bn' ? 'স্টোরের প্রাথমিক প্রোফাইল সেটআপ (Store Settings)' : 'Configure Store Identity & Brand Details'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>ড্যাশবোর্ডের <strong>Settings &gt; General</strong> মেনুতে যান। এখানে আপনার স্টোরের নাম, কাস্টমার সাপোর্ট ফোন নম্বর, যোগাযোগের ইমেইল এবং ব্যবসার ঠিকানা প্রদান করুন। এছাড়া আপনার স্টোরের ব্র্যান্ড লোগো এবং ফেভিকন (Favicon) আপলোড করুন।</>
                  ) : (
                    <>Navigate to <strong>Settings &gt; General</strong> in your merchant dashboard. Enter your store name, official customer support hotline, email, and business physical address. Upload your high-resolution store logo and browser favicon.</>
                  )}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>{lang === 'bn' ? 'টিপ্স:' : 'Pro Tip:'}</strong>{' '}
                    {lang === 'bn' 
                      ? 'লোগো হিসেবে স্বচ্ছ ব্যাকগ্রাউন্ডের (Transparent PNG) ফাইল ব্যবহার করলে সব থিমেই এটি সুন্দরভাবে প্রদর্শিত হয়।'
                      : 'Use a high-resolution transparent PNG (at least 400x120px) for your store logo to ensure crisp rendering across all 5 built-in storefront themes.'}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#5022C3] text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                  {lang === 'bn' ? 'ক্যাটাগরি তৈরি করুন (Manage Categories)' : 'Create Categories for Structured Cataloging'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>পণ্য যোগ করার আগে পণ্য সাজাতে ক্যাটাগরি তৈরি করুন। <strong>Categories &gt; Add New</strong>-এ ক্লিক করে ক্যাটাগরির নাম (যেমন: স্মার্টফোন, স্মার্টওয়াচ, গ্যাজেট) লিখুন এবং আইকন যুক্ত করুন।</>
                  ) : (
                    <>Before listing products, organize your catalog by navigating to <strong>Categories &gt; Add New</strong>. Enter your category title (e.g., Smartphones, Smartwatches, Audio, Accessories), assign category banners, and define category slugs.</>
                  )}
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#5022C3] text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                  {lang === 'bn' ? 'আপনার প্রথম প্রোডাক্ট আপলোড করুন (Add Product)' : 'Publish Your First Product Listing'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <><strong>Products &gt; Add Product</strong> অপশনে যান। পণ্যের আকর্ষণীয় শিরোনাম, বিস্তারিত স্পেসিফিকেশন, নিয়মিত মূল্য (Regular Price) এবং বিক্রয় মূল্য (Sale Price) নির্ধারণ করুন। স্টকের সঠিক সংখ্যা (Quantity) দিন এবং একাধিক আকর্ষণীয় পণ্যের ছবি আপলোড করুন।</>
                  ) : (
                    <>Go to <strong>Products &gt; Add Product</strong>. Input product title, detailed description, technical specifications, Regular Price vs. Discounted Sale Price, inventory SKU, and stock count. Upload multiple product photos (Cloudinary auto-optimizes all image resolutions).</>
                  )}
                </p>
              </div>

              {/* Step 4 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#5022C3] text-white rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                  {lang === 'bn' ? 'থিম ও স্টোরফ্রন্ট প্রিভিউ (Theme Customization)' : 'Select & Preview Your Storefront Theme'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>ড্যাশবোর্ডের <strong>Themes</strong> সেকশনে গিয়ে আমাদের ৫টি প্রিমিয়াম থিমের যেকোনোটি নির্বাচন করুন। আপনি থিমের অ্যাকসেন্ট কালার, ব্যানার স্লাইডার এবং অ্যানাউন্সমেন্ট বার কাস্টমাইজ করতে পারবেন।</>
                  ) : (
                    <>Head over to the <strong>Themes</strong> section. Choose from our 5 high-converting e-commerce templates (Design 01 through Design 05). You can adjust primary brand colors, setup hero carousel banners, promotional badges, and navigation links without touching any code.</>
                  )}
                </p>
              </div>

              {/* Step 5 */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#5022C3] text-white rounded-lg flex items-center justify-center text-sm font-bold">5</span>
                  {lang === 'bn' ? 'স্টোর মোড: অনলাইন ও অফলাইন টগল' : 'Store Availability: Online vs Offline Toggle'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>আপনার স্টোরে কাজ চলার সময় বা ছুটির দিনে আপনি স্টোরটিকে <strong>Offline</strong> করে রাখতে পারেন। স্টোর প্রস্তুত হয়ে গেলে এক ক্লিকে <strong>Online</strong> করে দিন—যাতে ক্রেতারা নিরাপদে অর্ডার প্লেস করতে পারেন।</>
                  ) : (
                    <>In your merchant header or store settings, you can toggle your storefront between <strong>Online</strong> and <strong>Offline</strong> modes. When offline, visiting buyers see a polite maintenance message while you update inventory or prepare sales campaigns.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GUIDE 2: CUSTOM DOMAINS */}
          {/* ========================================================= */}
          {activeGuide === 'custom-domains' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  DNS Configuration Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {lang === 'bn' ? 'কাস্টম ডোমেন সংযোগ ও DNS কনফিগারেশন' : 'Custom Domain Setup & DNS Mapping'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'bn' 
                    ? 'আপনার নিজস্ব ডোমেন (যেমন www.yourbrand.com) সংযুক্ত করার পূর্ণাঙ্গ নির্দেশিকা।'
                    : 'Step-by-step instructions for pointing your domain registrar to MASH ECO servers with automated free SSL.'}
                </p>
              </div>

              {/* Requirement Alert */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#5022C3] shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-900 leading-relaxed">
                  <strong>{lang === 'bn' ? 'ডোমেন ফরম্যাট সতর্কতা:' : 'Format Requirement:'}</strong>{' '}
                  {lang === 'bn' 
                    ? 'ডোমেনটি অবশ্যই "www" সহ যুক্ত করতে হবে (উদাহরণ: www.mystore.com)। কোনো http:// বা https:// যুক্ত করবেন না।'
                    : 'Your custom domain must be formatted with the "www" prefix (e.g., www.yourstore.com). Do not include http://, https://, or trailing slashes.'}
                </div>
              </div>

              {/* DNS Records Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {lang === 'bn' ? 'যে DNS রেকর্ডগুলো আপনার ডোমেন প্রোভাইডারে বসাতে হবে:' : 'Required DNS Records (Add in Namecheap/GoDaddy/Cloudflare):'}
                </h3>

                <div className="grid gap-4">
                  {/* Record 1 */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
                        Record 1: Root Domain
                      </span>
                      <button
                        onClick={() => copyToClipboard('merchant.masheco.com', 'Value')}
                        className="text-xs text-[#5022C3] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" /> {lang === 'bn' ? 'ভ্যালু কপি করুন' : 'Copy Value'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block">Type</span>
                        <span className="font-bold text-gray-900">CNAME (or ALIAS/ANAME)</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Host / Name</span>
                        <span className="font-bold text-gray-900">@</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Target / Value</span>
                        <code className="font-mono font-bold text-[#5022C3] bg-white px-2 py-0.5 rounded border border-gray-200">
                          merchant.masheco.com
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Record 2 */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
                        Record 2: WWW Subdomain
                      </span>
                      <button
                        onClick={() => copyToClipboard('merchant.masheco.com', 'Value')}
                        className="text-xs text-[#5022C3] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" /> {lang === 'bn' ? 'ভ্যালু কপি করুন' : 'Copy Value'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block">Type</span>
                        <span className="font-bold text-gray-900">CNAME</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Host / Name</span>
                        <span className="font-bold text-gray-900">www</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Target / Value</span>
                        <code className="font-mono font-bold text-[#5022C3] bg-white px-2 py-0.5 rounded border border-gray-200">
                          merchant.masheco.com
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {lang === 'bn' ? 'ধাপে ধাপে সংযোগ করার উপায়:' : 'Execution Steps:'}
                </h3>
                <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-600 leading-relaxed">
                  <li>
                    <strong>{lang === 'bn' ? 'ডোমেন কন্ট্রোল প্যানেলে লগইন করুন:' : 'Log in to your Domain Registrar:'}</strong>{' '}
                    {lang === 'bn'
                      ? 'যেখান থেকে ডোমেন কিনেছেন (যেমন: Namecheap, GoDaddy, Hostinger, Cloudflare) সেখানে লগইন করে ডোমেনের "DNS Management" বা "Manage DNS" সেকশনে যান।'
                      : 'Sign into the provider where you purchased your domain (Namecheap, GoDaddy, Cloudflare, etc.) and locate the DNS Records or Advanced DNS management area.'}
                  </li>
                  <li>
                    <strong>{lang === 'bn' ? 'আগের অপ্রয়োজনীয় রেকর্ড রিমুভ করুন:' : 'Remove conflicting A/CNAME records:'}</strong>{' '}
                    {lang === 'bn'
                      ? 'যদি আগে থেকে @ বা www-এর জন্য কোনো পার্কিং পেজ বা অন্য হোস্টিংয়ের রেকর্ড থাকে, তা ডিলিট করুন।'
                      : 'Delete any default placeholder parking page A records or CNAME records mapped to @ or www.'}
                  </li>
                  <li>
                    <strong>{lang === 'bn' ? 'উপরের ২টি CNAME রেকর্ড যুক্ত করুন:' : 'Add the two CNAME records above:'}</strong>{' '}
                    {lang === 'bn'
                      ? 'টার্গেট ভ্যালু হিসেবে "merchant.masheco.com" বসিয়ে সেভ করুন। TTL রাখুন Automatic অথবা 1/2 Hour।'
                      : 'Insert the records pointing to merchant.masheco.com. Set TTL to Automatic or lowest possible value.'}
                  </li>
                  <li>
                    <strong>{lang === 'bn' ? 'MASH ECO ড্যাশবোর্ডে ডোমেন সাবমিট করুন:' : 'Save in MASH ECO Dashboard:'}</strong>{' '}
                    {lang === 'bn'
                      ? 'ড্যাশবোর্ডের Settings &gt; Domain পেইজে গিয়ে আপনার ডোমেনটি (যেমন www.yourstore.com) লিখে "Connect Domain" এ ক্লিক করুন।'
                      : 'In your merchant dashboard, open Settings &gt; Domain, enter www.yourstore.com, and click "Connect Domain".'}
                  </li>
                  <li>
                    <strong>{lang === 'bn' ? 'অটোমেটিক SSL ইস্যু ও অ্যাক্টিভেশন:' : 'Automatic SSL Provisioning:'}</strong>{' '}
                    {lang === 'bn'
                      ? 'আমাদের ব্যাকএন্ড Cloudflare এজের মাধ্যমে স্বয়ংক্রিয়ভাবে DNS ভেরিফাই করে ফ্রি SSL সার্টিফিকেট ইস্যু করে দিবে। সাধারণত ৫ থেকে ৩০ মিনিটের মধ্যে স্ট্যাটাস "Active" হয়ে যায়।'
                      : 'Our cloud edge network automatically detects the DNS propagation and provisions a free, auto-renewing SSL certificate. The status transitions to "Connected" within 5 to 30 minutes.'}
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs sm:text-sm font-bold text-emerald-900">
                    {lang === 'bn' ? 'ফ্রি SSL সার্টিফিকেট আজীবন নবায়নযোগ্য অন্তর্ভুক্ত।' : 'Includes 100% Free Auto-Renewing SSL Certificate.'}
                  </span>
                </div>
                <Link
                  href="/dashboard/domain"
                  className="px-3.5 py-1.5 bg-[#5022C3] hover:bg-[#401a9c] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {lang === 'bn' ? 'ডোমেন পেইজে যান' : 'Go to Domain Settings'} &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GUIDE 3: COURIER AUTOMATION */}
          {/* ========================================================= */}
          {activeGuide === 'courier-automation' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Logistics Integration
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {lang === 'bn' ? 'কুরিয়ার অটোমেশন ও স্বয়ংক্রিয় পার্সেল বুকিং' : 'Courier Automation & One-Click Shipping'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'bn'
                    ? 'Steadfast, Pathao ও REDX কুরিয়ার এপিআই কনফিগারেশন এবং অর্ডার ট্র্যাকিং সিঙ্ক গাইড।'
                    : 'Automate parcel fulfillment with Steadfast, Pathao, and REDX. Live consignment generation and status sync.'}
                </p>
              </div>

              {/* Supported Couriers */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 text-center">
                  <img src="/Courier_images/steadfast_courier.jpg" alt="Steadfast" className="w-12 h-12 rounded-xl mx-auto mb-2 object-cover" />
                  <h4 className="font-bold text-gray-900 text-sm">Steadfast Courier</h4>
                  <p className="text-xs text-gray-500 mt-1">{lang === 'bn' ? 'API Key ও Secret Key প্রয়োজন' : 'Requires API Key & Secret Key'}</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 text-center">
                  <img src="/Courier_images/pathao_courier.png" alt="Pathao" className="w-12 h-12 rounded-xl mx-auto mb-2 object-cover" />
                  <h4 className="font-bold text-gray-900 text-sm">Pathao Courier</h4>
                  <p className="text-xs text-gray-500 mt-1">{lang === 'bn' ? 'Client ID, Secret ও Store ID' : 'Client ID, Secret & Store ID'}</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 text-center">
                  <img src="/Courier_images/redx-logo.png" alt="REDX" className="w-12 h-12 rounded-xl mx-auto mb-2 object-cover" />
                  <h4 className="font-bold text-gray-900 text-sm">REDX Courier</h4>
                  <p className="text-xs text-gray-500 mt-1">{lang === 'bn' ? 'App Secret ও Token' : 'App Secret & API Token'}</p>
                </div>
              </div>

              {/* Step 1: Charges */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                  {lang === 'bn' ? 'ঢাকার ভেতরে ও বাইরে ডেলিভারি চার্জ নির্ধারণ' : 'Set Inside & Outside Dhaka Delivery Charges'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>ড্যাশবোর্ডের <strong>Courier &gt; Settings</strong> এ গিয়ে ঢাকার ভেতরের চার্জ (যেমন: ৳৬০) এবং ঢাকার বাইরের ডেলিভারি চার্জ (যেমন: ৳১২০) সেট করুন। ক্রেতারা চেকআউট করার সময় তাদের জেলা অনুযায়ী স্বয়ংক্রিয়ভাবে সঠিক চার্জ যুক্ত হয়ে যাবে।</>
                  ) : (
                    <>Go to <strong>Courier &gt; Settings</strong>. Configure your standard delivery rate Inside Dhaka (e.g. ৳60 or ৳70) and Outside Dhaka (e.g. ৳120 or ৳130). The storefront checkout dynamically applies these fees based on the customer district.</>
                  )}
                </p>
              </div>

              {/* Step 2: Forwarding */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                  {lang === 'bn' ? '১-ক্লিকে অর্ডার কুরিয়ারে বুকিং (One-Click Dispatch)' : 'One-Click Forwarding to Courier'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>যখন কোনো গ্রাহক অর্ডার করে, <strong>Orders</strong> পেইজে গিয়ে অর্ডারের পাশে থাকা "Forward to Courier" বাটনে ক্লিক করুন। আপনার পছন্দের কুরিয়ার (Steadfast/Pathao) সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে কুরিয়ার সিস্টেমে পার্সেল এন্ট্রি হয়ে যাবে এবং একটি Consignment ID ও লাইভ ট্র্যাকিং লিঙ্ক তৈরি হবে।</>
                  ) : (
                    <>When a new order arrives, go to <strong>Orders</strong>, click "Forward to Courier", and pick your active logistics provider. MASH ECO programmatically transmits buyer recipient details, invoice amount (COD), and parcel notes via the courier API, instantaneously generating a live Consignment ID and tracking URL.</>
                  )}
                </p>
              </div>

              {/* Step 3: Status Lock */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                  {lang === 'bn' ? 'স্বয়ংক্রিয় ২৪/৭ ট্র্যাকিং সিঙ্ক ও স্ট্যাটাস লক' : '24/7 Automated Background Sync & Status Lock'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === 'bn' ? (
                    <>অর্ডার কুরিয়ারে চলে যাওয়ার পর আমাদের ব্যাকএন্ড সার্ভার প্রতি ঘণ্টায় কুরিয়ারের সাথে স্ট্যাটাস সিঙ্ক করে (In Transit, Delivered, Partial Delivery, Returned)। একবার কুরিয়ারে দেওয়া হলে কোনো বিভ্রান্তি এড়াতে ম্যানুয়াল স্ট্যাটাস পরিবর্তন লক থাকে যাতে ভুলবশত কোনো হিসাব গরমিল না হয়।</>
                  ) : (
                    <>Once dispatched, our automated background sync cron polls courier tracking servers periodically to update your dashboard status (In Transit, Delivered, Returned, Cancelled). Manual status tampering is strictly locked once an order is assigned to a courier, ensuring seamless accounting alignment with courier settlement sheets.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GUIDE 4: FRAUD PROTECTION */}
          {/* ========================================================= */}
          {activeGuide === 'fraud-protection' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Loss Prevention
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {lang === 'bn' ? 'AI ফ্রড প্রটেকশন ও রিটার্ন ক্ষতি প্রতিরোধ গাইড' : 'Fraud Protection & COD Return Risk Management'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'bn' 
                    ? 'ভুয়া অর্ডার ও রিটার্ন ডেলিভারি চার্জের ক্ষতি থেকে বাঁচতে ফ্রড স্কোরের সঠিক ব্যবহার।'
                    : 'Prevent Cash-on-Delivery return penalties and fake orders using our built-in 0-100 fraud scoring engine.'}
                </p>
              </div>

              {/* Score breakdown cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/70">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    Score: 0 - 30
                  </span>
                  <h4 className="font-bold text-emerald-950 mt-2">🟢 Safe (নিরাপদ ক্রেতা)</h4>
                  <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                    {lang === 'bn' 
                      ? 'উচ্চ ডেলিভারি সাকসেস রেট (>৯০%)। নিশ্চিন্তে অর্ডার কুরিয়ারে পাঠিয়ে দিন।'
                      : 'High completion rate (>90%), valid verified phone history. Safe to dispatch immediately.'}
                  </p>
                </div>

                <div className="border border-amber-200 rounded-2xl p-4 bg-amber-50/70">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-800">
                    Score: 31 - 70
                  </span>
                  <h4 className="font-bold text-amber-950 mt-2">🟡 Suspicious (সতর্কতা)</h4>
                  <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                    {lang === 'bn' 
                      ? 'নতুন নম্বর অথবা পূর্ববর্তী বাতিল হিস্ট্রি আছে। কুরিয়ারে দেওয়ার আগে ফোনে কথা বলুন।'
                      : 'Moderate risk or low historical order volume. Phone confirmation recommended before dispatch.'}
                  </p>
                </div>

                <div className="border border-red-200 rounded-2xl p-4 bg-red-50/70">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-200 text-red-800">
                    Score: 71 - 100
                  </span>
                  <h4 className="font-bold text-red-950 mt-2">🔴 High Risk (উচ্চ ঝুঁকি)</h4>
                  <p className="text-xs text-red-900/80 mt-1 leading-relaxed">
                    {lang === 'bn' 
                      ? 'ভুয়া অর্ডার বা একাধিকবার পার্সেল রিটার্নের রেকর্ড। অগ্রিম ডেলিভারি চার্জ ছাড়া পাঠাবেন না।'
                      : 'History of repeated fake orders or refused deliveries. Never ship without collecting advance delivery fee.'}
                  </p>
                </div>
              </div>

              {/* Best practices checklist */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {lang === 'bn' ? 'মার্চেন্টদের জন্য ফ্রড প্রতিরোধে সেরা কার্যপ্রণালী:' : 'Best Practice Merchant Protocol for High-Risk Orders:'}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <strong>{lang === 'bn' ? '১. অর্ডারের পাশে "Check Fraud" বাটনে ক্লিক করুন:' : '1. Run Fraud Check on Orders Table:'}</strong>{' '}
                      {lang === 'bn'
                        ? 'প্রতিটি নতুন অর্ডারের পাশে একটি "Check Fraud" আইকন দেখতে পাবেন। এতে ক্লিক করলে তাৎক্ষণিকভাবে ফ্রড স্কোর ও হিস্ট্রি বিস্তারিত দেখা যায়।'
                        : 'Click the "Check Fraud" icon beside each order. The engine evaluates phone reputation, network delivery rates, and flag reasons.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <strong>{lang === 'bn' ? '২. উচ্চ ঝুঁকিপূর্ণ অর্ডারে অগ্রিম ডেলিভারি চার্জ নিন:' : '2. Collect Advance Delivery Fee for Suspicious/High-Risk Orders:'}</strong>{' '}
                      {lang === 'bn'
                        ? 'যদি কোনো অর্ডারের স্কোর ৬০-এর উপরে হয়, তবে কাস্টমারকে ফোন করে ১০০ থেকে ১৫০ টাকা ডেলিভারি চার্জ bKash বা Nagad-এ অগ্রিম গ্রহণ করুন। এতে কাস্টমার সত্যি নিতে আগ্রহী কিনা তা নিশ্চিত হওয়া যায় এবং রিটার্ন চার্জের ক্ষতি এড়ানো যায়।'
                        : 'If an order scores >60, call the buyer and request an advance delivery deposit (৳100 - ৳150) via bKash/Nagad. This confirms authentic buyer intent and protects your cash-flow against return freight fees.'}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <strong>{lang === 'bn' ? '৩. ফেক বা ভুয়া অর্ডার রিজেক্ট করুন:' : '3. Cancel Unverified / Abusive Orders:'}</strong>{' '}
                      {lang === 'bn'
                        ? 'ফোন বন্ধ থাকলে বা উল্টাপাল্টা ঠিকানা দিলে অর্ডারটি সাথে সাথে "Cancelled" মার্ক করুন।'
                        : 'If buyer contact numbers are repeatedly unreachable or addresses are incomplete/gibberish, mark the order Cancelled.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* GUIDE 5: ACCOUNT DELETION */}
          {/* ========================================================= */}
          {activeGuide === 'account-deletion' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-5">
                <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full">
                  Account Management & Offboarding
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {lang === 'bn' ? 'অ্যাকাউন্ট ডিলিট ও ডেটা পার্জ করার গাইড' : 'Account Deletion & Data Purge Guide'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {lang === 'bn'
                    ? 'আপনার স্টোর স্থায়ীভাবে ডিলিট করার নিয়মাবলী, প্রয়োজনীয় ব্যাকআপ এবং ক্যাসকেডিং ডেটা ডিলিটেশন।'
                    : 'Comprehensive instructions for store owners requesting account cancellation, exports, and permanent data eradication.'}
                </p>
              </div>

              {/* Warning */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-900 leading-relaxed">
                  <strong>{lang === 'bn' ? 'স্থায়ী পদক্ষেপের সতর্কতা:' : 'Irrevocable Action Warning:'}</strong>{' '}
                  {lang === 'bn'
                    ? 'অ্যাকাউন্ট ডিলিট প্রক্রিয়া সম্পন্ন হলে এটি পুনরুদ্ধার করা সম্ভব নয়। আপনার সকল পণ্য, ছবি ও কাস্টমার ডেটা স্থায়ীভাবে ধ্বংস করা হবে।'
                    : 'Account eradication cannot be undone. Once the deletion is verified and processed, all products, images, and order histories are permanently erased.'}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {lang === 'bn' ? 'ডিলিট করার পূর্বে প্রয়োজনীয় ধাপসমূহ:' : 'Recommended Offboarding Steps:'}
                </h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      {lang === 'bn' ? '১. পেন্ডিং অর্ডার ডেলিভারি' : '1. Complete Active Orders'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'bn'
                        ? 'কুরিয়ারে থাকা সকল পার্সেলের ডেলিভারি ও কাস্টমার রিফান্ড সম্পূর্ণ নিষ্পত্তি করুন।'
                        : 'Ensure all in-transit parcels are delivered and resolve any open buyer refund inquiries.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      {lang === 'bn' ? '২. রিকোয়েস্ট সাবমিশন' : '2. Submit Deletion Request'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'bn'
                        ? 'আপনার রেজিস্টার্ড ইমেইল থেকে support@masheco.com এ অ্যাকাউন্ট ডিলিটের মেইল দিন অথবা সেটিংস থেকে সাবমিট করুন।'
                        : 'Email support@masheco.com from your registered merchant owner email or use the in-dashboard deletion form.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      {lang === 'bn' ? '৩. ১৪ দিনের কুলিং-অফ পিরিয়ড' : '3. 14-Day Cooling-off Grace Period'}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {lang === 'bn'
                        ? 'রিকোয়েস্টের পর ১৪ দিনের একটি গ্রেস পিরিয়ড পাবেন, যার মধ্যে আপনি চাইলে ডিলিটেশন বাতিল করতে পারেন।'
                        : 'A 14-day safety window prevents accidental data loss. After 14 days, automated ACID database purging executes.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                <div>
                  <span className="font-bold text-gray-900">{lang === 'bn' ? 'পূর্ণাঙ্গ আইনি নীতিমালা দেখতে চান?' : 'Need full legal terms?'}</span>{' '}
                  <span className="text-gray-600">{lang === 'bn' ? 'আমাদের ডেডিকেটেড অ্যাকাউন্ট ডিলিটেশন পলিসি পড়ুন।' : 'Read our full Account Deletion & Data Policy.'}</span>
                </div>
                <Link
                  href="/landing/account-deletion"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all whitespace-nowrap shadow-xs"
                >
                  {lang === 'bn' ? 'অ্যাকাউন্ট ডিলিটেশন পলিসি' : 'View Full Policy'} &rarr;
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
