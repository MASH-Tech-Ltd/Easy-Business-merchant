'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Globe,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Clock,
  LifeBuoy,
  AlertTriangle,
  Loader2,
  Unlink,
  Wifi,
} from 'lucide-react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

let globalStoreCache: any = null;

// ─────────────────────────────────────────────────────────────────────────────
// Hold-to-Disconnect Button (hold for 3 seconds)
// ─────────────────────────────────────────────────────────────────────────────
function HoldToDisconnect({ onConfirm, disabled }: { onConfirm: () => void; disabled: boolean }) {
  const HOLD_MS = 3000;
  const [progress, setProgress] = useState(0); // 0–100
  const [holding, setHolding] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current === null) return;
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min((elapsed / HOLD_MS) * 100, 100);
    setProgress(pct);
    if (pct < 100) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setHolding(false);
      setProgress(0);
      onConfirm();
    }
  }, [onConfirm]);

  const startHold = useCallback(() => {
    if (disabled) return;
    startRef.current = Date.now();
    setHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, tick]);

  const cancelHold = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Ring button */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow when holding */}
        {holding && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30" />
        )}

        <svg width="72" height="72" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="36" cy="36" r={radius + 8}
            fill="none" stroke="#fee2e2" strokeWidth="4"
          />
          {/* Progress arc */}
          <circle
            cx="36" cy="36" r={radius + 8}
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (radius + 8)}
            strokeDashoffset={2 * Math.PI * (radius + 8) - (progress / 100) * 2 * Math.PI * (radius + 8)}
            style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.15s ease' }}
          />
        </svg>

        <button
          type="button"
          disabled={disabled}
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          className={`absolute inset-0 flex items-center justify-center rounded-full transition-colors select-none ${
            holding ? 'bg-red-600' : 'bg-red-100 hover:bg-red-200'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          style={{ width: 72, height: 72 }}
          aria-label="Hold to disconnect domain"
        >
          <Unlink className={`w-6 h-6 ${holding ? 'text-white' : 'text-red-600'}`} />
        </button>
      </div>

      <p className="text-xs text-gray-500 font-medium select-none">
        {holding
          ? `Release to cancel · ${Math.round(((100 - progress) / 100) * 3)}s`
          : 'Hold 3 seconds to disconnect'}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Disconnect Modal
// ─────────────────────────────────────────────────────────────────────────────
function DisconnectModal({
  domain,
  onClose,
  onDisconnected,
}: {
  domain: string;
  onClose: () => void;
  onDisconnected: () => void;
}) {
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConfirm = async () => {
    setDisconnecting(true);
    try {
      await api.delete('/tenants/custom-domain');
      toast.success('Custom domain disconnected successfully');
      onDisconnected();
      onClose();
    } catch (error: any) {
      console.error('Error disconnecting domain', error);
      toast.error(error.response?.data?.message || 'Failed to disconnect domain');
      setDisconnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: 'modalIn 0.2s ease' }}
      >
        {/* Red header strip */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Unlink className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Disconnect Domain</h3>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Domain pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl mb-4 w-fit mx-auto">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 break-all">{domain}</span>
          </div>

          <p className="text-sm text-gray-600 text-center leading-relaxed mb-2">
            Disconnecting will remove SSL certificates and DNS records from Cloudflare.
            Your store will revert to its default system domain immediately.
          </p>
          <p className="text-xs text-gray-400 text-center mb-6">
            You can reconnect a new domain at any time.
          </p>

          {/* Warning box */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Any existing visitors using <strong>{domain}</strong> may temporarily see errors
              while DNS propagates (5–30 minutes).
            </p>
          </div>

          {/* Hold-to-disconnect */}
          {!disconnecting ? (
            <HoldToDisconnect onConfirm={handleConfirm} disabled={disconnecting} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-sm text-gray-500">Removing domain and SSL records…</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={disconnecting}
            className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel — Keep Domain Connected
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function isValidDomain(value: string) {
  return /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Content
// ─────────────────────────────────────────────────────────────────────────────
function DomainContent() {
  useSearchParams(); // keep Suspense boundary happy
  const [store, setStore] = useState<any>(globalStoreCache);
  const [pageLoading, setPageLoading] = useState(!globalStoreCache);
  const [saving, setSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState(globalStoreCache?.customDomain || '');
  const [showRetry, setShowRetry] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [savingSlug, setSavingSlug] = useState(false);
  const [errorSlug, setErrorSlug] = useState('');
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const inputHasError = customDomain.length > 0 && !isValidDomain(customDomain);
  const canSubmit = customDomain.length > 0 && isValidDomain(customDomain) && !saving;

  /* Retry timer */
  useEffect(() => {
    if (store?.domainStatus === 'pending' && store?.updatedAt) {
      const elapsed = Date.now() - new Date(store.updatedAt).getTime();
      const delay = 2 * 60 * 1000 - elapsed;
      if (delay <= 0) { setShowRetry(true); return; }
      const t = setTimeout(() => setShowRetry(true), delay);
      return () => clearTimeout(t);
    }
    setShowRetry(false);
  }, [store]);

  /* Initial fetch */
  useEffect(() => { fetchStoreInfo(); }, []);

  /* Polling while pending */
  useEffect(() => {
    if (store?.domainStatus !== 'pending') return;
    const id = setInterval(fetchStoreInfo, 50_000);
    return () => clearInterval(id);
  }, [store?.domainStatus]);

  const fetchStoreInfo = async () => {
    try {
      const res = await api.get('/tenants/my-store');
      if (res.data?.data) {
        globalStoreCache = res.data.data;
        setStore(res.data.data);
        setCustomDomain(res.data.data.customDomain || '');
      }
    } catch (err) {
      console.error('Failed to fetch store data', err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    let domain = customDomain.trim().toLowerCase();
    // silently normalize
    if (!domain.startsWith('www.')) domain = `www.${domain}`;
    setSaving(true);
    try {
      const res = await api.post('/tenants/custom-domain', { customDomain: domain });
      toast.success(res.data?.message || 'Domain connection initiated!');
      fetchStoreInfo();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to connect domain');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlug = async () => {
    setErrorSlug('');
    if (!newSlug || newSlug === store?.slug) { setIsEditingSlug(false); return; }
    setSavingSlug(true);
    try {
      const res = await api.patch('/tenants/update-slug', { slug: newSlug });
      toast.success(res.data?.message || 'Subdomain updated!');
      setStore({ ...store, slug: res.data?.data?.slug || newSlug });
      setIsEditingSlug(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update subdomain';
      setErrorSlug(msg);
      toast.error(msg);
    } finally {
      setSavingSlug(false);
    }
  };

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin" />
    </div>
  );

  const isPending = store?.domainStatus === 'pending';
  const isActive  = store?.domainStatus === 'active';
  const isFailed  = store?.domainStatus === 'failed';

  return (
    <>
      {showDisconnectModal && (
        <DisconnectModal
          domain={store?.customDomain || ''}
          onClose={() => setShowDisconnectModal(false)}
          onDisconnected={() => { setCustomDomain(''); fetchStoreInfo(); }}
        />
      )}

      <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pt-2 sm:pt-4">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            <div id="custom-domain-section" className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Custom Domain Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Point your own domain to your store.</p>

              {/* 5–30 min banner — shown when a custom domain is connecting */}
              {store?.customDomain && !isActive && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                  <Wifi className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">DNS &amp; SSL verification in progress</p>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      It typically takes <strong>5 to 30 minutes</strong> for DNS changes to propagate across global networks and for your SSL certificate to be issued. This page refreshes automatically — please wait patiently.
                    </p>
                  </div>
                </div>
              )}

              {/* Input form */}
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Domain</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="mystore.com  or  www.mystore.com"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3] focus:border-transparent transition-all ${
                          inputHasError ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto ${
                          canSubmit
                            ? 'bg-[#5022C3] hover:bg-[#401a9c] text-white shadow-purple-500/20'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Connecting…</> : 'Connect Domain'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toast('Support team will contact you shortly!', { icon: '👋' })}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                      >
                        <LifeBuoy className="w-5 h-5 text-gray-500" /> Get Help
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs mt-3 flex items-center gap-1.5 ${inputHasError ? 'text-red-500' : 'text-gray-500'}`}>
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 ${inputHasError ? 'text-red-500' : 'text-amber-500'}`} />
                    {inputHasError
                      ? 'Please enter a valid domain — e.g. mystore.com or www.mystore.com'
                      : "Enter your domain with or without 'www' — we'll normalize it automatically."}
                  </p>
                </div>
              </form>

              {/* ── Domain list ── */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-md font-bold text-gray-900 mb-4">Current Active Domains</h3>
                <div className="space-y-3">

                  {/* System domain */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl gap-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        {isEditingSlug ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={newSlug}
                              onChange={(e) => { setNewSlug(e.target.value); setErrorSlug(''); }}
                              className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3] ${errorSlug ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="my-store-name"
                            />
                            <span className="text-gray-500 font-medium">.{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000'}</span>
                          </div>
                        ) : (
                          <p className="font-bold text-gray-900">{store?.slug}.{process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000'}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5">System Domain (Default)</p>
                        {isEditingSlug && errorSlug && (
                          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />{errorSlug}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:ml-auto whitespace-nowrap">
                      {isEditingSlug ? (
                        <>
                          <button onClick={() => setIsEditingSlug(false)} disabled={savingSlug} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50">Cancel</button>
                          <button onClick={handleSaveSlug} disabled={savingSlug || !newSlug} className="px-4 py-1.5 bg-[#5022C3] hover:bg-[#401a9c] text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70">{savingSlug ? 'Saving…' : 'Save'}</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setNewSlug(store?.slug || ''); setErrorSlug(''); setIsEditingSlug(true); }} className="px-4 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition-colors">Edit</button>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Connected</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Custom domain row */}
                  {store?.customDomain && (
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl shadow-sm gap-4 ${isActive ? 'bg-green-50 border-green-200' : isFailed ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : isFailed ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          {isActive ? <CheckCircle2 className="w-5 h-5" /> : isFailed ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={`font-bold ${isActive ? 'text-green-900' : isFailed ? 'text-red-900' : 'text-amber-900'}`}>{store.customDomain}</p>
                          <p className={`text-xs ${isActive ? 'text-green-700/70' : isFailed ? 'text-red-700/70' : 'text-amber-700/70'}`}>
                            {isActive ? 'SSL Active — Fully Connected' : isFailed ? 'Verification Failed · Check DNS records' : 'Verifying DNS & Provisioning SSL · 5–30 min'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isPending && showRetry && (
                          <button onClick={handleSave as any} disabled={saving} className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200 transition-colors shadow-sm disabled:opacity-50">
                            {saving ? 'Retrying…' : 'Retry'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowDisconnectModal(true)}
                          className="px-3 py-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-bold rounded-full border border-red-200 transition-colors shadow-sm"
                          title="Disconnect Domain"
                        >
                          Disconnect
                        </button>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${isActive ? 'bg-green-100 text-green-800 border-green-200' : isFailed ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                          {isActive ? 'Connected' : isFailed ? 'Failed' : 'Connecting'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Free SSL Included
                </h3>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Every custom domain automatically receives a free, auto-renewing SSL certificate.
                  Your store is completely secure from day one.
                </p>
              </div>
            </div>

            {!isActive && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-md font-bold text-gray-900 mb-4">DNS Configuration</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Log in to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:
                </p>

                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-800 flex gap-2">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    Use CNAME flattening or ALIAS instead of an A Record to keep your origin IP hidden.
                  </div>

                  {[
                    { step: 1, title: 'Root / Apex', name: '@', note: 'CNAME or ALIAS/ANAME' },
                    { step: 2, title: 'WWW subdomain', name: 'www', note: 'CNAME' },
                  ].map(({ step, title, name, note }) => (
                    <div key={step} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                      <p className="font-bold text-gray-800 mb-2">Step {step}: {title}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Type</span><span>{note}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Name</span><span>{name}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Value</span><span className="font-mono bg-white px-2 py-0.5 border rounded">merchant.masheco.com</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-bold text-[#5022C3] hover:text-[#401a9c] transition-colors">
                  Read Detailed Guide <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DomainManagementPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>}>
      <DomainContent />
    </Suspense>
  );
}
