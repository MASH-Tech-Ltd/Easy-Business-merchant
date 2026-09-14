'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { api } from '@/utils/api';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(7);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 3.2,
    chartData: []
  });

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics/dashboard-stats', {
        params: { days: timeframe }
      });
      if (response.data?.data) {
        setStats({
          totalRevenue: response.data.data.totalRevenue || 0,
          totalOrders: response.data.data.totalOrders || 0,
          totalCustomers: response.data.data.totalCustomers || 0,
          conversionRate: response.data.data.conversionRate || 3.2,
          chartData: response.data.data.chartData || []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your store's performance</p>
        </div>
        <select 
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:border-[#5022C3] w-full sm:w-auto"
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
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
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
        
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
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

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
          <div className="absolute top-4 right-4 flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-red-50 text-red-700">
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

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col relative">
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
      </div>

      {/* Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Revenue Over Time</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dx={-5} tickFormatter={(value) => `${value.toLocaleString()}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value: any) => [Number(value || 0).toLocaleString() + ' BDT', 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#5022C3" strokeWidth={3} dot={{r: 4, fill: '#5022C3', strokeWidth: 0}} activeDot={{r: 6, fill: '#5022C3', stroke: '#fff', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Orders Summary</h3>
          <div className="h-60 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dx={-5} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="orders" fill="#8200da" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
