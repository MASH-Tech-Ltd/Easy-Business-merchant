'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, AlertCircle, Save, Trash2, RefreshCw, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
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

  // Fetch current merchant tracking config
  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/tracking/merchant');
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
    if (!validate()) {
      toast.error('Please fix configuration errors before saving');
      return;
    }

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

  return (
    <div className="p-6 md:p-8 w-full max-w-[1800px] mx-auto space-y-6 pb-16">
      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5022C3] flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Marketing & Analytics Integrations</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Tracking IDs configured below will automatically apply to all 5 storefront themes across your domain and subdomains.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            Test / Verify
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#5022C3] hover:bg-[#401ab0] text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 gap-6">
        {/* 1. Google Analytics 4 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4 transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-600 text-lg">
                G4
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Google Analytics 4 (GA4)</h3>
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
                <h3 className="font-bold text-gray-900">Meta (Facebook) Pixel</h3>
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
                <h3 className="font-bold text-gray-900">Google Tag Manager (GTM)</h3>
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
    </div>
  );
}
