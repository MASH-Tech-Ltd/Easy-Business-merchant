'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, X, Star, Zap, ShieldCheck, Clock, Crown, ThumbsUp, Sparkles } from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { useSocket } from '@/context/SocketContext';
import PlanComparisonTable from '@/components/landing/PlanComparisonTable';

interface Package {
  _id: string;
  name: string;
  price: number;
  billingCycle: string;
  productLimit: number;
  features?: string[];
  tagline?: string;
  description?: string;
  isActive: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

interface Subscription {
  _id: string;
  packageId: Package | null;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  isTrial?: boolean;
  originalPrice?: number;
  paidAmount?: number;
  discountApplied?: {
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    discountAmount?: number;
    reason?: string;
  };
  isRenewed?: boolean;
  renewalEndDate?: string;
  extendedEndDate?: string;
  renewalStatus?: string;
  queuedSubscription?: any;
  hasPendingRequest?: boolean;
  pendingSubscription?: any;
  isUpcomingOnly?: boolean;
  daysUntilStart?: number;
  upcomingStartDate?: string;
  upcomingEndDate?: string;
}

interface ReferralDiscountInfo {
  referralCode?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  used?: boolean;
}

let globalPackagesCache: Package[] = [];
let globalSubscriptionCache: Subscription | null = null;
let globalExpiredSubscriptionCache: Subscription | null = null;
let globalSubscriptionLoaded = false;
const PLAN_ESCALATING_FEATURES: Record<string, string[]> = {
  basic: [
    "Up to 199 Products Capacity",
    "Courier Automation: 5 Free Orders / Month",
    "Abandoned Checkout: 5 Free Leads / Month",
    "Online Storefront & All 5 Modern Themes",
    "Mash Eco Subdomain & Custom Domain",
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
    "Mash Eco Subdomain & Custom Domain",
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
    "Up to 1500 Products (Maximum Catalog Size)",
    "Courier Automation: 15 Free Orders / Month (3x Volume)",
    "Abandoned Checkout: 15 Free Leads / Month (3x Volume)",
    "Online Storefront & All 5 Modern Themes",
    "Mash Eco Subdomain & Custom Domain",
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

export default function SubscriptionPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>(globalPackagesCache);
  const [subscription, setSubscription] = useState<Subscription | null>(globalSubscriptionCache);
  const [expiredSubscription, setExpiredSubscription] = useState<Subscription | null>(globalExpiredSubscriptionCache);
  const [referralDiscount, setReferralDiscount] = useState<ReferralDiscountInfo | null>(null);
  const [loading, setLoading] = useState(!globalSubscriptionLoaded);
  const [submitting, setSubmitting] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [confirmModal, setConfirmModal] = useState<(Package & { isRenewal?: boolean; finalPrice?: number }) | null>(null);
  const [activationType, setActivationType] = useState<'immediate' | 'queue'>('immediate');
  const [activatingEarly, setActivatingEarly] = useState(false);
  const { socket } = useSocket();

  const handleActivateEarly = async () => {
    setActivatingEarly(true);
    try {
      await api.post('/subscriptions/activate-early');
      toast.success('Subscription activated immediately with zero time gap!');
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to activate subscription early');
    } finally {
      setActivatingEarly(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('dashboard:refresh', fetchData);
    return () => window.removeEventListener('dashboard:refresh', fetchData);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchData();
    };

    socket.on('refresh_subscriptions', handleRefresh);
    socket.on('new_notification', handleRefresh);

    return () => {
      socket.off('refresh_subscriptions', handleRefresh);
      socket.off('new_notification', handleRefresh);
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [packagesRes, subRes, storeRes] = await Promise.all([
        api.get('/packages/get-all-packages'),
        api.get('/subscriptions/my-subscription?includeExpired=true'),
        api.get('/tenants/my-store').catch((err) => {
          if (err?.response?.status === 404 || err?.response?.data?.code === 'ACCOUNT_DELETED' || err?.response?.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('merchantUser');
              sessionStorage.removeItem('merchantUser');
              window.location.href = '/login';
            }
          }
          return null;
        }),
      ]);
      
      const activePackages = (packagesRes.data.data || []).filter((p: Package) => p.isActive);
      globalPackagesCache = activePackages;
      setPackages(activePackages);

      if (storeRes?.data?.data?.referralDiscount) {
        setReferralDiscount(storeRes.data.data.referralDiscount);
      }

      const sub: Subscription | null = subRes.data.data;
      if (sub && sub.status === 'expired') {
        // No active subscription — this is the last expired one
        globalExpiredSubscriptionCache = sub;
        globalSubscriptionCache = null;
        setExpiredSubscription(sub);
        setSubscription(null);
      } else {
        globalSubscriptionCache = sub;
        globalExpiredSubscriptionCache = null;
        setSubscription(sub);
        setExpiredSubscription(null);
      }
      globalSubscriptionLoaded = true;
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (originalPrice: number) => {
    if (!referralDiscount || referralDiscount.used || !referralDiscount.discountValue) {
      return originalPrice;
    }
    if (referralDiscount.discountType === 'percentage') {
      const discount = Math.round((originalPrice * referralDiscount.discountValue) / 100);
      return Math.max(0, originalPrice - discount);
    }
    if (referralDiscount.discountType === 'fixed') {
      return Math.max(0, originalPrice - referralDiscount.discountValue);
    }
    return originalPrice;
  };

  const handleSubscribe = async () => {
    if (!confirmModal) return;
    setSubmitting(true);
    const pkgName = confirmModal.name;
    const finalAmount = confirmModal.finalPrice ?? confirmModal.price;
    const isRenewal = confirmModal.isRenewal;
    try {
      await api.post('/subscriptions/request-package', {
        packageId: confirmModal._id,
        activationType,
      });
      toast.success('Subscription requested! Redirecting to payment...');
      setConfirmModal(null);
      router.push(`/dashboard/subscription/payment?purpose=${isRenewal ? 'renewal' : 'package'}&title=${encodeURIComponent(pkgName)}&amount=${finalAmount}`);
    } catch (error: any) {
      console.error('Error subscribing:', error);
      toast.error(error.response?.data?.message || 'Failed to request subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const displayedPackages = packages.filter(p => p.billingCycle.toLowerCase() === billingCycle);
  const activePackageId = subscription?.packageId?._id;
  const isPending = subscription?.status === 'pending' || Boolean(subscription?.hasPendingRequest);
  const isTrialActive = subscription?.isTrial && subscription?.status === 'active';
  const trialDaysLeft = isTrialActive
    ? Math.max(0, Math.ceil((new Date(subscription!.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const isExpired = !!expiredSubscription;
  const expiredPackageName = expiredSubscription?.isTrial
    ? 'Free Trial'
    : expiredSubscription?.packageId?.name || 'Previous Plan';
  const expiredDate = expiredSubscription
    ? new Date(expiredSubscription.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const isSubDiscountValid = Boolean(
    subscription &&
    !subscription.isTrial &&
    subscription.discountApplied &&
    (Number(subscription.discountApplied.discountValue || 0) > 0 || Number(subscription.discountApplied.discountAmount || 0) > 0) &&
    subscription.originalPrice &&
    subscription.paidAmount !== undefined &&
    subscription.paidAmount !== null &&
    Number(subscription.paidAmount) > 0 &&
    Number(subscription.paidAmount) < Number(subscription.originalPrice)
  );

  const isEligibleForReferral = Boolean(
    (!subscription || subscription.isTrial || subscription.status !== 'active') &&
    referralDiscount &&
    !referralDiscount.used &&
    Number(referralDiscount.discountValue || 0) > 0
  );

  return (
    <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto min-h-[calc(100vh-64px)] bg-[#f8f9fc]">
      <div className="text-center mb-8 sm:mb-12 relative z-10 pt-4 sm:pt-8">
        <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-purple-100 rounded-full mb-4 sm:mb-6">
          <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#5022C3]" />
        </div>
        <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-3 sm:mb-6 tracking-tight px-2">
          Choose the right plan for your business
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-lg px-2">
          Scale your store with confidence. From startup to enterprise, we have a tier that perfectly matches your ambition.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center mt-6 sm:mt-8">
          <div className="bg-white p-1 rounded-xl inline-flex relative shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                billingCycle === 'monthly' ? 'bg-[#5022C3] text-white shadow-md shadow-purple-500/20' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ${
                billingCycle === 'yearly' ? 'bg-[#5022C3] text-white shadow-md shadow-purple-500/20' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly billing
            </button>
            <span className="absolute -top-3 -right-4 sm:-right-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm animate-pulse border border-white">
              SAVE 20%
            </span>
          </div>
        </div>
      </div>

      {/* Referral Discount Promo Banner */}
      {!loading && isEligibleForReferral && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-emerald-950 text-sm sm:text-base">
                    Exclusive First-Time Referral Offer Applied!
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                    {referralDiscount?.discountValue}{referralDiscount?.discountType === 'fixed' ? '৳' : '%'} Off 1st Plan
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-1 leading-relaxed">
                  Referral code <span className="font-mono font-bold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300">{referralDiscount?.referralCode}</span> unlocks special savings on your first purchase:
                  <span className="block mt-1 sm:inline sm:mt-0 font-semibold text-emerald-950">
                    {' '}• <strong>Yearly Plans:</strong> Enjoy <strong>20% Platform Annual Savings + {referralDiscount?.discountValue}{referralDiscount?.discountType === 'fixed' ? '৳' : '%'} First-Time Extra Off</strong>.
                    {' '}• <strong>Monthly Plans:</strong> <strong>{referralDiscount?.discountValue}{referralDiscount?.discountType === 'fixed' ? '৳' : '%'} Off</strong> your first month.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Trial Active Banner */}
      {!loading && isTrialActive && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-900 text-base">Free Trial</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
                  </span>
                </div>
                <p className="text-sm text-amber-700 font-medium">
                  {trialDaysLeft > 0
                    ? <>Your free trial expires in <strong>{trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'}</strong>. Upgrade to keep your store live.</>
                    : 'Your free trial expires today. Upgrade now to avoid interruption.'}
                </p>
              </div>
            </div>
            <div className="text-xs text-amber-600 font-semibold shrink-0">
              Expires: {new Date(subscription!.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming / Scheduled Subscription Banner (e.g. current was cancelled) */}
      {!loading && subscription && subscription.isUpcomingOnly && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-blue-50 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900 text-base">
                    Upcoming Plan: {subscription.packageId?.name || 'Scheduled Plan'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Clock className="w-3 h-3" /> Starts in {subscription.daysUntilStart || 1} Days
                  </span>
                  <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-rose-200">
                    Current Plan Cancelled
                  </span>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Your current period is cancelled or inactive. Your next plan is scheduled to begin on <strong>{new Date(subscription.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>.
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={handleActivateEarly}
                disabled={activatingEarly}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                {activatingEarly ? "Activating..." : "Activate Plan Today (Start Now)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Paid Subscription Banner */}
      {!loading && subscription && !subscription.isTrial && subscription.status === 'active' && !subscription.isUpcomingOnly && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5022C3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-[#5022C3]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900 text-base">
                    Current Plan: {subscription.packageId?.name || 'Active Plan'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
                  </span>
                  {subscription.isRenewed && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-[#5022C3] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200">
                      <Check className="w-3 h-3" strokeWidth={3} /> Plan Renewed
                    </span>
                  )}
                  {subscription.hasPendingRequest && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3" /> Renewal Request Pending
                    </span>
                  )}
                  {isSubDiscountValid && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-200">
                      <Sparkles className="w-3 h-3" />
                      {subscription.discountApplied?.discountType === 'fixed'
                        ? `৳${subscription.discountApplied?.discountValue || subscription.discountApplied?.discountAmount} ${subscription.discountApplied?.reason || 'Discount'}`
                        : `${subscription.discountApplied?.discountValue}% ${subscription.discountApplied?.reason || 'Referral Discount'}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium flex-wrap">
                  {isSubDiscountValid ? (
                    <>
                      <span>You Paid:</span>
                      <span className="line-through text-gray-400 font-semibold">
                        ৳{(subscription.originalPrice || subscription.packageId?.price || 0).toLocaleString()}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-sm">
                        ৳{Number(subscription.paidAmount).toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({subscription.discountApplied?.reason || 'Discount Applied'})
                      </span>
                    </>
                  ) : (
                    <span>
                      Plan Price: <strong>৳{Number(subscription.paidAmount && Number(subscription.paidAmount) > 0 ? subscription.paidAmount : (subscription.originalPrice || subscription.packageId?.price || 0)).toLocaleString()}</strong> / {subscription.packageId?.billingCycle || 'month'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-gray-400 font-semibold mb-0.5">
                {subscription.isRenewed ? 'Current Cycle Ends' : 'Renews / Expires'}
              </div>
              <div className="text-sm font-bold text-purple-900">
                {new Date(subscription.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {subscription.isRenewed && (subscription.extendedEndDate || subscription.renewalEndDate) && (
                <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center justify-end gap-1">
                  <Check className="w-3 h-3" strokeWidth={3} />
                  Covered until {new Date(subscription.extendedEndDate || subscription.renewalEndDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              {subscription.hasPendingRequest && (
                <div className="text-[11px] font-bold text-amber-600 mt-1 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  Renewal awaiting approval
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expired Subscription Banner */}
      {!loading && isExpired && (
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-base">{expiredPackageName}</span>
                  <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-red-200">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Expired
                  </span>
                </div>
                <p className="text-sm text-red-600 font-medium">
                  Your {expiredSubscription?.isTrial ? 'free trial' : 'subscription'} expired on <strong>{expiredDate}</strong>. Your store is currently <strong>offline</strong>. Choose a plan below to go live again.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-xs text-red-400 font-semibold mb-1">Expired on</div>
              <div className="text-sm font-bold text-red-600">{expiredDate}</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin"></div>
        </div>
      ) : displayedPackages.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100">
          No {billingCycle} packages available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 items-start">
          {displayedPackages.sort((a,b) => {
            const order = ['basic', 'standard', 'premium'];
            const idxA = order.indexOf((a.name || '').toLowerCase().trim());
            const idxB = order.indexOf((b.name || '').toLowerCase().trim());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            return a.price - b.price;
          }).map((pkg, index) => {
            const isPopular = pkg.isPopular || pkg.name.toLowerCase().includes('standard'); 
            const isRecommended = pkg.isRecommended;
            const isCurrentActive = activePackageId === pkg._id && subscription?.status === 'active';
            const isCurrentPending = activePackageId === pkg._id && subscription?.status === 'pending';
            const nameLower = (pkg.name || '').toLowerCase().trim();
            const meta = nameLower.includes('basic') ? {
              badge: 'STARTER KIT',
              summary: 'Essential tools to launch your brand online with standard support.',
              highlights: ['199 Products Capacity', '5 Free Courier Orders / mo', '5 Free Abandoned Leads / mo', 'Standard Ticket Support']
            } : nameLower.includes('standard') ? {
              badge: 'HIGH GROWTH',
              inheritance: 'Includes everything in Basic, plus:',
              summary: 'Double capacity, 2x free automations, and native analytics for growing stores.',
              highlights: ['399 Products (+100% capacity)', '10 Free Courier Orders / mo', '10 Free Abandoned Leads / mo', 'GA4 & Meta Pixel Tracking']
            } : nameLower.includes('premium') ? {
              badge: 'MAX SCALE & VIP',
              inheritance: 'Includes everything in Standard, plus:',
              summary: 'Maximum 699 product capacity, 3x free automations, and dedicated Swift VIP support.',
              highlights: ['699 Products (Maximum)', '15 Free Courier Orders / mo', '15 Free Abandoned Leads / mo', 'Swift VIP Priority Support']
            } : null;
            
            return (
              <div 
                key={pkg._id} 
                className={`relative bg-white rounded-3xl border transition-all duration-500 flex flex-col overflow-hidden group ${
                  isPopular 
                    ? 'border-[#5022C3] ring-2 ring-[#5022C3] shadow-xl lg:-mt-4 z-10' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg shadow-md lg:mt-0'
                }`}
              >
                {/* Background Gradient for Popular */}
                {isPopular && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#5022C3]/5 to-transparent pointer-events-none" />
                )}

                <div className="flex flex-col w-full">
                  {isPopular && (
                    <div className="bg-[#5022C3] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 text-center flex items-center justify-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" /> Most Popular
                    </div>
                  )}
                </div>
                
                {isCurrentActive && (
                  <div className="absolute top-5 right-5 flex items-center gap-1.5 z-20">
                    {subscription?.isUpcomingOnly ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" /> Starts in {subscription.daysUntilStart || 1}d
                      </span>
                    ) : (
                      <>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-green-200">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
                        </span>
                        {subscription?.isRenewed && (
                          <span className="bg-purple-100 text-[#5022C3] text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1 border border-purple-200 shadow-xs">
                            <Check className="w-3 h-3" strokeWidth={3} /> Renewed
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                <div className="p-6 pb-4 relative">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-xl font-extrabold text-gray-900">{pkg.name}</h3>
                    {isRecommended && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <ThumbsUp className="w-3 h-3 fill-current" /> Recommended
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    {(() => {
                      const isYearly = pkg.billingCycle === 'yearly';
                      const matchingMonthly = isYearly ? packages.find(p => p.billingCycle === 'monthly' && p.name.toLowerCase() === pkg.name.toLowerCase()) : null;
                      const regularAnnualPrice = matchingMonthly ? (matchingMonthly.price * 12) : Math.round(pkg.price * 1.2);

                      // Referral discount only applies to first-time eligible users who haven't claimed it yet.
                      // Once claimed or for existing active plans, future renewals/upgrades always use the real package price.
                      const hasReferralDiscount = isEligibleForReferral;
                      const discountedPrice = hasReferralDiscount ? calculateFinalPrice(pkg.price) : pkg.price;

                      const totalSavedOnYearly = regularAnnualPrice - discountedPrice;
                      const monthlySaved = pkg.price - discountedPrice;
                      const hasDiscount = hasReferralDiscount && (isYearly ? totalSavedOnYearly > 0 : monthlySaved > 0);

                      const discountBadgeText = hasReferralDiscount
                        ? `${referralDiscount?.discountValue}${referralDiscount?.discountType === 'fixed' ? '৳' : '%'} Off Applied`
                        : '';

                      return (
                        <>
                          {isYearly ? (
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="text-sm sm:text-base font-bold text-gray-400 line-through decoration-red-400 decoration-1">
                                ৳{regularAnnualPrice.toLocaleString()}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5022C3] text-[10px] font-extrabold uppercase tracking-wider border border-purple-200">
                                20% Platform Saver
                              </span>
                              {hasDiscount && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  {discountBadgeText}
                                </span>
                              )}
                            </div>
                          ) : hasDiscount ? (
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm sm:text-base font-bold text-gray-400 line-through decoration-red-400 decoration-2">
                                ৳{pkg.price.toLocaleString()}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                {discountBadgeText}
                              </span>
                            </div>
                          ) : (
                            <div className="text-base font-semibold invisible select-none leading-tight mb-1">
                              ৳0
                            </div>
                          )}

                          <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                            <span className={`text-4xl font-black tracking-tight ${hasDiscount ? 'text-emerald-700' : 'text-gray-900'}`}>
                              ৳{discountedPrice.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 font-semibold">/ Per {isYearly ? 'Year' : 'Month'}</span>
                          </div>

                          {/* Clear Breakdown & Logical Savings Details */}
                          {isYearly && hasDiscount && (
                            <div className="mt-2 text-[11px] leading-tight text-emerald-800 font-medium bg-emerald-50/90 border border-emerald-200 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1">
                              <span>Platform 20% + {discountBadgeText}</span>
                              <span className="font-extrabold text-emerald-700 whitespace-nowrap">Save ৳{totalSavedOnYearly.toLocaleString()}</span>
                            </div>
                          )}
                          {isYearly && !hasDiscount && (
                            <div className="mt-2 text-[11px] leading-tight text-purple-800 font-medium bg-purple-50 border border-purple-200 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1">
                              <span>Annual Saver (2 Months Free)</span>
                              <span className="font-extrabold text-[#5022C3] whitespace-nowrap">Save ৳{(regularAnnualPrice - pkg.price).toLocaleString()}</span>
                            </div>
                          )}
                          {!isYearly && hasDiscount && monthlySaved > 0 && (
                            <div className="mt-2 text-[11px] leading-tight text-emerald-800 font-medium bg-emerald-50/90 border border-emerald-200 rounded-xl px-2.5 py-1.5 flex items-center justify-between gap-1">
                              <span>First-Time Offer Applied</span>
                              <span className="font-extrabold text-emerald-700 whitespace-nowrap">Save ৳{monthlySaved.toLocaleString()}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="mb-2 space-y-1">
                    {pkg.tagline && (
                      <p className="text-[13px] font-bold text-gray-900 leading-snug">
                        {pkg.tagline}
                      </p>
                    )}
                    <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                      {pkg.description || `Perfect for growing businesses that need ${pkg.name.toLowerCase()} features and customization.`}
                    </p>
                  </div>

                </div>
                
                <div className="px-6 pb-6 flex-1 flex flex-col relative bg-gray-50/50">
                  <div className="h-px w-full bg-gray-200 mb-4"></div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {(() => {
                      const nameLower = (pkg.name || "").toLowerCase().trim();
                      const planKey = nameLower.includes("basic")
                        ? "basic"
                        : nameLower.includes("standard")
                          ? "standard"
                          : nameLower.includes("premium")
                            ? "premium"
                            : nameLower;
                      const featuresList = PLAN_ESCALATING_FEATURES[planKey] || pkg.features || [];
                      return featuresList.map((feature, idx) => {
                        if (feature.startsWith('Key Features:')) return null;
                        
                        const isNested = feature.startsWith('- ') || feature.startsWith('* ');
                        const cleanFeature = isNested ? feature.substring(2) : feature;
                        const isExcluded = /\b(not included|0 free)\b/i.test(cleanFeature);
                        const colonIndex = cleanFeature.indexOf(':');
                        const hasBoldPrefix = colonIndex > 0 && colonIndex < 35;
                        
                        return (
                          <li key={idx} className="flex items-start gap-2.5">
                            {isExcluded ? (
                              <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                <X className="w-3 h-3 text-rose-500" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                            <span className={`text-sm font-normal leading-relaxed ${isExcluded ? 'text-gray-400' : 'text-gray-600'}`}>
                              {hasBoldPrefix ? (
                                <>
                                  <strong className={isExcluded ? 'text-gray-400 font-semibold' : 'text-gray-900 font-bold'}>{cleanFeature.substring(0, colonIndex + 1)}</strong>
                                  {cleanFeature.substring(colonIndex + 1)}
                                </>
                              ) : (
                                cleanFeature
                              )}
                            </span>
                          </li>
                        );
                      });
                    })()}
                  </ul>
                  
                  {isCurrentActive ? (
                    subscription?.isUpcomingOnly ? (
                      <button 
                        onClick={handleActivateEarly}
                        disabled={activatingEarly}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        {activatingEarly ? "Activating..." : "Activate Plan Now (Start Today)"}
                      </button>
                    ) : subscription?.hasPendingRequest ? (
                      <button 
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center gap-1.5 cursor-default shadow-xs"
                      >
                        <Clock className="w-4 h-4 animate-spin-slow" /> Renewal Request Pending
                      </button>
                    ) : subscription?.isRenewed ? (
                      <button 
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-purple-50 text-[#5022C3] border border-purple-200 flex items-center justify-center gap-1.5 cursor-default shadow-xs"
                      >
                        <Check className="w-4 h-4" strokeWidth={3} /> Plan Renewed (Next Cycle Confirmed)
                      </button>
                    ) : (
                      <button 
                        onClick={() => setConfirmModal({ ...pkg, isRenewal: true, finalPrice: pkg.price })}
                        disabled={isPending}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                          isPending ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                          'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        <Check className="w-4 h-4 inline-block mr-1 -mt-0.5" /> Renew Plan
                      </button>
                    )
                  ) : isCurrentPending ? (
                    <button disabled className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center gap-2 cursor-default">
                      <Clock className="w-4 h-4 animate-spin-slow" /> Pending
                    </button>
                  ) : (
                    <button 
                      onClick={() => setConfirmModal({ ...pkg, finalPrice: isEligibleForReferral ? calculateFinalPrice(pkg.price) : pkg.price })}
                      disabled={isPending}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                        isPending ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                        isPopular 
                          ? 'bg-[#5022C3] hover:bg-[#401a9c] text-white shadow-md shadow-purple-500/20' 
                          : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {isPending ? 'Cannot upgrade' : 'Upgrade to ' + pkg.name}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Plan Comparison Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <PlanComparisonTable billing={billingCycle} />
      </div>

      {/* Feature Highlight */}
      <div className="mt-16 bg-gradient-to-br from-slate-900 via-[#1A0B2E] to-slate-900 rounded-[2rem] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden w-full max-w-5xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-2xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 tracking-tight">Enterprise Grade Security & Performance</h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
            All our premium plans come with a 99.99% uptime SLA guarantee, real-time automated backups, and enterprise-grade SSL certificates included completely free of charge. Your store is always blazingly fast and impeccably secure.
          </p>
        </div>
        <div className="flex gap-8 relative z-10 shrink-0">
          <div className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
              <Zap className="w-8 h-8 text-yellow-400 drop-shadow-md" />
            </div>
            <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">Global CDN</span>
          </div>
          <div className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-emerald-400 drop-shadow-md" />
            </div>
            <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">AES-256 SSL</span>
          </div>
        </div>
      </div>
      
      <div className="h-16"></div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-in-center">
            <div className="p-8 text-center relative">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => !submitting && setConfirmModal(null)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-[#5022C3]" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Confirm {confirmModal.isRenewal ? 'Renewal' : 'Upgrade'}</h2>
              {(() => {
                const isYearly = confirmModal.billingCycle === 'yearly';
                const matchingMonthly = isYearly ? packages.find(p => p.billingCycle === 'monthly' && p.name.toLowerCase() === confirmModal.name.toLowerCase()) : null;
                const regularAnnualPrice = matchingMonthly ? (matchingMonthly.price * 12) : Math.round(confirmModal.price * 1.2);
                const referralDiscountAmount = confirmModal.price - (confirmModal.finalPrice ?? confirmModal.price);
                const hasReferralDiscount = !confirmModal.isRenewal && isEligibleForReferral && confirmModal.finalPrice !== undefined && confirmModal.finalPrice < confirmModal.price && referralDiscountAmount > 0;

                return (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left text-xs mb-6 space-y-2">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Package Selected:</span>
                      <span className="font-bold text-slate-900">{confirmModal.name} ({isYearly ? 'Annual' : 'Monthly'})</span>
                    </div>

                    {isYearly && (
                      <>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>12-Month Standard Value:</span>
                          <span className="line-through">৳{regularAnnualPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-purple-700 font-medium">
                          <span>Platform Annual Savings (20%):</span>
                          <span>-৳{(regularAnnualPrice - confirmModal.price).toLocaleString()}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center text-slate-700">
                      <span>Base Plan Price:</span>
                      <span className="font-semibold">৳{confirmModal.price.toLocaleString()}</span>
                    </div>

                    {hasReferralDiscount && (
                      <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-100/70 px-2 py-1 rounded-lg">
                        <span>First-Time Referral Discount:</span>
                        <span>-৳{referralDiscountAmount.toLocaleString()} ({referralDiscount?.discountValue}{referralDiscount?.discountType === 'fixed' ? '৳' : '%'} Off)</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-900">Total Payable:</span>
                      <span className="text-xl font-black text-emerald-700">
                        ৳{(confirmModal.finalPrice ?? confirmModal.price).toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
                      </span>
                    </div>
                  </div>
                );
              })()}
              
              {/* Activation Choice Option (Instant vs Queue) - Only shown when upgrading to a DIFFERENT package */}
              {(() => {
                const isDifferentPackage =
                  subscription?.packageId?._id &&
                  subscription.packageId._id.toString() !== confirmModal._id.toString();
                const showChoice =
                  isDifferentPackage &&
                  !confirmModal.isRenewal &&
                  subscription?.status === 'active' &&
                  !subscription?.isTrial;

                if (!showChoice) return null;

                return (
                  <div className="mb-6 text-left">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      Activation Schedule (Package Upgrade)
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      <label
                        onClick={() => setActivationType('immediate')}
                        className={`relative flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                          activationType === 'immediate'
                            ? 'border-[#5022C3] bg-purple-50/60 shadow-sm'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="activationType"
                          value="immediate"
                          checked={activationType === 'immediate'}
                          onChange={() => setActivationType('immediate')}
                          className="mt-1 text-[#5022C3] focus:ring-[#5022C3]"
                        />
                        <div className="ml-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              ⚡ Instant Upgrade
                            </span>
                            <span className="text-[10px] font-bold bg-purple-100 text-[#5022C3] px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Start immediately from today. Premium features and limits unlock right away.
                          </p>
                        </div>
                      </label>

                      <label
                        onClick={() => setActivationType('queue')}
                        className={`relative flex items-start p-3.5 rounded-xl border cursor-pointer transition-all ${
                          activationType === 'queue'
                            ? 'border-[#5022C3] bg-purple-50/60 shadow-sm'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="activationType"
                          value="queue"
                          checked={activationType === 'queue'}
                          onChange={() => setActivationType('queue')}
                          className="mt-1 text-[#5022C3] focus:ring-[#5022C3]"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-bold text-gray-900">
                            ⏳ After Current Plan Ends
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Keep using your current plan until it expires, then automatically start this plan.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">What happens next</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Request sent to admin for approval
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />{' '}
                    {activationType === 'immediate'
                      ? 'Plan activates immediately upon payment verification'
                      : 'New time starts automatically when current period expires'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Complete peace of mind and seamless store continuity
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setConfirmModal(null)}
                  disabled={submitting}
                  className="flex-1 py-3.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubscribe}
                  disabled={submitting}
                  className="flex-1 py-3.5 text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c] rounded-xl transition-colors shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing
                    </>
                  ) : (
                    `Confirm ${confirmModal.isRenewal ? 'Renewal' : 'Upgrade'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
