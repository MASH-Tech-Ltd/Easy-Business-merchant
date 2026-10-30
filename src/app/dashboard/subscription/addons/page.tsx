'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Mail, 
  BarChart, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  X,
  Copy,
  Send,
  Smartphone,
  Pencil,
  Clock,
  Building2,
  Truck,
  ShoppingCart,
  MessageSquare,
  Code2,
  TrendingUp,
  Crown,
  Lock
} from 'lucide-react';

import { useSocket } from '@/context/SocketContext';
import { billingCacheStore } from '@/utils/billingCache';
import { MFSLogo } from '@/components/MFSLogo';

export default function AddonsPage() {
  const router = useRouter();
  const hasCache = billingCacheStore.addons !== null;

  const [addons, setAddons] = useState<any[]>(billingCacheStore.addons || []);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'basic' | 'standard' | 'premium' | 'active'>('all');
  const [purchasedAddons, setPurchasedAddons] = useState<{
    id: string;
    status: string;
    used: number;
    limit: number;
    freeLimit?: number;
    freeUsed?: number;
    paidLimit?: number;
    paidUsed?: number;
    nextResetDate?: string;
  }[]>(billingCacheStore.purchasedAddons || []);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(billingCacheStore.subscriptionEndDate);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(billingCacheStore.hasActiveSubscription || false);
  const [isTrialAccount, setIsTrialAccount] = useState<boolean>(false);
  const [loading, setLoading] = useState(!hasCache);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Payment Modal States
  const [platformAccounts, setPlatformAccounts] = useState<any[]>(billingCacheStore.platformAccounts || []);
  const [myPayments, setMyPayments] = useState<any[]>(billingCacheStore.myPayments || []);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    addon: any | null;
    existingPayment: any | null;
  }>({
    isOpen: false,
    addon: null,
    existingPayment: null,
  });

  const [paymentForm, setPaymentForm] = useState({
    provider: 'bKash',
    senderNumber: '',
    transactionId: '',
    amount: '',
    note: ''
  });
  const [formErrors, setFormErrors] = useState<{
    senderNumber?: string;
    transactionId?: string;
    amount?: string;
  }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      if (billingCacheStore.addons === null) {
        setLoading(true);
      }

      const [addonsRes, subRes, settingsRes, paymentsRes] = await Promise.all([
        api.get('/addons'),
        api.get('/subscriptions/my-subscription'),
        api.get('/billing/platform-payment-settings').catch(() => null),
        api.get('/billing/my-payments').catch(() => null),
      ]);
      
      if (addonsRes?.data?.data) {
        const filteredAddons = addonsRes.data.data.filter((a: any) => a.isActive);
        setAddons(filteredAddons);
        billingCacheStore.addons = filteredAddons;
      }

      if (subRes?.data?.data) {
        const isTrial = Boolean(subRes.data.data.isTrial);
        const isActiveSub = subRes.data.data.status === 'active';
        const subEndDate = subRes.data.data.endDate || null;
        setHasActiveSubscription(isActiveSub);
        setIsTrialAccount(isTrial);
        setSubscriptionEndDate(subEndDate);
        setCurrentPackage(subRes.data.data.packageId || (isTrial ? { name: 'Free Trial', billingCycle: 'monthly', price: 0 } as any : null));
        billingCacheStore.hasActiveSubscription = isActiveSub;
        billingCacheStore.subscriptionEndDate = subEndDate;

        if (subRes.data.data.purchasedAddons) {
          const pIds = subRes.data.data.purchasedAddons.map((pa: any) => ({
            id: typeof pa.addonId === 'string' ? pa.addonId : pa.addonId?._id,
            status: pa.status || 'active',
            used: pa.used || 0,
            limit: pa.limit || 0,
            freeLimit: pa.freeLimit || 0,
            freeUsed: pa.freeUsed || 0,
            paidLimit: pa.paidLimit || 0,
            paidUsed: pa.paidUsed || 0,
            nextResetDate: pa.nextResetDate,
          }));
          setPurchasedAddons(pIds);
          billingCacheStore.purchasedAddons = pIds;
        }
      }

      if (settingsRes?.data?.data?.accounts) {
        const activeAccounts = settingsRes.data.data.accounts.filter((a: any) => a.isActive);
        setPlatformAccounts(activeAccounts);
        billingCacheStore.platformAccounts = activeAccounts;
      }
      if (paymentsRes?.data?.data) {
        setMyPayments(paymentsRes.data.data);
        billingCacheStore.myPayments = paymentsRes.data.data;
      }
    } catch (error) {
      toast.error('Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      if (!notification) return;
      fetchData();
    };

    const handleRefreshSubscriptions = () => {
      fetchData();
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('refresh_subscriptions', handleRefreshSubscriptions);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('refresh_subscriptions', handleRefreshSubscriptions);
    };
  }, [socket]);

  const handleOpenPaymentModal = (addon: any) => {
    if (isTrialAccount) {
      toast('Add-on purchases require a paid subscription. Please upgrade your plan.', { icon: 'ℹ️' });
      router.push('/dashboard/subscription');
      return;
    }
    const eligibility = getPlanEligibility(addon);
    if (!eligibility.isEligible) {
      toast.error(`This add-on requires a ${eligibility.requiredPlanName} plan. Please upgrade your subscription.`);
      router.push('/dashboard/subscription');
      return;
    }

    // Find existing pending payment proof specifically for this addon name
    const existing = myPayments.find(
      (p) => p.status === 'pending' && p.purposeTitle?.trim().toLowerCase() === addon.name?.trim().toLowerCase()
    );

    setPaymentModal({
      isOpen: true,
      addon,
      existingPayment: existing || null,
    });

    setPaymentForm({
      provider: existing?.provider || platformAccounts[0]?.provider || 'bKash',
      senderNumber: existing?.senderNumber || '',
      transactionId: existing?.transactionId || '',
      amount: String(existing?.amount || addon.price || 0),
      note: existing?.note || `Purchase of ${addon.name}`
    });
    setFormErrors({});
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({ isOpen: false, addon: null, existingPayment: null });
    setFormErrors({});
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Number copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmitModalPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { addon, existingPayment } = paymentModal;
    if (!addon) return;

    const errors: { senderNumber?: string; transactionId?: string; amount?: string } = {};

    const numAmount = Number(paymentForm.amount);
    if (!paymentForm.amount || isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }

    const rawSender = paymentForm.senderNumber.trim();
    const sanitizedMobile = rawSender.replace(/[\s\-()]/g, '').replace(/^(?:\+?880)/, '0');
    const isMobileBanking = ['bKash', 'Nagad', 'Rocket', 'Upay'].includes(paymentForm.provider);

    if (!rawSender) {
      errors.senderNumber = 'Sender phone/account number is required';
    } else if (isMobileBanking) {
      // Bangladeshi valid mobile numbers: 013, 014, 015, 016, 017, 018, 019 (11 digits total)
      if (!/^01[3-9]\d{8}$/.test(sanitizedMobile)) {
        errors.senderNumber = 'Please enter a valid 11-digit BD number (e.g. 017XXXXXXXX, 018..., 019..., 013...)';
      }
    } else if (!isMobileBanking && rawSender.length < 5) {
      errors.senderNumber = 'Account number must be at least 5 characters/digits';
    }

    const cleanTrx = paymentForm.transactionId.trim();
    if (!cleanTrx) {
      errors.transactionId = 'Transaction ID (TrxID) is required';
    } else if (cleanTrx.length < 4) {
      errors.transactionId = 'TrxID must be at least 4 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return toast.error('Please fix the errors in the payment form');
    }

    setFormErrors({});

    try {
      setSubmittingPayment(true);

      // 1. Submit Addon Purchase Request if not already requested
      const purchasedAddon = purchasedAddons.find(p => p.id === addon._id);
      if (!purchasedAddon || purchasedAddon.status !== 'pending') {
        try {
          await api.post('/subscriptions/addons/purchase', { addonId: addon._id });
          setPurchasedAddons(prev => {
            const filtered = prev.filter(p => p.id !== addon._id);
            return [...filtered, { id: addon._id, status: 'pending', used: 0, limit: 0 }];
          });
        } catch (err: any) {
          // If already requested, swallow or proceed
        }
      }

      // 2. Submit or Update Payment Proof
      const payload = {
        purpose: 'addon',
        purposeTitle: addon.name,
        amount: Number(paymentForm.amount),
        provider: paymentForm.provider,
        senderNumber: isMobileBanking ? sanitizedMobile : rawSender,
        transactionId: paymentForm.transactionId.trim(),
        note: paymentForm.note.trim()
      };

      if (existingPayment) {
        await api.put(`/billing/my-payments/${existingPayment._id}`, payload);
        toast.success(`Payment proof updated for ${addon.name}! Admin will review shortly.`);
      } else {
        await api.post('/billing/submit-payment', payload);
        toast.success(`Payment proof submitted for ${addon.name}! Admin will verify shortly.`);
      }

      handleClosePaymentModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getAddonIcon = (slug: string) => {
    const s = (slug || '').toLowerCase();
    if (s.includes('courier')) return <Truck className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('abandoned')) return <ShoppingCart className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('fraud')) return <ShieldCheck className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('sms')) return <MessageSquare className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('mail') || s.includes('email')) return <Mail className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('gtm') || s.includes('script')) return <Code2 className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('analytic')) return <TrendingUp className="w-6 h-6 text-[#0284c7]" />;
    if (s.includes('vip') || s.includes('onboard')) return <Crown className="w-6 h-6 text-amber-500" />;
    return <Zap className="w-6 h-6 text-[#0284c7]" />;
  };

  const getAddonLimitText = (addon: any) => {
    const s = (addon.slug || '').toLowerCase();
    if (s.includes('courier')) return `${addon.defaultLimit} orders/mo`;
    if (s.includes('abandoned')) return `${addon.defaultLimit} leads/mo`;
    if (s.includes('sms')) return `${addon.defaultLimit} SMS alerts/mo`;
    if (s.includes('mail') || s.includes('email')) return `${(addon.defaultLimit || 0).toLocaleString()} emails/mo`;
    if (s.includes('fraud')) return `${addon.defaultLimit} fraud checks/mo`;
    if (s.includes('gtm') || s.includes('script')) return 'Unlimited GTM & scripts';
    if (s.includes('analytic')) return 'Full analytics & cohorts';
    if (s.includes('vip') || s.includes('onboard')) return '1-on-1 VIP setup';
    return `${addon.defaultLimit} limit`;
  };

  const getPlanEligibility = (addon: any) => {
    // If no applicablePlans restrictions or includes 'basic', available to all paid plans
    if (
      !addon.applicablePlans ||
      addon.applicablePlans.length === 0 ||
      addon.applicablePlans.includes('basic')
    ) {
      return { isEligible: true, requiredPlanName: null, upgradeTarget: null, message: null };
    }

    const currentPlanName = (currentPackage?.name || '').trim().toLowerCase();
    
    // Check if current plan name matches any of applicablePlans
    const isDirectlyAllowed = addon.applicablePlans.some((p: string) => 
      currentPlanName.includes(p.toLowerCase())
    );

    if (isDirectlyAllowed) {
      return { isEligible: true, requiredPlanName: null, upgradeTarget: null, message: null };
    }

    const isPremiumExclusive = addon.applicablePlans.includes('premium') && !addon.applicablePlans.includes('standard');
    if (isPremiumExclusive) {
      return { 
        isEligible: false, 
        requiredPlanName: 'Premium', 
        upgradeTarget: 'Premium',
        message: 'Premium Only'
      };
    }

    return { 
      isEligible: false, 
      requiredPlanName: 'Standard', 
      upgradeTarget: 'Standard',
      message: 'Standard Required'
    };
  };

  const displayedAddons = addons.filter((addon) => {
    if (activeTab === 'basic') {
      return addon.applicablePlans?.includes('basic');
    }
    if (activeTab === 'standard') {
      return addon.applicablePlans?.includes('standard') && !addon.applicablePlans?.includes('basic');
    }
    if (activeTab === 'premium') {
      return addon.applicablePlans?.includes('premium') && !addon.applicablePlans?.includes('standard');
    }
    if (activeTab === 'active') {
      const p = purchasedAddons.find(pa => pa.id === addon._id);
      return p && p.status === 'active';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0284c7]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-8">
      {/* Hero Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200/80 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" /> Premium Growth Add-ons
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Power Up Your Store</h1>
        <p className="text-slate-500 text-lg">Activate specialized add-ons to boost security, increase sales, and automate your workflow instantly.</p>
      </div>

      {hasActiveSubscription ? (
        <div className="space-y-6">
          {/* Navigation Filter Tabs & Active Plan Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#122846] to-[#0284c7] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Add-ons ({addons.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'basic'
                    ? 'bg-gradient-to-r from-[#122846] to-[#0284c7] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Basic & All Plans ({addons.filter(a => a.applicablePlans?.includes('basic')).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('standard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'standard'
                    ? 'bg-gradient-to-r from-[#122846] to-[#0284c7] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Standard & Premium ({addons.filter(a => a.applicablePlans?.includes('standard') && !a.applicablePlans?.includes('basic')).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('premium')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'premium'
                    ? 'bg-gradient-to-r from-[#122846] to-[#0284c7] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Premium Exclusive ({addons.filter(a => a.applicablePlans?.includes('premium') && !a.applicablePlans?.includes('standard')).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'active'
                    ? 'bg-gradient-to-r from-[#122846] to-[#0284c7] text-white shadow-md shadow-slate-900/15'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Active Add-ons ({purchasedAddons.filter(p => p.status === 'active').length})
              </button>
            </div>

            {currentPackage && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200/80 text-xs text-sky-950 font-medium shadow-2xs">
                <span className="text-slate-500">Your Current Plan:</span>
                <span className="font-extrabold text-[#0284c7] uppercase tracking-wide">{currentPackage.name}</span>
                {isTrialAccount && (
                  <span className="text-[11px] text-emerald-700 font-semibold">(10 Courier + 30 Abandoned Leads included)</span>
                )}
              </div>
            )}
          </div>

          {/* Add-ons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAddons.map((addon) => {
              const purchasedAddon = purchasedAddons.find(p => p.id === addon._id);
              const eligibility = getPlanEligibility(addon);

              // Find latest payment submission for this specific addon
              const latestPayment = myPayments
                ?.filter((p: any) => p.purpose === 'addon' && p.purposeTitle?.trim().toLowerCase() === addon.name?.trim().toLowerCase())
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

              let effectiveStatus = purchasedAddon?.status || 'none';
              if (purchasedAddon && ['terminated', 'rejected', 'inactive', 'active'].includes(purchasedAddon.status)) {
                if (latestPayment && latestPayment.status === 'pending') {
                  effectiveStatus = 'pending';
                } else {
                  effectiveStatus = purchasedAddon.status;
                }
              } else if (latestPayment && latestPayment.status === 'pending') {
                effectiveStatus = 'pending';
              } else {
                effectiveStatus = 'none';
              }

              const isPurchased = effectiveStatus === 'active';
              const isPending = effectiveStatus === 'pending';
              const isInactive = effectiveStatus === 'inactive';
              const isTerminated = effectiveStatus === 'terminated';
              const isRejected = effectiveStatus === 'rejected';
              
              const isLocked = !eligibility.isEligible && !isPurchased && !isPending;
              const limitReached = isPurchased && purchasedAddon && purchasedAddon.used >= purchasedAddon.limit && purchasedAddon.limit > 0;

              return (
                <div 
                  key={addon._id} 
                  className={`relative bg-white border ${
                    isPurchased 
                      ? 'border-[#0284c7] shadow-lg shadow-sky-500/10 ring-1 ring-[#0284c7]/20' 
                      : isInactive 
                      ? 'border-orange-300 bg-orange-50/10' 
                      : isTerminated 
                      ? 'border-red-200 bg-red-50/10' 
                      : isLocked
                      ? 'border-amber-200/80 bg-slate-50/60 hover:border-amber-300'
                      : 'border-slate-200 hover:border-sky-300 hover:shadow-xl'
                  } rounded-2xl p-6 transition-all duration-300 flex flex-col group hover:-translate-y-1 overflow-hidden`}
                >
                  {isPurchased && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                      {limitReached ? 'Limit Reached' : 'Active'}
                    </div>
                  )}
                  {isPending && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                      Pending Approval
                    </div>
                  )}
                  {isInactive && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                      On Hold
                    </div>
                  )}
                  {isTerminated && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                      Terminated
                    </div>
                  )}
                  {isRejected && (
                    <div className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-xs">
                      Rejected
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Lock className="w-3 h-3" />
                      {eligibility.requiredPlanName} Only
                    </div>
                  )}
                  
                  {/* Category Badge & Locked indicator */}
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    {addon.badge && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                        addon.badge.includes('Exclusive')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : addon.badge.includes('Standard')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-sky-50 text-[#0284c7] border border-sky-200'
                      }`}>
                        {addon.badge.includes('Exclusive') ? (
                          <Crown className="w-3 h-3 text-amber-500" />
                        ) : addon.badge.includes('Standard') ? (
                          <Sparkles className="w-3 h-3 text-blue-600" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-[#0284c7]" />
                        )}
                        {addon.badge}
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                        <Lock className="w-2.5 h-2.5 text-amber-600" /> Plan Locked
                      </span>
                    )}
                  </div>
                  
                  {/* Title & Pricing */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPurchased ? 'bg-sky-100 text-[#0284c7]' : 'bg-slate-100 group-hover:bg-sky-50 text-[#0284c7] transition-colors'}`}>
                      {getAddonIcon(addon.slug)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">{addon.name}</h3>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-[#0284c7]">৳ {addon.price}</span>
                        <span className="text-xs text-slate-500 font-medium">/{addon.billingCycle === 'one_time' ? 'lifetime' : addon.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">{addon.description}</p>
                  
                  {/* Limit & Usage Metrics */}
                  <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Includes <strong>{getAddonLimitText(addon)}</strong></span>
                    </div>
                    {isPurchased && purchasedAddon && (
                      <div className="text-xs text-slate-500 border-t border-slate-200 pt-3 mt-2">
                        <div className="flex justify-between mb-1.5">
                          <span>Total Usage:</span>
                          <span className={`font-semibold ${limitReached ? 'text-red-500' : 'text-[#0284c7]'}`}>
                            {purchasedAddon.used} / {purchasedAddon.limit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                          <div 
                            className={`h-1.5 rounded-full ${limitReached ? 'bg-red-500' : 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7]'}`} 
                            style={{ width: `${Math.min((purchasedAddon.used / (purchasedAddon.limit || 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        {(purchasedAddon.freeLimit ?? 0) > 0 && (
                          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-lg p-2 mb-2 text-[11px] space-y-1">
                            <div className="flex justify-between text-emerald-800 font-medium">
                              <span>Plan Free Credits:</span>
                              <span className="font-bold">
                                {Math.max(0, (purchasedAddon.freeLimit || 0) - (purchasedAddon.freeUsed || 0))} left of {purchasedAddon.freeLimit}/mo
                              </span>
                            </div>
                            {(purchasedAddon.paidLimit ?? 0) > 0 && (
                              <div className="flex justify-between text-slate-600">
                                <span>Paid Add-on Credits:</span>
                                <span className="font-bold">
                                  {Math.max(0, (purchasedAddon.paidLimit || 0) - (purchasedAddon.paidUsed || 0))} left
                                </span>
                              </div>
                            )}
                            {purchasedAddon.nextResetDate && (
                              <div className="flex justify-between text-slate-500 text-[10px]">
                                <span>Next Monthly Refresh:</span>
                                <span>{new Date(purchasedAddon.nextResetDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {subscriptionEndDate && (
                          <div className="flex justify-between mt-2 pt-2 border-t border-slate-200">
                            <span>Subscription Ends:</span>
                            <span className="font-semibold text-slate-700">{new Date(subscriptionEndDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {isPending && (
                      <div className="text-xs text-yellow-700 font-medium border-t border-yellow-200 pt-2 mt-2 leading-relaxed flex items-center justify-between">
                        <span>Verification Pending</span>
                        <Link
                          href="/dashboard/subscription/payment-history"
                          className="text-[#0284c7] underline font-bold hover:text-sky-900"
                        >
                          View Payment History
                        </Link>
                      </div>
                    )}
                    {isInactive && (
                      <div className="text-xs text-orange-600 font-medium border-t border-orange-200 pt-2 mt-2 leading-relaxed">
                        Status: Temporarily On Hold. Contact support or click below to re-activate.
                      </div>
                    )}
                    {isTerminated && (
                      <div className="text-xs text-red-600 font-medium border-t border-red-200 pt-2 mt-2 leading-relaxed">
                        Status: Add-on Terminated. Contact support for assistance.
                      </div>
                    )}
                    {isLocked && (
                      <div className="text-xs text-amber-800 font-medium border-t border-amber-200/80 pt-2 mt-2 leading-relaxed">
                        This add-on is available for <strong>{eligibility.requiredPlanName}</strong> plan subscribers.
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {limitReached ? (
                    <button 
                      onClick={() => handleOpenPaymentModal(addon)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:to-[#0284c7] text-white font-semibold text-sm transition-all shadow-md shadow-sky-950/20 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      Limit Reached - Pay & Request Again
                    </button>
                  ) : isPurchased ? (
                    <button disabled className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 font-medium text-sm flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Activated
                    </button>
                  ) : isPending ? (
                    <button 
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-yellow-50 text-yellow-700 font-bold text-sm flex items-center justify-center gap-2 border border-yellow-300 cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 text-yellow-600" /> Pending Approval
                    </button>
                  ) : (isInactive || isTerminated || isRejected) ? (
                    <button 
                      onClick={() => handleOpenPaymentModal(addon)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:to-[#0284c7] text-white font-semibold text-sm transition-all shadow-md shadow-sky-950/20 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      Re-request Add-on
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : isLocked ? (
                    <Link 
                      href="/dashboard/subscription"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:via-[#0284c7] hover:to-[#0ea5e9] text-white font-bold text-sm transition-all shadow-md shadow-slate-900/15 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    >
                      <Lock className="w-4 h-4 text-sky-300 group-hover/btn:scale-110 transition-transform" />
                      Upgrade to {eligibility.upgradeTarget} to Unlock
                    </Link>
                  ) : isTrialAccount ? (
                    <Link 
                      href="/dashboard/subscription"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:via-[#0284c7] hover:to-[#0ea5e9] text-white font-bold text-sm transition-all shadow-md shadow-slate-900/15 hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                    >
                      <Lock className="w-4 h-4 text-sky-300 group-hover/btn:scale-110 transition-transform" />
                      Upgrade Plan to Unlock
                    </Link>
                  ) : (
                    <button 
                      onClick={() => handleOpenPaymentModal(addon)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:via-[#0284c7] hover:to-[#0ea5e9] text-white font-semibold text-sm transition-all shadow-md shadow-slate-900/15 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      Activate Add-on
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-[#0284c7]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upgrade to Unlock Add-ons</h2>
          <p className="text-slate-500 mb-6">Free trial accounts do not support premium add-ons. Please upgrade to a paid subscription to access these features.</p>
          <Link 
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white rounded-xl font-semibold transition-all shadow-md shadow-sky-500/20 hover:shadow-lg"
          >
            View Subscription Plans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Payment & Verification Modal */}
      {paymentModal.isOpen && paymentModal.addon && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleClosePaymentModal}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="px-3 py-1 rounded-full bg-sky-100 text-[#0284c7] text-xs font-bold uppercase tracking-wider">
                Product Checkout & Payment
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                {paymentModal.existingPayment ? 'Edit Payment Proof' : 'Request & Pay for Add-on'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Pay using Mobile Banking (bKash/Nagad) or Bank Transfer, then enter your TrxID.
              </p>
            </div>

            {/* Product Purchase Summary Box */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 text-[#0284c7]">
                {getAddonIcon(paymentModal.addon.slug)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{paymentModal.addon.name}</h3>
                  <span className="text-lg font-extrabold text-[#0284c7]">৳ {paymentModal.addon.price}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{paymentModal.addon.description}</p>
                <div className="mt-2 text-xs font-medium text-sky-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Includes {getAddonLimitText(paymentModal.addon)}</span>
                </div>
              </div>
            </div>

            {/* Platform Official Payment Numbers */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#0284c7]" /> Platform Payment Accounts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platformAccounts.map((acc) => (
                  <div key={acc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <MFSLogo provider={acc.provider} className="h-6 w-auto object-contain" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{acc.type}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-2xs">
                      <span className="font-extrabold text-slate-900 text-base tracking-wider font-sans">{acc.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.accountNumber, acc.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-[#0284c7] hover:bg-sky-50 transition-colors"
                        title="Copy Number"
                      >
                        {copiedId === acc.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {acc.instructions && (
                      <p className="text-[10px] text-slate-500 italic truncate">{acc.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Submission / Edit Form */}
            <form onSubmit={handleSubmitModalPayment} className="space-y-4 border-t border-slate-100 pt-4">
              {paymentModal.existingPayment && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs font-medium flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Editing your existing pending proof (TrxID: {paymentModal.existingPayment.transactionId}).</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Method Used</label>
                  <select
                    value={paymentForm.provider}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, provider: e.target.value });
                      if (formErrors.senderNumber) {
                        setFormErrors((prev) => ({ ...prev, senderNumber: undefined }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Upay">Upay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Amount Paid (৳ BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, amount: e.target.value });
                      if (formErrors.amount) {
                        setFormErrors((prev) => ({ ...prev, amount: undefined }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      formErrors.amount
                        ? 'bg-red-50/50 border border-red-400 focus:ring-red-400 text-red-900'
                        : 'bg-slate-50 border border-slate-200 focus:ring-[#0284c7]'
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.amount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sender Number / Account <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01712345678"
                    value={paymentForm.senderNumber}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, senderNumber: e.target.value });
                      if (formErrors.senderNumber) {
                        setFormErrors((prev) => ({ ...prev, senderNumber: undefined }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      formErrors.senderNumber
                        ? 'bg-red-50/50 border border-red-400 focus:ring-red-400 text-red-900'
                        : 'bg-slate-50 border border-slate-200 focus:ring-[#0284c7]'
                    }`}
                  />
                  {formErrors.senderNumber ? (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.senderNumber}</p>
                  ) : (
                    ['bKash', 'Nagad', 'Rocket', 'Upay'].includes(paymentForm.provider) && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Must be a valid 11-digit BD number (013–019).
                      </p>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    TrxID / Last 6 Digits <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TRX9B87A or 567890"
                    value={paymentForm.transactionId}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, transactionId: e.target.value });
                      if (formErrors.transactionId) {
                        setFormErrors((prev) => ({ ...prev, transactionId: undefined }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      formErrors.transactionId
                        ? 'bg-red-50/50 border border-red-400 focus:ring-red-400 text-red-900'
                        : 'bg-slate-50 border border-slate-200 focus:ring-[#0284c7]'
                    }`}
                  />
                  {formErrors.transactionId ? (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.transactionId}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enter full TrxID or last 6 digits of sender number.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Payment for Courier Automation Add-on"
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#122846] via-[#0369a1] to-[#0284c7] hover:from-[#0d1e35] hover:to-[#0284c7] text-white font-bold text-sm shadow-md shadow-slate-900/15 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {paymentModal.existingPayment ? 'Update Payment Proof' : 'Submit Payment Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
