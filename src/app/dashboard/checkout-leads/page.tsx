'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, ChevronLeft, ChevronRight, ShieldCheck, ShoppingCart, CheckCircle, TrendingUp } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

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
  status: string;
  createdAt: string;
  updatedAt: string;
}

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

  // Modals
  const [fraudErrorModal, setFraudErrorModal] = useState<{show: boolean, message: string} | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [page, search]);

  useEffect(() => {
    fetchStats();
  }, []);

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
        <div className="p-6 border-b border-gray-200 bg-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Checkout Recovery Stats</h2>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5022C3] cursor-pointer"
            >
              <option value="allTime">All Time</option>
              <option value="thisYear">This Year</option>
              <option value="thisMonth">This Month</option>
              <option value="thisWeek">This Week</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#5022C3]">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-purple-900">Abandoned Checkouts</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : stats?.[timeframe]?.abandoned || 0}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-emerald-900">Recovered Checkouts</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {statsLoading ? '-' : stats?.[timeframe]?.completed || 0}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-blue-900">Recovery Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
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
          <div className="bg-orange-50 border-b border-orange-200 p-3 px-6 flex items-center justify-center gap-3 shrink-0">
            <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-sm text-orange-800 font-medium text-center">
              You have reached your Abandoned Checkout limit. You will not receive new leads until you activate the add-on again.
            </p>
            <button 
              onClick={() => router.push('/dashboard/subscription/addons')}
              className="text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Increase Limit
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-bold">Customer Name</th>
                <th className="px-6 py-4 font-bold">Contact Info</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Time Tracked</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-500">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-4"></div>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
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
    </div>
  );
}
