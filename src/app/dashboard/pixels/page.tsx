'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Trash2,
  RefreshCw,
  ShieldCheck,
  HelpCircle,
  Lock,
  ArrowUpRight,
  X,
  ExternalLink,
  BookOpen,
  Zap,
} from 'lucide-react';
import { SiGoogleanalytics, SiMeta, SiGoogletagmanager } from 'react-icons/si';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { api } from '@/utils/api';

interface ProviderConfig {
  enabled: boolean;
  measurementId?: string;
  pixelId?: string;
  containerId?: string;
}

interface MetaPixelConfig extends ProviderConfig {
  capiEnabled?: boolean;
  capiAccessToken?: string;
  hasCapiToken?: boolean;
  capiTokenMasked?: string;
  clearCapiToken?: boolean;
  mode?: 'live' | 'test';
  graphApiVersion?: string;
  testEventCode?: string;
  events?: {
    PageView?: boolean;
    ViewContent?: boolean;
    AddToCart?: boolean;
    InitiateCheckout?: boolean;
    Purchase?: boolean;
    Contact?: boolean;
    [key: string]: boolean | undefined;
  };
  diagnostics?: {
    lastTestAt?: string | null;
    lastTestStatus?: 'idle' | 'success' | 'failed';
    lastTestMessage?: string;
    lastEventAt?: string | null;
    lastEventName?: string;
    lastEventStatus?: 'idle' | 'sent' | 'failed';
    lastErrorMessage?: string;
    lastErrorAt?: string | null;
  };
}

interface TrackingState {
  googleAnalytics: ProviderConfig;
  metaPixel: MetaPixelConfig;
  googleTagManager: ProviderConfig;
}

interface TrackingDeliveryEvent {
  _id?: string;
  eventId: string;
  eventName: string;
  status: 'sent' | 'retry_scheduled' | 'failed' | 'pending' | 'skipped';
  attempts?: number;
  httpStatus?: number;
  fbTraceId?: string;
  errorMessage?: string;
  sentAt?: string | null;
  createdAt: string;
}

export default function TrackingSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingCapi, setIsTestingCapi] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [trackingData, setTrackingData] = useState<TrackingState>({
    googleAnalytics: { enabled: false, measurementId: '' },
    metaPixel: {
      enabled: false,
      pixelId: '',
      capiEnabled: false,
      capiAccessToken: '',
      hasCapiToken: false,
      capiTokenMasked: '',
      clearCapiToken: false,
      mode: 'live',
      graphApiVersion: 'v21.0',
      testEventCode: '',
      events: {
        PageView: true,
        ViewContent: true,
        AddToCart: true,
        InitiateCheckout: true,
        Purchase: true,
        Contact: true,
      },
      diagnostics: {
        lastTestAt: null,
        lastTestStatus: 'idle',
        lastTestMessage: '',
        lastEventAt: null,
        lastEventName: '',
        lastEventStatus: 'idle',
        lastErrorMessage: '',
        lastErrorAt: null,
      },
    },
    googleTagManager: { enabled: false, containerId: '' },
  });

  const [recentTrackingEvents, setRecentTrackingEvents] = useState<TrackingDeliveryEvent[]>([]);

  const [statuses, setStatuses] = useState({
    googleAnalytics: 'Not Configured',
    metaPixel: 'Not Configured',
    googleTagManager: 'Not Configured',
  });

  const [currentPlanName, setCurrentPlanName] = useState<string>('');
  const [isTrialPlan, setIsTrialPlan] = useState<boolean>(false);
  const [trackingDocModal, setTrackingDocModal] = useState<string | null>(null);

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
        const meta = data.metaPixel || {};
        setTrackingData({
          googleAnalytics: {
            enabled: Boolean(data.googleAnalytics?.enabled),
            measurementId: data.googleAnalytics?.measurementId || '',
          },
          metaPixel: {
            enabled: Boolean(meta.enabled),
            pixelId: meta.pixelId || '',
            capiEnabled: Boolean(meta.capiEnabled),
            capiAccessToken: '',
            hasCapiToken: Boolean(meta.hasCapiToken),
            capiTokenMasked: meta.capiTokenMasked || '',
            clearCapiToken: false,
            mode: meta.mode || (meta.testEventCode ? 'test' : 'live'),
            graphApiVersion: meta.graphApiVersion || 'v21.0',
            testEventCode: meta.testEventCode || '',
            events: {
              PageView: meta.events?.PageView ?? true,
              ViewContent: meta.events?.ViewContent ?? true,
              AddToCart: meta.events?.AddToCart ?? true,
              InitiateCheckout: meta.events?.InitiateCheckout ?? true,
              Purchase: meta.events?.Purchase ?? true,
              Contact: meta.events?.Contact ?? true,
            },
            diagnostics: {
              lastTestAt: meta.diagnostics?.lastTestAt || null,
              lastTestStatus: meta.diagnostics?.lastTestStatus || 'idle',
              lastTestMessage: meta.diagnostics?.lastTestMessage || '',
              lastEventAt: meta.diagnostics?.lastEventAt || null,
              lastEventName: meta.diagnostics?.lastEventName || '',
              lastEventStatus: meta.diagnostics?.lastEventStatus || 'idle',
              lastErrorMessage: meta.diagnostics?.lastErrorMessage || '',
              lastErrorAt: meta.diagnostics?.lastErrorAt || null,
            },
          },
          googleTagManager: {
            enabled: Boolean(data.googleTagManager?.enabled),
            containerId: data.googleTagManager?.containerId || '',
          },
        });

        if (Array.isArray(data.recentEvents)) {
          setRecentTrackingEvents(data.recentEvents);
        }
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
      googleAnalytics:
        data.googleAnalytics?.enabled && data.googleAnalytics?.measurementId
          ? 'Connected'
          : data.googleAnalytics?.measurementId
          ? 'Disabled'
          : 'Not Configured',
      metaPixel:
        (data.metaPixel?.enabled && data.metaPixel?.pixelId) ||
        (data.metaPixel?.capiEnabled && data.metaPixel?.hasCapiToken)
          ? 'Connected'
          : data.metaPixel?.pixelId
          ? 'Disabled'
          : 'Not Configured',
      googleTagManager:
        data.googleTagManager?.enabled && data.googleTagManager?.containerId
          ? 'Connected'
          : data.googleTagManager?.containerId
          ? 'Disabled'
          : 'Not Configured',
    });
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const planNameLower = (currentPlanName || '').toLowerCase().trim();
  const canUseGA4AndPixel = !isTrialPlan && (planNameLower.includes('standard') || planNameLower.includes('premium'));
  const canUseGTM = !isTrialPlan && planNameLower.includes('premium');

  const showPlanIneligibleModal = (featureName: string) => {
    if (isTrialPlan) {
      setIneligibleModal({
        isOpen: true,
        title: 'Feature Locked on Free Trial',
        message: 'Native marketing & analytics tracking integrations (GA4, Meta Pixel, and GTM) are premium capabilities and are not included in the Free Trial.',
        requiredPlan: 'Standard or Premium',
        reasons: [
          'Free Trial only provides basic store catalog setup without automated analytics.',
          'Google Analytics 4 (GA4) requires a Standard or Premium plan.',
          'Meta (Facebook) Pixel & Server-Side Conversions API (CAPI) require a Standard or Premium plan.',
          'Google Tag Manager (GTM) requires a Premium plan.',
        ],
      });
      return;
    }

    if (featureName === 'gtm') {
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
      return;
    }

    setIneligibleModal({
      isOpen: true,
      title: 'Plan Upgrade Required',
      message: `Your current plan (${currentPlanName || 'Basic'}) does not support native marketing and analytics tracking integrations.`,
      requiredPlan: 'Standard or Premium',
      reasons: [
        'Basic plan and Free Trial include core storefront catalog features only.',
        'Google Analytics 4 (GA4) automated tracking requires Standard or Premium.',
        'Meta (Facebook) Pixel & Server-Side Conversions API (CAPI) require Standard or Premium.',
        'Google Tag Manager (GTM) multi-channel script injection requires Premium.',
      ],
    });
  };

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
        errs.metaPixel = 'Meta Pixel ID should be a 5–20 digit numeric value';
      }
    }

    if (trackingData.metaPixel.capiEnabled) {
      if (!trackingData.metaPixel.pixelId?.trim()) {
        errs.metaPixel = 'Meta Pixel ID is required when CAPI is enabled';
      }
      if (
        !trackingData.metaPixel.hasCapiToken &&
        !trackingData.metaPixel.capiAccessToken?.trim() &&
        !trackingData.metaPixel.clearCapiToken
      ) {
        errs.capiAccessToken = 'CAPI Access Token is required to activate Server-Side CAPI';
      }
    }

    if (trackingData.googleTagManager.enabled && trackingData.googleTagManager.containerId) {
      const val = trackingData.googleTagManager.containerId.trim();
      if (!/^GTM-[A-Z0-9]+$/i.test(val)) {
        errs.googleTagManager = 'Invalid GTM Container ID (e.g. GTM-XXXXXXX)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    // FRONTEND GUARD: Check if merchant plan is eligible before making PUT API call
    const wantsGA = Boolean(trackingData.googleAnalytics.enabled && trackingData.googleAnalytics.measurementId?.trim());
    const wantsPixel = Boolean(
      (trackingData.metaPixel.enabled && trackingData.metaPixel.pixelId?.trim()) ||
      trackingData.metaPixel.capiEnabled
    );
    const wantsGTM = Boolean(trackingData.googleTagManager.enabled && trackingData.googleTagManager.containerId?.trim());

    if ((wantsGA || wantsPixel || wantsGTM) && !canUseGA4AndPixel) {
      showPlanIneligibleModal('all');
      return;
    }

    if (wantsGTM && !canUseGTM) {
      showPlanIneligibleModal('gtm');
      return;
    }

    if (!validate()) {
      toast.error('Please fix validation errors before saving.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.put('/tracking/merchant', trackingData);
      toast.success(res.data?.message || 'Tracking configuration saved successfully!');
      if (res.data?.data) {
        const data = res.data.data;
        const meta = data.metaPixel || {};
        setTrackingData((prev) => ({
          ...prev,
          metaPixel: {
            ...prev.metaPixel,
            hasCapiToken: Boolean(meta.hasCapiToken),
            capiTokenMasked: meta.capiTokenMasked || '',
            capiAccessToken: '',
            clearCapiToken: false,
            diagnostics: meta.diagnostics || prev.metaPixel.diagnostics,
          },
        }));
        if (Array.isArray(data.recentEvents)) {
          setRecentTrackingEvents(data.recentEvents);
        }
        updateStatuses(data);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save tracking configuration';
      toast.error(msg);
      if (err.response?.status === 403) {
        showPlanIneligibleModal(wantsGTM && canUseGA4AndPixel ? 'gtm' : 'all');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    const wantsGA = Boolean(trackingData.googleAnalytics.enabled);
    const wantsPixel = Boolean(trackingData.metaPixel.enabled || trackingData.metaPixel.capiEnabled);
    const wantsGTM = Boolean(trackingData.googleTagManager.enabled);

    if ((wantsGA || wantsPixel || wantsGTM) && !canUseGA4AndPixel) {
      showPlanIneligibleModal('all');
      return;
    }

    try {
      setIsTesting(true);
      const res = await api.post('/tracking/merchant/test');
      if (res.data?.data) {
        setStatuses(res.data.data);
      }
      toast.success('Configuration connection verified successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to verify tracking status');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestMerchantCapi = async () => {
    if (!canUseGA4AndPixel) {
      showPlanIneligibleModal('all');
      return;
    }

    if (!trackingData.metaPixel.pixelId?.trim()) {
      toast.error('Please enter and save a valid Meta Pixel ID first.');
      return;
    }

    if (!trackingData.metaPixel.hasCapiToken && !trackingData.metaPixel.capiAccessToken?.trim()) {
      toast.error('Please enter and save your Meta Conversions API Access Token first.');
      return;
    }

    try {
      setIsTestingCapi(true);
      const res = await api.post('/tracking/merchant/test-capi', {
        testEventCode: trackingData.metaPixel.testEventCode,
        graphApiVersion: trackingData.metaPixel.graphApiVersion,
        pixelId: trackingData.metaPixel.pixelId,
      });

      toast.success(res.data?.message || 'Test event sent to Meta CAPI successfully!');
      fetchConfig();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Meta CAPI test event delivery failed';
      toast.error(msg);
      fetchConfig();
    } finally {
      setIsTestingCapi(false);
    }
  };

  const getBadge = (status: string) => {
    switch (status) {
      case 'Connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Connected
          </span>
        );
      case 'Disabled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <XCircle className="w-3.5 h-3.5" /> Not Configured
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#5022C3]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Plan Guard Banner when not eligible */}
      {!canUseGA4AndPixel && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {isTrialPlan ? 'Marketing Integrations Locked on Free Trial' : 'Plan Upgrade Required for Marketing & CAPI'}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Google Analytics 4, Meta Pixel & Server-Side Conversions API (CAPI) are available on <strong>Standard</strong> and <strong>Premium</strong> plans.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
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
            className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTesting ? 'animate-spin' : ''}`} />
            Test / Verify
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 sm:px-5 py-2 bg-[#5022C3] hover:bg-[#401ab0] text-white font-medium rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5 sm:gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* 1. Google Analytics 4 */}
        <div
          className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4 transition-all ${
            trackingData.googleAnalytics.enabled
              ? 'border-amber-300 ring-1 ring-amber-300/25 bg-amber-50/10'
              : 'border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                <SiGoogleanalytics className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Google Analytics 4 (GA4)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Standard & Premium
                  </span>
                  <button
                    type="button"
                    onClick={() => setTrackingDocModal('ga4')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> How to find ID?
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Track pageviews, ecommerce activity, and store traffic</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {getBadge(statuses.googleAnalytics)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.googleAnalytics.enabled}
                  onChange={(e) => {
                    if (!canUseGA4AndPixel) {
                      showPlanIneligibleModal('all');
                      return;
                    }
                    setTrackingData({
                      ...trackingData,
                      googleAnalytics: { ...trackingData.googleAnalytics, enabled: e.target.checked },
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                GA4 Measurement ID
              </label>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                Open Google Analytics <ExternalLink className="w-3 h-3" />
              </a>
            </div>
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
                  type="button"
                  onClick={() =>
                    setTrackingData({
                      ...trackingData,
                      googleAnalytics: { ...trackingData.googleAnalytics, measurementId: '' },
                    })
                  }
                  className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Measurement ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.googleAnalytics ? (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.googleAnalytics}</p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                Format: <code className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">G-XXXXXXXXXX</code> · Automatically binds to gtag.js on all 5 themes.
              </p>
            )}
          </div>
        </div>

        {/* 2. Meta Pixel & Conversions API (CAPI) */}
        <div
          className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-5 transition-all ${
            trackingData.metaPixel.enabled || trackingData.metaPixel.capiEnabled
              ? 'border-blue-300 ring-1 ring-blue-300/25 bg-blue-50/10'
              : 'border-gray-200/80 hover:border-gray-300'
          }`}
        >
          {/* Pixel Top Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0668E1] shrink-0 shadow-xs">
                <SiMeta className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Meta (Facebook) Pixel & Conversions API (CAPI)</h3>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    trackingData.metaPixel.enabled && trackingData.metaPixel.pixelId
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    Pixel: {trackingData.metaPixel.enabled && trackingData.metaPixel.pixelId ? 'Active' : 'Off'}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                    trackingData.metaPixel.capiEnabled && trackingData.metaPixel.hasCapiToken
                      ? 'bg-blue-100 text-blue-700'
                      : trackingData.metaPixel.capiEnabled
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    CAPI: {trackingData.metaPixel.capiEnabled && trackingData.metaPixel.hasCapiToken ? 'Active' : trackingData.metaPixel.capiEnabled ? 'Token Missing' : 'Off'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTrackingDocModal('pixel_id')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> Setup Guide
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Track store visitors, cart additions & authoritative server purchases with browser + server deduplication.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {getBadge(statuses.metaPixel)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.metaPixel.enabled}
                  onChange={(e) => {
                    if (!canUseGA4AndPixel) {
                      showPlanIneligibleModal('all');
                      return;
                    }
                    setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, enabled: e.target.checked },
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          {/* Pixel ID and Graph API Version Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Meta Pixel ID / Dataset ID
                </label>
                <a
                  href="https://business.facebook.com/events_manager2"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                >
                  Meta Events Manager <ExternalLink className="w-3 h-3" />
                </a>
              </div>
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
                    type="button"
                    onClick={() =>
                      setTrackingData({
                        ...trackingData,
                        metaPixel: { ...trackingData.metaPixel, pixelId: '' },
                      })
                    }
                    className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove Pixel ID"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {errors.metaPixel && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.metaPixel}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Meta Graph API Version
                </label>
                <button
                  type="button"
                  onClick={() => setTrackingDocModal('graph_version')}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" /> Which version?
                </button>
              </div>
              <select
                value={trackingData.metaPixel.graphApiVersion || 'v21.0'}
                onChange={(e) =>
                  setTrackingData({
                    ...trackingData,
                    metaPixel: { ...trackingData.metaPixel, graphApiVersion: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-gray-50/50"
              >
                <option value="v22.0">v22.0 (Latest)</option>
                <option value="v21.0">v21.0 (Recommended)</option>
                <option value="v20.0">v20.0</option>
                <option value="v19.0">v19.0</option>
              </select>
            </div>
          </div>

          {/* Server-Side CAPI Section (Matches Super Admin Dashboard) */}
          <div className="p-4 sm:p-5 bg-white border border-gray-200/90 rounded-2xl space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-700" />
                    Server-Side Conversions API (CAPI)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setTrackingDocModal('capi_token')}
                    className="text-[11px] font-medium text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                  >
                    How to get token?
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Direct server-to-server event dispatch via Meta Graph API (AES-256 encrypted at rest).
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Segmented Mode Selector */}
                <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg text-xs font-medium border border-gray-200/80">
                  <button
                    type="button"
                    onClick={() => setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, mode: 'live' }
                    })}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      trackingData.metaPixel.mode === 'live'
                        ? 'bg-white text-gray-900 font-semibold shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, mode: 'test' }
                    })}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      trackingData.metaPixel.mode === 'test'
                        ? 'bg-white text-gray-900 font-semibold shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Test
                  </button>
                </div>

                {/* Main CAPI Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={Boolean(trackingData.metaPixel.capiEnabled)}
                    onChange={(e) => {
                      if (!canUseGA4AndPixel) {
                        showPlanIneligibleModal('all');
                        return;
                      }
                      setTrackingData({
                        ...trackingData,
                        metaPixel: { ...trackingData.metaPixel, capiEnabled: e.target.checked },
                      });
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-700">CAPI Access Token</label>
                    <button
                      type="button"
                      onClick={() => setTrackingDocModal('capi_token')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> Guide
                    </button>
                  </div>
                  {trackingData.metaPixel.hasCapiToken && !trackingData.metaPixel.clearCapiToken && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                      Configured: {trackingData.metaPixel.capiTokenMasked || '••••••••'}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={
                    trackingData.metaPixel.hasCapiToken
                      ? 'Enter new token to rotate / replace existing'
                      : 'Paste Meta Conversions API Access Token'
                  }
                  value={trackingData.metaPixel.capiAccessToken || ''}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      metaPixel: {
                        ...trackingData.metaPixel,
                        capiAccessToken: e.target.value,
                        clearCapiToken: false,
                      },
                    })
                  }
                  className={`w-full px-4 py-2.5 bg-gray-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 ${
                    errors.capiAccessToken ? 'border-red-300 bg-red-50/20' : 'border-gray-200'
                  }`}
                />
                {errors.capiAccessToken && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.capiAccessToken}</p>
                )}
                {trackingData.metaPixel.hasCapiToken && (
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Stored encrypted; raw token is never displayed.</span>
                    <button
                      type="button"
                      onClick={() =>
                        setTrackingData({
                          ...trackingData,
                          metaPixel: {
                            ...trackingData.metaPixel,
                            capiAccessToken: '',
                            clearCapiToken: !trackingData.metaPixel.clearCapiToken,
                          },
                        })
                      }
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        trackingData.metaPixel.clearCapiToken
                          ? 'bg-red-100 text-red-700'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {trackingData.metaPixel.clearCapiToken ? 'Will Clear on Save (Undo)' : 'Clear Saved Token'}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-700">Test Event Code</label>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      trackingData.metaPixel.mode === 'test'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {trackingData.metaPixel.mode === 'test' ? 'Active in Test' : 'Inactive in Live'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTrackingDocModal('test_event_code')}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> Where to find?
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. TEST12345"
                  value={trackingData.metaPixel.testEventCode || ''}
                  onChange={(e) =>
                    setTrackingData({
                      ...trackingData,
                      metaPixel: { ...trackingData.metaPixel, testEventCode: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200 bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {trackingData.metaPixel.mode === 'test'
                    ? 'Events with this code route to Meta Events Manager → Test Events tab.'
                    : 'In Live mode, events go directly to live campaigns (test code ignored).'}
                </p>
              </div>
            </div>

            {/* Event Level Toggles */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Individual Store Events Enabled</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'PageView', label: 'PageView' },
                  { key: 'ViewContent', label: 'ViewContent' },
                  { key: 'AddToCart', label: 'AddToCart' },
                  { key: 'InitiateCheckout', label: 'Checkout' },
                  { key: 'Purchase', label: 'Purchase' },
                  { key: 'Contact', label: 'Contact' },
                ].map((evt) => {
                  const checked = trackingData.metaPixel.events?.[evt.key] ?? true;
                  return (
                    <label
                      key={evt.key}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        checked
                          ? 'bg-purple-50/80 border-purple-200 text-[#5022C3] font-medium'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setTrackingData({
                            ...trackingData,
                            metaPixel: {
                              ...trackingData.metaPixel,
                              events: {
                                ...trackingData.metaPixel.events,
                                [evt.key]: e.target.checked,
                              },
                            },
                          })
                        }
                        className="rounded border-gray-300 text-[#5022C3] focus:ring-purple-500 w-3.5 h-3.5"
                      />
                      <span>{evt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Connection Test & Diagnostics */}
            <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-700">Last Test:</span>
                  {trackingData.metaPixel.diagnostics?.lastTestAt ? (
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${
                        trackingData.metaPixel.diagnostics.lastTestStatus === 'success'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {trackingData.metaPixel.diagnostics.lastTestStatus?.toUpperCase()} —{' '}
                      {new Date(trackingData.metaPixel.diagnostics.lastTestAt).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not tested yet</span>
                  )}
                </div>
                {trackingData.metaPixel.diagnostics?.lastTestMessage && (
                  <p className="text-[11px] text-gray-500 max-w-xl">
                    {trackingData.metaPixel.diagnostics.lastTestMessage}
                  </p>
                )}
                {trackingData.metaPixel.diagnostics?.lastEventAt && (
                  <p className="text-[11px] text-gray-500">
                    Last Delivery: <strong>{trackingData.metaPixel.diagnostics.lastEventName}</strong> (
                    {trackingData.metaPixel.diagnostics.lastEventStatus}) at{' '}
                    {new Date(trackingData.metaPixel.diagnostics.lastEventAt).toLocaleString()}
                  </p>
                )}
                {trackingData.metaPixel.diagnostics?.lastErrorMessage && (
                  <p className="text-[11px] text-red-600">
                    Last Error: {trackingData.metaPixel.diagnostics.lastErrorMessage}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleTestMerchantCapi}
                disabled={isTestingCapi}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-2 shrink-0 disabled:opacity-60 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isTestingCapi ? 'Sending Test Event...' : 'Test CAPI Connection'}
              </button>
            </div>

            {/* Recent Server CAPI Deliveries Table (Same as Admin Dashboard) */}
            {recentTrackingEvents.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-semibold text-gray-700">Recent Server CAPI Deliveries</h5>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      Latest {recentTrackingEvents.length} Events (Auto-pruned to 100 max)
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Older events automatically deleted
                  </span>
                </div>
                <div className="max-h-64 sm:max-h-80 overflow-y-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0 shadow-2xs">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Event</th>
                        <th className="py-2 px-3 font-semibold">Status</th>
                        <th className="py-2 px-3 font-semibold">HTTP / Trace</th>
                        <th className="py-2 px-3 font-semibold">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {recentTrackingEvents.map((ev) => (
                        <tr key={ev._id || ev.eventId} className="hover:bg-gray-50/70">
                          <td className="py-2 px-3 font-semibold text-gray-800">{ev.eventName}</td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full font-semibold ${
                                ev.status === 'sent'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : ev.status === 'retry_scheduled'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {ev.status}
                            </span>
                          </td>
                          <td
                            className="py-2 px-3 text-gray-500 truncate max-w-[200px]"
                            title={ev.errorMessage || ev.fbTraceId}
                          >
                            {ev.errorMessage
                              ? ev.errorMessage
                              : `${ev.httpStatus || '-'} ${ev.fbTraceId ? `(${ev.fbTraceId.slice(0, 10)})` : ''}`}
                          </td>
                          <td className="py-2 px-3 text-gray-400 whitespace-nowrap">
                            {new Date(ev.sentAt || ev.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            {new Date(ev.sentAt || ev.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Google Tag Manager */}
        <div
          className={`bg-white rounded-2xl border shadow-sm p-4 sm:p-6 space-y-4 transition-all ${
            trackingData.googleTagManager.enabled
              ? 'border-sky-300 ring-1 ring-sky-300/25 bg-sky-50/10'
              : 'border-gray-200/80 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                <SiGoogletagmanager className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Google Tag Manager (GTM)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#5022C3] border border-purple-200">
                    Premium Exclusive
                  </span>
                  <button
                    type="button"
                    onClick={() => setTrackingDocModal('gtm')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> How to setup?
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Inject custom marketing tags and custom dataLayer triggers across your store</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {getBadge(statuses.googleTagManager)}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={trackingData.googleTagManager.enabled}
                  onChange={(e) => {
                    if (!canUseGTM) {
                      showPlanIneligibleModal('gtm');
                      return;
                    }
                    setTrackingData({
                      ...trackingData,
                      googleTagManager: { ...trackingData.googleTagManager, enabled: e.target.checked },
                    });
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                GTM Container ID
              </label>
              <a
                href="https://tagmanager.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
              >
                Open Google Tag Manager <ExternalLink className="w-3 h-3" />
              </a>
            </div>
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
                  type="button"
                  onClick={() =>
                    setTrackingData({
                      ...trackingData,
                      googleTagManager: { ...trackingData.googleTagManager, containerId: '' },
                    })
                  }
                  className="p-2.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Container ID"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            {errors.googleTagManager ? (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.googleTagManager}</p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">
                Format: <code className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">GTM-XXXXXXX</code> · Inserts head script and body noscript fallback automatically.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Security & Isolation Guarantee Banner */}
      <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#5022C3] shrink-0 mt-0.5" />
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-900">Tenant Isolation & Zero Leakage Guarantee</p>
          <p>
            Your tracking credentials and Meta CAPI Access Tokens are strictly encrypted at rest via AES-256-GCM and bound exclusively to your store account and domain. They will never leak to other stores or to the central SaaS platform. Scripts are automatically initialized dynamically across all 5 themes without requiring manual theme code editing.
          </p>
        </div>
      </div>

      {/* Tracking Documentation Setup Guide Modal */}
      {trackingDocModal && (
        <div
          onClick={() => setTrackingDocModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5022C3] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Analytics & Tracking Setup Guide</h3>
                  <p className="text-xs text-gray-500">Step-by-step instructions to obtain and configure your tracking IDs and CAPI Token</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingDocModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap bg-white">
              {[
                { id: 'all', label: 'Complete Guide' },
                { id: 'ga4', label: 'Google Analytics 4' },
                { id: 'pixel_id', label: 'Meta Pixel ID' },
                { id: 'capi_token', label: 'CAPI Access Token' },
                { id: 'test_event_code', label: 'Test Event Code' },
                { id: 'graph_version', label: 'Graph Version' },
                { id: 'gtm', label: 'Google Tag Manager' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTrackingDocModal(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    trackingDocModal === tab.id
                      ? 'bg-[#5022C3] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed">
              {(trackingDocModal === 'all' || trackingDocModal === 'ga4') && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <SiGoogleanalytics className="w-4 h-4 text-amber-600" />
                    <h4>Google Analytics 4 (GA4) Measurement ID</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                    <li>Open <a href="https://analytics.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">Google Analytics <ExternalLink className="w-3 h-3" /></a> &rarr; click <strong>Admin</strong> (gear icon, bottom-left).</li>
                    <li>Under <em>Data collection and modification</em>, click <strong>Data streams</strong> &rarr; select your Web stream.</li>
                    <li>Copy the <strong>Measurement ID</strong> (format: <code className="px-1.5 py-0.5 bg-amber-100/70 text-amber-900 rounded font-mono font-bold">G-XXXXXXXXXX</code>).</li>
                    <li>Paste it in the GA4 field, toggle it On, and click <strong>Save Changes</strong>.</li>
                  </ol>
                </div>
              )}

              {(trackingDocModal === 'all' || trackingDocModal === 'pixel_id') && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <SiMeta className="w-4 h-4 text-blue-600" />
                    <h4>Meta (Facebook) Pixel ID / Dataset ID</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                    <li>Go to <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">Meta Events Manager <ExternalLink className="w-3 h-3" /></a> &rarr; left menu <strong>Data Sources</strong>.</li>
                    <li>Click your store Web Pixel / Dataset (or create one under <strong>Connect Data Sources &rarr; Web</strong>).</li>
                    <li>Click the <strong>Settings</strong> tab at the top.</li>
                    <li>Copy your <strong>Dataset ID</strong> (15–16 digit numeric ID, e.g., <code className="px-1.5 py-0.5 bg-blue-100/70 text-blue-900 rounded font-mono font-bold">123456789012345</code>).</li>
                    <li>Paste it in the Meta Pixel field, toggle it On, and click <strong>Save Changes</strong>.</li>
                  </ol>
                </div>
              )}

              {(trackingDocModal === 'all' || trackingDocModal === 'capi_token') && (
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <Lock className="w-4 h-4 text-[#5022C3]" />
                    <h4>How to Generate Meta Conversions API (CAPI) Access Token</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                    <li>Go to <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">Meta Events Manager <ExternalLink className="w-3 h-3" /></a> &rarr; select your Pixel / Dataset.</li>
                    <li>Click the <strong>Settings</strong> tab &rarr; scroll down to <strong>Conversions API</strong>.</li>
                    <li>Under <em>Set up manually</em>, click <strong>Generate access token</strong>.</li>
                    <li>Copy the generated token string (starts with <code className="px-1.5 py-0.5 bg-purple-100/70 text-purple-900 rounded font-mono font-bold">EAAG...</code>).</li>
                    <li>Paste the token into the <strong>CAPI Access Token</strong> field above, toggle CAPI On, and click <strong>Save Changes</strong>.</li>
                  </ol>
                  <p className="text-[11px] text-gray-500 bg-white p-2 rounded-lg border border-purple-100 mt-2">
                    🔒 <strong>Security:</strong> The access token is encrypted on the server with AES-256-GCM. It will never be displayed in plain text again.
                  </p>
                </div>
              )}

              {(trackingDocModal === 'all' || trackingDocModal === 'test_event_code') && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <h4>Meta Test Event Code</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                    <li>In Meta Events Manager, click the <strong>Test Events</strong> tab on your Pixel.</li>
                    <li>Under <em>Confirm your server events are set up correctly</em>, find the code (e.g. <code className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono font-bold">TEST12345</code>).</li>
                    <li>Paste that code here and click <strong>Test CAPI Connection</strong>.</li>
                    <li>You will immediately see the test event registered in your Meta Events Manager test stream!</li>
                  </ol>
                </div>
              )}

              {(trackingDocModal === 'all' || trackingDocModal === 'graph_version') && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-800 text-sm">Meta Graph API Version</h4>
                  <p>
                    We recommend <strong>v21.0</strong> for highest stability and full compatibility with standard Bangladeshi e-commerce events. v22.0 is the latest version.
                  </p>
                </div>
              )}

              {(trackingDocModal === 'all' || trackingDocModal === 'gtm') && (
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <SiGoogletagmanager className="w-4 h-4 text-sky-600" />
                    <h4>Google Tag Manager (GTM) Container ID</h4>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                    <li>Open <a href="https://tagmanager.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">Google Tag Manager <ExternalLink className="w-3 h-3" /></a> and select your Web container.</li>
                    <li>Copy the Container ID in the top bar (format: <code className="px-1.5 py-0.5 bg-sky-100/70 text-sky-900 rounded font-mono font-bold">GTM-XXXXXXX</code>).</li>
                    <li>Make sure you click <strong>Submit &rarr; Publish</strong> inside GTM so your tags go live.</li>
                    <li>Paste the ID in the GTM field, toggle it On, and click <strong>Save Changes</strong>.</li>
                  </ol>
                  <p className="text-[11px] text-gray-500 bg-white p-2 rounded-lg border border-gray-200 mt-2">
                    💡 <strong>Tip:</strong> If you already enabled Meta Pixel or GA4 above, avoid firing duplicate Pixel/GA4 tags inside GTM to prevent double-counting conversions.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setTrackingDocModal(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

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
