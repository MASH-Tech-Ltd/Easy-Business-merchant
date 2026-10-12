"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import {
  Gift,
  Copy,
  Check,
  Coins,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function ReferAndEarnPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPoints, setWithdrawPoints] = useState("20");
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad" | "Rocket" | "Bank">("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/referrals/merchant/my-referral");
      if (res.data?.status === "ok" || res.data?.success) {
        setData(res.data.data);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("referralPointsUpdate"));
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load referral details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fullReferralLink = typeof window !== "undefined" && data?.referralCode
    ? `${window.location.origin}/register?ref=${data.referralCode}`
    : `/register?ref=${data?.referralCode || ""}`;

  const handleCopyLink = () => {
    if (!fullReferralLink) return;
    navigator.clipboard.writeText(fullReferralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pts = Number(withdrawPoints);
    if (!pts || pts < 100) {
      toast.error("Minimum withdrawal is 100 points (৳100)");
      return;
    }
    if (!accountNumber.trim()) {
      toast.error("Please enter account / phone number");
      return;
    }

    setSubmittingWithdraw(true);
    try {
      const res = await api.post("/referrals/merchant/withdraw", {
        points: pts,
        paymentMethod,
        accountNumber: accountNumber.trim(),
        accountDetails: accountDetails.trim(),
      });

      if (res.data?.status === "ok" || res.data?.success) {
        toast.success(`Withdrawal request for ৳${pts} submitted! Pending Admin Approval.`);
        setIsWithdrawModalOpen(false);
        setAccountNumber("");
        setAccountDetails("");
        fetchReferralData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit withdrawal request");
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto p-2.5 sm:p-6 space-y-4 sm:space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-5 sm:p-8 md:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-blue-200 mb-3 sm:mb-4 border border-white/10">
              <Gift className="w-3.5 h-3.5 text-blue-300" />
              <span>Merchant Referral Program</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Refer a Merchant, Earn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                20 Points (৳20)
              </span>
            </h1>
            <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Invite friends to create their online store on MASH ECO. Your friend gets{" "}
              <strong className="text-white font-semibold">10 Days Extra Free Trial (15 days total)</strong>. 
              When they purchase a subscription plan, you get{" "}
              <strong className="text-amber-300 font-semibold">20 Points convertible directly to Taka (৳20)</strong>!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 w-full lg:w-auto min-w-0 sm:min-w-[280px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Usable Points
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300">
                    {data?.wallet?.usablePoints ?? 0}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    pts (= ৳{data?.wallet?.usableTaka ?? 0})
                  </span>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 bg-amber-400/20 text-amber-300 rounded-xl">
                <Coins className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <button
              onClick={() => {
                setWithdrawPoints(String(Math.max(100, data?.wallet?.usablePoints || 100)));
                setIsWithdrawModalOpen(true);
              }}
              disabled={(data?.wallet?.usablePoints || 0) < 100}
              className="mt-3 sm:mt-4 w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Convert to Taka</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {(data?.wallet?.usablePoints || 0) < 100 && (
              <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-2">
                Min 100 points (৳100) needed to withdraw
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Share Referral Link Box */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Your Unique Referral Link</span>
        </h2>
        <p className="text-xs text-slate-500 mb-3 sm:mb-4 leading-relaxed">
          Share this link with merchants. The referral code will be automatically applied on registration.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
          <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 font-mono text-xs sm:text-sm text-slate-800 break-all select-all">
            {loading ? "Loading referral code..." : fullReferralLink}
          </div>
          <button
            onClick={handleCopyLink}
            disabled={loading}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Code pill */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span>Referral Code:</span>
          <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-900 border border-slate-200 text-xs">
            {data?.referralCode || "..."}
          </span>
        </div>
      </div>

      {/* Wallet Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Usable Points */}
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Usable Points
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
              {data?.wallet?.usablePoints ?? 0}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 inline-block">
              = ৳{data?.wallet?.usableTaka ?? 0} (Ready to withdraw)
            </span>
          </div>
          <div className="p-2.5 sm:p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Pending Points */}
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Points
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
              {data?.wallet?.pendingPoints ?? 0}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 inline-block">
              Unlocks when friend subscribes
            </span>
          </div>
          <div className="p-2.5 sm:p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Points Earned */}
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lifetime Earned
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {data?.wallet?.totalPoints ?? 0}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 inline-block">
              Total referral points
            </span>
          </div>
          <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Withdrawn
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ৳{data?.wallet?.totalTakaWithdrawn ?? 0}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 inline-block">
              Total paid out
            </span>
          </div>
          <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Referred Friends Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Referred Merchants
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              People who registered using your referral link
            </p>
          </div>
          <button
            onClick={fetchReferralData}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>

        {/* Mobile View (Cards) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
              <span>Loading your referrals...</span>
            </div>
          ) : !data?.referralsList || data.referralsList.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-400">
              <Gift className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700 text-sm">No merchants referred yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Share your referral link with merchant friends to earn 20 points per subscription!
              </p>
            </div>
          ) : (
            data.referralsList.map((item: any) => (
              <div key={item._id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.referredUserId?.name || "Merchant"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Store: <strong className="text-slate-700">{item.referredStoreName || item.referredTenantId?.name || "Store"}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono break-all">
                      {item.referredEmail}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-slate-900 text-sm block">
                      +{item.pointsAwarded || 20} pts
                    </span>
                    <span className="text-[10px] text-slate-400">(= ৳{item.pointsAwarded || 20})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                    +{item.extraDaysAwarded || 10}d Extra Trial
                  </span>

                  {item.pointsStatus === "usable" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Usable (Active)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Pending Subscription</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Merchant Name</th>
                <th className="py-3.5 px-6">Store Name</th>
                <th className="py-3.5 px-6">Trial Bonus</th>
                <th className="py-3.5 px-6">Your Reward</th>
                <th className="py-3.5 px-6">Reward Status</th>
                <th className="py-3.5 px-6 text-right">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading your referrals...</span>
                  </td>
                </tr>
              ) : !data?.referralsList || data.referralsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">No merchants referred yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Share your referral link with merchant friends to earn 20 points per subscription!
                    </p>
                  </td>
                </tr>
              ) : (
                data.referralsList.map((item: any) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900">
                        {item.referredUserId?.name || "Merchant"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {item.referredEmail}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-800">
                        {item.referredStoreName || item.referredTenantId?.name || "Store"}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        +{item.extraDaysAwarded || 10} Days Extra
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">
                        +{item.pointsAwarded || 20} Points
                      </span>
                      <span className="text-xs text-slate-400 block">(= ৳{item.pointsAwarded || 20})</span>
                    </td>

                    <td className="py-4 px-6">
                      {item.pointsStatus === "usable" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Usable (Active)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800" title="Waiting for merchant to buy a paid subscription">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Subscription</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right text-xs text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal History */}
      {data?.withdrawals && data.withdrawals.length > 0 && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Withdrawal Requests
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your points to Taka conversion requests
            </p>
          </div>

          {/* Mobile View (Cards) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {data.withdrawals.map((w: any) => (
              <div key={w._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-slate-900 text-sm">
                    {w.points} pts (= ৳{w.takaAmount})
                  </span>
                  {w.status === "approved" ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Approved / Paid
                    </span>
                  ) : w.status === "rejected" ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      Pending Review
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Method: <strong className="text-slate-800">{w.paymentMethod}</strong></span>
                  <span className="font-mono text-slate-700">{w.accountNumber}</span>
                </div>

                <div className="text-[11px] text-slate-400 text-right pt-1">
                  {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "N/A"}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Method</th>
                  <th className="py-3 px-6">Account Number</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data.withdrawals.map((w: any) => (
                  <tr key={w._id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-6 font-bold text-slate-900">
                      {w.points} pts (= ৳{w.takaAmount})
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-700">
                      {w.paymentMethod}
                    </td>
                    <td className="py-3 px-6 font-mono text-xs text-slate-600">
                      {w.accountNumber}
                    </td>
                    <td className="py-3 px-6">
                      {w.status === "approved" ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Approved / Paid
                        </span>
                      ) : w.status === "rejected" ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right text-xs text-slate-400">
                      {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Convert to Taka / Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl xs:rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="p-4 xs:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base xs:text-lg font-bold text-slate-900">
                  Convert Points to Taka
                </h3>
                <p className="text-[11px] xs:text-xs text-slate-500 mt-0.5">
                  1 Point = ৳1 BDT. Direct payout to your mobile wallet.
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-4 xs:p-6 space-y-3.5 xs:space-y-4 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Points to Convert
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    Available: <strong className="text-emerald-600">{data?.wallet?.usablePoints || 0} pts</strong>
                  </span>
                </div>
                <input
                  type="number"
                  min="100"
                  max={data?.wallet?.usablePoints || 100}
                  required
                  placeholder="Min. 100"
                  value={withdrawPoints}
                  onChange={(e) => setWithdrawPoints(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-emerald-600 font-bold">
                    You will receive: ৳{Number(withdrawPoints) || 0} BDT
                  </span>
                  <span className="text-slate-400 font-medium">
                    (Min. 100 pts)
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Approval Required:</strong> Your withdrawal request will be reviewed and approved by Platform Admin before the payout is sent to your account.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["bKash", "Nagad", "Rocket", "Bank"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        paymentMethod === method
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Number / Mobile Wallet
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 01700000000"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Details / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Personal Account / Bank Branch details"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw}
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingWithdraw ? "Submitting..." : "Submit Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
