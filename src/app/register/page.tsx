"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Gift, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralStatus, setReferralStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [referralBonusText, setReferralBonusText] = useState("");
  const [referralOffer, setReferralOffer] = useState<{
    offerType: "trial_extension" | "subscription_discount" | "both";
    extraDays: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
    referrerName: string;
    totalDays: number;
  } | null>(null);
  const [referralError, setReferralError] = useState("");

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Auto-detect referral code from URL query params: ?ref=CODE or ?referral=CODE
  useEffect(() => {
    let refParam = searchParams?.get("ref") || searchParams?.get("referral");
    if (!refParam && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      refParam = urlParams.get("ref") || urlParams.get("referral");
    }
    if (refParam) {
      const codeUpper = refParam.trim().toUpperCase();
      setReferralCode(codeUpper);
    }
  }, [searchParams]);

  // Real-time verification with debounce whenever referralCode changes
  useEffect(() => {
    const trimmed = referralCode.trim().toUpperCase();
    if (!trimmed) {
      setReferralStatus("idle");
      setReferralBonusText("");
      setReferralOffer(null);
      setReferralError("");
      return;
    }

    const timer = setTimeout(() => {
      validateReferralCode(trimmed);
    }, 350);

    return () => clearTimeout(timer);
  }, [referralCode]);

  // Real-time verification for referral code
  const validateReferralCode = async (codeToVerify: string) => {
    const trimmed = codeToVerify.trim().toUpperCase();
    if (!trimmed) {
      setReferralStatus("idle");
      setReferralBonusText("");
      setReferralOffer(null);
      setReferralError("");
      return;
    }

    setReferralStatus("validating");
    setReferralError("");

    try {
      const res = await fetch(`/api/referrals/validate/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && (data.status === "ok" || data.success) && data.data?.valid) {
        setReferralStatus("valid");
        const offerType = data.data.offerType || "trial_extension";
        const extra = Number(data.data.extraDays) || 0;
        const total = 5 + extra;
        const discountType = data.data.discountType || "percentage";
        const discountValue = Number(data.data.discountValue) || 0;
        const referrer = data.data.referrerName || "";
        
        setReferralOffer({
          offerType,
          extraDays: extra,
          discountType,
          discountValue,
          referrerName: referrer,
          totalDays: total,
        });
        setReferralError("");
      } else {
        setReferralStatus("invalid");
        setReferralBonusText("");
        setReferralOffer(null);
        setReferralError(data.message || "Invalid or expired referral code.");
      }
    } catch {
      setReferralStatus("invalid");
      setReferralBonusText("");
      setReferralOffer(null);
      setReferralError("Could not verify referral code.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Frontend Validation
    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2)
      errors.name = "Full name must be at least 2 characters";
    if (!storeName.trim() || storeName.trim().length < 2)
      errors.storeName = "Store name must be at least 2 characters";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please provide a valid email address";
    if (!password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password,
      )
    ) {
      errors.password =
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        storeName: storeName.trim(),
        email: email.trim(),
        password,
        role: "tenant_admin",
      };

      if (referralCode.trim()) {
        payload.referralCode = referralCode.trim().toUpperCase();
      }

      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const beErrors: Record<string, string> = {};
          data.errors.forEach((err: any) => {
            beErrors[err.field] = err.message;
          });
          setFieldErrors(beErrors);
          throw new Error("Please fix the errors below.");
        }
        throw new Error(data.message || "Registration failed");
      }

      const user = data.data?.user || data.data;
      if (user) {
        localStorage.setItem("merchantUser", JSON.stringify(user));
        sessionStorage.setItem("merchantUser", JSON.stringify(user));
      }

      toast.success("Registration successful! Welcome to your dashboard.");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel - Premium Brand Hero */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-center items-end p-16 xl:p-24 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="E-commerce success"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/90 to-gray-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center">
              <img
                src="/masheco-logo.png"
                alt="MASH ECO Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <span className="text-3xl font-righteous text-white tracking-tight">
              MASH ECO
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
            Start your journey with MASH ECO today.
          </h1>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed max-w-md">
            Create your store in seconds and unlock the most powerful tools to
            scale your business online.
          </p>

          <div className="flex flex-col gap-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg
                  className="w-5 h-5 text-[hsl(var(--accent-primary))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">
                No hidden fees or setup costs
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg
                  className="w-5 h-5 text-[hsl(var(--accent-primary))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">
                Instant store deployment
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg
                  className="w-5 h-5 text-[hsl(var(--accent-primary))]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">
                24/7 dedicated merchant support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-4 xs:p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-6 self-start">
          <img
            src="/masheco-logo.png"
            alt="MASH ECO"
            className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 object-contain"
          />
          <span className="text-xl xs:text-2xl sm:text-3xl font-righteous text-gray-900 tracking-tight">
            MASH ECO
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6 xs:mb-8 text-left">
            <h2 className="text-2xl xs:text-3xl font-extrabold text-gray-900 mb-1.5 xs:mb-2 tracking-tight">
              Create your store
            </h2>
            <p className="text-gray-500 text-xs xs:text-sm">
              Fill in your details below to get started on MASH ECO.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Owner / Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Owner / Full Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.name ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400`}
                placeholder="e.g. Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {fieldErrors.name && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            {/* Business / Store Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="storeName"
                className="text-sm font-semibold text-gray-700"
              >
                Business / Store Name
              </label>
              <input
                type="text"
                id="storeName"
                className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.storeName ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400`}
                placeholder="e.g. Business Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
              {fieldErrors.storeName && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.storeName}
                </span>
              )}
            </div>

            {/* Email Address Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.email ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400`}
                placeholder="e.g. demo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border ${fieldErrors.password ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="text-xs text-red-500 font-medium">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Optional Referral Code Field */}
            <div className="flex flex-col gap-2 p-3 xs:p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <label
                  htmlFor="referralCode"
                  className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5 text-[hsl(var(--accent-primary))]" />
                  <span>Referral Code</span>
                  <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <span className={`inline-flex items-center gap-1 text-[10px] xs:text-[11px] font-bold px-2 xs:px-2.5 py-0.5 rounded-full transition-all max-w-full truncate ${
                  referralStatus === "valid"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : referralStatus === "validating"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  <Sparkles className={`w-3 h-3 shrink-0 ${referralStatus === "valid" ? "fill-white text-white" : "text-emerald-600"}`} />
                  <span className="truncate">
                    {referralStatus === "valid" && referralOffer
                      ? referralOffer.offerType === "subscription_discount"
                        ? `${referralOffer.discountValue}${referralOffer.discountType === "fixed" ? "৳" : "%"} Off 1st Sub`
                        : referralOffer.offerType === "both"
                        ? `+${referralOffer.extraDays}d & ${referralOffer.discountValue}${referralOffer.discountType === "fixed" ? "৳" : "%"} Off`
                        : `+${referralOffer.extraDays} Days Extra Trial`
                      : referralStatus === "validating"
                      ? "Checking Offer..."
                      : "Bonus Offer Available"}
                  </span>
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="referralCode"
                  className={`w-full px-4 py-2.5 pr-10 rounded-xl border-2 transition-all outline-none font-mono tracking-wide text-sm uppercase ${
                    referralStatus === "valid"
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 font-bold shadow-xs"
                      : referralStatus === "invalid"
                      ? "border-amber-400 bg-amber-50/20 text-gray-900"
                      : "border-gray-200 bg-white text-gray-900 focus:border-[hsl(var(--accent-primary))] focus:ring-2 focus:ring-[hsl(var(--accent-primary))]"
                  } placeholder:normal-case placeholder:font-sans placeholder:text-gray-400`}
                  placeholder="e.g. GET10"
                  value={referralCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setReferralCode(val);
                  }}
                  onBlur={() => {
                    if (referralCode.trim()) {
                      validateReferralCode(referralCode);
                    }
                  }}
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {referralStatus === "validating" && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  {referralStatus === "valid" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {referralStatus === "invalid" && (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  {referralStatus === "idle" && (
                    <Gift className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Status & Feedback messages */}
              {referralStatus === "valid" && referralOffer && (
                <div className="p-3 xs:p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-500 text-emerald-950 text-xs shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-start gap-2 xs:gap-2.5">
                    <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {referralOffer.offerType === "subscription_discount" ? (
                        <>
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className="font-extrabold text-emerald-900 text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                              <span>Offer Applied:</span>
                              <span className="text-emerald-700 underline decoration-emerald-400 decoration-2">
                                {referralOffer.discountValue}{referralOffer.discountType === "fixed" ? "৳ BDT" : "%"} Discount on 1st Subscription!
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] xs:text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                              1st Package Discount
                            </span>
                          </div>

                          <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
                            {referralOffer.referrerName ? (
                              <>Special invite from <strong className="text-emerald-950 font-bold">{referralOffer.referrerName}</strong>! </>
                            ) : (
                              <>Promotional offer applied! </>
                            )}
                            You will get <strong className="text-emerald-950 font-bold">{referralOffer.discountValue}{referralOffer.discountType === "fixed" ? "৳" : "%"} off</strong> your very first paid subscription plan. Standard 5-day free trial applies now to build your store.
                          </p>
                        </>
                      ) : referralOffer.offerType === "both" ? (
                        <>
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className="font-extrabold text-emerald-900 text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                              <span>Double Offer Applied:</span>
                              <span className="text-emerald-700 underline decoration-emerald-400 decoration-2">
                                +{referralOffer.extraDays}d Trial + {referralOffer.discountValue}{referralOffer.discountType === "fixed" ? "৳" : "%"} Off!
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] xs:text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                              Total {referralOffer.totalDays} Days Trial
                            </span>
                          </div>

                          <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
                            {referralOffer.referrerName ? (
                              <>Special invite from <strong className="text-emerald-950 font-bold">{referralOffer.referrerName}</strong>! </>
                            ) : (
                              <>Promotional offer applied! </>
                            )}
                            You get <strong className="text-emerald-950 font-bold">+{referralOffer.extraDays} bonus trial days</strong> ({referralOffer.totalDays} days total trial) <strong className="text-emerald-950 font-bold">AND {referralOffer.discountValue}{referralOffer.discountType === "fixed" ? "৳" : "%"} discount</strong> on your first subscription purchase!
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className="font-extrabold text-emerald-900 text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                              <span>Offer Applied:</span>
                              <span className="text-emerald-700 underline decoration-emerald-400 decoration-2">
                                +{referralOffer.extraDays} Days Extra Free Trial
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] xs:text-[10px] font-extrabold tracking-wider uppercase shadow-2xs">
                              Total {referralOffer.totalDays} Days Trial
                            </span>
                          </div>

                          {referralOffer.referrerName ? (
                            <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
                              Special invite from <strong className="text-emerald-950 font-bold">{referralOffer.referrerName}</strong>! You get <strong className="text-emerald-950">+{referralOffer.extraDays} bonus trial days</strong> added on top of the standard 5 days, giving you <strong className="text-emerald-950">{referralOffer.totalDays} full days</strong> of free access.
                            </p>
                          ) : (
                            <p className="text-emerald-800 text-[11px] font-medium leading-relaxed">
                              Verified promotional offer! You get <strong className="text-emerald-950">+{referralOffer.extraDays} bonus trial days</strong> added on top of the standard 5 days, giving you <strong className="text-emerald-950">{referralOffer.totalDays} full days</strong> of free access.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {referralStatus === "validating" && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium animate-in fade-in duration-150">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  <span>Verifying referral code offer details...</span>
                </div>
              )}

              {referralStatus === "invalid" && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{referralError} (Standard 5-day trial will apply)</span>
                </div>
              )}

              {referralStatus === "idle" && (
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Enter a referral code to get extra free trial days for your store. Standard trial is 5 days. Leave blank if you don&apos;t have one.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-[hsl(var(--accent-primary))] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[hsl(var(--accent-primary))]/25 hover:shadow-[hsl(var(--accent-primary))]/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Store...</span>
                </div>
              ) : (
                "Create Store"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Already have a store?{" "}
              <Link
                href="/login"
                className="text-[hsl(var(--accent-primary))] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-3 border-[hsl(var(--accent-primary))] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

