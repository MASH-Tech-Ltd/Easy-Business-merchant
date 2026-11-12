'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MoreVertical,
  Users,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Copy,
  PhoneOff,
  X,
  Calendar,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

interface CustomerOrder {
  _id: string;
  orderNumber?: string;
  status: string;
  totalAmount?: number;
  grandTotal?: number;
  createdAt: string;
}

const normalizeBDPhone = (phone: string): string => {
  const digits = (phone || '').replace(/[\s\-()]/g, '').trim();
  if (digits.startsWith('+880')) return '0' + digits.slice(4);
  if (digits.startsWith('880')) return '0' + digits.slice(3);
  return digits;
};

let globalCustomersCache: Customer[] = [];
let globalTotalPages = 0;
let globalTotalRecords = 0;

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>(globalCustomersCache);
  const [loading, setLoading] = useState(globalCustomersCache.length === 0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'orders' | 'spent'>('newest');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(globalTotalRecords);
  const [totalPages, setTotalPages] = useState(globalTotalPages);

  // Actions Menu & Customer Details Modal
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Blocked Phones
  const [blockedPhones, setBlockedPhones] = useState<Set<string>>(new Set());
  const [togglingPhone, setTogglingPhone] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, limit, search]);

  useEffect(() => {
    fetchBlockedPhones();
  }, []);

  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const fetchCustomers = async () => {
    if (customers.length === 0) setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search.trim() && { search: search.trim() }),
      });
      const response = await api
        .get(`/customers/my-customers?${query.toString()}`)
        .catch(() => ({ data: { data: [], meta: { total: 0, totalPages: 0 } } }));

      const newCustomers = response.data.data || [];
      const newTotalRecords = response.data.meta?.total || 0;
      const newTotalPages = response.data.meta?.totalPages || 0;

      globalCustomersCache = newCustomers;
      globalTotalRecords = newTotalRecords;
      globalTotalPages = newTotalPages;

      setCustomers(newCustomers);
      setTotalRecords(newTotalRecords);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedPhones = async () => {
    try {
      const res = await api.get('/blocked-phones?limit=100');
      const list = res.data?.data?.data || [];
      setBlockedPhones(new Set(list.map((b: any) => b.normalizedPhone)));
    } catch {
      // ignore silently
    }
  };

  const handleToggleBlockPhone = async (customer: Customer) => {
    if (!customer.phone) {
      toast.error('No phone number available for this customer');
      return;
    }
    const normalized = normalizeBDPhone(customer.phone);
    const isBlocked = blockedPhones.has(normalized);
    setTogglingPhone(normalized);
    try {
      if (isBlocked) {
        await api.delete(`/blocked-phones/${encodeURIComponent(normalized)}`);
        setBlockedPhones((prev) => {
          const next = new Set(prev);
          next.delete(normalized);
          return next;
        });
        toast.success(`Unblocked ${customer.phone}`);
      } else {
        await api.post('/blocked-phones', {
          phone: customer.phone,
          customerName: customer.name,
          reason: 'Blocked from Customers',
        });
        setBlockedPhones((prev) => new Set(prev).add(normalized));
        toast.success(`Blocked ${customer.phone} for your store`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update block status');
    } finally {
      setTogglingPhone(null);
      setOpenMenuId(null);
    }
  };

  const handleOpenCustomerDetails = async (customer: Customer) => {
    setOpenMenuId(null);
    setSelectedCustomer(customer);
    setCustomerOrders([]);
    setOrdersLoading(true);
    try {
      const searchKey = customer.phone || customer.name;
      const res = await api.get(`/orders/my-orders?search=${encodeURIComponent(searchKey)}&limit=10`);
      const list = res.data?.data?.orders || res.data?.data || [];
      setCustomerOrders(Array.isArray(list) ? list : []);
    } catch {
      setCustomerOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCopyPhone = (phone?: string) => {
    setOpenMenuId(null);
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    toast.success('Phone number copied');
  };

  const sortedCustomers = useMemo(() => {
    const copy = [...customers];
    if (sortBy === 'orders') {
      return copy.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
    }
    if (sortBy === 'spent') {
      return copy.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    }
    return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [customers, sortBy]);

  const renderActionsMenu = (customer: Customer) => {
    const isBlocked = customer.phone ? blockedPhones.has(normalizeBDPhone(customer.phone)) : false;
    return (
      <div
        className="absolute right-0 top-10 z-30 w-52 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 text-left animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => handleOpenCustomerDetails(customer)}
          className="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#5022C3] flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details & Orders
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenMenuId(null);
            router.push('/dashboard/manual-order');
          }}
          className="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#5022C3] flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Create Manual Order
        </button>
        {customer.phone && (
          <>
            <a
              href={`tel:${customer.phone}`}
              onClick={() => setOpenMenuId(null)}
              className="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Customer
            </a>
            <button
              type="button"
              onClick={() => handleCopyPhone(customer.phone)}
              className="w-full px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Phone Number
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={() => handleToggleBlockPhone(customer)}
              disabled={togglingPhone === normalizeBDPhone(customer.phone)}
              className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-50 ${
                isBlocked
                  ? 'text-emerald-700 hover:bg-emerald-50'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <PhoneOff className="w-3.5 h-3.5" />
              {isBlocked ? 'Unblock Phone' : 'Block Phone'}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full font-sans flex flex-col">
      <div className="bg-white border-t border-gray-200 flex-1 flex flex-col min-h-0">
        {/* Filters Bar */}
        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#fcfcfc] shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3] w-full bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-1 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'orders' | 'spent')}
              className="border border-gray-300 rounded-lg text-xs sm:text-sm px-3 py-2 sm:py-2.5 focus:outline-none focus:border-[#5022C3] bg-white text-gray-600 font-medium w-full sm:w-auto cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="orders">Sort by: Most Orders</option>
              <option value="spent">Sort by: Highest Spent</option>
            </select>
          </div>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden flex-1 p-3 sm:p-4 space-y-3 bg-gray-50/50 overflow-y-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mb-4"></div>
                <p>Loading customers...</p>
              </div>
            </div>
          ) : sortedCustomers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-[#5022C3] mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium text-gray-900">No customers found</p>
                <p className="text-sm mt-1">Customers will appear here when they place an order.</p>
              </div>
            </div>
          ) : (
            sortedCustomers.map((customer) => {
              const isBlocked = customer.phone ? blockedPhones.has(normalizeBDPhone(customer.phone)) : false;
              return (
                <div key={customer._id} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5022C3] flex items-center justify-center font-bold text-sm shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 truncate">{customer.name}</span>
                        {isBlocked && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 shrink-0">
                            Blocked
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {new Date(customer.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === customer._id ? null : customer._id);
                        }}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:text-[#5022C3] hover:bg-purple-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === customer._id && renderActionsMenu(customer)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Orders</div>
                      <div className="inline-flex items-center justify-center bg-white border border-gray-200 px-2 py-0.5 rounded-full text-xs font-bold text-gray-700">
                        {customer.totalOrders || 0}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total Spent</div>
                      <div className="font-bold text-gray-900 text-sm">{customer.totalSpent ? customer.totalSpent.toLocaleString() : 0} BDT</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Orders</th>
                <th className="px-6 py-4 font-semibold">Total Spent</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mb-4"></div>
                      <p>Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-[#5022C3] mb-4">
                        <Users className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">No customers found</p>
                      <p className="text-sm mt-1">Customers will appear here when they place an order.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCustomers.map((customer) => {
                  const isBlocked = customer.phone ? blockedPhones.has(normalizeBDPhone(customer.phone)) : false;
                  return (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-[#5022C3] flex items-center justify-center font-bold text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{customer.name}</span>
                            {isBlocked && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                                Blocked
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400" /> {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center justify-center bg-gray-100 px-2.5 py-1 rounded-full text-xs font-bold text-gray-700">
                          {customer.totalOrders || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {customer.totalSpent ? customer.totalSpent.toLocaleString() : 0} BDT
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === customer._id ? null : customer._id);
                            }}
                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:text-[#5022C3] hover:bg-purple-50 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === customer._id && renderActionsMenu(customer)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 mt-auto">
            <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Showing <span className="font-bold text-gray-900">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-bold text-gray-900">{Math.min(page * limit, totalRecords)}</span> of{' '}
              <span className="font-bold text-gray-900">{totalRecords}</span> results
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors shrink-0 ${
                    page === i + 1
                      ? 'bg-[#5022C3] text-white border border-[#5022C3]'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details & Order History Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5022C3] to-[#6D38EB] px-6 py-5 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold tracking-tight">{selectedCustomer.name}</h2>
                    {selectedCustomer.phone && blockedPhones.has(normalizeBDPhone(selectedCustomer.phone)) && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/30 text-red-100 border border-red-300/30 uppercase">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-purple-100 mt-1 flex-wrap">
                    {selectedCustomer.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedCustomer.phone}
                      </span>
                    )}
                    {selectedCustomer.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selectedCustomer.email}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Joined{' '}
                      {new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">{selectedCustomer.totalOrders || 0}</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Spent</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    ৳{(selectedCustomer.totalSpent || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Avg Order</div>
                  <div className="text-xl font-bold text-[#5022C3] mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ৳
                    {selectedCustomer.totalOrders > 0
                      ? Math.round((selectedCustomer.totalSpent || 0) / selectedCustomer.totalOrders).toLocaleString()
                      : 0}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Recent Orders</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(null);
                      router.push('/dashboard/orders');
                    }}
                    className="text-xs font-semibold text-[#5022C3] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Open Orders Page <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="py-8 text-center text-xs text-gray-500">Loading recent orders...</div>
                ) : customerOrders.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500">
                    No matching orders found.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {customerOrders.map((order) => (
                      <div key={order._id} className="px-4 py-3 flex items-center justify-between gap-3 bg-white hover:bg-gray-50/70">
                        <div>
                          <div className="text-xs font-bold text-gray-900">
                            #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-GB')} ·{' '}
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 capitalize">
                            {order.status}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ৳{(order.grandTotal ?? order.totalAmount ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCustomer.phone && (
                  <>
                    <a
                      href={`tel:${selectedCustomer.phone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <button
                      type="button"
                      onClick={() => handleToggleBlockPhone(selectedCustomer)}
                      disabled={togglingPhone === normalizeBDPhone(selectedCustomer.phone)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
                        blockedPhones.has(normalizeBDPhone(selectedCustomer.phone))
                          ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                      }`}
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      {blockedPhones.has(normalizeBDPhone(selectedCustomer.phone)) ? 'Unblock Phone' : 'Block Phone'}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCustomer(null);
                    router.push('/dashboard/manual-order');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#5022C3] text-white hover:bg-[#401b9c] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Manual Order
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
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
