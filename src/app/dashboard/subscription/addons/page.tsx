'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ShieldCheck, Zap, Mail, BarChart, CheckCircle2, ChevronRight, Loader2, Sparkles } from 'lucide-react';

export default function AddonsPage() {
  const [addons, setAddons] = useState<any[]>([]);
  const [purchasedAddons, setPurchasedAddons] = useState<{id: string, status: string, used: number, limit: number}[]>([]);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addonsRes, subRes] = await Promise.all([
          api.get('/addons'),
          api.get('/subscriptions/my-subscription')
        ]);
        
        if (addonsRes.data?.data) {
          setAddons(addonsRes.data.data.filter((a: any) => a.isActive));
        }

        if (subRes.data?.data) {
          setHasActiveSubscription(subRes.data.data.status === 'active' && !subRes.data.data.isTrial);
          setSubscriptionEndDate(subRes.data.data.endDate || null);
          if (subRes.data.data.purchasedAddons) {
            const pIds = subRes.data.data.purchasedAddons.map((pa: any) => ({
              id: typeof pa.addonId === 'string' ? pa.addonId : pa.addonId?._id,
              status: pa.status || 'active',
              used: pa.used || 0,
              limit: pa.limit || 0
            }));
            setPurchasedAddons(pIds);
          }
        }
      } catch (error) {
        toast.error('Failed to load add-ons');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (addonId: string, addonName: string) => {
    try {
      setProcessingId(addonId);
      const res = await api.post('/subscriptions/addons/purchase', { addonId });
      if (res.data?.success || res.data?.status === 'ok') {
        toast.success(`${addonName} requested successfully!`);
        setPurchasedAddons(prev => {
          const filtered = prev.filter(p => p.id !== addonId);
          // Default values for optimistic update
          return [...filtered, { id: addonId, status: 'pending', used: 0, limit: 0 }];
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate add-on');
    } finally {
      setProcessingId(null);
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center max-w-2xl mx-auto">
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
            const isPurchased = !!purchasedAddon && purchasedAddon.status === 'active';
            const isPending = !!purchasedAddon && purchasedAddon.status === 'pending';
            const isRejected = !!purchasedAddon && purchasedAddon.status === 'rejected';
            
            const limitReached = isPurchased && purchasedAddon.used >= purchasedAddon.limit && purchasedAddon.limit > 0;

            return (
              <div 
                key={addon._id} 
                className={`relative bg-white border ${isPurchased ? 'border-[#5022C3] shadow-md ring-1 ring-[#5022C3]/10' : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'} rounded-2xl p-6 transition-all duration-300 flex flex-col group hover:-translate-y-1 overflow-hidden`}
              >
                {isPurchased && (
                  <div className="absolute top-0 right-0 bg-[#5022C3] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    {limitReached ? 'Limit Reached' : 'Active'}
                  </div>
                )}
                {isPending && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Pending
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
                  {isPurchased && (
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
                </div>
                
                {limitReached ? (
                  <button 
                    onClick={() => handlePurchase(addon._id, addon.name)}
                    disabled={processingId === addon._id}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processingId === addon._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Limit Reached - Activate Again'}
                  </button>
                ) : isPurchased ? (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl bg-gray-50 text-gray-500 font-medium text-sm flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
                    <CheckCircle2 className="w-4 h-4" /> Activated
                  </button>
                ) : isPending ? (
                  <button disabled className="w-full py-2.5 px-4 rounded-xl bg-yellow-50 text-yellow-600 font-medium text-sm flex items-center justify-center gap-2 border border-yellow-200 cursor-not-allowed">
                    <Loader2 className="w-4 h-4 animate-spin" /> Pending Approval
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchase(addon._id, addon.name)}
                    disabled={processingId === addon._id}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processingId === addon._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Add-on'}
                    {!processingId && <ChevronRight className="w-4 h-4" />}
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
    </div>
  );
}
