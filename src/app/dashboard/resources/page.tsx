'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HardDrive, Image as ImageIcon, Globe, Activity, AlertTriangle, RefreshCw, PlusCircle, Clock, CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '@/utils/api';

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

function fmt(bytes: number | null | undefined): string {
  const b = Number(bytes || 0);
  if (b <= 0) return '0 B';
  if (b >= GB) return `${(b / GB).toFixed(2)} GB`;
  if (b >= MB) return `${(b / MB).toFixed(2)} MB`;
  if (b >= KB) return `${(b / KB).toFixed(2)} KB`;
  return `${b} B`;
}

function limitLabel(bytes: number | null | undefined): string {
  return bytes && bytes > 0 ? fmt(bytes) : 'Unlimited';
}

function barColor(pct: number): string {
  if (pct >= 100) return 'bg-red-500';
  if (pct >= 95) return 'bg-orange-500';
  if (pct >= 85) return 'bg-amber-500';
  return 'bg-indigo-600';
}

export default function ResourceUsagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/resources/me/overview');
      setData(res.data?.data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load resource usage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[320px] text-gray-500 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading Resource &amp; Bandwidth Usage...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error || 'Unable to load resource usage.'}
        </div>
      </div>
    );
  }

  const { storage, imageBandwidth, generalBandwidth, combined, warnings = [], daily = [], history = [], activeAddons = [] } = data;
  const chartData = daily.map((d: any) => ({
    date: d.date.slice(5),
    imageMB: Math.round((d.imageBytes / MB) * 100) / 100,
    generalMB: Math.round((d.generalBytes / MB) * 100) / 100,
  }));

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Resource Usage</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Billing period <strong>{data.period}</strong> &bull; Plan:{' '}
            <strong>{data.package?.name || 'Standard Default'}</strong>
            {data.dataThrough && ` • Bandwidth synced through ${new Date(data.dataThrough).toLocaleString()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            href="/dashboard/subscription/addons"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Buy Resource Add-ons
          </Link>
        </div>
      </div>

      {/* Warning Banners */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w: any) => (
            <div
              key={w.key}
              className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border text-xs sm:text-sm ${
                w.status === 'limit_reached' || w.status === 'critical'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>{w.label}</strong> is at <strong>{w.percent}%</strong> of your allocation.
                </span>
              </div>
              <Link href="/dashboard/subscription/addons" className="underline font-bold whitespace-nowrap">
                Upgrade / Buy Add-on &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Three Independent Resource Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card A: Image Storage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Image Storage</h2>
                <p className="text-[11px] text-gray-500">Cloudflare R2 stored assets</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              {storage.limitBytes > 0 ? `${storage.percent}%` : 'Unlimited'}
            </span>
          </div>

          {storage.limitBytes > 0 && (
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(storage.percent)}`}
                style={{ width: `${Math.min(100, Math.max(2, storage.percent))}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Allocated</div>
              <div className="font-bold text-gray-900">{limitLabel(storage.limitBytes)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Used</div>
              <div className="font-bold text-gray-900">{fmt(storage.usedBytes)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Remaining</div>
              <div className="font-bold text-emerald-700">
                {storage.remainingBytes == null ? 'Unlimited' : fmt(storage.remainingBytes)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Uploaded Files</div>
              <div className="font-bold text-gray-900">{storage.fileCount}</div>
            </div>
          </div>
        </div>

        {/* Card B: Image Bandwidth */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Image Bandwidth</h2>
                <p className="text-[11px] text-gray-500">CDN delivery (HIT + MISS)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {imageBandwidth.limitBytes > 0 ? `${imageBandwidth.percent}%` : 'Unlimited'}
            </span>
          </div>

          {imageBandwidth.limitBytes > 0 && (
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(imageBandwidth.percent)}`}
                style={{ width: `${Math.min(100, Math.max(2, imageBandwidth.percent))}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Monthly Allocation</div>
              <div className="font-bold text-gray-900">{limitLabel(imageBandwidth.limitBytes)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Used / Remaining</div>
              <div className="font-bold text-gray-900">
                {fmt(imageBandwidth.usedBytes)} / {imageBandwidth.remainingBytes == null ? '∞' : fmt(imageBandwidth.remainingBytes)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Requests</div>
              <div className="font-bold text-gray-900">{imageBandwidth.requests}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-50">CDN HIT / MISS</div>
              <div className="font-bold text-gray-900">
                {imageBandwidth.cacheHit} / {imageBandwidth.cacheMiss} ({imageBandwidth.cacheHitRate}%)
              </div>
            </div>
          </div>
        </div>

        {/* Card C: General Traffic */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">General Traffic</h2>
                <p className="text-[11px] text-gray-500">HTML, CSS, JS, API JSON &amp; fonts</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              {generalBandwidth.limitBytes > 0 ? `${generalBandwidth.percent}%` : 'Unlimited'}
            </span>
          </div>

          {generalBandwidth.limitBytes > 0 && (
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor(generalBandwidth.percent)}`}
                style={{ width: `${Math.min(100, Math.max(2, generalBandwidth.percent))}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Monthly Allocation</div>
              <div className="font-bold text-gray-900">{limitLabel(generalBandwidth.limitBytes)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Used</div>
              <div className="font-bold text-gray-900">{fmt(generalBandwidth.usedBytes)}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Remaining</div>
              <div className="font-bold text-emerald-700">
                {generalBandwidth.remainingBytes == null ? 'Unlimited' : fmt(generalBandwidth.remainingBytes)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50">
              <div className="text-gray-500">Total Requests</div>
              <div className="font-bold text-gray-900">{generalBandwidth.requests}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Bandwidth Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900">Combined Monthly Bandwidth (Image + General Traffic)</h2>
          </div>
          <span className="text-xs text-gray-500">Image storage is separate and not included in bandwidth</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="text-gray-500">Image Bandwidth</div>
            <div className="text-base font-bold text-gray-900">{fmt(combined.imageBytes)}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="text-gray-500">General Traffic</div>
            <div className="text-base font-bold text-gray-900">{fmt(combined.generalBytes)}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50">
            <div className="text-purple-700">Combined Monthly Usage</div>
            <div className="text-base font-bold text-purple-900">{fmt(combined.usedBytes)}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="text-gray-500">Combined Remaining</div>
            <div className="text-base font-bold text-emerald-700">
              {combined.remainingBytes == null ? 'Unlimited' : fmt(combined.remainingBytes)}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Chart + Active Add-ons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Daily Bandwidth Usage (MB)</h3>
          {chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-xs text-gray-400">
              No daily bandwidth traffic recorded yet for {data.period}.
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="imageMB" name="Image (MB)" stroke="#10b981" fill="#d1fae5" />
                  <Area type="monotone" dataKey="generalMB" name="General (MB)" stroke="#3b82f6" fill="#dbeafe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Active &amp; Pending Add-ons</h3>
            <Link href="/dashboard/subscription/addons" className="text-xs font-semibold text-indigo-600 hover:underline">
              Browse Add-ons
            </Link>
          </div>
          {activeAddons.length === 0 ? (
            <p className="text-xs text-gray-400">No resource add-ons purchased yet.</p>
          ) : (
            <div className="space-y-2">
              {activeAddons.map((a: any) => (
                <div key={a.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-gray-900">
                    <span>{a.name} x{a.quantity}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                      a.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {a.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {a.status}
                    </span>
                  </div>
                  <div className="text-gray-500 mt-0.5">
                    +{fmt(a.quantityBytes)} &bull; {a.expiresAt ? `Expires ${new Date(a.expiresAt).toLocaleDateString()}` : 'Permanent'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Monthly Usage History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="py-2 pr-4">Period</th>
                  <th className="py-2 pr-4">Image Bandwidth</th>
                  <th className="py-2 pr-4">General Traffic</th>
                  <th className="py-2 pr-4">Combined</th>
                  <th className="py-2">Requests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h: any) => (
                  <tr key={h.period}>
                    <td className="py-2 pr-4 font-semibold">{h.period}</td>
                    <td className="py-2 pr-4">{fmt(h.imageBytes)}</td>
                    <td className="py-2 pr-4">{fmt(h.generalBytes)}</td>
                    <td className="py-2 pr-4 font-bold">{fmt(h.imageBytes + h.generalBytes)}</td>
                    <td className="py-2">{(h.imageRequests || 0) + (h.generalRequests || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400">{data.measurementNote}</p>
    </div>
  );
}
