"use client";

import { getMerchantProductThumbnailUrl } from '@/utils/imageOptimizer';

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  MoreVertical,
  Activity,
  Headset,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  ExternalLink,
  Crown,
  Calendar,
  Clock,
  CreditCard,
  Tag,
  Package,
  Star,
  Sparkles,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Palette,
  ArrowRight,
  CircleDashed,
  Globe,
  Truck,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../utils/api";
import { toast } from "react-hot-toast";

const baseMetrics = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Total Orders",
    icon: ShoppingBag,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Active Customers",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Conversion Rate",
    icon: Activity,
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

let globalCache: any = null;

export default function DashboardOverview() {
  const [storeName, setStoreName] = useState(
    globalCache?.storeName || "Your Store",
  );
  const [storeSlug, setStoreSlug] = useState(globalCache?.storeSlug || "");
  const [loading, setLoading] = useState(!globalCache);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<any[]>(globalCache?.metrics || []);
  const [recentOrders, setRecentOrders] = useState<any[]>(
    globalCache?.recentOrders || [],
  );
  const [subscription, setSubscription] = useState<any>(
    globalCache?.subscription || null,
  );
  const [productStats, setProductStats] = useState(
    globalCache?.productStats || { total: 0, active: 0, inactive: 0 },
  );
  const [categoryStats, setCategoryStats] = useState(
    globalCache?.categoryStats || { total: 0, active: 0, inactive: 0 },
  );
  const [topProducts, setTopProducts] = useState<any[]>(
    globalCache?.topProducts || [],
  );
  const [showDemoSeed, setShowDemoSeed] = useState<boolean>(
    globalCache?.showDemoSeed ?? false,
  );
  const [storeSetup, setStoreSetup] = useState<any>(
    globalCache?.storeSetup || null,
  );
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const [isSetupScoreDismissed, setIsSetupScoreDismissed] = useState(false);
  const [checklistFilter, setChecklistFilter] = useState<
    "all" | "appearance" | "catalog" | "trust"
  >("all");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const key = `hide_store_setup_score_${storeSlug || "default"}`;
        const isDismissed = localStorage.getItem(key);
        if (isDismissed === "true") {
          setIsSetupScoreDismissed(true);
        }
      }
    } catch (e) {}
  }, [storeSlug]);

  const handleDismissPermanently = () => {
    try {
      if (typeof window !== "undefined") {
        const key = `hide_store_setup_score_${storeSlug || "default"}`;
        localStorage.setItem(key, "true");
      }
    } catch (e) {}
    setIsSetupScoreDismissed(true);
    toast.success("Setup card hidden from dashboard. You can review or unhide it anytime from Settings > Profile.");
  };

  const handleUnhideSetupScore = () => {
    try {
      if (typeof window !== "undefined") {
        const key = `hide_store_setup_score_${storeSlug || "default"}`;
        localStorage.removeItem(key);
      }
    } catch (e) {}
    setIsSetupScoreDismissed(false);
    setIsChecklistExpanded(true);
    toast.success("Store setup checklist unhidden!");
  };
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [seedLanguage, setSeedLanguage] = useState<"en" | "bn">("en");
  const [seedType, setSeedType] = useState<
    "electronics" | "fashion" | "lifestyle" | "all"
  >("electronics");
  const [activatingEarly, setActivatingEarly] = useState(false);

  const handleActivateEarly = async () => {
    setActivatingEarly(true);
    try {
      await api.post("/subscriptions/activate-early");
      toast.success("Subscription activated immediately with zero time gap!");
      fetchData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to activate subscription early",
      );
    } finally {
      setActivatingEarly(false);
    }
  };

  // Previous code:
  // const seedTypeData = {
  //   electronics: { categories: 15, products: 60, desc: "Smartphones, Laptops, Audio, Cameras, TVs, Gaming, Smartwatches, etc." },
  //   fashion: { categories: 15, products: 60, desc: "Men's & Women's Wear, Shoes, Watches, Bags, Jewelry, Beauty, etc." },
  //   lifestyle: { categories: 15, products: 60, desc: "Furniture, Home Decor, Sports, Groceries, Books, Stationery, etc." },
  //   all: { categories: 45, products: 180, desc: "Everything from all business types" }
  // };

  const seedTypeData = {
    electronics: {
      categories: 15,
      products: 900,
      desc: "Smartphones, Laptops, Audio, Cameras, TVs, Gaming, Smartwatches, etc.",
    },
    fashion: {
      categories: 15,
      products: 900,
      desc: "Men's & Women's Wear, Shoes, Watches, Bags, Jewelry, Beauty, etc.",
    },
    lifestyle: {
      categories: 15,
      products: 900,
      desc: "Furniture, Home Decor, Sports, Groceries, Books, Stationery, etc.",
    },
    all: {
      categories: 45,
      products: 2700,
      desc: "Everything from all business types",
    },
  };

  const fetchData = async () => {
    try {
      if (!globalCache) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const res = await api.get("/analytics/dashboard-summary", {
        params: { days: 7 },
      });
      const summary = res.data?.data;

      if (!summary) return;

      const stats = summary.stats || {};
      const newMetrics = [
        {
          ...baseMetrics[0],
          value: `${(stats.totalRevenue || 0).toLocaleString()} BDT`,
          change: "+14.5%",
          isPositive: true,
        },
        {
          ...baseMetrics[1],
          value: stats.totalOrders || 0,
          change: "+5.2%",
          isPositive: true,
        },
        {
          ...baseMetrics[2],
          value: stats.totalCustomers || 0,
          change: "-1.1%",
          isPositive: false,
        },
        {
          ...baseMetrics[3],
          value: `${stats.conversionRate || 0}%`,
          change: "+0.8%",
          isPositive: true,
        },
      ];

      globalCache = {
        storeName: summary.store?.name || "Your Store",
        storeSlug: summary.store?.slug || "",
        showDemoSeed: summary.store?.showDemoSeed !== false,
        metrics: newMetrics,
        recentOrders: summary.recentOrders || [],
        subscription: summary.subscription || null,
        productStats: summary.productStats || {
          total: 0,
          active: 0,
          inactive: 0,
        },
        categoryStats: summary.categoryStats || {
          total: 0,
          active: 0,
          inactive: 0,
        },
        topProducts: summary.topProducts || [],
        storeSetup: summary.storeSetup || null,
      };

      setStoreName(globalCache.storeName);
      setStoreSlug(globalCache.storeSlug);
      setShowDemoSeed(globalCache.showDemoSeed);
      setMetrics(globalCache.metrics);
      setRecentOrders(globalCache.recentOrders);
      setSubscription(globalCache.subscription);
      setProductStats(globalCache.productStats);
      setCategoryStats(globalCache.categoryStats);
      setTopProducts(globalCache.topProducts);
      setStoreSetup(globalCache.storeSetup);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("dashboard:refresh", fetchData);
    return () => window.removeEventListener("dashboard:refresh", fetchData);
  }, []);

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000";
  const protocol = process.env.NEXT_PUBLIC_BASE_DOMAIN ? "https" : "http";
  const storeUrl = storeSlug ? `${protocol}://${storeSlug}.${baseDomain}` : "#";

  const copyToClipboard = () => {
    if (storeSlug) {
      navigator.clipboard.writeText(storeUrl);
      toast.success("Store URL copied to clipboard!");
    }
  };

  const handleSeedDemo = async () => {
    setSeedLoading(true);
    setSeedResult(null);
    try {
      const res = await api.post(
        `/seed/demo?lang=${seedLanguage}&type=${seedType}`,
      );
      const data = res.data?.data;
      setSeedResult({
        type: "success",
        message: `✅ Seeded ${data?.categoriesCreated || seedTypeData[seedType].categories} categories and ${data?.productsCreated || seedTypeData[seedType].products} products! Visit your storefront to see them live.`,
      });
      // Refresh dashboard data
      setTimeout(() => {
        fetchData();
        setShowSeedModal(false);
      }, 1800);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to seed demo data.";
      setSeedResult({ type: "error", message: msg });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleReset = async () => {
    setResetLoading(true);
    setSeedResult(null);
    try {
      const res = await api.delete("/seed/reset");
      const data = res.data?.data;
      setSeedResult({
        type: "success",
        message: `🗑️ Cleared ${data?.productsDeleted || 0} products and ${data?.categoriesDeleted || 0} categories.`,
      });
      setTimeout(() => window.location.reload(), 1800);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to reset store data.";
      setSeedResult({ type: "error", message: msg });
    } finally {
      setResetLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Delivered":
        return (
          <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            {status}
          </span>
        );
      case "Processing":
        return (
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            {status}
          </span>
        );
      case "Pending":
        return (
          <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative min-h-full pb-20 bg-[#F8FAFC]">
      <div className="w-full max-w-[1800px] mx-auto pt-4 sm:pt-8 px-3 sm:px-6">
        {/* Store Down / No Active Subscription Warning Banner */}
        {!loading &&
          (!subscription ||
            subscription.isUpcomingOnly ||
            subscription.status !== "active") && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-red-600 mt-0.5">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-extrabold text-red-950 text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        Your Store is Currently Offline (Store Down)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                        No Active Plan Running Right Now
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-red-800 leading-relaxed font-medium">
                      {subscription?.isUpcomingOnly ? (
                        <>
                          Your store is currently <strong>offline</strong>{" "}
                          because your current subscription ended or was
                          cancelled. Your confirmed next plan (
                          <strong>{subscription.packageId?.name}</strong>) is
                          scheduled to start on{" "}
                          <strong>{formatDate(subscription.startDate)}</strong>.
                          Customers cannot visit your store or place orders
                          until your plan is active.
                        </>
                      ) : subscription?.status === "pending" ? (
                        <>
                          Your store is currently <strong>offline</strong>{" "}
                          because your subscription request for{" "}
                          <strong>{subscription.packageId?.name}</strong> is
                          awaiting Super Admin approval. Once approved, your
                          store will go live immediately.
                        </>
                      ) : (
                        <>
                          Your store is currently <strong>offline</strong>{" "}
                          because there is no active subscription at this time.
                          Customers cannot browse products or place orders.
                          Please subscribe or renew your plan to bring your
                          storefront back online.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                  {subscription?.isUpcomingOnly ? (
                    <button
                      onClick={handleActivateEarly}
                      disabled={activatingEarly}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 text-yellow-300" />
                      {activatingEarly
                        ? "Activating..."
                        : "Activate Plan Now (Go Live Today)"}
                    </button>
                  ) : (
                    <Link
                      href="/dashboard/subscription"
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Crown className="w-4 h-4 text-yellow-300" />
                      Subscribe / Renew Plan
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {storeName} 👋
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Here is what's happening with your store today.
            </p>
          </div>

          {/* Quick Actions / Store Link */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-1 md:mt-0">
            {/* Seed Demo Data Button */}
            {showDemoSeed && (
              <button
                onClick={() => {
                  setShowSeedModal(true);
                  setSeedResult(null);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl shadow-xs hover:shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all whitespace-nowrap"
                title="Seed demo categories and products"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Make demo store</span>
              </button>
            )}

            <div className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 shadow-xs min-w-0">
              <span className="text-xs sm:text-sm font-medium text-gray-600 truncate max-w-[110px] min-[360px]:max-w-[140px] sm:max-w-[200px]">
                {storeSlug
                  ? `${storeSlug}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || "localhost:3000"}`
                  : "Loading..."}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-px h-4 bg-gray-200"></div>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                  title="Copy URL"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-indigo-100 transition-colors shrink-0"
                >
                  <span>View Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Store Setup & Visual Polish Progress Score (Compact & Fully Responsive) */}
        {storeSetup && !isSetupScoreDismissed && (
          <div className="bg-white border border-purple-100 rounded-xl p-3 sm:p-4 shadow-2xs mb-4 sm:mb-6 transition-all">
            {/* Top Bar: Title, Score Badge, Stats, Action Controls */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#5022C3]/10 text-[#5022C3] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex items-center gap-2 flex-wrap">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                    Store Setup
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      storeSetup.score === 100
                        ? "bg-emerald-100 text-emerald-800"
                        : storeSetup.score >= 70
                          ? "bg-purple-100 text-[#5022C3]"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {storeSetup.score}%
                  </span>
                  <span className="text-[11px] text-gray-500 hidden md:inline truncate">
                    •{" "}
                    {storeSetup.requiredCompletedCount ??
                      storeSetup.completedCount}{" "}
                    of {storeSetup.requiredTotalCount ?? 7} core steps completed
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                {/* Permanently hide option */}
                {storeSetup.score === 100 ? (
                  <button
                    type="button"
                    onClick={handleDismissPermanently}
                    className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all"
                    title="100% Setup Complete. Permanently hide this card."
                  >
                    <span>Hide Forever</span>
                    <X className="w-3 h-3 text-emerald-600" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDismissPermanently}
                    className="text-[10px] sm:text-[11px] font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-1.5 py-0.5 rounded transition-all"
                    title="Permanently hide this setup card"
                  >
                    Hide
                  </button>
                )}

                {/* Expand / Collapse toggle */}
                <button
                  type="button"
                  onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
                  className="text-[10px] sm:text-[11px] font-semibold text-[#5022C3] bg-purple-50 hover:bg-purple-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-all"
                >
                  <span>{isChecklistExpanded ? "Collapse" : "Steps"}</span>
                  {isChecklistExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Slim Progress Meter */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-[#5022C3] to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(storeSetup.score, 5)}%` }}
                />
              </div>
              <span className="text-[11px] font-extrabold text-[#5022C3] shrink-0">
                {storeSetup.score}%
              </span>
            </div>

            {/* Detailed Checklist (Compact & Ultra-Responsive for Mobile/XS) */}
            {isChecklistExpanded && (
              <div className="mt-3 pt-3 border-t border-purple-50 space-y-2.5">
                {/* Compact Filter Chips */}
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 -mx-1 px-1">
                  {[
                    { id: "all", label: `All (${storeSetup.totalCount})` },
                    { id: "appearance", label: "Appearance" },
                    { id: "catalog", label: "Catalog" },
                    { id: "trust", label: "Trust & Policies" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setChecklistFilter(filter.id as any)}
                      className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium whitespace-nowrap transition-all ${
                        checklistFilter === filter.id
                          ? "bg-[#5022C3] text-white shadow-xs"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Steps Grid: Responsive from 1 column on xs, 2 cols on sm, 4 cols on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {storeSetup.steps
                    .filter(
                      (step: any) =>
                        checklistFilter === "all" ||
                        step.category === checklistFilter ||
                        (checklistFilter === "trust" &&
                          (step.category === "trust" ||
                            step.category === "operations" ||
                            step.category === "branding")),
                    )
                    .map((step: any) => (
                      <Link
                        key={step.id}
                        href={step.link}
                        className={`group rounded-lg p-2 sm:p-2.5 border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          step.completed
                            ? "bg-emerald-50/20 border-emerald-200/60 hover:bg-emerald-50/50"
                            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-xs"
                        }`}
                      >
                        {/* Left: Status icon & Title */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {step.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-amber-400 bg-amber-50 shrink-0 flex items-center justify-center text-[8px] font-bold text-amber-700">
                              !
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[11px] sm:text-xs font-bold truncate transition-colors ${
                                  step.completed
                                    ? "text-gray-700"
                                    : "text-gray-900 group-hover:text-[#5022C3]"
                                }`}
                              >
                                {step.title}
                              </span>
                              <span
                                className={`text-[9px] font-semibold px-1 py-0.2 rounded shrink-0 ${
                                  step.isOptional
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {step.isOptional ? "Opt" : `+${step.weight}%`}
                              </span>
                            </div>
                            {step.titleBn && (
                              <p className="text-[10px] text-gray-400 font-medium truncate">
                                {step.titleBn}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Compact Action */}
                        <div className="shrink-0 flex items-center">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors flex items-center gap-0.5 ${
                              step.completed
                                ? "text-gray-500 group-hover:text-gray-800 bg-gray-50 group-hover:bg-gray-100"
                                : "text-white bg-[#5022C3] group-hover:bg-[#431ca7] shadow-xs"
                            }`}
                          >
                            <span>{step.completed ? "Edit" : "Setup"}</span>
                            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white/50 animate-pulse rounded-2xl p-4 sm:p-6 border border-gray-100 h-[120px] sm:h-[140px]"
                  ></div>
                ))
            : metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${metric.bg}`}>
                      <metric.icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${metric.isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {metric.isPositive ? (
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      ) : (
                        <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">
                    {metric.title}
                  </h3>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                    {metric.value}
                  </p>
                </div>
              ))}
        </div>

        {/* Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Data (Orders & Best Selling) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Orders
                </h2>
                <Link
                  href="/dashboard/orders"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All
                </Link>
              </div>
              {/* Mobile View (2 boxes per row) */}
              <div className="md:hidden p-3 grid grid-cols-2 gap-3 bg-gray-50/30">
                {loading ? (
                  <div className="col-span-2 p-6 text-center text-gray-500">
                    Loading orders...
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="col-span-2 p-6 text-center text-gray-500">
                    No orders found.
                  </div>
                ) : (
                  recentOrders.slice(0, 2).map((order, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col gap-2 relative"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-indigo-600 text-xs bg-indigo-50 px-1.5 py-0.5 rounded">
                          #{order.orderId || order._id?.slice(-6).toUpperCase()}
                        </span>
                        <button className="text-gray-400 hover:text-indigo-600 absolute top-2 right-2 p-0.5">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1">
                        <div className="font-bold text-gray-900 text-[13px] truncate pr-4">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {order.items?.[0]?.title || "Multiple Items"}
                        </div>
                      </div>
                      <div className="mt-auto pt-2 flex flex-col gap-1.5 border-t border-gray-50">
                        <div className="font-bold text-gray-900 text-sm">
                          {order.totalPrice?.toLocaleString()} BDT
                        </div>
                        <div className="scale-90 origin-left -ml-1">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-gray-500"
                        >
                          Loading orders...
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-indigo-600 text-sm">
                              #
                              {order.orderId ||
                                order._id?.slice(-6).toUpperCase()}
                            </span>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 text-sm">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                              {order.items?.[0]?.title || "Multiple Items"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
                            {order.totalPrice?.toLocaleString()} BDT
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" /> Best Selling
                Products
              </h2>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No products found.
                  </p>
                ) : (
                  topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50 transition-all hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex-shrink-0 overflow-hidden p-1 shadow-sm">
                        {product.images && product.images[0] ? (
                          <img
                            src={getMerchantProductThumbnailUrl(product.images[0].secure_url)} loading="lazy" decoding="async"
                            alt={product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate mb-1">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                            {product.salesCount || 0} Sold
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">
                            Total Sales
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-black text-gray-900 shrink-0 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        {product.discountedPrice || product.originalPrice} BDT
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Current Subscription Plan */}
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              {loading ? (
                <div className="relative z-10 animate-pulse">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-xl mb-3 sm:mb-6"></div>
                  <div className="h-5 sm:h-6 bg-white/20 rounded w-1/2 mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-white/20 rounded w-full mb-2"></div>
                  <div className="h-3 sm:h-4 bg-white/20 rounded w-3/4 mb-4 sm:mb-6"></div>
                </div>
              ) : subscription ? (
                <div className="relative z-10">
                  {subscription.isUpcomingOnly ? (
                    <>
                      <div className="flex justify-between items-start mb-3 sm:mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg shrink-0">
                            <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold">
                              {subscription.packageId?.name || "Upcoming Plan"}
                            </h3>
                            <span className="text-[11px] text-amber-300 font-semibold block">
                              Upcoming Plan Queued
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-300 animate-pulse" />{" "}
                          Starts in {subscription.daysUntilStart || 1} Days
                        </span>
                      </div>

                      <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-5">
                        <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-200">
                          <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                            Current Plan Inactive / Cancelled
                          </div>
                          <p className="text-[11px] text-amber-200/80 leading-relaxed">
                            Your current plan was cancelled or ended. Your next
                            plan ({subscription.packageId?.name || "Package"})
                            is scheduled to start on{" "}
                            {formatDate(subscription.startDate)}.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-indigo-100 bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                              Scheduled Start Date
                            </span>
                            <span className="text-xs sm:text-sm font-medium">
                              {formatDate(subscription.startDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-indigo-100 bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                              Cycle Ends Date
                            </span>
                            <span className="text-xs sm:text-sm font-medium">
                              {formatDate(subscription.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleActivateEarly}
                        disabled={activatingEarly}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        {activatingEarly
                          ? "Activating..."
                          : "Activate Plan Now (Start Today)"}
                      </button>

                      <a
                        href="/dashboard/subscription"
                        className="mt-2.5 w-full flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 font-bold py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-white/20 transition-all duration-300"
                      >
                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                        Manage Subscription
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3 sm:mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg shrink-0">
                            <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold">
                            {subscription.packageId?.name ||
                              (subscription.isTrial
                                ? "Free Trial"
                                : "Unknown Plan")}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1 mt-1">
                          <span
                            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full ${
                              subscription.status === "active"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : subscription.status === "pending"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : subscription.status === "expired" ||
                                      subscription.status === "cancelled"
                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                    : "bg-white/20 text-white border border-white/10"
                            }`}
                          >
                            {subscription.status}
                          </span>
                          {subscription.isRenewed && (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-purple-300" />{" "}
                              Renewed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 text-indigo-100 bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                              Current Cycle Started
                            </span>
                            <span className="text-xs sm:text-sm font-medium">
                              {formatDate(subscription.startDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-indigo-100 bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-[9px] sm:text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                              {subscription.isRenewed
                                ? "Current Cycle Ends"
                                : "Expires Date"}
                            </span>
                            <span className="text-xs sm:text-sm font-medium">
                              {formatDate(subscription.endDate)}
                            </span>
                            {subscription.isRenewed && (
                              <span className="text-[11px] text-emerald-300 font-bold mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                                Extended through{" "}
                                {formatDate(
                                  subscription.extendedEndDate ||
                                    subscription.renewalEndDate,
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href="/dashboard/subscription"
                        className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                        Manage Subscription
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 sm:mb-6 border border-white/20">
                    <Store className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                    No Active Plan
                  </h3>
                  <p className="text-indigo-200 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    You do not currently have an active subscription plan.
                  </p>
                  <a
                    href="/dashboard/subscription"
                    className="block text-center w-full bg-white text-indigo-900 font-bold py-2 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Subscribe Now
                  </a>
                </div>
              )}
            </div>

            {/* Store Overview Data */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-500" /> Store Overview
              </h2>

              <div className="space-y-6">
                {/* Product Stats */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-700 font-bold flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-500" /> Total
                      Products
                    </span>
                    <span className="text-gray-900 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                      {productStats.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-green-600 mb-1">
                        Active
                      </span>
                      <span className="text-lg font-black text-green-700">
                        {productStats.active}
                      </span>
                    </div>
                    <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                        Inactive/Draft
                      </span>
                      <span className="text-lg font-black text-gray-700">
                        {productStats.inactive}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-100"></div>

                {/* Category Stats */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-700 font-bold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" /> Total Categories
                    </span>
                    <span className="text-gray-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                      {categoryStats.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-blue-600 mb-1">
                        Active
                      </span>
                      <span className="text-lg font-black text-blue-700">
                        {categoryStats.active}
                      </span>
                    </div>
                    <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                        Inactive
                      </span>
                      <span className="text-lg font-black text-gray-700">
                        {categoryStats.inactive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        href="/dashboard/support"
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-105 transition-all duration-300 z-50"
      >
        <Headset className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
      </Link>

      {/* ── Seed Demo Data Modal ─────────────────────────────────────────────── */}
      {showSeedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[slideUp_0.25s_ease-out]"
            style={{ animation: "slideUp 0.25s ease-out" }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-6 relative">
              <button
                onClick={() => setShowSeedModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Seed Demo Data</h2>
              </div>
              <p className="text-indigo-100 text-sm">
                Instantly populate your store with realistic electronics
                categories and products to explore the full experience.
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6">
              {/* Business Type Selection */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Business Type
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "electronics", label: "Electronics" },
                    { id: "fashion", label: "Fashion" },
                    { id: "lifestyle", label: "Lifestyle" },
                    // { id: 'all', label: 'All Categories' }
                  ].map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 cursor-pointer transition-all ${seedType === t.id ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-gray-200 hover:border-indigo-200 text-gray-600"}`}
                    >
                      <input
                        type="radio"
                        name="seedType"
                        value={t.id}
                        checked={seedType === t.id}
                        onChange={() => setSeedType(t.id as any)}
                        className="hidden"
                      />
                      <span className="font-bold text-sm w-full text-center">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* What gets seeded */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  What will be created
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-center flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-indigo-700 mb-1">
                      {seedTypeData[seedType].categories}
                    </div>
                    <div className="text-xs font-semibold text-indigo-500">
                      Categories
                    </div>
                  </div>
                  <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100 text-center flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-violet-700 mb-1">
                      {seedTypeData[seedType].products}
                    </div>
                    <div className="text-xs font-semibold text-violet-500">
                      Products
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 text-center mt-2 font-medium">
                  Includes: {seedTypeData[seedType].desc}
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Language
                </p>
                <div className="flex gap-3">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${seedLanguage === "en" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-gray-200 hover:border-indigo-200 text-gray-600"}`}
                  >
                    <input
                      type="radio"
                      name="seedLang"
                      value="en"
                      checked={seedLanguage === "en"}
                      onChange={() => setSeedLanguage("en")}
                      className="hidden"
                    />
                    <span className="font-bold">English (en)</span>
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${seedLanguage === "bn" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-gray-200 hover:border-indigo-200 text-gray-600"}`}
                  >
                    <input
                      type="radio"
                      name="seedLang"
                      value="bn"
                      checked={seedLanguage === "bn"}
                      onChange={() => setSeedLanguage("bn")}
                      className="hidden"
                    />
                    <span className="font-bold text-[15px]">বাংলা (bn)</span>
                  </label>
                </div>
              </div>

              {/* Result message */}
              {seedResult && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-2xl mb-5 text-sm font-medium ${
                    seedResult.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {seedResult.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                  )}
                  <span>{seedResult.message}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSeedDemo}
                  disabled={seedLoading || resetLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:from-violet-700 hover:to-indigo-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {seedLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>{" "}
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Seed{" "}
                      {seedTypeData[seedType].categories} Categories +{" "}
                      {seedTypeData[seedType].products} Products
                    </>
                  )}
                </button>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <button
                  onClick={handleReset}
                  disabled={seedLoading || resetLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-2xl border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {resetLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>{" "}
                      Resetting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Reset — Delete All
                      Categories &amp; Products
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-4">
                ⚠️ Seeding is blocked if your store already has data. Use Reset
                first if you want to re-seed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
