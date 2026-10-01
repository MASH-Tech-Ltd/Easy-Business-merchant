'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { 
  CreditCard, 
  Send, 
  Copy, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Loader2, 
  FileText, 
  Pencil,
  Search,
  Filter,
  PlusCircle
} from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { billingCacheStore } from '@/utils/billingCache';
import { MFSLogo } from '@/components/MFSLogo';

interface PlatformAccount {
  id: string;
  provider: string;
  type: string;
  accountNumber: string;
  accountName?: string;
  bankName?: string;
  branchName?: string;
  instructions: string;
  isActive: boolean;
}

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

function PlatformPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const purposeParam = searchParams.get('purpose');
  const titleParam = searchParams.get('title');
  const amountParam = searchParams.get('amount');
  const tabParam = searchParams.get('tab');

  // Default tab is 'history' unless requested to pay via query params
  const [activeTab, setActiveTab] = useState<'history' | 'manual' | 'gateways'>(() => {
    if (purposeParam || titleParam || amountParam || tabParam === 'manual') return 'manual';
    if (tabParam === 'gateways') return 'gateways';
    return 'history';
  });

  const hasCache = billingCacheStore.platformAccounts !== null || billingCacheStore.myPayments !== null;

  const [accounts, setAccounts] = useState<PlatformAccount[]>(billingCacheStore.platformAccounts || []);
  const [myPayments, setMyPayments] = useState<PaymentSubmission[]>(billingCacheStore.myPayments || []);
  const [loading, setLoading] = useState(!hasCache);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // History search and filter
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    purpose: 'addon',
    purposeTitle: 'Add-on Purchase',
    provider: 'bKash',
    amount: '',
    senderNumber: '',
    transactionId: '',
    note: ''
  });

  const { socket } = useSocket();

  useEffect(() => {
    if (purposeParam || titleParam || amountParam) {
      setForm(prev => ({
        ...prev,
        purpose: purposeParam || prev.purpose,
        purposeTitle: titleParam || prev.purposeTitle,
        amount: amountParam || prev.amount,
      }));
      setActiveTab('manual');
    }
  }, [searchParams, purposeParam, titleParam, amountParam]);

  const fetchData = async () => {
    try {
      if (!hasCache) {
        setLoading(true);
      }
      const [settingsRes, paymentsRes] = await Promise.all([
        api.get('/billing/platform-payment-settings').catch(() => null),
        api.get('/billing/my-payments').catch(() => null)
      ]);

      if (settingsRes?.data?.data?.accounts) {
        const activeAccounts = settingsRes.data.data.accounts.filter((a: PlatformAccount) => a.isActive);
        setAccounts(activeAccounts);
        billingCacheStore.platformAccounts = activeAccounts;
      }
      if (paymentsRes?.data?.data) {
        setMyPayments(paymentsRes.data.data);
        billingCacheStore.myPayments = paymentsRes.data.data;
      }
    } catch (error) {
      console.error('Failed to load payment info', error);
      toast.error('Failed to load platform payment options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for socket notifications
  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => fetchData();
    socket.on('new_notification', handleRefresh);
    socket.on('refresh_subscriptions', handleRefresh);
    return () => {
      socket.off('new_notification', handleRefresh);
      socket.off('refresh_subscriptions', handleRefresh);
    };
  }, [socket]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Number copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditClick = (payment: PaymentSubmission) => {
    if (payment.status !== 'pending') {
      return toast.error('Only pending payment proofs can be edited.');
    }
    setEditingId(payment._id);
    setForm({
      purpose: payment.purpose || 'addon',
      purposeTitle: payment.purposeTitle || 'Platform Payment',
      provider: payment.provider || 'bKash',
      amount: String(payment.amount),
      senderNumber: payment.senderNumber,
      transactionId: payment.transactionId,
      note: payment.note || ''
    });
    setActiveTab('manual');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      purpose: 'addon',
      purposeTitle: 'Add-on Purchase',
      provider: accounts[0]?.provider || 'bKash',
      amount: '',
      senderNumber: '',
      transactionId: '',
      note: ''
    });
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.transactionId.trim() || !form.amount || !form.senderNumber.trim()) {
      return toast.error('Please fill in all required fields (TrxID, Amount, Sender Number)');
    }

    try {
      setSubmitting(true);
      const payload = {
        purpose: form.purpose,
        purposeTitle: form.purposeTitle,
        amount: Number(form.amount),
        provider: form.provider,
        senderNumber: form.senderNumber.trim(),
        transactionId: form.transactionId.trim(),
        note: form.note.trim()
      };

      if (editingId) {
        const res = await api.put(`/billing/my-payments/${editingId}`, payload);
        if (res.data?.success || res.data?.status === 'ok') {
          toast.success('Payment proof updated successfully!');
          handleCancelEdit();
          fetchData();
          setActiveTab('history');
        }
      } else {
        const res = await api.post('/billing/submit-payment', payload);
        if (res.data?.success || res.data?.status === 'ok') {
          toast.success('Payment proof submitted successfully! Admin will verify shortly.');
          handleCancelEdit();
          fetchData();
          setActiveTab('history');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered payments for History tab
  const filteredPayments = myPayments.filter(p => {
    const matchesSearch = 
      (p.purposeTitle || p.purpose || '').toLowerCase().includes(historySearch.toLowerCase()) ||
      (p.transactionId || '').toLowerCase().includes(historySearch.toLowerCase()) ||
      (p.senderNumber || '').toLowerCase().includes(historySearch.toLowerCase()) ||
      (p.provider || '').toLowerCase().includes(historySearch.toLowerCase());

    const matchesStatus = historyFilterStatus === 'all' || p.status === historyFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCount = myPayments.length;
  const pendingCount = myPayments.filter(p => p.status === 'pending').length;
  const approvedCount = myPayments.filter(p => p.status === 'approved').length;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5022C3]" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#5022C3] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Platform Billing & Payments
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payment Verification Center</h1>
          <p className="text-gray-500 text-sm mt-1">Track payment history, submit new payment proofs, or view online gateways.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 self-start md:self-auto gap-1">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-[#5022C3] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Payment History {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'manual' ? 'bg-white text-[#5022C3] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Make Payment & Transfer
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'gateways' ? 'bg-white text-[#5022C3] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4 text-[#5022C3]" /> Online Gateways
          </button>
        </div>
      </div>

      {/* TAB 1: INITIAL PAYMENT HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Summary Cards */}
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
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={historyFilterStatus}
                  onChange={(e) => setHistoryFilterStatus(e.target.value as any)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                >
                  <option value="all">All Statuses ({totalCount})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                  <option value="approved">Approved ({approvedCount})</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={() => setActiveTab('manual')}
                className="px-4 py-2 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Submit New Payment
              </button>
            </div>
          </div>

          {/* Dedicated Payment History Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" /> My Payment Verification History
              </h2>
              <span className="text-xs text-gray-500 font-medium">{filteredPayments.length} records</span>
            </div>

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
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No payment submissions found. Click <strong>Submit New Payment</strong> to register a transaction.
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
        </div>
      )}

      {/* TAB 2: MAKE MANUAL PAYMENT VIEW */}
      {activeTab === 'manual' && (
        <div className="space-y-8">
          {/* Official Platform Payment Numbers Grid */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Platform Official Payment Numbers
            </h2>
            <p className="text-xs text-gray-500 mb-4">Send money to any of the official admin numbers below, then submit your Transaction ID (TrxID).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {accounts.map((acc) => (
                <div key={acc.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-purple-300 transition-all space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <MFSLogo provider={acc.provider} className="h-7 w-auto object-contain" />
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {acc.type}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Account Number:</div>
                    <div className="flex items-center justify-between bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-300 shadow-xs">
                      <span className="font-extrabold text-slate-900 text-lg tracking-wider font-sans">{acc.accountNumber}</span>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, acc.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#5022C3] hover:bg-purple-50 transition-colors"
                        title="Copy Number"
                      >
                        {copiedId === acc.id ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {acc.accountName && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-gray-400">Account Name:</span> {acc.accountName}
                    </div>
                  )}

                  {acc.bankName && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium text-gray-400">Bank:</span> {acc.bankName} ({acc.branchName || ''})
                    </div>
                  )}

                  {acc.instructions && (
                    <p className="text-[11px] text-gray-500 border-t border-gray-100 pt-2.5 leading-relaxed">
                      💡 {acc.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Verification Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#5022C3]" /> {editingId ? 'Edit Pending Payment Proof' : 'Submit Payment Verification (TrxID)'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId ? 'Update your sender number or transaction ID before admin review.' : 'Submit your payment details for instant admin verification & activation.'}
                </p>
              </div>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {editingId && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs font-medium flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>You are editing a pending submission. Once admin approves it, editing will be locked.</span>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Payment Purpose</label>
                  <select
                    value={form.purpose}
                    onChange={(e) => {
                      const title = e.target.value === 'addon' ? 'Add-on Purchase' : e.target.value === 'package' ? 'Plan Upgrade' : 'Renewal';
                      setForm({ ...form, purpose: e.target.value, purposeTitle: title });
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                  >
                    <option value="addon">Add-on Purchase</option>
                    <option value="package">Plan Upgrade / Subscription</option>
                    <option value="renewal">Subscription Renewal</option>
                    <option value="other">Other Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Payment Method Used</label>
                  <select
                    value={form.provider}
                    onChange={(e) => setForm({ ...form, provider: e.target.value })}
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
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Amount (৳ BDT) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Sender Number / Account <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01712345678"
                    value={form.senderNumber}
                    onChange={(e) => setForm({ ...form, senderNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TRX9B87A65C"
                    value={form.transactionId}
                    onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    💡 Enter full TrxID (e.g. TRX98234) or last 6 digits of sender number (e.g. 567890).
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Notes / Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paid for Courier Automation Add-on"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5022C3]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-8 rounded-xl bg-[#5022C3] hover:bg-[#401a9b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {editingId ? 'Update Payment Proof' : 'Submit Payment Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ONLINE GATEWAYS VIEW */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute right-[-5%] top-[-20%] w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-2xl relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" /> Automated Checkout Vision
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Instant Gateway Payments</h2>
              <p className="text-purple-200 text-sm leading-relaxed">
                Our platform architecture is built for instant automated tokenized checkouts. When enabled, payments for subscriptions and add-ons will activate automatically without manual admin verification!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* bKash Checkout */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-pink-300 transition-all">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xl">
                  bK
                </div>
                <h3 className="font-bold text-gray-900 text-base">bKash Direct Gateway</h3>
                <p className="text-xs text-gray-500">Tokenized bKash Popup Checkout with 1-click pin authorization.</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Upcoming
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* EPS Easy Payment System */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  EPS
                </div>
                <h3 className="font-bold text-gray-900 text-base">EPS (Easy Payment System)</h3>
                <p className="text-xs text-gray-500">Fast online payment gateway for Internet Banking, Mobile Banking & Cards.</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Upcoming
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Nagad Direct */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-orange-300 transition-all">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl">
                  NG
                </div>
                <h3 className="font-bold text-gray-900 text-base">Nagad Online Payment</h3>
                <p className="text-xs text-gray-500">Instant merchant API payment integration with OTP verification.</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Upcoming
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Stripe Cards */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Cards</h3>
                <p className="text-xs text-gray-500">Visa, Mastercard, Amex Pay.</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Upcoming
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlatformPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5022C3]" />
      </div>
    }>
      <PlatformPaymentContent />
    </Suspense>
  );
}
