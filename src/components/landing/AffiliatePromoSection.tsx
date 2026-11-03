import Link from 'next/link';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Wallet, Gift } from 'lucide-react';

export default function AffiliatePromoSection() {
  const affiliateBaseUrl = (
    process.env.NEXT_PUBLIC_AFFILIATE_URL || 'https://affiliate.masheco.com'
  ).replace(/\/$/, '');

  return (
    <section id="affiliate" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-sky-50/40 to-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#122846] via-[#163358] to-[#0284c7] p-6 sm:p-10 lg:p-14 text-white shadow-xl">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.22) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-sky-100">
                <span>MASH ECO Affiliate Partner Program</span>
                <span className="text-sky-300">•</span>
                <span className="font-mono text-white">affiliate.masheco.com</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Refer Merchants &amp; Earn{' '}
                <span className="text-sky-300">30% Recurring Commission</span> for 6 Months
              </h2>

              <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl">
                Join our official Affiliate Partner Program at{' '}
                <strong className="text-white">affiliate.masheco.com</strong>. Share your unique
                referral link with e-commerce store owners in Bangladesh — they get{' '}
                <strong className="text-white">+10 extra free trial days</strong>, and you earn{' '}
                <strong className="text-white">30% commission</strong> on every subscription payment
                for their first 6 months.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  '30% recurring commission for 6 months per merchant',
                  'Fast payouts from ৳100 via bKash, Nagad, Rocket & Bank',
                  '+10 bonus free trial days for every merchant you refer',
                  'Real-time click, referral & commission ledger dashboard',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-sky-50">
                    <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <a
                  href={`${affiliateBaseUrl}/register`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#122846] hover:bg-sky-50 font-extrabold text-sm shadow-lg transition-all"
                >
                  <span>Affiliate Register</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`${affiliateBaseUrl}/login`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-all"
                >
                  <span>Affiliate Login</span>
                </a>

                <Link
                  href="/landing/affiliate"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold text-sky-200 hover:text-white transition-colors"
                >
                  <span>Explore Program Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Stats Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-200 mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">30%</p>
                <p className="text-xs text-sky-100/80 font-medium mt-1">
                  Recurring Commission Rate
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-200 mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">6 Months</p>
                <p className="text-xs text-sky-100/80 font-medium mt-1">
                  Per Referred Merchant
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-200 mb-3">
                  <Wallet className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">৳100</p>
                <p className="text-xs text-sky-100/80 font-medium mt-1">
                  Minimum Fast Withdrawal
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-200 mb-3">
                  <Gift className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">+10 Days</p>
                <p className="text-xs text-sky-100/80 font-medium mt-1">
                  Merchant Bonus Free Trial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

