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
  Building2
} from 'lucide-react';

import { useSocket } from '@/context/SocketContext';
import { billingCacheStore } from '@/utils/billingCache';
import { MFSLogo } from '@/components/MFSLogo';

export default function AddonsPage() {
  const router = useRouter();
  const hasCache = billingCacheStore.addons !== null;

  const [addons, setAddons] = useState<any[]>(billingCacheStore.addons || []);
  const [purchasedAddons, setPurchasedAddons] = useState<{id: string, status: string, used: number, limit: number}[]>(billingCacheStore.purchasedAddons || []);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(billingCacheStore.subscriptionEndDate);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(billingCacheStore.hasActiveSubscription || false);
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
        const isActiveSub = subRes.data.data.status === 'active' && !subRes.data.data.isTrial;
        const subEndDate = subRes.data.data.endDate || null;
        setHasActiveSubscription(isActiveSub);
        setSubscriptionEndDate(subEndDate);
        billingCacheStore.hasActiveSubscription = isActiveSub;
        billingCacheStore.subscriptionEndDate = subEndDate;

        if (subRes.data.data.purchasedAddons) {
          const pIds = subRes.data.data.purchasedAddons.map((pa: any) => ({
            id: typeof pa.addonId === 'string' ? pa.addonId : pa.addonId?._id,
            status: pa.status || 'active',
            used: pa.used || 0,
            limit: pa.limit || 0
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
    if (slug.includes('fraud')) return <ShieldCheck className="w-6 h-6 text-[#5022C3]" />;
    if (slug.includes('sms') || slug.includes('mail')) return <Mail className="w-6 h-6 text-[#5022C3]" />;
    if (slug.includes('analytic')) return <BarChart className="w-6 h-6 text-[#5022C3]" />;
    return <Zap className="w-6 h-6 text-[#5022C3]" />;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5022C3]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-8">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#5022C3] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Premium Features
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Power Up Your Store</h1>
        <p className="text-gray-500 text-lg">Activate specialized add-ons to boost security, increase sales, and automate your workflow instantly.</p>
      </div>

      {hasActiveSubscription ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon) => {
            const purchasedAddon = purchasedAddons.find(p => p.id === addon._id);

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
            
            const limitReached = isPurchased && purchasedAddon && purchasedAddon.used >= purchasedAddon.limit && purchasedAddon.limit > 0;

            return (
              <div 
                key={addon._id} 
                className={`relative bg-white border ${isPurchased ? 'border-[#5022C3] shadow-md ring-1 ring-[#5022C3]/10' : isInactive ? 'border-orange-300 bg-orange-50/10' : isTerminated ? 'border-red-200 bg-red-50/10' : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'} rounded-2xl p-6 transition-all duration-300 flex flex-col group hover:-translate-y-1 overflow-hidden`}
              >
                {isPurchased && (
                  <div className="absolute top-0 right-0 bg-[#5022C3] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    {limitReached ? 'Limit Reached' : 'Active'}
                  </div>
                )}
                {isPending && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Pending Approval
                  </div>
                )}
                {isInactive && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    On Hold
                  </div>
                )}
                {isTerminated && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Terminated
                  </div>
                )}
                {isRejected && (
                  <div className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Rejected
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isPurchased ? 'bg-purple-100' : 'bg-gray-50 group-hover:bg-purple-50 transition-colors'}`}>
                    {getAddonIcon(addon.slug)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{addon.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-gray-900">৳ {addon.price}</span>
                      <span className="text-xs text-gray-500 font-medium">/{addon.billingCycle === 'one_time' ? 'lifetime' : addon.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 flex-grow">{addon.description}</p>
                
                <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Includes <strong>{addon.defaultLimit}</strong> limit</span>
                  </div>
                  {isPurchased && purchasedAddon && (
                    <div className="text-xs text-gray-500 border-t border-gray-200 pt-3 mt-2">
                      <div className="flex justify-between mb-1.5">
                        <span>Usage Limit:</span>
                        <span className={`font-semibold ${limitReached ? 'text-red-500' : 'text-[#5022C3]'}`}>
                          {purchasedAddon.used} / {purchasedAddon.limit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                        <div 
                          className={`h-1.5 rounded-full ${limitReached ? 'bg-red-500' : 'bg-[#5022C3]'}`} 
                          style={{ width: `${Math.min((purchasedAddon.used / purchasedAddon.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {subscriptionEndDate && (
                        <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                          <span>Expires On:</span>
                          <span className="font-semibold text-gray-700">{new Date(subscriptionEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {isPending && (
                    <div className="text-xs text-yellow-700 font-medium border-t border-yellow-200 pt-2 mt-2 leading-relaxed flex items-center justify-between">
                      <span>Verification Pending</span>
                      <Link
                        href="/dashboard/subscription/payment-history"
                        className="text-[#5022C3] underline font-bold hover:text-purple-900"
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
                </div>
                
                {limitReached ? (
                  <button 
                    onClick={() => handleOpenPaymentModal(addon)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Limit Reached - Pay & Request Again
                  </button>
                ) : isPurchased ? (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl bg-gray-50 text-gray-500 font-medium text-sm flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
                    <CheckCircle2 className="w-4 h-4" /> Activated
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
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Re-request Add-on
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleOpenPaymentModal(addon)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Activate Add-on
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-[#5022C3]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Unlock Add-ons</h2>
          <p className="text-gray-500 mb-6">Free trial accounts do not support premium add-ons. Please upgrade to a paid subscription to access these features.</p>
          <Link 
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5022C3] hover:bg-[#401a9b] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
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
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#5022C3] text-xs font-bold uppercase tracking-wider">
                Product Checkout & Payment
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
                {paymentModal.existingPayment ? 'Edit Payment Proof' : 'Request & Pay for Add-on'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Pay using Mobile Banking (bKash/Nagad) or Bank Transfer, then enter your TrxID.
              </p>
            </div>

            {/* Product Purchase Summary Box */}
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 text-[#5022C3]">
                {getAddonIcon(paymentModal.addon.slug)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base">{paymentModal.addon.name}</h3>
                  <span className="text-lg font-extrabold text-[#5022C3]">৳ {paymentModal.addon.price}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{paymentModal.addon.description}</p>
                <div className="mt-2 text-xs font-medium text-purple-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Includes {paymentModal.addon.defaultLimit} usage limit</span>
                </div>
              </div>
            </div>

            {/* Platform Official Payment Numbers */}
            <div>
              <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#5022C3]" /> Platform Payment Accounts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {platformAccounts.map((acc) => (
                  <div key={acc.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <MFSLogo provider={acc.provider} className="h-6 w-auto object-contain" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{acc.type}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-300 shadow-xs">
                      <span className="font-extrabold text-slate-900 text-base tracking-wider font-sans">{acc.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.accountNumber, acc.id)}
                        className="p-1 rounded-lg text-gray-500 hover:text-[#5022C3] hover:bg-purple-50 transition-colors"
                        title="Copy Number"
                      >
                        {copiedId === acc.id ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {acc.instructions && (
                      <p className="text-[10px] text-gray-500 italic truncate">{acc.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Submission / Edit Form */}
            <form onSubmit={handleSubmitModalPayment} className="space-y-4 border-t border-gray-100 pt-4">
              {paymentModal.existingPayment && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs font-medium flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Editing your existing pending proof (TrxID: {paymentModal.existingPayment.transactionId}).</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Payment Method Used</label>
                  <select
                    value={paymentForm.provider}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, provider: e.target.value });
                      if (formErrors.senderNumber) {
                        setFormErrors((prev) => ({ ...prev, senderNumber: undefined }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
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
                        : 'bg-gray-50 border border-gray-200 focus:ring-[#5022C3]'
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.amount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
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
                        : 'bg-gray-50 border border-gray-200 focus:ring-[#5022C3]'
                    }`}
                  />
                  {formErrors.senderNumber ? (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.senderNumber}</p>
                  ) : (
                    ['bKash', 'Nagad', 'Rocket', 'Upay'].includes(paymentForm.provider) && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        Must be a valid 11-digit BD number (013–019).
                      </p>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
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
                        : 'bg-gray-50 border border-gray-200 focus:ring-[#5022C3]'
                    }`}
                  />
                  {formErrors.transactionId ? (
                    <p className="text-xs text-red-500 font-medium mt-1">{formErrors.transactionId}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Enter full TrxID or last 6 digits of sender number.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Payment for Fraud Check Add-on"
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-7 py-2.5 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
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
