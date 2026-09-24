'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Package, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { api } from '@/utils/api';
// Global cache to persist data during client-side navigation
const globalStatsCache: Record<number, any> = {};

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState(30);
  const [loading, setLoading] = useState(!globalStatsCache[30]);
  const [stats, setStats] = useState(globalStatsCache[30] || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 3.2,
    chartData: [],
    todaySales: 0,
    topProducts: [],
    salesByCategory: [],
    recentOrders: [],
    orderStatusBreakdown: [],
    averageOrderValue: 0,
    topCustomers: []
  });

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71', '#1ABC9C'];
  const STATUS_COLORS = { pending: '#F59E0B', confirmed: '#3B82F6', shipped: '#8B5CF6', delivered: '#10B981', cancelled: '#EF4444' };

  useEffect(() => {
    // If we have cached data for this timeframe, show it instantly while we refetch behind the scenes
    if (globalStatsCache[timeframe]) {
      setStats(globalStatsCache[timeframe]);
    }
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    // Only show loading opacity if we don't have cached data for this timeframe
    if (!globalStatsCache[timeframe]) {
      setLoading(true);
    }
    
    try {
      const response = await api.get('/analytics/dashboard-stats', {
        params: { days: timeframe }
      });
      if (response.data?.data) {
        const newData = {
          totalRevenue: response.data.data.totalRevenue || 0,
          totalOrders: response.data.data.totalOrders || 0,
          totalCustomers: response.data.data.totalCustomers || 0,
          conversionRate: response.data.data.conversionRate || 3.2,
          chartData: response.data.data.chartData || [],
          todaySales: response.data.data.todaySales || 0,
          topProducts: response.data.data.topProducts || [],
          salesByCategory: response.data.data.salesByCategory || [],
          recentOrders: response.data.data.recentOrders || [],
          orderStatusBreakdown: response.data.data.orderStatusBreakdown || [],
          averageOrderValue: response.data.data.averageOrderValue || 0,
          topCustomers: response.data.data.topCustomers || []
        };
        globalStatsCache[timeframe] = newData;
        setStats(newData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-[1800px] mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Store Insights</h2>
          <p className="text-sm text-gray-500">Monitor your revenue and track business growth in real-time</p>
        </div>
        <select 
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white text-gray-700 font-medium cursor-pointer focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3] w-full sm:w-auto shadow-sm transition-all"
          value={timeframe}
          onChange={(e) => setTimeframe(Number(e.target.value))}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 12 months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Today's Sales</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{stats.todaySales.toLocaleString()} BDT</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-orange-600 truncate">
            <span className="truncate">For today only</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="absolute top-4 right-4 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-green-50 text-green-700">
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +14.5%
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Total Revenue</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{stats.totalRevenue.toLocaleString()} BDT</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-green-600 truncate">
            <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">For selected period</span>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="absolute top-4 right-4 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-green-50 text-green-700">
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +5.2%
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Total Orders</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{stats.totalOrders}</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-green-600 truncate">
            <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">For selected period</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="absolute top-3 right-3 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-red-50 text-red-700">
            <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> -1.1%
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Total Customers</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{stats.totalCustomers}</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-green-600 truncate">
            <TrendingUp className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">Overall registered</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="absolute top-4 right-4 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-green-50 text-green-700">
            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +0.8%
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Conversion Rate</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{stats.conversionRate}%</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-gray-400 truncate">
            <span className="truncate">Average rate</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">Average Order Value</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 truncate">{Math.round(stats.averageOrderValue).toLocaleString()} BDT</div>
          <div className="flex items-center text-[10px] sm:text-xs font-medium text-indigo-600 truncate">
            <span className="truncate">Per order avg</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Revenue Over Time</h3>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} tickFormatter={(value) => `${value.toLocaleString()}`} />
                <Tooltip cursor={{stroke: '#FF6B6B', strokeWidth: 1, strokeDasharray: '4 4', fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} formatter={(value: any) => [Number(value || 0).toLocaleString() + ' BDT', 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B6B" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{r: 6, fill: '#FF6B6B', stroke: '#fff', strokeWidth: 2}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Orders Summary</h3>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8200da" stopOpacity={1} />
                    <stop offset="100%" stopColor="#b249f8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="orders" fill="url(#colorOrders)" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Order Status Breakdown</h3>
          <div className="flex flex-col sm:flex-row items-center h-auto sm:h-48 md:h-56 py-2 sm:py-0">
            <div className="relative w-full sm:w-1/2 h-48 sm:h-full mb-4 sm:mb-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.orderStatusBreakdown} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={2} dataKey="value" stroke="none">
                    {stats.orderStatusBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={(STATUS_COLORS as any)[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} formatter={(value: any) => [`${value} orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">Total Orders</span>
                <span className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{stats.totalOrders}</span>
              </div>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-2 pt-4 sm:pt-0 sm:pl-4 md:pl-6 border-t sm:border-t-0 sm:border-l border-gray-100">
              {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: (STATUS_COLORS as any)[status] || '#ccc' }}></div>
                  <span className="capitalize text-xs text-gray-600 font-medium truncate">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className={`mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-4 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Top Selling Products</h3>
          <div className="flex flex-col gap-3">
            {stats.topProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden shrink-0">
                    {(product.images && product.images[0]?.secure_url) || product.image?.secure_url ? (
                      <img src={(product.images && product.images[0]?.secure_url) || product.image?.secure_url} alt={product.title || product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingBag size={20} /></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{product.title || product.name || 'Unknown Product'}</h4>
                    <p className="text-xs text-gray-500">{(product.discountedPrice || product.price || 0).toLocaleString()} BDT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#5022C3]">{product.salesCount} sold</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No top selling products yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Sales by Category</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <YAxis dataKey="name" type="category" width={110} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 11, fontWeight: 500}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}} 
                  contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value: any) => [`${value} sold`, 'Sales']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {stats.salesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col col-span-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Top Customers</h3>
          <div className="flex flex-col gap-3">
            {stats.topCustomers.map((customer: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{customer.name || 'Guest User'}</h4>
                    <p className="text-xs text-gray-500">{customer._id}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-bold text-[#5022C3]">{customer.totalSpent.toLocaleString()} BDT</p>
                  <p className="text-xs text-gray-500">{customer.ordersCount} orders</p>
                </div>
              </div>
            ))}
            {stats.topCustomers.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No customers found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className={`mt-4 sm:mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-gray-900">Recent Orders</h3>
          <button className="text-sm font-medium text-[#5022C3] hover:text-[#3f199b] transition-colors">
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-semibold text-gray-900">#{order.orderId || order._id?.toString().slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{order.customerName || 'Guest User'}</span>
                      <span className="text-xs text-gray-500">{order.customerPhone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-700">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-900">
                    {order.totalPrice?.toLocaleString()} BDT
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {order.paymentStatus || 'unpaid'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                      ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-blue-50 text-blue-700 border-blue-200'}
                    `}>
                      {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'pending' && <Clock className="w-3 h-3" />}
                      {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {order.status !== 'delivered' && order.status !== 'pending' && order.status !== 'cancelled' && <Package className="w-3 h-3" />}
                      <span className="capitalize">{order.status || 'Processing'}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 text-sm">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
