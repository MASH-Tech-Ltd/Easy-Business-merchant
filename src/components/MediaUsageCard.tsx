'use client';

import { useEffect, useState } from 'react';
import { HardDrive, Image as ImageIcon, UploadCloud, Activity } from 'lucide-react';
import { api } from '@/utils/api';

interface MediaUsageData {
  month: string;
  activeProvider: 'cloudinary' | 'r2';
  quota?: {
    baseLimitBytes: number;
    addonLimitBytes: number;
    totalLimitBytes: number;
    usedBytes: number;
    remainingBytes: number;
    usedPercent: number;
    isLimitReached: boolean;
  };
  storage: {
    r2: { imageCount: number; mainBytes: number; totalBytes: number };
    cloudinaryTracked: { imageCount: number; mainBytes: number; totalBytes: number };
    legacyCloudinaryImageCount: number;
    totalTrackedBytes: number;
    totalImageCount: number;
  };
  monthly: {
    uploadCount: number;
    uploadBytes: number;
    deleteCount: number;
    deletedBytes: number;
    deliveryRequests: number | null;
    deliveryBytes: number | null;
    deliverySource: 'none' | 'cloudflare_graphql';
  };
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, idx);
  return `${value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(2)} ${units[idx]}`;
}

export default function MediaUsageCard() {
  const [data, setData] = useState<MediaUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get('/media/usage/me')
      .then((res) => {
        const payload = res?.data?.data ?? res?.data;
        if (mounted && payload?.storage) {
          setData(payload);
        }
      })
      .catch(() => {
        // Non-critical widget; fail silently without disrupting subscription page
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !data || !data.storage) return null;

  const quota = data.quota;
  const barColor =
    quota && quota.isLimitReached
      ? 'bg-red-500'
      : quota && quota.usedPercent >= 85
        ? 'bg-amber-500'
        : 'bg-indigo-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Media & Image Storage</h3>
          <p className="text-xs text-gray-500">
            Current month ({data.month}) &bull; New uploads use{' '}
            <span className="font-semibold uppercase text-gray-700">{data.activeProvider}</span>
          </p>
        </div>
        {quota && quota.totalLimitBytes > 0 && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              quota.isLimitReached
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            {formatBytes(quota.usedBytes)} / {formatBytes(quota.totalLimitBytes)} ({quota.usedPercent}%)
          </span>
        )}
      </div>

      {quota && quota.totalLimitBytes > 0 && (
        <div className="mb-4">
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${Math.min(100, Math.max(1, quota.usedPercent))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1.5">
            <span>
              {quota.isLimitReached
                ? 'Storage limit reached — delete unused images or purchase a storage add-on.'
                : `${formatBytes(quota.remainingBytes)} remaining`}
            </span>
            {quota.addonLimitBytes > 0 && (
              <span>Includes +{formatBytes(quota.addonLimitBytes)} add-on</span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>Tracked Storage</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatBytes(data.storage.totalTrackedBytes)}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            R2: {formatBytes(data.storage.r2.totalBytes)}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>Stored Images</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{data.storage.totalImageCount}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            R2: {data.storage.r2.imageCount} &bull; Legacy: {data.storage.legacyCloudinaryImageCount}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Monthly Uploads</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{data.monthly.uploadCount}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {formatBytes(data.monthly.uploadBytes)} uploaded
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
            <Activity className="w-4 h-4 text-amber-600" />
            <span>Monthly Bandwidth</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {data.monthly.deliveryBytes !== null
              ? formatBytes(data.monthly.deliveryBytes)
              : 'Not measured'}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {data.monthly.deliveryRequests !== null
              ? `${data.monthly.deliveryRequests.toLocaleString()} requests`
              : 'CDN metering inactive'}
          </div>
        </div>
      </div>
    </div>
  );
}
