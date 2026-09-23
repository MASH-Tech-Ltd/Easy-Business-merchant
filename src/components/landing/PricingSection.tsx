'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useState } from 'react';

export interface IPackage {
  _id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  productLimit: number;
  features?: string[];
  tagline?: string;
  description?: string;
  isActive: boolean;
  isPopular?: boolean;
}

interface PricingSectionProps {
  packages: IPackage[];
}

export default function PricingSection({ packages }: PricingSectionProps) {
  const hasYearly = packages.some((p) => p.billingCycle === 'yearly');
  const hasMonthly = packages.some((p) => p.billingCycle === 'monthly');
  const showToggle = hasYearly && hasMonthly;

  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const visiblePackages = showToggle
    ? packages.filter((p) => p.billingCycle === billing)
    : packages;

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--accent-primary))]/5 via-white to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-base font-semibold text-[hsl(var(--accent-primary))] tracking-wide uppercase">
            Pricing
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the plan that fits your business. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Monthly / Yearly Toggle */}
        {showToggle && (
          <div className="flex items-center justify-center gap-4 mb-14">
            <span
              className={`text-sm font-semibold transition-colors ${
                billing === 'monthly' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Monthly
            </span>

            {/* Toggle pill */}
            <button
              id="billing-toggle"
              role="switch"
              aria-checked={billing === 'yearly'}
              onClick={() => setBilling((b) => (b === 'monthly' ? 'yearly' : 'monthly'))}
              className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-primary))] focus-visible:ring-offset-2"
              style={{
                backgroundColor:
                  billing === 'yearly'
                    ? 'hsl(var(--accent-primary))'
                    : '#d1d5db',
              }}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  billing === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>

            <span
              className={`text-sm font-semibold transition-colors ${
                billing === 'yearly' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Yearly
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                Save up to 20%
              </span>
            </span>
          </div>
        )}

        {/* Cards */}
        {visiblePackages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Pricing plans coming soon. Contact us for details.</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-8 lg:gap-10 items-start ${
              visiblePackages.length === 1
                ? 'max-w-sm mx-auto'
                : visiblePackages.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : 'md:grid-cols-3'
            }`}
          >
            {visiblePackages.map((pkg) => {
              const featured = !!pkg.isPopular;
              const features = pkg.features ?? [];
              const formattedPrice = `৳${pkg.price.toLocaleString()}`;
              const nameLower = pkg.name.toLowerCase();
              const isEnterprise = nameLower.includes('enterprise');
              const href = isEnterprise ? '/landing/contact' : '/register';

              const ctaText = isEnterprise
                ? 'Talk to Our Team →'
                : featured
                ? 'Get Your Store Live →'
                : nameLower.includes('basic') || nameLower.includes('starter')
                ? 'Start Free Trial →'
                : 'Start Building Today →';

              return (
                <div
                  key={pkg._id}
                  className={`bg-white rounded-3xl p-8 relative flex flex-col h-full border transition-all duration-300 ${
                    featured
                      ? 'border-[hsl(var(--accent-primary))] shadow-2xl shadow-[hsl(var(--accent-primary))]/10 scale-105 z-10'
                      : 'border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Popular badge */}
                  {featured && (
                    <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                      <span className="bg-[hsl(var(--accent-primary))] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Name & description */}
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    {(pkg.description || pkg.tagline) && (
                      <p className="mt-2 text-sm text-gray-500">
                        {pkg.description || pkg.tagline}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-5xl font-extrabold text-gray-900">{formattedPrice}</span>
                    <span className="ml-1 text-gray-500 font-medium text-base">
                      /{billing === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>

                  {/* Product limit pill */}
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      Up to {pkg.productLimit.toLocaleString()} products
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex-1 space-y-3 mb-8">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check
                          className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            featured
                              ? 'text-[hsl(var(--accent-primary))]'
                              : 'text-green-500'
                          }`}
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={href}
                    className={`mt-auto w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      featured
                        ? 'bg-[hsl(var(--accent-primary))] text-white hover:opacity-90 shadow-lg shadow-[hsl(var(--accent-primary))]/30'
                        : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}
                  >
                    {ctaText}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
