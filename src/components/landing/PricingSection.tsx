"use client";

import Link from "next/link";
import { Check, X, ThumbsUp, Sparkles, ArrowDown } from "lucide-react";
import { useState } from "react";
import PlanComparisonTable from "./PlanComparisonTable";

export interface IPackage {
  _id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  productLimit: number;
  freeCourierLimit?: number;
  freeAbandonedLimit?: number;
  features?: string[];
  tagline?: string;
  description?: string;
  isActive: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

interface PricingSectionProps {
  packages: IPackage[];
}

const PACKAGE_METADATA: Record<string, {
  badge: string;
  badgeClass: string;
  summary: string;
  inheritanceNote?: string;
  highlights: string[];
}> = {
  basic: {
    badge: "ESSENTIAL STARTER",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    summary: "All the core commerce tools you need to launch and start selling online.",
    highlights: [
      "199 Products Capacity",
      "5 Free Courier Orders / Month",
      "5 Free Abandoned Leads / Month",
      "Standard Ticket Support",
    ],
  },
  standard: {
    badge: "HIGH GROWTH",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    inheritanceNote: "Includes everything in Basic, plus:",
    summary: "Double capacity, 2x free automations, and native analytics for growing stores.",
    highlights: [
      "399 Products (2x Capacity)",
      "10 Free Courier Orders / Month (2x)",
      "10 Free Abandoned Leads / Month (2x)",
      "Google Analytics 4 & Meta Pixel",
      "Priority Support Queue",
    ],
  },
  premium: {
    badge: "MAX SCALE & VIP",
    badgeClass: "bg-slate-100 text-[#122846] border-slate-300 font-bold",
    inheritanceNote: "Includes everything in Standard, plus:",
    summary: "Maximum catalog size, 3x free automations, and dedicated Swift VIP support.",
    highlights: [
      "Catalog Capacity & VIP Scale",
      "15 Free Courier Orders / Month (3x)",
      "15 Free Abandoned Leads / Month (3x)",
      "Multi-channel Tracking Setup",
      "Swift VIP Priority Support",
    ],
  },
};

const getDynamicFeatures = (pkg: IPackage, planKey: string): string[] => {
  const baseList = PLAN_ESCALATING_FEATURES[planKey] || (pkg.features ?? []);
  const limit = pkg.productLimit ? pkg.productLimit.toLocaleString() : "Unlimited";
  const courier = pkg.freeCourierLimit ?? (planKey === "basic" ? 5 : planKey === "standard" ? 10 : 15);
  const abandoned = pkg.freeAbandonedLimit ?? (planKey === "basic" ? 5 : planKey === "standard" ? 10 : 15);

  return baseList.map((feat, idx) => {
    // 1) Replace product catalog limit dynamically
    if (idx === 0 || /products/i.test(feat)) {
      if (/up to \d+ products/i.test(feat)) {
        if (planKey === "basic") {
          return `Up to ${limit} Products Capacity`;
        } else if (planKey === "standard") {
          return `Up to ${limit} Products (2x Capacity)`;
        } else {
          return `Up to ${limit} Products (Maximum Catalog Size)`;
        }
      }
    }
    // 2) Replace courier automation free orders dynamically
    if (/courier automation/i.test(feat) && /free orders/i.test(feat)) {
      if (planKey === "basic") {
        return `Courier Automation: ${courier} Free Orders / Month`;
      } else if (planKey === "standard") {
        return `Courier Automation: ${courier} Free Orders / Month (2x)`;
      } else {
        return `Courier Automation: ${courier} Free Orders / Month (3x Volume)`;
      }
    }
    // 3) Replace abandoned checkout free leads dynamically
    if (/abandoned checkout/i.test(feat) && /free leads/i.test(feat)) {
      if (planKey === "basic") {
        return `Abandoned Checkout: ${abandoned} Free Leads / Month`;
      } else if (planKey === "standard") {
        return `Abandoned Checkout: ${abandoned} Free Leads / Month (2x)`;
      } else {
        return `Abandoned Checkout: ${abandoned} Free Leads / Month (3x Volume)`;
      }
    }
    return feat;
  });
};

const PLAN_ESCALATING_FEATURES: Record<string, string[]> = {
  basic: [
    "Up to 199 Products Capacity",
    "Courier Automation: 5 Free Orders / Month",
    "Abandoned Checkout: 5 Free Leads / Month",
    "Online Storefront & All 5 Modern Themes",
    "MashEasy Subdomain & Custom Domain",
    "Cash on Delivery (COD) & Manual Payments",
    "Customer Support: Standard Ticket Support",
    "Google Analytics 4 (GA4): Not included",
    "Meta (Facebook) Pixel & Conversion Tracking: Not included",
    "Advanced Sales & Business Insights: Not included",
    "Automated SMS & Email Marketing: Not included",
    "Multi-channel GTM Custom Scripts: Not included",
    "Advanced Customer Fraud Risk Scoring: Not included",
    "Swift VIP Dedicated 24/7 Priority Support: Not included",
  ],
  standard: [
    "Up to 399 Products (2x Capacity)",
    "Courier Automation: 10 Free Orders / Month (2x)",
    "Abandoned Checkout: 10 Free Leads / Month (2x)",
    "Online Storefront & All 5 Modern Themes",
    "MashEasy Subdomain & Custom Domain",
    "Cash on Delivery (COD) & Manual Payments",
    "Customer Support: Priority Support Queue",
    "Google Analytics 4 (GA4) Native Integration",
    "Meta (Facebook) Pixel & Conversion Tracking",
    "Advanced Sales & Conversion Analytics",
    "Automated SMS & Email Marketing Ready",
    "Multi-channel GTM Custom Scripts: Not included",
    "Advanced Customer Fraud Risk Scoring: Not included",
    "Swift VIP Dedicated 24/7 Priority Support: Not included",
  ],
  premium: [
    "Up to 699 Products (Maximum Catalog Size)",
    "Courier Automation: 15 Free Orders / Month (3x Volume)",
    "Abandoned Checkout: 15 Free Leads / Month (3x Volume)",
    "Online Storefront & All 5 Modern Themes",
    "MashEasy Subdomain & Custom Domain",
    "Cash on Delivery (COD) & Manual Payments",
    "Customer Support: Fast-Track VIP Ticket Support",
    "Google Analytics 4 (GA4) Native Integration",
    "Meta (Facebook) Pixel & Conversion Tracking",
    "Advanced Sales & Business Insights Dashboard",
    "Automated SMS & Email Marketing Ready",
    "Multi-channel GTM Tracking & Custom Scripts",
    "Advanced Customer Fraud Risk Scoring",
    "Swift VIP Dedicated 24/7 Priority Support",
  ],
};

export default function PricingSection({
  packages = [],
}: PricingSectionProps) {
  const hasYearly = packages.some((p) => p.billingCycle === "yearly");
  const hasMonthly = packages.some((p) => p.billingCycle === "monthly");
  const showToggle = hasYearly && hasMonthly;

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const visiblePackages = showToggle
    ? packages.filter((p) => p.billingCycle === billing)
    : packages;

  // Enforce strictly ordered package display: Basic -> Standard -> Premium
  const PLAN_ORDER = ["basic", "standard", "premium"];
  const sortedPackages = [...visiblePackages].sort((a, b) => {
    const nameA = (a.name || "").toLowerCase().trim();
    const nameB = (b.name || "").toLowerCase().trim();
    const idxA = PLAN_ORDER.indexOf(nameA);
    const idxB = PLAN_ORDER.indexOf(nameB);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.price - b.price;
  });

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--accent-primary))]/5 via-white to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-sm font-bold text-[#0284c7] tracking-wider uppercase">
            Pricing & Plans
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            Simple, Transparent Pricing
          </p>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-600 mx-auto">
            Choose the plan that fits your business scale. No hidden fees, upgrade anytime.
          </p>
        </div>

        {/* Monthly / Yearly Toggle */}
        {showToggle && (
          <div className="flex items-center justify-center gap-4 mb-10 sm:mb-14">
            <span
              className={`text-sm font-semibold transition-colors ${
                billing === "monthly" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Monthly
            </span>

            {/* Toggle pill */}
            <button
              id="billing-toggle"
              role="switch"
              aria-checked={billing === "yearly"}
              onClick={() =>
                setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
              }
              className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
              style={{
                backgroundColor:
                  billing === "yearly"
                    ? "#0284c7"
                    : "#cbd5e1",
              }}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  billing === "yearly" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>

            <span
              className={`text-sm font-semibold transition-colors ${
                billing === "yearly" ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Save 20%
              </span>
            </span>
          </div>
        )}

        {/* Pricing Cards */}
        {sortedPackages.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">Loading pricing packages...</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-8 lg:gap-8 items-stretch ${
              sortedPackages.length === 1
                ? "max-w-sm mx-auto"
                : sortedPackages.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-3"
            }`}
          >
            {sortedPackages.map((pkg) => {
              const featured = !!pkg.isPopular;
              const recommended = !!pkg.isRecommended;
              const nameLower = (pkg.name || "").toLowerCase().trim();
              const planKey = nameLower.includes("basic")
                ? "basic"
                : nameLower.includes("standard")
                  ? "standard"
                  : nameLower.includes("premium")
                    ? "premium"
                    : nameLower;
              const features = getDynamicFeatures(pkg, planKey);
              const formattedPrice = `৳${pkg.price.toLocaleString()}`;
              const meta = PACKAGE_METADATA[nameLower];
              const isEnterprise = nameLower.includes("enterprise");
              const href = isEnterprise ? "/landing/contact" : "/register";

              const ctaText = isEnterprise
                ? "Talk to Our Team →"
                : featured
                  ? "Get Standard Plan →"
                  : nameLower.includes("basic")
                    ? "Start Free Trial →"
                    : "Get Premium Plan →";

              return (
                <div
                  key={pkg._id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 relative flex flex-col h-full border transition-all duration-300 ${
                    featured
                      ? "border-[#0284c7] shadow-xl shadow-sky-500/10 lg:scale-[1.03] z-10 ring-2 ring-[#0284c7]/20"
                      : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  {/* Top Popular Badge */}
                  {featured && (
                    <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2 gap-2 z-20">
                      <span className="bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] text-white text-xs font-extrabold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Header: Name, Badge, & Tagline */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <h3 className="text-2xl font-black text-slate-900">
                        {pkg.name}
                      </h3>
                      {recommended && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 fill-current" /> Recommended
                        </span>
                      )}
                    </div>
                    {meta?.badge && (
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badgeClass} mb-2`}>
                        {meta.badge}
                      </span>
                    )}
                    {(pkg.tagline || pkg.description) && (
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {pkg.tagline || pkg.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4 pt-3 border-t border-slate-100">
                    {billing === "yearly" ? (
                      <div className="text-sm font-semibold text-slate-400 line-through decoration-red-400 decoration-1 leading-tight">
                        ৳{Math.round(pkg.price * 1.25).toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold invisible select-none leading-tight">
                        ৳0
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">
                        {formattedPrice}
                      </span>
                      <span className="text-slate-500 font-medium text-sm">
                        / {billing === "yearly" ? "per year" : "per month"}
                      </span>
                    </div>
                  </div>

                  {/* Product limit pill */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Up to {pkg.productLimit ? pkg.productLimit.toLocaleString() : "Unlimited"} products
                    </span>
                  </div>


                  {/* Verified Features List */}
                  <div className="flex-1 space-y-2.5 mb-6 pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Included Capabilities:
                    </div>
                    {features.map((feature, fIdx) => {
                      // Fix: Use exact word boundary so "10 Free" doesn't falsely match "0 free"
                      const isExcluded = /\b(not included|0 free)\b/i.test(feature);
                      const isInherited = /includes everything in/i.test(feature);
                      const colonIdx = feature.indexOf(":");
                      const hasPrefix = colonIdx > 0 && colonIdx < 30;
                      const prefix = hasPrefix ? feature.substring(0, colonIdx + 1) : "";
                      const rest = hasPrefix ? feature.substring(colonIdx + 1) : feature;

                      return (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          {isExcluded ? (
                            <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              <X className="w-3 h-3 text-rose-500" strokeWidth={2.5} />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                          <span
                            className={`text-xs sm:text-sm leading-snug ${
                              isExcluded
                                ? "text-slate-400"
                                : isInherited
                                  ? "text-blue-700 font-bold"
                                  : "text-slate-700"
                            }`}
                          >
                            {hasPrefix ? (
                              <>
                                <strong
                                  className={
                                    isExcluded
                                      ? "text-slate-400 font-medium"
                                      : "text-slate-900 font-semibold"
                                  }
                                >
                                  {prefix}
                                </strong>
                                {rest}
                              </>
                            ) : (
                              feature
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={href}
                    prefetch={false}
                    className={`mt-auto w-full text-center py-3 px-4 sm:px-6 rounded-xl font-bold text-sm transition-all duration-200 ${
                      featured
                        ? "bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] text-white hover:brightness-110 shadow-md shadow-sky-500/20"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {ctaText}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Jump Button to Comparison Matrix */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="#compare-plans"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all border border-slate-200 shadow-xs"
          >
            <span>Compare Full Feature Matrix & Limits</span>
            <ArrowDown className="w-4 h-4 text-[#0284c7] animate-bounce" />
          </a>
        </div>

        {/* Separate Side-by-Side Comparison Section */}
        <PlanComparisonTable billing={billing} packages={packages} />
      </div>
    </section>
  );
}
