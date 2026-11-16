'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, AlertCircle, Save, Trash2, RefreshCw, Eye, EyeOff, ShieldCheck, HelpCircle, Lock, ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { api } from '@/utils/api';

interface ProviderConfig {
  enabled: boolean;
  measurementId?: string;
  pixelId?: string;
  containerId?: string;
}

interface TrackingState {
  googleAnalytics: ProviderConfig;
  metaPixel: ProviderConfig;
  googleTagManager: ProviderConfig;
}

export default function TrackingSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [trackingData, setTrackingData] = useState<TrackingState>({
    googleAnalytics: { enabled: false, measurementId: '' },
    metaPixel: { enabled: false, pixelId: '' },
    googleTagManager: { enabled: false, containerId: '' },
  });

  const [statuses, setStatuses] = useState({
    googleAnalytics: 'Not Configured',
    metaPixel: 'Not Configured',
    googleTagManager: 'Not Configured',
  });

  const [currentPlanName, setCurrentPlanName] = useState<string>('');
  const [isTrialPlan, setIsTrialPlan] = useState<boolean>(false);
  const [ineligibleModal, setIneligibleModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    requiredPlan: string;
    reasons: string[];
  }>({
    isOpen: false,
    title: '',
    message: '',
    requiredPlan: '',
    reasons: [],
  });

  // Fetch current merchant tracking config and plan eligibility
  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const [res, subRes] = await Promise.all([
        api.get('/tracking/merchant'),
        api.get('/subscriptions/my-subscription').catch(() => null),
      ]);

      if (subRes?.data?.data) {
        const sub = subRes.data.data;
        setCurrentPlanName(sub.packageId?.name || '');
        setIsTrialPlan(Boolean(sub.isTrial));
      }

      if (res.data?.data) {
        const data = res.data.data;
        setTrackingData({
          googleAnalytics: {
            enabled: Boolean(data.googleAnalytics?.enabled),
            measurementId: data.googleAnalytics?.measurementId || '',
          },
          metaPixel: {
            enabled: Boolean(data.metaPixel?.enabled),
            pixelId: data.metaPixel?.pixelId || '',
          },
          googleTagManager: {
            enabled: Boolean(data.googleTagManager?.enabled),
            containerId: data.googleTagManager?.containerId || '',
          },
        });
        updateStatuses(data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load tracking configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatuses = (data: any) => {
    setStatuses({
      googleAnalytics: data.googleAnalytics?.enabled && data.googleAnalytics?.measurementId ? 'Connected' : data.googleAnalytics?.measurementId ? 'Disabled' : 'Not Configured',
      metaPixel: data.metaPixel?.enabled && data.metaPixel?.pixelId ? 'Connected' : data.metaPixel?.pixelId ? 'Disabled' : 'Not Configured',
      googleTagManager: data.googleTagManager?.enabled && data.googleTagManager?.containerId ? 'Connected' : data.googleTagManager?.containerId ? 'Disabled' : 'Not Configured',
    });
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (trackingData.googleAnalytics.enabled && trackingData.googleAnalytics.measurementId) {
      const val = trackingData.googleAnalytics.measurementId.trim();
      if (!/^(G|UA)-[A-Z0-9]+$/i.test(val) && val.length < 5) {
        errs.googleAnalytics = 'Invalid GA4 Measurement ID (e.g. G-XXXXXXXXXX)';
      }
    }

    if (trackingData.metaPixel.enabled && trackingData.metaPixel.pixelId) {
      const val = trackingData.metaPixel.pixelId.trim();
      if (!/^\d{5,20}$/.test(val)) {
        errs.metaPixel = 'Invalid Meta Pixel ID (must be numeric, e.g. 1234567890)';
      }
    }

    if (trackingData.googleTagManager.enabled && trackingData.googleTagManager.containerId) {
      const val = trackingData.googleTagManager.containerId.trim();
      if (!/^GTM-[A-Z0-9]+$/i.test(val) && val.length < 5) {
        errs.googleTagManager = 'Invalid GTM Container ID (e.g. GTM-XXXXXXX)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    // 1. FRONTEND ELIGIBILITY CHECK:
    // If merchant is not eligible, display detailed error modal and NEVER call backend save API
    const planNameLower = (currentPlanName || '').toLowerCase().trim();
    const canUseGA4AndPixel = !isTrialPlan && (planNameLower.includes('standard') || planNameLower.includes('premium'));
    const canUseGTM = !isTrialPlan && planNameLower.includes('premium');

    // Case A: Free Trial or Basic (or no active plan)
    if (!canUseGA4AndPixel) {
      setIneligibleModal({
        isOpen: true,
        title: isTrialPlan ? 'Feature Locked on Free Trial' : 'Plan Upgrade Required',
        message: isTrialPlan
          ? 'Native marketing & analytics tracking integrations (GA4, Meta Pixel, and GTM) are premium capabilities and are not included in the Free Trial.'
          : `Your current plan (${currentPlanName || 'Basic'}) does not support native marketing and analytics tracking integrations.`,
        requiredPlan: 'Standard or Premium',
        reasons: [
          'Basic plan and Free Trial include core storefront catalog features only.',
          'Google Analytics 4 (GA4) automated tracking requires Standard or Premium.',
          'Meta (Facebook) Pixel & Conversions API require Standard or Premium.',
          'Google Tag Manager (GTM) multi-channel script injection requires Premium.',
        ],
      });
      return; // Stop immediately, do not call backend API
    }

    // Case B: Standard Plan attempting to save GTM
    if (!canUseGTM && (trackingData.googleTagManager.enabled || Boolean(trackingData.googleTagManager.containerId?.trim()))) {
      setIneligibleModal({
        isOpen: true,
        title: 'Premium Plan Exclusive Feature',
        message: 'Google Tag Manager (GTM) multi-channel tracking is an enterprise-grade capability exclusive to the Premium plan.',
        requiredPlan: 'Premium',
        reasons: [
          'Your current Standard plan includes Google Analytics 4 and Meta Pixel integrations.',
          'Google Tag Manager (GTM) custom script container is exclusive to the Premium plan.',
          'Upgrade to Premium to activate custom GTM scripts and advanced tracking triggers.',
        ],
      });
      return; // Stop immediately, do not call backend API
    }

    // 2. Validate input format if eligible
    if (!validate()) {
      toast.error('Please fix configuration errors before saving');
      return;
    }

    // 3. Eligible - Call backend API
    try {
      setIsSaving(true);
      const res = await api.put('/tracking/merchant', trackingData);
      if (res.data?.success) {
        toast.success('Tracking settings saved successfully!');
        updateStatuses(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save tracking settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    const planNameLower = (currentPlanName || '').toLowerCase().trim();
    const canUseGA4AndPixel = !isTrialPlan && (planNameLower.includes('standard') || planNameLower.includes('premium'));

    if (!canUseGA4AndPixel) {
      setIneligibleModal({
        isOpen: true,
        title: 'Tracking Verification Requires Upgrade',
        message: `Tracking verification is only available on Standard and Premium plans. Your current plan (${isTrialPlan ? 'Free Trial' : currentPlanName || 'Basic'}) does not support native tracking.`,
        requiredPlan: 'Standard or Premium',
        reasons: [
          'Script verification requires active tracking integrations on your storefront.',
          'Upgrade to Standard or Premium to activate and verify your tracking IDs.',
        ],
      });
      return;
    }

    try {
      setIsTesting(true);
      const res = await api.post('/tracking/merchant/test');
      if (res.data?.data) {
        setStatuses(res.data.data);
        toast.success('Verified tracking status successfully!');
      }
    } catch (err: any) {
      toast.error('Failed to verify tracking status');
    } finally {
      setIsTesting(false);
    }
  };

  const getBadge = (status: string) => {
    if (status === 'Connected') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Connected
        </span>
      );
    }
    if (status === 'Disabled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Disabled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
        <XCircle className="w-3.5 h-3.5 text-gray-400" />
        Not Configured
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin"></div>
      </div>
    );
  }

  const planNameLower = currentPlanName.toLowerCase();
  const canUseGA4AndPixel = !isTrialPlan && (planNameLower.includes('standard') || planNameLower.includes('premium'));
  const canUseGTM = !isTrialPlan && planNameLower.includes('premium');

  return (
    <div className="p-3 sm:p-6 md:p-8 w-full max-w-[1800px] mx-auto space-y-4 sm:space-y-6 pb-16">
      {/* Plan Entitlement Notice if on Free Trial or Basic */}
      {!canUseGA4AndPixel && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Native GA4, Meta Pixel, and GTM tracking integrations are available on <strong>Standard</strong> and <strong>Premium</strong> plans.
            </span>
          </div>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800 underline underline-offset-2 shrink-0"
          >
            Upgrade Plan <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5022C3] flex-shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">Marketing & Analytics Integrations</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Tracking IDs configured below will automatically apply to all 5 storefront themes across your domain and subdomains.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTesting ? 'animate-spin' : ''}`} />
            Test / Verify
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 sm:px-5 py-2 bg-[#5022C3] hover:bg-[#401ab0] text-white font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 sm:gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* 1. Google Analytics 4 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6 space-y-4 transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-600 text-lg">
                G4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">Google Analytics 4 (GA4)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Standard & Premium
                  </span>
                </div>
                <p className="text-xs text-gray-500">Track pageviews, ecommerce activity, and store traffic</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getBadge(statuses.googleAnalytics)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.googleAnalytics.enabled}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      googleAnalytics: { ...trackingData.googleAnalytics, enabled: e.target.checked },
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              GA4 Measurement ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. G-XXXXXXXXXX"
                value={trackingData.googleAnalytics.measurementId}
                onChange={(e) =>
                  setTrackingData({
                    ...trackingData,
                    googleAnalytics: { ...trackingData.googleAnalytics, measurementId: e.target.value },
                  })
                }
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.googleAnalytics
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-200 focus:ring-purple-200 bg-gray-50/50'
                }`}
              />
              {trackingData.googleAnalytics.measurementId && (
                <button
                  onClick={() =>
                    setTrackingData({
                      ...trackingData,
                      googleAnalytics: { ...trackingData.googleAnalytics, measurementId: '' },
                    })
                  }
                  className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Remove Measurement ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.googleAnalytics && <p className="text-xs text-red-600 mt-1 font-medium">{errors.googleAnalytics}</p>}
          </div>
        </div>

        {/* 2. Meta Pixel */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4 transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                ∞
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">Meta (Facebook) Pixel</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Standard & Premium
                  </span>
                </div>
                <p className="text-xs text-gray-500">Track Meta ad conversions, standard events, and visitor behavior</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getBadge(statuses.metaPixel)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.metaPixel.enabled}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, enabled: e.target.checked },
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Meta Pixel ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 123456789012345"
                value={trackingData.metaPixel.pixelId}
                onChange={(e) =>
                  setTrackingData({
                    ...trackingData,
                    metaPixel: { ...trackingData.metaPixel, pixelId: e.target.value },
                  })
                }
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.metaPixel
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-200 focus:ring-purple-200 bg-gray-50/50'
                }`}
              />
              {trackingData.metaPixel.pixelId && (
                <button
                  onClick={() =>
                    setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, pixelId: '' },
                    })
                  }
                  className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Remove Pixel ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.metaPixel && <p className="text-xs text-red-600 mt-1 font-medium">{errors.metaPixel}</p>}
          </div>
        </div>

        {/* 3. Google Tag Manager */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4 transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                TM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">Google Tag Manager (GTM)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Premium Exclusive
                  </span>
                </div>
                <p className="text-xs text-gray-500">Inject custom marketing tags and custom dataLayer triggers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {getBadge(statuses.googleTagManager)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.googleTagManager.enabled}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      googleTagManager: { ...trackingData.googleTagManager, enabled: e.target.checked },
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              GTM Container ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. GTM-XXXXXXX"
                value={trackingData.googleTagManager.containerId}
                onChange={(e) =>
                  setTrackingData({
                    ...trackingData,
                    googleTagManager: { ...trackingData.googleTagManager, containerId: e.target.value },
                  })
                }
                className={`flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.googleTagManager
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-gray-200 focus:ring-purple-200 bg-gray-50/50'
                }`}
              />
              {trackingData.googleTagManager.containerId && (
                <button
                  onClick={() =>
                    setTrackingData({
                      ...trackingData,
                      googleTagManager: { ...trackingData.googleTagManager, containerId: '' },
                    })
                  }
                  className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Remove Container ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.googleTagManager && <p className="text-xs text-red-600 mt-1 font-medium">{errors.googleTagManager}</p>}
          </div>
        </div>
      </div>

      {/* Security & Isolation Note */}
      <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#5022C3] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-purple-900 leading-relaxed">
          <p className="font-semibold text-sm mb-1 text-[#5022C3]">Tenant Isolation & Zero Leakage Guarantee</p>
          Your tracking credentials are strictly bound to your tenant account and custom domain. They will never leak to other stores or to the central SaaS platform. Scripts are automatically initialized dynamically across all 5 themes without requiring manual theme code editing.
        </div>
      </div>

      {/* Ineligible Plan Details Error Modal */}
      {ineligibleModal.isOpen && (
        <div 
          onClick={() => setIneligibleModal((prev) => ({ ...prev, isOpen: false }))}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 text-center"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setIneligibleModal((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>

            {/* Current Plan Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Current Plan: {isTrialPlan ? 'Free Trial' : currentPlanName || 'Basic'}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
              {ineligibleModal.title}
            </h3>

            {/* Main Message */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
              {ineligibleModal.message}
            </p>

            {/* Plan Requirements / Detailed Error Breakdown Box */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left mb-6 space-y-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Why this action is blocked:
              </div>
              <ul className="space-y-2">
                {ineligibleModal.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2.5 mt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Unlocked on:</span>
                <span className="font-bold text-[#5022C3] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {ineligibleModal.requiredPlan}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIneligibleModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-5 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <Link
                href="/dashboard/subscription"
                className="flex-1 py-3 px-5 text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c] rounded-xl transition-colors shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                Upgrade Plan
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
