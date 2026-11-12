'use client';

import { useState, useEffect } from 'react';
import {
  PhoneOff,
  Search,
  Plus,
  Trash2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface BlockedPhoneRecord {
  _id: string;
  phone: string;
  normalizedPhone: string;
  customerName?: string;
  reason?: string;
  createdAt: string;
}

export default function BlockedPhonesPage() {
  const [records, setRecords] = useState<BlockedPhoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlockedPhones();
  }, [page, search]);

  const fetchBlockedPhones = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blocked-phones', {
        params: { page, limit: 15, search },
      });
      const payload = res.data?.data;
      setRecords(payload?.data || []);
      setTotalPages(payload?.meta?.totalPages || 1);
      setTotalRecords(payload?.meta?.total || 0);
    } catch {
      toast.error('Failed to load blocked phone numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/blocked-phones', {
        phone: phone.trim(),
        customerName: customerName.trim(),
        reason: reason.trim() || 'Blocked by merchant',
      });
      toast.success('Phone number blocked for your store');
      setPhone('');
      setCustomerName('');
      setReason('');
      setIsModalOpen(false);
      setPage(1);
      fetchBlockedPhones();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to block phone number');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblock = async (record: BlockedPhoneRecord) => {
    setUnblockingId(record._id);
    try {
      await api.delete(`/blocked-phones/${encodeURIComponent(record.normalizedPhone)}`);
      toast.success(`${record.phone} unblocked`);
      fetchBlockedPhones();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to unblock phone number');
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <div className="w-full h-full font-sans flex flex-col">
      <div className="bg-white border-t border-gray-200 flex-1 flex flex-col min-h-0">
        {/* Top Info Banner */}
        <div className="p-3.5 sm:p-6 border-b border-gray-200 bg-white shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Store Phone Blocklist ({totalRecords})
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Blocked phone numbers are restricted from placing orders <strong>only on your store</strong>. Other stores are unaffected.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5022C3] hover:bg-[#401b9c] text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Block Phone Number
          </button>
        </div>

        {/* Search */}
        <div className="p-3.5 sm:px-6 sm:py-4 border-b border-gray-200 bg-gray-50/60 shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by phone, name, or reason..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3] w-full bg-white transition-all"
            />
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex-1 p-3 space-y-3 bg-gray-50/50 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-3 mx-auto">
                <PhoneOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No blocked numbers</h3>
              <p className="text-gray-500 text-xs px-4">
                Add spam or fake-order phone numbers to prevent them from ordering on your store.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec._id}
                className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{rec.phone}</div>
                    {rec.customerName && (
                      <div className="text-xs text-gray-600">{rec.customerName}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(rec)}
                    disabled={unblockingId === rec._id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Unblock
                  </button>
                </div>
                <div className="text-xs text-gray-500">{rec.reason || 'Blocked by merchant'}</div>
                <div className="text-[11px] text-gray-400">
                  Blocked on {new Date(rec.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-bold">Phone Number</th>
                <th className="px-6 py-4 font-bold">Customer Name</th>
                <th className="px-6 py-4 font-bold">Reason</th>
                <th className="px-6 py-4 font-bold">Blocked Date</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-500">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-4"></div>
                    Loading blocked numbers...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 mx-auto">
                      <PhoneOff className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No blocked phone numbers</h3>
                    <p className="text-gray-500 text-sm">
                      Add spam or fake-order phone numbers to block them from ordering on your store.
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">{rec.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rec.customerName || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {rec.reason || 'Blocked by merchant'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(rec.createdAt).toLocaleDateString('en-GB')}{' '}
                      <span className="text-xs text-gray-400">
                        {new Date(rec.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleUnblock(rec)}
                        disabled={unblockingId === rec._id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Block Phone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Block Phone Number</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBlockPhone} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fake Orderer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Repeated fake / returned orders"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Blocking...' : 'Block Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

