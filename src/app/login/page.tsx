"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Frontend Validation
    const errors: Record<string, string> = {};
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
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        throw new Error(data.message || "Login failed");
      }

      const user = data.data.user;
      if (user && user.role !== "tenant_admin") {
        throw new Error("Access denied. Merchant account required.");
      }

      sessionStorage.setItem("merchantUser", JSON.stringify(user));
      router.push("/dashboard");
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
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="Electronics setup"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
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
              masheco
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
            Manage your electronics business effortlessly.
          </h1>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed max-w-md">
            Join the premier multi-tenant platform designed specifically for
            electronics merchants. Scale your sales, manage inventory, and grow
            your brand.
          </p>

          <div className="flex flex-col gap-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-2 rounded-lg">
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
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">
                  Built for Rising Businesses
                </span>
                <span className="text-xs text-gray-400">
                  Everything you need to scale your electronics brand.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-6 sm:p-12 lg:p-16 xl:p-24 relative">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <img
            src="/MEasy.png"
            alt="MASH ECO"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            masheco
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Please enter your details to sign in to your dashboard.
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

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email
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

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot"
                  className="text-xs text-[hsl(var(--accent-primary))] font-semibold hover:text-[hsl(var(--accent-primary))]/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Don't have a merchant account?{" "}
              <Link
                href="/register"
                className="text-[hsl(var(--accent-primary))] font-semibold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
