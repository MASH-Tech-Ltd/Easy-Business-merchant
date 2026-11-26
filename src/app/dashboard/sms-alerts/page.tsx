'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShoppingBag,
  Send,
  AlertTriangle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/utils/api';

interface SmsLogItem {
  _id: string;
  orderId?: string | null;
  phone: string;
  message: string;
  triggerType: 'new_order_offline' | 'order_confirmation' | 'admin_manual';
  status: 'sent' | 'failed';
  providerMessage?: string;
  createdAt: string;
}

interface MerchantSmsStats {
  totalSent: number;
  totalFailed: number;
  orderOfflineSent: number;
  orderConfirmationSent: number;
  addonQuota: {
    hasAddon: boolean;
    addonName: string | null;
    limit: number;
    used: number;
    remaining: number;
  };
  recentLogs: SmsLogItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SmsAlertsPage() {
  const [stats, setStats] = useState<MerchantSmsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchStats = async (targetPage: number = page) => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/sms/my-stats', {
        params: { page: targetPage, limit: 15 },
      });
      setStats(res.data?.data || null);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(page);
  }, [page]);

  const quota = stats?.addonQuota;
  const pct =
    quota && quota.limit > 0
      ? Math.min(100, Math.round((quota.used / quota.limit) * 100))
      : 0;
  const meta = stats?.meta || { page: 1, limit: 15, total: 0, totalPages: 1 };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SMS Alerts &amp; Usage</h1>
            <p className="text-xs text-gray-500">
              Track your SMS add-on quota, new-order alerts, and customer confirmation messages.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => fetchStats(page)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add-on Quota Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SMS Add-on Quota
            </p>
            <h2 className="text-base font-bold text-gray-900 mt-0.5">
              {quota?.hasAddon ? quota.addonName || 'New Order SMS Alert' : 'No Active SMS Add-on'}
            </h2>
          </div>

          {quota?.hasAddon ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {quota.used} / {quota.limit} Used ({quota.remaining} Remaining)
            </span>
          ) : (
            <Link
              href="/dashboard/subscription/addons"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <span>Activate SMS Add-on</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {quota?.hasAddon ? (
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                quota.remaining === 0
                  ? 'bg-red-500'
                  : pct >= 85
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.max(2, pct)}%` }}
            />
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Activate the <strong>New Order SMS Alert</strong> add-on (200 SMS / 120 BDT) to receive
            new-order SMS alerts and send English order confirmation SMS directly to customers.
          </p>
        )}
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Total SMS Sent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalSent || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-indigo-600">New Order Alerts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.orderOfflineSent || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-600">Order Confirmations</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats?.orderConfirmationSent || 0}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-600">Failed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalFailed || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Detailed SMS History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">SMS Delivery History</h3>
          <span className="text-xs text-gray-500">
            Total {meta.total} message{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Type</th>
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Recipient</th>
                <th className="py-3 px-4 font-bold">Message</th>
                <th className="py-3 px-4 font-bold">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    Loading SMS history...
                  </td>
                </tr>
              ) : !stats?.recentLogs?.length ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No order SMS notifications have been sent yet.
                  </td>
                </tr>
              ) : (
                stats.recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4">
                      {log.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <span
                          title={log.providerMessage || 'Failed'}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200"
                        >
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {log.triggerType === 'new_order_offline'
                        ? 'New Order Alert'
                        : 'Order Confirmation'}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {log.orderId ? `#${String(log.orderId).slice(-6).toUpperCase()}` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">{log.phone}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-md">{log.message}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-xs text-gray-600">
            <span>
              Page {meta.page} of {meta.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                disabled={page >= meta.totalPages || loading}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
