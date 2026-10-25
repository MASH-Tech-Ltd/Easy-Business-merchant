"use client";

import React from "react";
import { Check, X, HelpCircle } from "lucide-react";
import Link from "next/link";

import type { IPackage } from "./PricingSection";

interface PlanComparisonTableProps {
  billing: "monthly" | "yearly";
  packages?: IPackage[];
}

interface FeatureRow {
  name: string;
  tooltip?: string;
  freeTrial: string | boolean;
  basic: string | boolean;
  standard: string | boolean;
  premium: string | boolean;
  isHighlight?: boolean;
}

interface FeatureCategory {
  category: string;
  rows: FeatureRow[];
}

const buildComparisonData = (params: {
  basicProducts: string;
  stdProducts: string;
  premProducts: string;
  basicCourier: string;
  stdCourier: string;
  premCourier: string;
  basicAbandoned: string;
  stdAbandoned: string;
  premAbandoned: string;
}): FeatureCategory[] => [
  {
    category: "Store & Catalog Capacity",
    rows: [
      {
        name: "Product Catalog Limit",
        tooltip: "Maximum number of active products you can list in your online store.",
        freeTrial: "20 Products",
        basic: params.basicProducts,
        standard: params.stdProducts,
        premium: params.premProducts,
        isHighlight: true,
      },
      {
        name: "Modern Storefront Themes",
        tooltip: "Access to all mobile-friendly, conversion-optimized storefront designs.",
        freeTrial: true,
        basic: true,
        standard: true,
        premium: true,
      },
      {
        name: "Custom Domain Connection",
        tooltip: "Connect your own custom branded domain (e.g., yourstore.com).",
        freeTrial: true,
        basic: true,
        standard: true,
        premium: true,
      },
      {
        name: "Free MASH Subdomain (.masheco.com)",
        tooltip: "Instant live storefront subdomain ready out of the box.",
        freeTrial: true,
        basic: true,
        standard: true,
        premium: true,
      },
      {
        name: "Order & Category Management",
        tooltip: "Unlimited product categories, inventory controls, and status pipelines.",
        freeTrial: true,
        basic: true,
        standard: true,
        premium: true,
      },
      {
        name: "Cash on Delivery (COD) & Manual Payments",
        tooltip: "Accept COD, bKash, Nagad, Rocket, and Bank transfer verification.",
        freeTrial: true,
        basic: true,
        standard: true,
        premium: true,
      },
    ],
  },
  {
    category: "Monthly Free Automations",
    rows: [
      {
        name: "Courier Automation (Pathao, Steadfast, Redx)",
        tooltip: "One-click order forwarding to courier partners directly from merchant dashboard.",
        freeTrial: "— (Paid Add-on)",
        basic: params.basicCourier,
        standard: params.stdCourier,
        premium: params.premCourier,
        isHighlight: true,
      },
      {
        name: "Abandoned Cart Recovery Leads",
        tooltip: "Capture shopper checkout details for abandoned orders to recover lost sales.",
        freeTrial: "— (Paid Add-on)",
        basic: params.basicAbandoned,
        standard: params.stdAbandoned,
        premium: params.premAbandoned,
        isHighlight: true,
      },
      {
        name: "Monthly Allowance Reset",
        tooltip: "Free credits refresh every monthly billing cycle. Unused credits expire each month.",
        freeTrial: "—",
        basic: "Monthly Refresh",
        standard: "Monthly Refresh",
        premium: "Monthly Refresh",
      },
      {
        name: "Extra Usage Beyond Quota",
        tooltip: "Easily top-up credits via pay-as-you-go add-on whenever you need more volume.",
        freeTrial: "Add-on Available",
        basic: "Add-on Available",
        standard: "Add-on Available",
        premium: "Add-on Available",
      },
    ],
  },
  {
    category: "Analytics & Tracking",
    rows: [
      {
        name: "Store Performance Dashboard",
        tooltip: "Real-time metrics on orders, delivered revenue, store visits, and conversion rates.",
        freeTrial: "Basic Analytics",
        basic: "Basic Analytics",
        standard: "Advanced Insights",
        premium: "Full Multi-channel",
      },
      {
        name: "Google Analytics 4 (GA4) Integration",
        tooltip: "Connect your GA4 Measurement ID for automated storefront tracking.",
        freeTrial: false,
        basic: "Manual Header",
        standard: "Native Integration",
        premium: "Native Integration",
      },
      {
        name: "Meta (Facebook) Pixel & Conversions",
        tooltip: "Track storefront visitor events and purchases for targeted ad campaigns.",
        freeTrial: false,
        basic: "Manual Header",
        standard: "Native Integration",
        premium: "Native Integration",
      },
      {
        name: "Google Tag Manager (GTM) Multi-channel",
        tooltip: "Advanced custom script and dataLayer tracking for scaling stores.",
        freeTrial: false,
        basic: false,
        standard: false,
        premium: "Native Integration",
      },
      {
        name: "Analytics Report Export (PDF/Excel)",
        tooltip: "Full transparency: Report export system is currently in development and not yet available.",
        freeTrial: false,
        basic: false,
        standard: false,
        premium: false,
      },
    ],
  },
  {
    category: "Customer Support & SLA",
    rows: [
      {
        name: "Support Ticket Priority",
        tooltip: "Queue response priority for technical queries and issue resolution.",
        freeTrial: "Self-Service",
        basic: "Standard Queue",
        standard: "Priority Support",
        premium: "Swift VIP Priority",
        isHighlight: true,
      },
      {
        name: "Store Setup & Onboarding Guidance",
        tooltip: "Guidance and documentation to help get your store live quickly.",
        freeTrial: "Docs & Guides",
        basic: "Self-Service Docs",
        standard: "Standard Guidance",
        premium: "Dedicated VIP Support",
      },
    ],
  },
  {
    category: "Optional Add-ons (Pay-as-you-go)",
    rows: [
      {
        name: "Automated SMS Notifications",
        tooltip: "Send real-time SMS alerts to customers upon order placement and fulfillment.",
        freeTrial: "Add-on Available",
        basic: "Add-on Available",
        standard: "Add-on Available",
        premium: "Add-on Available",
      },
      {
        name: "Email Marketing Campaigns",
        tooltip: "Send promotional newsletters and cart re-engagement emails.",
        freeTrial: "Add-on Available",
        basic: "Add-on Available",
        standard: "Add-on Available",
        premium: "Add-on Available",
      },
      {
        name: "Advanced Order Fraud Detection",
        tooltip: "Risk scoring to identify suspicious customer numbers and fake orders.",
        freeTrial: "Add-on Available",
        basic: "Add-on Available",
        standard: "Add-on Available",
        premium: "Add-on Available",
      },
    ],
  },
];

export default function PlanComparisonTable({ billing, packages = [] }: PlanComparisonTableProps) {
  const isYearly = billing === "yearly";

  // Find packages matching the billing cycle or general tier
  const basicPkg =
    packages.find(
      (p) => p.name.toLowerCase().includes("basic") && p.billingCycle === billing
    ) || packages.find((p) => p.name.toLowerCase().includes("basic"));

  const stdPkg =
    packages.find(
      (p) => p.name.toLowerCase().includes("standard") && p.billingCycle === billing
    ) || packages.find((p) => p.name.toLowerCase().includes("standard"));

  const premPkg =
    packages.find(
      (p) => p.name.toLowerCase().includes("premium") && p.billingCycle === billing
    ) || packages.find((p) => p.name.toLowerCase().includes("premium"));

  // Derive dynamic quantities
  const basicProducts = basicPkg?.productLimit
    ? `${basicPkg.productLimit.toLocaleString()} Products`
    : "199 Products";
  const stdProducts = stdPkg?.productLimit
    ? `${stdPkg.productLimit.toLocaleString()} Products`
    : "399 Products";
  const premProducts = premPkg?.productLimit
    ? `${premPkg.productLimit.toLocaleString()} Products`
    : "1,500 Products";

  const basicCourier =
    basicPkg?.freeCourierLimit !== undefined
      ? `${basicPkg.freeCourierLimit} Free Orders / mo`
      : "5 Free Orders / mo";
  const stdCourier =
    stdPkg?.freeCourierLimit !== undefined
      ? `${stdPkg.freeCourierLimit} Free Orders / mo`
      : "10 Free Orders / mo";
  const premCourier =
    premPkg?.freeCourierLimit !== undefined
      ? `${premPkg.freeCourierLimit} Free Orders / mo`
      : "15 Free Orders / mo";

  const basicAbandoned =
    basicPkg?.freeAbandonedLimit !== undefined
      ? `${basicPkg.freeAbandonedLimit} Free Leads / mo`
      : "5 Free Leads / mo";
  const stdAbandoned =
    stdPkg?.freeAbandonedLimit !== undefined
      ? `${stdPkg.freeAbandonedLimit} Free Leads / mo`
      : "10 Free Leads / mo";
  const premAbandoned =
    premPkg?.freeAbandonedLimit !== undefined
      ? `${premPkg.freeAbandonedLimit} Free Leads / mo`
      : "15 Free Leads / mo";

  const comparisonData = buildComparisonData({
    basicProducts,
    stdProducts,
    premProducts,
    basicCourier,
    stdCourier,
    premCourier,
    basicAbandoned,
    stdAbandoned,
    premAbandoned,
  });

  const plans = [
    {
      key: "freeTrial" as const,
      name: "Free Trial",
      price: "৳0",
      period: "/5 days",
      tagline: "Test-drive store features risk-free",
      cta: "Start Free Trial",
      isPopular: false,
    },
    {
      key: "basic" as const,
      name: "Basic",
      price: basicPkg ? `৳${basicPkg.price.toLocaleString()}` : isYearly ? "৳2,990" : "৳299",
      period: isYearly ? "/yr" : "/mo",
      tagline: "Essential starter kit for new sellers",
      cta: "Get Started",
      isPopular: false,
    },
    {
      key: "standard" as const,
      name: "Standard",
      price: stdPkg ? `৳${stdPkg.price.toLocaleString()}` : isYearly ? "৳4,990" : "৳499",
      period: isYearly ? "/yr" : "/mo",
      tagline: "High growth tools for scaling stores",
      cta: "Get Started",
      isPopular: true,
    },
    {
      key: "premium" as const,
      name: "Premium",
      price: premPkg ? `৳${premPkg.price.toLocaleString()}` : isYearly ? "৳7,990" : "৳799",
      period: isYearly ? "/yr" : "/mo",
      tagline: "Maximum catalog size & VIP support",
      cta: "Get Started",
      isPopular: false,
    },
  ];

  const renderCell = (val: string | boolean, isHighlighted = false, isPopularCol = false) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-2xs">
            <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-400 border border-rose-200 flex items-center justify-center">
            <X className="w-3 h-3 text-rose-400" strokeWidth={2.5} />
          </div>
        </div>
      );
    }

    const isExcluded = val === "—" || val.includes("Not Available");
    if (isExcluded) {
      return (
        <div className="flex justify-center items-center">
          <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-400 border border-rose-200 flex items-center justify-center">
            <X className="w-3 h-3 text-rose-400" strokeWidth={2.5} />
          </div>
        </div>
      );
    }

    return (
      <span
        className={`text-xs sm:text-sm ${
          isHighlighted
            ? "font-bold text-slate-900"
            : isPopularCol
              ? "font-bold text-[#122846]"
              : "font-medium text-slate-700"
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <div className="mt-14 sm:mt-18 pt-10 sm:pt-14 border-t border-slate-200" id="compare-plans">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare Plan Features
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Transparent side-by-side comparison of verified capabilities across all MASH ECO plans.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full min-w-[850px] border-collapse text-left">
          {/* Header Row */}
          <thead>
            <tr className="border-b border-slate-200 divide-x divide-slate-100">
              <th className="p-6 bg-white w-[28%] align-bottom">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Plan Details
                </span>
              </th>

              {plans.map((p) => {
                if (p.isPopular) {
                  return (
                    <th
                      key={p.key}
                      className="p-6 bg-gradient-to-b from-[#122846] via-[#102d54] to-[#0369a1] text-white w-[18%] text-center relative overflow-hidden align-top shadow-md"
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <span className="text-xl font-bold tracking-tight">{p.name}</span>
                        <span className="bg-sky-400/30 text-sky-100 border border-sky-300/40 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                          POPULAR
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black mb-1">
                        {p.price}
                        <span className="text-xs font-medium text-sky-200">{p.period}</span>
                      </div>
                      <p className="text-[11px] text-sky-100/90 font-normal mb-4 leading-tight">
                        {p.tagline}
                      </p>
                      <Link
                        href="/register"
                        className="inline-block w-full py-2 px-4 rounded-full font-bold text-xs bg-white text-[#122846] hover:bg-sky-50 transition-all shadow-sm text-center"
                      >
                        {p.cta}
                      </Link>
                    </th>
                  );
                }

                return (
                  <th
                    key={p.key}
                    className="p-6 bg-white w-[18%] text-center align-top"
                  >
                    <div className="text-xl font-bold text-slate-900 mb-2">{p.name}</div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                      {p.price}
                      <span className="text-xs font-medium text-slate-500">{p.period}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mb-4 leading-tight">
                      {p.tagline}
                    </p>
                    <Link
                      href="/register"
                      className="inline-block w-full py-2 px-4 rounded-full font-bold text-xs bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-all text-center shadow-2xs"
                    >
                      {p.cta}
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {comparisonData.map((cat, catIdx) => (
              <React.Fragment key={catIdx}>
                {/* Category Header Row */}
                <tr className="bg-slate-50/80 border-t border-b border-slate-200">
                  <td
                    colSpan={5}
                    className="py-3 px-6 text-xs font-extrabold uppercase tracking-wider text-slate-800"
                  >
                    {cat.category}
                  </td>
                </tr>

                {/* Feature Rows */}
                {cat.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50/50 transition-colors divide-x divide-slate-100"
                  >
                    {/* Feature Name */}
                    <td className="py-3.5 px-6 text-xs sm:text-sm font-medium text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.tooltip && (
                          <span
                            title={row.tooltip}
                            className="cursor-help text-slate-400 hover:text-slate-600 inline-flex"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Free Trial */}
                    <td className="py-3.5 px-4 text-center">
                      {renderCell(row.freeTrial, row.isHighlight, false)}
                    </td>

                    {/* Basic */}
                    <td className="py-3.5 px-4 text-center">
                      {renderCell(row.basic, row.isHighlight, false)}
                    </td>

                    {/* Standard (Highlighted Column with light sky tint) */}
                    <td className="py-3.5 px-4 text-center bg-sky-50/40">
                      {renderCell(row.standard, row.isHighlight, true)}
                    </td>

                    {/* Premium */}
                    <td className="py-3.5 px-4 text-center">
                      {renderCell(row.premium, row.isHighlight, false)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trust & Transparency Note */}
      <div className="mt-4 text-center text-xs text-slate-500">
        All product limits, courier automation quotas, and abandoned cart recovery allowances are strictly enforced by system logic. No hidden fees or unverified claims.
      </div>
    </div>
  );
}
