'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  MousePointer,
  TrendingUp,
  Store,
  Users,
  Package,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  ExternalLink,
  Edit,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Link from 'next/link';
import { api } from '@/utils/api';
import { getMerchantProductThumbnailUrl } from '@/utils/imageOptimizer';
import { toast } from 'react-hot-toast';

// Filter presets including user requested: Monthly, Last 30 Days, Last 7 Days, Yearly, Custom Range
const FILTER_RANGES = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Custom Range', value: 'custom' },
];

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-gray-200/90 text-xs min-w-[170px]">
        <div className="font-extrabold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">
          {label}
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={`entry-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 font-bold" style={{ color: entry.color }}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-black text-gray-900 text-sm">
                {Number(entry.value || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ImpressionsPage() {
  const [selectedRange, setSelectedRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Overview stats
  const [stats, setStats] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    ctr: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    totalProducts: 0,
  });

  // Timeline chart data
  const [timelineData, setTimelineData] = useState<any[]>([]);

  // Top products
  const [topImpressions, setTopImpressions] = useState<any[]>([]);
  const [topClicks, setTopClicks] = useState<any[]>([]);

  // Products Table state
  const [products, setProducts] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('impressions');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Fetch overview, timeline & top products
  const fetchOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { range: selectedRange };
      if (selectedRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const [overviewRes, timelineRes, topRes] = await Promise.allSettled([
        api.get('/analytics/merchant/overview', { params }),
        api.get('/analytics/merchant/timeline', { params }),
        api.get('/analytics/merchant/top-products', { params: { ...params, limit: 10 } }),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value.data?.data) {
        const oData = overviewRes.value.data.data;
        setStats(oData.overview || oData);
      }
      if (timelineRes.status === 'fulfilled' && timelineRes.value.data?.data) {
        const tData = timelineRes.value.data.data;
        const arrayData = Array.isArray(tData)
          ? tData
          : Array.isArray(tData.timeline)
            ? tData.timeline
            : [];
        setTimelineData(arrayData);
      }
      if (topRes.status === 'fulfilled' && topRes.value.data?.data) {
        const tpData = topRes.value.data.data;
        setTopImpressions(tpData.topByImpressions || tpData.topImpressed || []);
        setTopClicks(tpData.topByClicks || tpData.topClicked || []);
      }
    } catch (err) {
      console.error('Failed to load impressions telemetry:', err);
      toast.error('Failed to load impression statistics');
    } finally {
      setLoading(false);
    }
  }, [selectedRange, startDate, endDate]);

  // Fetch paginated products table
  const fetchProductsTable = useCallback(async () => {
    setTableLoading(true);
    try {
      const params: any = {
        range: selectedRange,
        page,
        limit,
        sortBy,
        sortOrder,
      };
      if (search) params.search = search;
      if (selectedRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await api.get('/analytics/merchant/products', { params });
      if (res.data) {
        const rawList = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data.data?.products)
            ? res.data.data.products
            : Array.isArray(res.data.data?.data)
              ? res.data.data.data
              : [];
        setProducts(rawList);

        const metaObj = res.data.meta || res.data.data?.pagination || res.data.data?.meta;
        if (metaObj) {
          setPagination({
            page: metaObj.page || 1,
            limit: metaObj.limit || 10,
            total: metaObj.total ?? rawList.length,
            totalPages: metaObj.totalPages || 1,
          });
        }
      }
    } catch (err) {
      console.error('Failed to load product impression table:', err);
    } finally {
      setTableLoading(false);
    }
  }, [selectedRange, startDate, endDate, page, limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  useEffect(() => {
    fetchProductsTable();
  }, [fetchProductsTable]);

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      setPage(1);
      fetchOverviewData();
      fetchProductsTable();
    }
  };

  return (
    <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto overflow-x-hidden font-sans space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Product Impressions & Click Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track genuine customer impressions, clicks, click-through rates, and catalog engagement across your store.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/dashboard/products"
            className="px-3.5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-gray-500" />
            Manage Products
          </Link>
          <button
            onClick={() => {
              fetchOverviewData();
              fetchProductsTable();
            }}
            disabled={loading || tableLoading}
            className="px-3.5 py-2 bg-[#5022C3] hover:bg-[#401a9c] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading || tableLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" /> Period:
          </span>
          {FILTER_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setSelectedRange(r.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedRange === r.value
                  ? 'bg-[#5022C3] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {selectedRange === 'custom' && (
          <form onSubmit={handleCustomDateSubmit} className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#5022C3] bg-white text-gray-800"
              required
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#5022C3] bg-white text-gray-800"
              required
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#5022C3] hover:bg-[#401a9c] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Apply Filter
            </button>
          </form>
        )}
      </div>

      {/* Overview Metric Cards (6 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Impressions */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5022C3] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5022C3] bg-purple-50 px-2 py-0.5 rounded-md">
              Views
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {(stats.totalImpressions || 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Total Impressions</div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MousePointer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Engagement
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {(stats.totalClicks || 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Total Product Clicks</div>
        </div>

        {/* Click-Through Rate (CTR) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Ratio
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {stats.ctr || 0}%
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Average CTR</div>
        </div>

        {/* Total Store Visits */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Store Visits
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {(stats.totalVisits || 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Total Storefront Visits</div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
              Reach
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {(stats.uniqueVisitors || 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Unique Store Visitors</div>
        </div>

        {/* Total Active Catalog Products */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Catalog
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {(stats.totalProducts || 0).toLocaleString()}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">Tracked Products</div>
        </div>
      </div>

      {/* Timeline Chart: Impressions & Clicks Over Time */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Impressions & Clicks Trajectory
            </h2>
            <p className="text-xs text-gray-500">
              Daily customer impressions and clicks recorded for the selected period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#5022C3]">
              <span className="w-3 h-3 rounded-full bg-[#5022C3]" /> Product Impressions
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-600" /> Product Clicks
            </span>
            <span className="flex items-center gap-1.5 text-teal-600">
              <span className="w-3 h-3 rounded-full bg-teal-600" /> Store Visits
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-72 flex items-center justify-center text-gray-400">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mr-3" />
            Loading trajectory...
          </div>
        ) : !Array.isArray(timelineData) || timelineData.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-400 text-sm">
            <Eye className="w-8 h-8 text-gray-300 mb-2" />
            No impressions recorded for this date range yet.
          </div>
        ) : (
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.isArray(timelineData) ? timelineData : []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="impGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5022C3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5022C3" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="impressions" name="Impressions" stroke="#5022C3" strokeWidth={2.5} fillOpacity={1} fill="url(#impGradient)" />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#clickGradient)" />
                <Area type="monotone" dataKey="visits" name="Store Visits" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#visitGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top 10 Most-Impressed & Top 10 Most-Clicked Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Most-Impressed */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Top 10 Most-Impressed Products</h3>
              <p className="text-xs text-gray-500">Products with the highest customer visibility</p>
            </div>
            <span className="text-xs font-bold text-[#5022C3] bg-purple-50 px-2.5 py-1 rounded-lg">
              Impressions
            </span>
          </div>

          {topImpressions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm my-auto">
              No product impressions recorded for this period yet.
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {topImpressions.map((item, idx) => {
                const maxVal = topImpressions[0]?.impressions || 1;
                const pct = Math.min(100, Math.round((item.impressions / maxVal) * 100));
                return (
                  <div
                    key={item.productId || item._id || `top-imp-${idx}`}
                    className="p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex items-center gap-3"
                  >
                    <span className="text-xs font-black text-gray-400 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden">
                      <img
                        src={getMerchantProductThumbnailUrl(item.image) || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {item.title}
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-[#5022C3] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-gray-900">
                        {item.impressions.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {item.clicks} clicks ({item.ctr}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top 10 Most-Clicked */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Top 10 Most-Clicked Products</h3>
              <p className="text-xs text-gray-500">Products that generate the strongest interest</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Clicks
            </span>
          </div>

          {topClicks.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm my-auto">
              No product clicks recorded for this period yet.
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {topClicks.map((item, idx) => {
                const maxVal = topClicks[0]?.clicks || 1;
                const pct = Math.min(100, Math.round((item.clicks / maxVal) * 100));
                return (
                  <div
                    key={item.productId || item._id || `top-clk-${idx}`}
                    className="p-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center gap-3"
                  >
                    <span className="text-xs font-black text-gray-400 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden">
                      <img
                        src={getMerchantProductThumbnailUrl(item.image) || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {item.title}
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-gray-900">
                        {item.clicks.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        {item.impressions} imps ({item.ctr}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Impressions & Clicks Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-gray-50/60">
          <div>
            <h2 className="text-base font-bold text-gray-900">Product Impressions & Clicks Table</h2>
            <p className="text-xs text-gray-500">
              Detailed performance metrics, impression counts, clicks, and conversion rate per product
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProductsTable()}
                className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm w-full bg-white focus:outline-none focus:border-[#5022C3]"
              />
            </div>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg text-xs px-2.5 py-1.5 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#5022C3]"
            >
              <option value="impressions-desc">Sort: Impressions (High to Low)</option>
              <option value="impressions-asc">Sort: Impressions (Low to High)</option>
              <option value="clicks-desc">Sort: Clicks (High to Low)</option>
              <option value="clicks-asc">Sort: Clicks (Low to High)</option>
              <option value="ctr-desc">Sort: CTR (High to Low)</option>
              <option value="ctr-asc">Sort: CTR (Low to High)</option>
              <option value="title-asc">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Mobile View (Cards) for XS and Small Devices (< md) */}
        <div className="md:hidden divide-y divide-gray-100">
          {tableLoading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-3" />
              Loading product telemetry...
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-gray-400 p-4">
              <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              No products recorded matching the selected filter.
            </div>
          ) : (
            products.map((prod) => (
              <div key={prod.productId || prod._id} className="p-3.5 space-y-3 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden">
                    <img
                      src={getMerchantProductThumbnailUrl(prod.image) || '/placeholder.png'}
                      alt={prod.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
                      {prod.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {prod.categoryName || 'General'}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        ৳{(prod.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Metric Pills: Impressions, Clicks, CTR */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-100">
                  <div className="bg-purple-50/70 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-purple-700 uppercase">Impressions</div>
                    <div className="text-sm font-black text-gray-900 mt-0.5">
                      {(prod.impressions || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-50/70 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-blue-700 uppercase">Clicks</div>
                    <div className="text-sm font-black text-blue-600 mt-0.5">
                      {(prod.clicks || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-xl">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">CTR</div>
                    <div className="text-sm font-black text-emerald-700 mt-0.5">
                      {prod.ctr || 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <Link
                    href={`/dashboard/products/${prod.productId || prod._id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-gray-500" />
                    Edit Product
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3.5 font-bold">Product</th>
                <th className="px-6 py-3.5 font-bold">Category</th>
                <th className="px-6 py-3.5 font-bold">Impressions</th>
                <th className="px-6 py-3.5 font-bold">Clicks</th>
                <th className="px-6 py-3.5 font-bold">CTR</th>
                <th className="px-6 py-3.5 font-bold">Price</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {tableLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-3" />
                    Loading product telemetry...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    No products recorded matching the selected filter.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.productId || prod._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-200 p-0.5 shrink-0 overflow-hidden">
                          <img
                            src={getMerchantProductThumbnailUrl(prod.image) || '/placeholder.png'}
                            alt={prod.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-xs sm:max-w-md">
                          {prod.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                        {prod.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-900">
                      {(prod.impressions || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-blue-600">
                      {(prod.clicks || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          (prod.ctr || 0) >= 5
                            ? 'bg-green-100 text-green-800'
                            : (prod.ctr || 0) >= 2
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {prod.ctr || 0}%
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-900 text-xs">
                      ৳{(prod.price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/dashboard/products/${prod.productId || prod._id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#5022C3] transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!tableLoading && pagination.total > 0 && (
          <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing{' '}
              <span className="font-bold text-gray-900">
                {(page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-gray-900">
                {Math.min(page * limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-bold text-gray-900">{pagination.total}</span>{' '}
              products
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-gray-800">
                Page {page} of {pagination.totalPages || 1}
              </span>
              <button
                disabled={page >= (pagination.totalPages || 1)}
                onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

