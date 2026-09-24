"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // Frontend Validation
    const errors: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please provide a valid email address";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
        throw new Error(data.message || "Failed to send OTP");
      }

      toast.success("OTP sent successfully to your email");
      setResetToken(data.data?.resetToken || data.resetToken);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    // Frontend Validation
    const errors: Record<string, string> = {};
    if (!otp.trim()) errors.otp = "OTP is required";
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
      const res = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, otp, password }),
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
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully. Redirecting to login...");
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
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
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="Secure access"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/90 to-gray-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <img
                src="/MEasy.png"
                alt="MASH ECO Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MASH ECO
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
            Secure access to your store.
          </h1>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed max-w-md">
            Don't worry if you've lost your password. We'll help you securely
            recover your account so you can get back to managing your
            online business.
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">
                Enterprise-grade security
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">
                Instant OTP recovery process
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-y-auto">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <img
            src="/MEasy.png"
            alt="MASH ECO"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            MASH ECO
          </span>
        </div>

        <div className="w-full max-w-md mt-10 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === 1
                ? "Enter your email below to receive an OTP."
                : "Enter the OTP and your new password to restore access."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="flex flex-col gap-5">
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
                  placeholder="admin@mystore.com"
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

              <button
                type="submit"
                className="mt-2 w-full bg-[hsl(var(--accent-primary))] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[hsl(var(--accent-primary))]/25 hover:shadow-[hsl(var(--accent-primary))]/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-5"
              autoComplete="off"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="otp_code_123"
                  className="text-sm font-semibold text-gray-700"
                >
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  id="otp_code_123"
                  name="random_unrecognized_name_12345"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.otp ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-center text-lg tracking-[0.5em] font-bold focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal`}
                  placeholder="••••••"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {fieldErrors.otp && (
                  <span className="text-xs text-red-500 font-medium text-center">
                    {fieldErrors.otp}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`w-full px-4 py-3 rounded-xl border ${fieldErrors.password ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"} text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400 pr-10`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="text-xs text-red-500 font-medium">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-[hsl(var(--accent-primary))] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[hsl(var(--accent-primary))]/25 hover:shadow-[hsl(var(--accent-primary))]/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                disabled={loading || isSuccess}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-[hsl(var(--accent-primary))] font-semibold hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
