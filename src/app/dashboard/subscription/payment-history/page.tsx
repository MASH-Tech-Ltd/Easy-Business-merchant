'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Pencil, 
  ArrowLeft, 
  Send, 
  Loader2, 
  Search, 
  Filter, 
  CreditCard,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { billingCacheStore } from '@/utils/billingCache';
import { MFSLogo } from '@/components/MFSLogo';

interface PaymentSubmission {
  _id: string;
  purpose: string;
  purposeTitle: string;
  amount: number;
  provider: string;
  senderNumber: string;
  transactionId: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
}

function PaymentHistoryContent() {
  const router = useRouter();
  const hasCache = billingCacheStore.myPayments !== null;

  const [myPayments, setMyPayments] = useState<PaymentSubmission[]>(billingCacheStore.myPayments || []);
  const [loading, setLoading] = useState(!hasCache);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Edit State
  const [editingPayment, setEditingPayment] = useState<PaymentSubmission | null>(null);
  const [editForm, setEditForm] = useState({
    provider: 'bKash',
    senderNumber: '',
    transactionId: '',
    amount: '',
    note: ''
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const { socket } = useSocket();

  const fetchPayments = async () => {
    try {
      if (billingCacheStore.myPayments === null) {
        setLoading(true);
      }
      const res = await api.get('/billing/my-payments');
      if (res.data?.data) {
        setMyPayments(res.data.data);
        billingCacheStore.myPayments = res.data.data;
      }
    } catch (error) {
      console.error('Failed to load payment history', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Real-time socket updates
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (notification: any) => {
      if (notification?.type === 'PAYMENT_VERIFIED' || notification?.type === 'PAYMENT_REJECTED') {
        fetchPayments();
      }
    };
    socket.on('new_notification', handleNotification);
    socket.on('refresh_subscriptions', fetchPayments);
    return () => {
      socket.off('new_notification', handleNotification);
      socket.off('refresh_subscriptions', fetchPayments);
    };
  }, [socket]);

  const handleEditClick = (payment: PaymentSubmission) => {
    if (payment.status !== 'pending') {
      return toast.error('Only pending payment proofs can be edited');
    }
    setEditingPayment(payment);
    setEditForm({
      provider: payment.provider || 'bKash',
      senderNumber: payment.senderNumber || '',
      transactionId: payment.transactionId || '',
      amount: String(payment.amount || ''),
      note: payment.note || ''
    });
  };

  const handleCloseEdit = () => {
    setEditingPayment(null);
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    if (!editForm.transactionId.trim() || !editForm.amount || !editForm.senderNumber.trim()) {
      return toast.error('Please fill in required fields (TrxID, Amount, Sender Number)');
    }

    try {
      setSubmittingEdit(true);
      const payload = {
        provider: editForm.provider,
        senderNumber: editForm.senderNumber.trim(),
        transactionId: editForm.transactionId.trim(),
        amount: Number(editForm.amount),
        note: editForm.note.trim()
      };

      const res = await api.put(`/billing/my-payments/${editingPayment._id}`, payload);
      if (res.data?.success || res.data?.status === 'ok') {
        toast.success('Payment proof updated successfully!');
        handleCloseEdit();
        fetchPayments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update payment proof');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Filter calculation
  const filteredPayments = myPayments.filter(p => {
    const matchesSearch = 
      (p.purposeTitle || p.purpose || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.transactionId || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.senderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.provider || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCount = myPayments.length;
  const pendingCount = myPayments.filter(p => p.status === 'pending').length;
  const approvedCount = myPayments.filter(p => p.status === 'approved').length;

  return (
    <div className="p-6 md:p-8 w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#5022C3] text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" /> Billing History
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Payment History</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all your payment proof submissions, review admin verification status, and edit pending proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/subscription/payment"
            className="px-5 py-2.5 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Make New Payment
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Submissions</div>
          <div className="text-2xl font-extrabold text-gray-900">{totalCount}</div>
          <div className="text-xs text-gray-500 font-medium">Your total payment submissions</div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Verifications</span>
            {pendingCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>}
          </div>
          <div className="text-2xl font-extrabold text-amber-900">{pendingCount}</div>
          <div className="text-xs text-amber-700 font-medium">Under admin review (Editable)</div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved Payments</div>
          <div className="text-2xl font-extrabold text-emerald-900">{approvedCount}</div>
          <div className="text-xs text-emerald-700 font-medium">Verified & activated</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search purpose, TrxID, sender number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="approved">Approved ({approvedCount})</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Purpose / Product</th>
                <th className="px-6 py-4">Method & TrxID</th>
                <th className="px-6 py-4">Sender Number</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#5022C3]" />
                      <span>Loading payment history...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No payment history records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{p.purposeTitle || p.purpose}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {p.purpose}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <MFSLogo provider={p.provider} className="h-5 w-auto object-contain" />
                      </div>
                      <div className="text-xs font-mono font-semibold text-gray-700 mt-1 bg-gray-100 px-2 py-0.5 rounded inline-block border border-gray-200">
                        {p.transactionId}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">
                      {p.senderNumber}
                    </td>

                    <td className="px-6 py-4 font-extrabold text-gray-900 text-base">
                      ৳ {p.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        p.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                        p.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {p.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {p.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {p.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                        {p.status.toUpperCase()}
                      </span>
                      {p.adminFeedback && (
                        <div className="text-[11px] text-gray-400 mt-1 italic max-w-xs">{p.adminFeedback}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {p.status === 'pending' ? (
                        <button
                          onClick={() => handleEditClick(p)}
                          className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit Proof
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Locked</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Pending Proof Modal */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-600" /> Edit Pending Payment Proof
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update sender number or transaction ID for <strong>{editingPayment.purposeTitle}</strong>.
                </p>
              </div>
              <button onClick={handleCloseEdit} className="text-gray-400 hover:text-gray-600 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Payment Method</label>
                  <select
                    value={editForm.provider}
                    onChange={(e) => setEditForm({ ...editForm, provider: e.target.value })}
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Amount (৳ BDT)</label>
                  <input
                    type="number"
                    required
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sender Number / Account</label>
                <input
                  type="text"
                  required
                  value={editForm.senderNumber}
                  onChange={(e) => setEditForm({ ...editForm, senderNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Transaction ID / Last 6 Digits</label>
                <input
                  type="text"
                  required
                  value={editForm.transactionId}
                  onChange={(e) => setEditForm({ ...editForm, transactionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  💡 Enter full TrxID or last 6 digits of sender number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-7 py-2.5 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5022C3]" />
      </div>
    }>
      <PaymentHistoryContent />
    </Suspense>
  );
}
