import Link from 'next/link';
import { Check, X } from 'lucide-react';

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '/register',
    priceMonthly: '৳500',
    description: 'Everything you need to grow your e-commerce business.',
    features: [
      'Up to 100 products limit',
      'Premium storefront themes',
      'Standard analytics',
      'Access to Addon Store',
    ],
    notIncluded: [
      'Dedicated Account Manager',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '/register',
    priceMonthly: '৳1000',
    description: 'Advanced features for scaling electronics businesses.',
    features: [
      'Up to 200 products limit',
      'Premium storefront themes',
      'Advanced analytics & reports',
      'Priority Support',
      'Access to Addon Store',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/landing/contact',
    priceMonthly: '৳3000',
    description: 'Maximum capacity and dedicated infrastructure.',
    features: [
      'Up to 500 products limit',
      'Custom theme development',
      'Dedicated account manager',
      'All Premium Addons Available',
    ],
    notIncluded: [],
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--accent-primary))]/5 via-white to-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-[hsl(var(--accent-primary))] tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Choose the plan that fits your business needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
          {tiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`bg-white rounded-3xl p-8 relative flex flex-col h-full border ${tier.featured ? 'border-[hsl(var(--accent-primary))] shadow-2xl shadow-[hsl(var(--accent-primary))]/10 scale-105 z-10' : 'border-gray-200 shadow-sm'}`}
            >
              {tier.featured && (
                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2">
                  <span className="bg-[hsl(var(--accent-primary))] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Popular</span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-gray-900">{tier.priceMonthly}</span>
                {tier.priceMonthly !== 'Custom' && <span className="text-gray-500 font-medium">/month</span>}
              </div>
              
              <div className="flex-1 space-y-4">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${tier.featured ? 'text-[hsl(var(--accent-primary))]' : 'text-green-500'}`} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                
                {tier.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 opacity-50">
                    <X className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="text-sm text-gray-500 line-through">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
