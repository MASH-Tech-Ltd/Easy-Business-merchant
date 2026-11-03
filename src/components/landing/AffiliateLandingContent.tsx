'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Calculator,
  Gift,
  Wallet,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export interface AffiliatePublicConfig {
  defaultCommissionRate: number;
  commissionDurationMonths: number;
  minimumWithdrawalAmount: number;
  extraTrialDaysForReferredMerchant: number;
}

interface AffiliateLandingContentProps {
  initialConfig: AffiliatePublicConfig;
  affiliateBaseUrl: string;
}

export default function AffiliateLandingContent({
  initialConfig,
  affiliateBaseUrl,
}: AffiliateLandingContentProps) {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [calcPaidAmount, setCalcPaidAmount] = useState<number>(499);
  const [calcMerchants, setCalcMerchants] = useState<number>(10);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cleanBaseUrl = affiliateBaseUrl.replace(/\/$/, '') || 'https://affiliate.masheco.com';
  const registerUrl = `${cleanBaseUrl}/register`;
  const loginUrl = `${cleanBaseUrl}/login`;

  const rate = initialConfig.defaultCommissionRate || 30;
  const duration = initialConfig.commissionDurationMonths || 6;
  const minWithdraw = initialConfig.minimumWithdrawalAmount || 100;
  const extraTrial = initialConfig.extraTrialDaysForReferredMerchant || 10;

  const perPaymentCommission =
    Math.round((calcPaidAmount * (rate / 100) + Number.EPSILON) * 100) / 100;
  const monthlyTotalAllMerchants =
    Math.round((perPaymentCommission * calcMerchants + Number.EPSILON) * 100) / 100;
  const sixMonthTotal =
    Math.round((perPaymentCommission * duration * calcMerchants + Number.EPSILON) * 100) / 100;

  const faqs =
    lang === 'bn'
      ? [
          {
            q: 'MASH ECO অ্যাফিলিয়েট প্রোগ্রাম কীভাবে কাজ করে?',
            a: `আপনি affiliate.masheco.com-এ ফ্রি পার্টনার অ্যাকাউন্ট তৈরি করলে একটি ইউনিক রেফারেল লিংক ও কোড পাবেন। কোনো মার্চেন্ট আপনার লিংক বা কোড ব্যবহার করে রেজিস্টার করার পর প্রথম ${duration} মাসের মধ্যে যতবার সাবস্ক্রিপশন পেমেন্ট করবেন, প্রতিটি পেমেন্টের ওপর আপনি স্বয়ংক্রিয়ভাবে ${rate}% কমিশন পাবেন।`,
          },
          {
            q: 'রেফারকৃত মার্চেন্টরা কী বিশেষ সুবিধা পাবেন?',
            a: `আপনার রেফারেল লিংক বা কোড ব্যবহার করে নতুন মার্চেন্ট রেজিস্টার করলেই তারা সাধারণ ফ্রি ট্রায়ালের পাশাপাশি অতিরিক্ত +${extraTrial} দিন বোনাস ফ্রি ট্রায়াল পাবেন।`,
          },
          {
            q: 'কমিশনের টাকা কীভাবে এবং কখন উত্তোলন করা যায়?',
            a: `আপনার অ্যাফিলিয়েট ওয়ালেটে ন্যূনতম ৳${minWithdraw} জমা হলেই আপনি বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket) অথবা ব্যাংক ট্রান্সফারের মাধ্যমে উইথড্রয়াল রিকোয়েস্ট পাঠাতে পারবেন।`,
          },
          {
            q: 'কারা MASH ECO অ্যাফিলিয়েট পার্টনার হতে পারবেন?',
            a: 'ডিজিটাল মার্কেটার, কন্টেন্ট ক্রিয়েটর, ফ্রিল্যান্সার, ওয়েব এজেন্সি, ই-কমার্স কনসালটেন্ট এবং বর্তমান মার্চেন্টসহ যে কেউ ফ্রি রেজিস্ট্রেশন করে অ্যাফিলিয়েট পার্টনার হতে পারবেন।',
          },
        ]
      : [
          {
            q: 'How does the MASH ECO Affiliate Partner Program work?',
            a: `Once you register a free partner account at affiliate.masheco.com, you receive a unique referral link and partner code. Whenever a referred merchant pays for any subscription plan during their first ${duration} months, ${rate}% of their actual paid amount is automatically credited to your affiliate wallet.`,
          },
          {
            q: 'Do referred merchants receive any special bonus?',
            a: `Yes! Every new merchant who signs up using your referral link or code automatically receives +${extraTrial} extra free trial days on top of the standard trial period.`,
          },
          {
            q: 'How and when can I withdraw my affiliate earnings?',
            a: `As soon as your available balance reaches ৳${minWithdraw}, you can request a fast payout directly to your bKash, Nagad, Rocket, or Bank account from your Affiliate Dashboard.`,
          },
          {
            q: 'Who can join the MASH ECO Affiliate Program?',
            a: 'Digital marketers, content creators, agencies, freelancers, e-commerce consultants, and entrepreneurs across Bangladesh can join for free and start earning recurring commissions.',
          },
        ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-14 md:pt-18 pb-14 sm:pb-20 overflow-hidden bg-gradient-to-b from-[#e0f2fe]/70 via-[#f0f9ff] to-white border-b border-sky-100/80">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -top-24 right-1/4 w-[480px] h-[480px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[420px] h-[420px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar: Portal Badge + Language Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto mb-6">
            <a
              href={cleanBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-200 text-xs sm:text-sm font-semibold text-[#122846] shadow-2xs hover:border-[#0284c7] transition-colors"
            >
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#122846] to-[#0284c7] text-white text-[10px] font-bold uppercase tracking-wider">
                {lang === 'bn' ? 'অফিসিয়াল পোর্টাল' : 'Official Portal'}
              </span>
              <span className="font-mono text-[#0284c7] font-bold">affiliate.masheco.com</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <div className="inline-flex rounded-lg border border-sky-200 bg-white/90 p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-[#0284c7] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  lang === 'bn' ? 'bg-[#0284c7] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Main Hero Glass Card */}
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-sky-200/70 rounded-3xl px-5 py-8 sm:px-12 sm:py-14 shadow-xl shadow-sky-900/5 text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-5 leading-[1.4] sm:leading-[1.32]">
              <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-[#122846] via-[#0284c7] to-[#0ea5e9]">
                {lang === 'bn'
                  ? `প্রতিটি রেফারেলে ${duration} মাস পর্যন্ত ${rate}% রেকারিং কমিশন আয় করুন`
                  : `Earn ${rate}% Recurring Commission for ${duration} Months`}
              </span>
            </h1>

            <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {lang === 'bn'
                ? `MASH ECO-তে নতুন ই-কমার্স মার্চেন্ট রেফার করুন এবং তাদের প্রথম ${duration} মাসের প্রতিটি সাবস্ক্রিপশন পেমেন্টের ওপর নিশ্চিত ${rate}% কমিশন পান। আপনার রেফারকৃত মার্চেন্টও পাবেন +${extraTrial} দিন অতিরিক্ত ফ্রি ট্রায়াল!`
                : `Refer e-commerce merchants to MASH ECO and earn ${rate}% recurring commission on every subscription payment they make during their first ${duration} months — while giving them +${extraTrial} extra free trial days.`}
            </p>

            {/* Primary CTA Buttons: Affiliate Register & Affiliate Login */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <a
                href={registerUrl}
                className="w-full sm:w-auto btn-primary py-3.5 px-7 sm:py-4 sm:px-9 text-sm sm:text-base font-bold group"
              >
                <span>
                  {lang === 'bn' ? 'অ্যাফিলিয়েট রেজিস্টার করুন' : 'Affiliate Register'}
                </span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={loginUrl}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 text-sm sm:text-base font-bold text-[#122846] bg-white border-2 border-slate-200 hover:border-[#0284c7] hover:text-[#0284c7] rounded-[var(--radius-md)] transition-all shadow-2xs text-center"
              >
                {lang === 'bn' ? 'অ্যাফিলিয়েট লগইন' : 'Affiliate Login'}
              </a>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
              <span>{lang === 'bn' ? 'সরাসরি পার্টনার ড্যাশবোর্ড:' : 'Dedicated Partner Portal:'}</span>
              <a
                href={cleanBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0284c7] hover:underline inline-flex items-center gap-1"
              >
                <span>https://affiliate.masheco.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4 KPI Highlight Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 pt-8 sm:pt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#122846]">{rate}%</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {lang === 'bn' ? 'রেকারিং কমিশন হার' : 'Recurring Commission'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0284c7]">
                {duration} {lang === 'bn' ? 'মাস' : 'Months'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {lang === 'bn' ? 'কমিশনের মেয়াদ' : 'Commission Window'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#122846]">৳{minWithdraw}</p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {lang === 'bn' ? 'ন্যূনতম উইথড্রয়াল' : 'Minimum Payout'}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0284c7]">
                +{extraTrial} {lang === 'bn' ? 'দিন' : 'Days'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                {lang === 'bn' ? 'মার্চেন্ট বোনাস ট্রায়াল' : 'Merchant Bonus Trial'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-12 sm:py-16 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-sm sm:text-base font-semibold text-[#0284c7] tracking-wide uppercase">
              {lang === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              {lang === 'bn'
                ? 'মাত্র ৩টি সহজ ধাপে আপনার রেকারিং আয় শুরু করুন'
                : 'Start Earning Recurring Commissions in 3 Simple Steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title:
                  lang === 'bn'
                    ? '১. ফ্রি অ্যাফিলিয়েট রেজিস্ট্রেশন করুন'
                    : '1. Register as an Affiliate Partner',
                desc:
                  lang === 'bn'
                    ? 'affiliate.masheco.com/register-এ গিয়ে মাত্র ১ মিনিটে ফ্রি অ্যাকাউন্ট খুলুন এবং আপনার ইউনিক রেফারেল লিংক ও কোড সংগ্রহ করুন।'
                    : 'Sign up for free at affiliate.masheco.com/register and instantly get your unique referral link and partner tracking code.',
              },
              {
                step: '02',
                icon: Gift,
                title:
                  lang === 'bn'
                    ? '২. মার্চেন্টদের সাথে লিংক শেয়ার করুন'
                    : '2. Refer E-Commerce Merchants',
                desc:
                  lang === 'bn'
                    ? `আপনার রেফারেল লিংক বা কোড ব্যবহার করে মার্চেন্ট রেজিস্টার করলেই তারা অতিরিক্ত +${extraTrial} দিন ফ্রি ট্রায়াল পাবেন এবং আপনার অ্যাকাউন্টে যুক্ত হবেন।`
                    : `Share your referral link on social media, YouTube, blogs, or directly with store owners. Referred merchants get +${extraTrial} bonus free trial days.`,
              },
              {
                step: '03',
                icon: TrendingUp,
                title:
                  lang === 'bn'
                    ? `৩. ${duration} মাস পর্যন্ত ${rate}% কমিশন পান`
                    : `3. Earn ${rate}% Commission for ${duration} Months`,
                desc:
                  lang === 'bn'
                    ? `রেফারকৃত মার্চেন্ট প্রথম ${duration} মাসের মধ্যে যতবার সাবস্ক্রিপশন পেমেন্ট করবেন, প্রতিটি পেমেন্টের ${rate}% আপনার ওয়ালেটে জমা হবে।`
                    : `Every time your referred merchant pays for a subscription within their first ${duration} months, ${rate}% is credited directly to your wallet.`,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#0284c7]/10 text-[#0284c7]">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure & Interactive Calculator */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-sm sm:text-base font-semibold text-[#0284c7] tracking-wide uppercase">
              {lang === 'bn' ? 'কমিশন ক্যালকুলেটর' : 'Commission Structure & Calculator'}
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {lang === 'bn'
                ? 'স্বচ্ছ ওেরিফায়েড কমিশন হিসাব'
                : 'Transparent Recurring Commission Math'}
            </p>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              {lang === 'bn'
                ? 'মার্চেন্ট প্রকৃতপক্ষে যত টাকা পেমেন্ট করবেন (ডিসকাউন্ট বা কুপন বাদে), তার ওপর সরাসরি ৩০% কমিশন হিসাব করা হয়।'
                : 'Commissions are calculated on the actual subscription amount paid by each referred merchant.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
                {lang === 'bn' ? 'উদাহরণ ১: রেগুলার পেমেন্ট' : 'Example 1: Standard Plan Payment'}
              </span>
              <p className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                {lang === 'bn'
                  ? `মার্চেন্ট ৳৪৯৯ পেমেন্ট করলে × ${rate}% = ৳১৪৯.৭০ কমিশন / প্রতি মাস`
                  : `Merchant pays ৳499 × ${rate}% = ৳149.70 commission / month`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {lang === 'bn'
                  ? `${duration} মাসে ১ জন মার্চেন্ট থেকে মোট সম্ভাব্য আয়: ৳১৪৯.৭০ × ${duration} = ৳৮৯৮.২০`
                  : `${duration}-Month recurring total from 1 merchant: ৳149.70 × ${duration} = ৳898.20`}
              </p>
            </div>

            <div className="p-6 bg-slate-50/70 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#122846]">
                {lang === 'bn' ? 'উদাহরণ ২: ডিসকাউন্ট পেমেন্ট' : 'Example 2: Discounted Payment'}
              </span>
              <p className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                {lang === 'bn'
                  ? `কুপন পর মার্চেন্ট ৳৪০০ পেমেন্ট করলে × ${rate}% = ৳১২০.০০ কমিশন`
                  : `Merchant pays ৳400 after coupon × ${rate}% = ৳120.00 commission`}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {lang === 'bn'
                  ? 'পেমেন্ট ভেরিফাই হওয়ার সাথে সাথেই কমিশন আপনার অ্যাফিলিয়েট লেজারে জমা হয়।'
                  : 'Credited automatically to your affiliate ledger as soon as the payment is verified.'}
              </p>
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-sky-50/80 via-white to-slate-50 rounded-2xl border border-sky-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-[#0284c7]" />
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                {lang === 'bn'
                  ? 'আপনার সম্ভাব্য আয় হিসাব করুন'
                  : 'Interactive Partner Earnings Calculator'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {lang === 'bn'
                    ? 'মার্চেন্টের মাসিক পেমেন্ট (৳)'
                    : 'Merchant Monthly Plan Payment (৳)'}
                </label>
                <input
                  type="number"
                  min={100}
                  value={calcPaidAmount}
                  onChange={(e) => setCalcPaidAmount(Math.max(0, Number(e.target.value)))}
                  className="input-field font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {lang === 'bn'
                    ? 'রেফারকৃত সক্রিয় মার্চেন্ট সংখ্যা'
                    : 'Number of Active Referred Merchants'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={calcMerchants}
                  onChange={(e) => setCalcMerchants(Math.max(1, Number(e.target.value)))}
                  className="input-field font-bold text-sm"
                />
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] text-white text-center shadow-md">
                <p className="text-xs text-sky-100">
                  {lang === 'bn'
                    ? `${duration} মাসে সম্ভাব্য মোট কমিশন (${rate}%)`
                    : `Estimated ${duration}-Month Total (${rate}%)`}
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                  ৳{sixMonthTotal.toLocaleString()}
                </p>
                <p className="text-[11px] text-sky-100 mt-1">
                  ৳{monthlyTotalAllMerchants.toLocaleString()} /{' '}
                  {lang === 'bn' ? 'প্রতি মাস' : 'per month'} (৳{perPaymentCommission} /{' '}
                  {lang === 'bn' ? 'মার্চেন্ট' : 'merchant'})
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With MASH ECO (6 Feature Grid) */}
      <section className="py-12 sm:py-16 bg-gray-50/60 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-sm sm:text-base font-semibold text-[#0284c7] tracking-wide uppercase">
              {lang === 'bn' ? 'পার্টনার সুবিধাসমূহ' : 'Why Partner With Us'}
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {lang === 'bn'
                ? 'কেন MASH ECO অ্যাফিলিয়েট প্রোগ্রামে যুক্ত হবেন?'
                : 'Built for Marketers, Creators & E-Commerce Consultants'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wallet,
                title:
                  lang === 'bn'
                    ? 'বিকাশ, নগদ, রকেট ও ব্যাংক পেআউট'
                    : 'bKash, Nagad, Rocket & Bank Payouts',
                desc:
                  lang === 'bn'
                    ? `মাত্র ৳${minWithdraw} ব্যালেন্স হলেই আপনার পছন্দের মোবাইল ব্যাংকিং বা ব্যাংক অ্যাকাউন্টে দ্রুত টাকা উত্তোলন করুন।`
                    : `Withdraw your earnings directly to bKash, Nagad, Rocket, or local Bank accounts starting from just ৳${minWithdraw}.`,
              },
              {
                icon: Clock,
                title:
                  lang === 'bn'
                    ? `${duration} মাস রেকারিং কমিশন`
                    : `${duration}-Month Recurring Revenue`,
                desc:
                  lang === 'bn'
                    ? `শুধু প্রথম পেমেন্টেই নয়, মার্চেন্টের প্রথম ${duration} মাসের প্রতিটি সাবস্ক্রিপশন নবায়নেও আপনি ${rate}% কমিশন পাবেন।`
                    : `Earn ${rate}% not just once, but on every subscription renewal your referred merchant makes during their first ${duration} months.`,
              },
              {
                icon: ShieldCheck,
                title:
                  lang === 'bn'
                    ? 'স্বয়ংক্রিয় ট্র্যাকিং ও রিয়েল-টাইম লেজার'
                    : 'Real-Time Attribution & Ledger',
                desc:
                  lang === 'bn'
                    ? 'আপনার পার্টনার ড্যাশবোর্ডে ক্লিক, রেজিস্ট্রেশন, পেইড সাবস্ক্রাইবার এবং প্রতিটি কমিশনের পূর্ণাঙ্গ হিসাব রিয়েল-টাইমে দেখুন।'
                    : 'Track link clicks, merchant signups, active commission windows, and every wallet transaction in real time.',
              },
              {
                icon: Gift,
                title:
                  lang === 'bn'
                    ? `মার্চেন্টদের জন্য +${extraTrial} দিন বোনাস ট্রায়াল`
                    : `+${extraTrial} Extra Trial Days for Merchants`,
                desc:
                  lang === 'bn'
                    ? 'আপনার রেফারেল লিংক ব্যবহার করলে মার্চেন্টরা অতিরিক্ত ফ্রি ট্রায়াল পান, ফলে আপনার কনভার্সন রেট অনেক বেশি হয়।'
                    : 'Merchants love signing up through partner links because they unlock extra free trial days immediately.',
              },
              {
                icon: CheckCircle2,
                title:
                  lang === 'bn'
                    ? 'বাংলাদেশের সবচেয়ে সাশ্রয়ী ই-কমার্স প্ল্যাটফর্ম'
                    : 'High-Converting SaaS Product',
                desc:
                  lang === 'bn'
                    ? 'কুরিয়ার অটোমেশন, ফ্রড চেক এবং রেডি থিমসহ MASH ECO বাংলাদেশের মার্চেন্টদের কাছে অত্যন্ত জনপ্রিয়।'
                    : 'With courier automation, fraud detection, and instant store setup, MASH ECO converts referred leads effortlessly.',
              },
              {
                icon: HelpCircle,
                title:
                  lang === 'bn'
                    ? 'ডেডিকেটেড পার্টনার সাপোর্ট সেন্টার'
                    : 'Dedicated Partner Support Center',
                desc:
                  lang === 'bn'
                    ? 'অ্যাফিলিয়েট ড্যাশবোর্ডের ভেতরেই রয়েছে সরাসরি টিকেট ও লাইভ চ্যাট সাপোর্ট সিস্টেম।'
                    : 'Get priority assistance from our partner team via the built-in Support Ticket center inside your dashboard.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-[#0284c7]/10 text-[#0284c7] mb-4">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-sm sm:text-base font-semibold text-[#0284c7] tracking-wide uppercase">
              {lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'Affiliate FAQ'}
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {lang === 'bn'
                ? 'অ্যাফিলিয়েট প্রোগ্রাম সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন'
                : 'Frequently Asked Questions'}
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-gray-900">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0284c7]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#122846] via-[#17365d] to-[#0284c7] rounded-3xl p-7 sm:p-12 text-center text-white shadow-xl">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider text-sky-100 mb-4">
            affiliate.masheco.com
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {lang === 'bn'
              ? 'আজই MASH ECO অ্যাফিলিয়েট পার্টনার হিসেবে যুক্ত হোন'
              : 'Ready to Start Earning 30% Recurring Commission?'}
          </h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            {lang === 'bn'
              ? 'ফ্রি রেজিস্ট্রেশন করে আপনার রেফারেল লিংক নিন অথবা আপনার পার্টনার ড্যাশবোর্ডে লগইন করে আয় ট্র্যাক করুন।'
              : 'Create your free partner account in 60 seconds or log in to your Affiliate Partner Dashboard at affiliate.masheco.com.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <a
              href={registerUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-white text-[#122846] hover:bg-sky-50 font-extrabold text-sm sm:text-base shadow-lg transition-all"
            >
              <span>
                {lang === 'bn' ? 'অ্যাফিলিয়েট রেজিস্টার করুন' : 'Affiliate Register'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={loginUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm sm:text-base transition-all"
            >
              <span>{lang === 'bn' ? 'অ্যাফিলিয়েট লগইন' : 'Affiliate Login'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

