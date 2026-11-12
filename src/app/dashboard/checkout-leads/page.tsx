'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, ChevronLeft, ChevronRight, ShieldCheck, ShoppingCart, CheckCircle, TrendingUp, PhoneOff, Package, Eye, X, Phone, Mail, MapPin, Copy, Clock } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface CheckoutLeadItem {
  productId?: string;
  title: string;
  price?: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

interface CheckoutLead {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  division?: string;
  district?: string;
  upazila?: string;
  items?: CheckoutLeadItem[];
  subTotal?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const normalizeBDPhone = (phone: string): string => {
  const digits = (phone || '').replace(/[\s\-()]/g, '').trim();
  if (digits.startsWith('+880')) return '0' + digits.slice(4);
  if (digits.startsWith('880')) return '0' + digits.slice(3);
  return digits;
};

export default function CheckoutLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<CheckoutLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  
  const [search, setSearch] = useState('');

  // Stats
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('allTime');

  // Modals & Phone Blocklist
  const [fraudErrorModal, setFraudErrorModal] = useState<{show: boolean, message: string} | null>(null);
  const [selectedLead, setSelectedLead] = useState<CheckoutLead | null>(null);
  const [blockedPhones, setBlockedPhones] = useState<Set<string>>(new Set());
  const [togglingPhone, setTogglingPhone] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  useEffect(() => {
    fetchStats();
    fetchBlockedPhones();
  }, []);

  const fetchBlockedPhones = async () => {
    try {
      const res = await api.get('/blocked-phones', { params: { page: 1, limit: 100 } });
      const list = res.data?.data?.data || [];
      setBlockedPhones(new Set(list.map((b: any) => b.normalizedPhone)));
    } catch {
      // ignore silently
    }
  };

  const handleToggleBlockPhone = async (lead: CheckoutLead) => {
    if (!lead.phone) return;
    const norm = normalizeBDPhone(lead.phone);
    setTogglingPhone(norm);
    try {
      if (blockedPhones.has(norm)) {
        await api.delete(`/blocked-phones/${encodeURIComponent(norm)}`);
        setBlockedPhones((prev) => {
          const next = new Set(prev);
          next.delete(norm);
          return next;
        });
        toast.success(`${lead.phone} unblocked`);
      } else {
        const customerName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
        await api.post('/blocked-phones', {
          phone: lead.phone,
          customerName,
          reason: 'Blocked from Checkout Leads',
        });
        setBlockedPhones((prev) => new Set(prev).add(norm));
        toast.success(`${lead.phone} blocked for your store`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update phone block status');
    } finally {
      setTogglingPhone(null);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get('/checkout-leads/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/checkout-leads/my-leads', {
        params: { page, limit, search }
      });
      const newLeads = response.data.data?.data || [];
      const newTotalPages = response.data.data?.meta?.totalPages || 1;
      const newTotalRecords = response.data.data?.meta?.total || 0;
      const newLimitReached = response.data.data?.meta?.limitReached || false;

      setLeads(newLeads);
      setTotalPages(newTotalPages);
      setTotalRecords(newTotalRecords);
      setLimitReached(newLimitReached);
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 402) {
        setFraudErrorModal({
          show: true,
          message: error.response?.data?.message || 'Abandoned Checkout add-on is not active or limit reached for this subscription.'
        });
      } else {
        toast.error('Failed to fetch checkout leads');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full font-sans flex flex-col">
      <div className="bg-white border-t border-gray-200 flex-1 flex flex-col min-h-0">
        
        {/* Stats Section */}
        <div className="p-3.5 sm:p-6 border-b border-gray-200 bg-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Checkout Recovery Stats</h2>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5022C3] cursor-pointer"
            >
              <option value="allTime">All Time</option>
              <option value="thisYear">This Year</option>
              <option value="thisMonth">This Month</option>
              <option value="thisWeek">This Week</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#5022C3] shrink-0">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-purple-900 leading-tight">Abandoned Checkouts</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 pl-1">
                {statsLoading ? '-' : stats?.[timeframe]?.abandoned || 0}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-emerald-900 leading-tight">Recovered Checkouts</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 pl-1">
                {statsLoading ? '-' : stats?.[timeframe]?.completed || 0}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-3 sm:p-4 shadow-sm col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[10px] sm:text-sm font-medium text-blue-900 leading-tight">Recovery Rate</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 pl-1">
                {statsLoading ? '-' : 
                  (stats?.[timeframe]?.abandoned + stats?.[timeframe]?.completed > 0) 
                  ? Math.round((stats?.[timeframe]?.completed / (stats?.[timeframe]?.abandoned + stats?.[timeframe]?.completed)) * 100) + '%' 
                  : '0%'
                }
              </div>
            </div>
          </div>
        </div>
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#fcfcfc] shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3] w-full bg-white transition-all"
            />
          </div>
        </div>

        {/* Limit Warning Banner */}
        {limitReached && (
          <div className="bg-orange-50 border-b border-orange-200 p-3 px-6 flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0">
            <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-sm text-orange-800 font-medium text-center">
              You have reached your Abandoned Checkout limit. You will not receive new leads until you activate the add-on again.
            </p>
            <button 
              onClick={() => router.push('/dashboard/subscription/addons')}
              className="text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer mt-2 sm:mt-0"
            >
              Increase Limit
            </button>
          </div>
        )}

        {/* Mobile View (Cards) */}
        <div className="md:hidden flex-1 p-3 space-y-3 bg-gray-50/50 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-4"></div>
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-[#5022C3] mb-3 mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">No leads found</h3>
              <p className="text-gray-500 text-xs">Customers who abandon checkout will appear here.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead._id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col gap-2 relative">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-bold text-gray-900 text-sm line-clamp-1">{(lead.firstName || '') + ' ' + (lead.lastName || '')}</div>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                    lead.status === 'recovered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <div>
                  {lead.phone && <div className="text-xs text-gray-700 font-medium">{lead.phone}</div>}
                  {lead.email && <div className="text-[10px] text-gray-500">{lead.email}</div>}
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-1">
                  {lead.address}
                  {lead.upazila && `, ${lead.upazila}`}
                  {lead.district && `, ${lead.district}`}
                  {lead.division && `, ${lead.division}`}
                </div>
                {lead.items && lead.items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedLead(lead)}
                    className="w-full text-left bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-lg p-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-white border border-purple-100 flex items-center justify-center text-[#5022C3] shrink-0">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {lead.items.length} {lead.items.length === 1 ? 'Product' : 'Products'}
                          {typeof lead.subTotal === 'number' && lead.subTotal > 0 ? ` · ৳${lead.subTotal.toLocaleString()}` : ''}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">{lead.items[0]?.title}</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5022C3] shrink-0">
                      <Eye className="w-3.5 h-3.5" /> View
                    </span>
                  </button>
                )}
                <div className="mt-1 flex justify-between items-center pt-2 border-t border-gray-50 gap-2">
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Time Tracked</div>
                    <div className="text-xs font-medium text-gray-900">
                      {new Date(lead.updatedAt).toLocaleDateString('en-GB')} {new Date(lead.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  {lead.phone && (
                    <button
                      onClick={() => handleToggleBlockPhone(lead)}
                      disabled={togglingPhone === normalizeBDPhone(lead.phone)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                        blockedPhones.has(normalizeBDPhone(lead.phone))
                          ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                      }`}
                    >
                      <PhoneOff className="w-3 h-3" />
                      {blockedPhones.has(normalizeBDPhone(lead.phone)) ? 'Blocked' : 'Block'}
                    </button>
                  )}
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
                <th className="px-6 py-4 font-bold">Customer Name</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Products</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Time Tracked</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-500">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-4"></div>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-[#5022C3] mb-4 mx-auto">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No leads found</h3>
                    <p className="text-gray-500 text-sm">Customers who abandon checkout will appear here.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{(lead.firstName || '') + ' ' + (lead.lastName || '')}</div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.phone && <div className="text-sm text-gray-700 font-medium">{lead.phone}</div>}
                      {lead.email && <div className="text-xs text-gray-500 mt-0.5">{lead.email}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-[260px]">
                      {lead.items && lead.items.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl border border-gray-200/80 bg-gray-50/70 hover:bg-purple-50/60 hover:border-[#5022C3]/35 transition-all cursor-pointer group/btn"
                        >
                          {lead.items[0]?.image ? (
                            <img
                              src={lead.items[0].image}
                              alt={lead.items[0].title}
                              className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-purple-100 text-[#5022C3] flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-gray-900 truncate group-hover/btn:text-[#5022C3] transition-colors">
                              {lead.items[0]?.title}
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-gray-700">
                                {lead.items.length} {lead.items.length === 1 ? 'item' : 'items'}
                              </span>
                              {typeof lead.subTotal === 'number' && lead.subTotal > 0 && (
                                <span>· ৳{lead.subTotal.toLocaleString()}</span>
                              )}
                              <span className="text-[#5022C3] font-semibold inline-flex items-center gap-0.5 ml-auto">
                                <Eye className="w-3 h-3" /> View
                              </span>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No items recorded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-sm text-gray-700 truncate" title={lead.address}>
                        {lead.address}
                        {lead.upazila && `, ${lead.upazila}`}
                        {lead.district && `, ${lead.district}`}
                        {lead.division && `, ${lead.division}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{new Date(lead.updatedAt).toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-gray-500">{new Date(lead.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200 capitalize">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {lead.phone ? (
                        <button
                          onClick={() => handleToggleBlockPhone(lead)}
                          disabled={togglingPhone === normalizeBDPhone(lead.phone)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                            blockedPhones.has(normalizeBDPhone(lead.phone))
                              ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                          }`}
                        >
                          <PhoneOff className="w-3.5 h-3.5" />
                          {blockedPhones.has(normalizeBDPhone(lead.phone)) ? 'Blocked' : 'Block Phone'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && leads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 mt-auto">
            <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Showing <span className="font-bold text-gray-900">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min(page * limit, totalRecords)}</span> of <span className="font-bold text-gray-900">{totalRecords}</span> results
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                if (totalPages > 10) {
                  if (i !== 0 && i !== totalPages - 1 && (i < page - 3 || i > page + 1)) {
                    if (i === page - 4 || i === page + 2) return <span key={i} className="px-1 flex items-end">...</span>;
                    return null;
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                      page === i + 1 
                        ? 'bg-[#5022C3] border-[#5022C3] text-white shadow-sm' 
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add-on Error Modal */}
      {fraudErrorModal?.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-center">
            <div className="p-8">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Action Required</h2>
              <p className="text-sm text-gray-500 mb-6">
                {fraudErrorModal.message}
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Go Back
              </button>
              <button 
                onClick={() => {
                  setFraudErrorModal(null);
                  router.push('/dashboard/subscription/addons');
                }}
                className="flex-1 py-3 text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401b9c] rounded-xl transition-colors shadow-md"
              >
                Purchase Add-on
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Premium Lead & Products Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-[#5022C3] to-[#6D38EB] px-6 py-5 text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg font-bold tracking-tight">
                    {`${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim() || 'Guest Customer'}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    selectedLead.status === 'completed'
                      ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30'
                      : 'bg-amber-400/20 text-amber-100 border border-amber-300/30'
                  }`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-purple-100 mt-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Last updated {new Date(selectedLead.updatedAt).toLocaleDateString('en-GB')} at{' '}
                    {new Date(selectedLead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Customer Contact & Shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Contact Information</div>
                  {selectedLead.phone ? (
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-[#5022C3] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#5022C3]" />
                        {selectedLead.phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedLead.phone || '');
                          toast.success('Phone number copied');
                        }}
                        className="text-xs text-gray-400 hover:text-[#5022C3] p-1 rounded cursor-pointer"
                        title="Copy phone"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No phone provided</div>
                  )}
                  {selectedLead.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{selectedLead.email}</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Delivery Location</div>
                  <div className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#5022C3] shrink-0 mt-0.5" />
                    <span>
                      {[selectedLead.address, selectedLead.upazila, selectedLead.district, selectedLead.division]
                        .filter(Boolean)
                        .join(', ') || 'No address recorded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#5022C3]" />
                    Cart Products ({selectedLead.items?.length || 0})
                  </h3>
                  {typeof selectedLead.subTotal === 'number' && selectedLead.subTotal > 0 && (
                    <span className="text-xs font-bold text-[#5022C3] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                      Subtotal: ৳{selectedLead.subTotal.toLocaleString()}
                    </span>
                  )}
                </div>

                {selectedLead.items && selectedLead.items.length > 0 ? (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white">
                    {selectedLead.items.map((item, idx) => {
                      const lineTotal = (item.price || 0) * (item.quantity || 1);
                      return (
                        <div key={idx} className="p-3.5 flex items-center gap-3.5 hover:bg-gray-50/60 transition-colors">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#5022C3] flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-gray-900 leading-snug">{item.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {item.color && (
                                <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                                  Color: {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                                  Size: {item.size}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {item.price ? `৳${item.price.toLocaleString()} × ${item.quantity}` : `Qty: ${item.quantity}`}
                              </span>
                            </div>
                          </div>
                          {lineTotal > 0 && (
                            <div className="text-sm font-bold text-gray-900 shrink-0">
                              ৳{lineTotal.toLocaleString()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500">
                    No cart items recorded for this lead.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedLead.phone && (
                  <>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Customer
                    </a>
                    <button
                      type="button"
                      onClick={() => handleToggleBlockPhone(selectedLead)}
                      disabled={togglingPhone === normalizeBDPhone(selectedLead.phone)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                        blockedPhones.has(normalizeBDPhone(selectedLead.phone))
                          ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                      }`}
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      {blockedPhones.has(normalizeBDPhone(selectedLead.phone)) ? 'Unblock Phone' : 'Block Phone'}
                    </button>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
