"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Save,
  LogOut,
  Store,
  Shield,
  Phone,
  Mail,
  MapPin,
  Package,
  Building2,
  User,
  ImagePlus,
  Upload,
  Image as ImageIcon,
  X,
  Globe,
  Lock,
  Headphones,
  Sparkles,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightParam = searchParams.get("highlight") || searchParams.get("section");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [merchantUser, setMerchantUser] = useState<any>(null);

  // Store Online/Offline State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isOnlineByAdmin, setIsOnlineByAdmin] = useState<boolean>(true);
  const [updatingOnline, setUpdatingOnline] = useState<boolean>(false);

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [checkoutNote, setCheckoutNote] = useState("");
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [storeLogoPreview, setStoreLogoPreview] = useState<string>("");
  const storeLogoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    details: "",
    storeName: "",
    taxId: "",
    supportEmail: "",
    supportPhone: "",
    warrantyPeriod: "1 Year",
    returnPolicy: "14 Days",
  });

  // Store Setup Score & Dashboard Visibility
  const [storeSetup, setStoreSetup] = useState<any>(null);
  const [storeSlug, setStoreSlug] = useState<string>("");
  const [isSetupDismissedOnDashboard, setIsSetupDismissedOnDashboard] = useState<boolean>(false);
  const [isSetupCardExpanded, setIsSetupCardExpanded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("merchantUser") ||
        sessionStorage.getItem("merchantUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setMerchantUser(user);

        let extraDetails = {};
        try {
          if (user.details && user.details.startsWith("{")) {
            extraDetails = JSON.parse(user.details);
          }
        } catch (e) {}

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          details:
            user.details && !user.details.startsWith("{")
              ? user.details
              : (extraDetails as any).details || "",
          storeName: (extraDetails as any).storeName || user.name || "",
          taxId: (extraDetails as any).taxId || "",
          supportEmail: (extraDetails as any).supportEmail || user.email || "",
          supportPhone: (extraDetails as any).supportPhone || user.phone || "",
          warrantyPeriod: (extraDetails as any).warrantyPeriod || "1 Year",
          returnPolicy: (extraDetails as any).returnPolicy || "14 Days",
        });
        if (user.avatar?.secure_url) {
          setPreviewUrl(user.avatar.secure_url);
        }
      }
    } catch (e) {
      console.error("Failed to parse merchant user", e);
    }

    const fetchStoreSettings = async () => {
      try {
        const res = await api.get("/tenants/my-store");
        const data = res.data?.data;
        if (data) {
          setIsOnline(data.isOnline !== false);
          setIsOnlineByAdmin(data.isOnlineByAdmin !== false);
          if (data.name) {
            setFormData((prev) => ({
              ...prev,
              storeName: data.name || prev.storeName,
            }));
          }
          if (data.settings?.checkoutNote) {
            setCheckoutNote(data.settings.checkoutNote);
          }
          if (data.logo) {
            setStoreLogoPreview(data.logo);
          }
          if (data.slug) {
            setStoreSlug(data.slug);
            const isDismissed = localStorage.getItem(`hide_store_setup_score_${data.slug}`) === "true";
            setIsSetupDismissedOnDashboard(isDismissed);
          }
          if (data.contactEmail) {
            setFormData((prev) => ({ ...prev, supportEmail: data.contactEmail }));
          }
          if (data.contactPhone) {
            setFormData((prev) => ({ ...prev, supportPhone: data.contactPhone }));
          }
          if (data.contactAddress) {
            setFormData((prev) => ({ ...prev, address: data.contactAddress }));
          }
          if (data.description) {
            setFormData((prev) => ({ ...prev, details: prev.details || data.description }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch store settings", err);
      }
    };

    const fetchAnalyticsSummary = async () => {
      try {
        const res = await api.get("/analytics/dashboard-summary");
        if (res.data?.data?.storeSetup) {
          setStoreSetup(res.data.data.storeSetup);
        }
      } catch (err) {
        console.error("Failed to fetch store setup score in profile", err);
      }
    };

    fetchStoreSettings();
    fetchAnalyticsSummary();
  }, []);

  const handleToggleDashboardSetupCard = () => {
    const slug = storeSlug || merchantUser?.slug;
    if (!slug) {
      toast.error("Store slug not found");
      return;
    }
    const key = `hide_store_setup_score_${slug}`;
    if (isSetupDismissedOnDashboard) {
      localStorage.removeItem(key);
      setIsSetupDismissedOnDashboard(false);
      toast.success("Setup card will now appear on your main Dashboard!");
    } else {
      localStorage.setItem(key, "true");
      setIsSetupDismissedOnDashboard(true);
      toast.success("Setup card is now hidden from your main Dashboard.");
    }
  };

  useEffect(() => {
    if (highlightParam) {
      const targetId = highlightParam === "logo" ? "store-logo-section" : highlightParam === "contact" ? "customer-support-section" : null;
      if (targetId) {
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightParam]);

  const handleToggleStoreOnline = async () => {
    if (!isOnlineByAdmin) {
      toast.error(
        "Your store has been set offline by Super Admin. Please contact support to reactivate your storefront.",
      );
      return;
    }

    const newOnlineState = !isOnline;
    setUpdatingOnline(true);
    try {
      const res = await api.patch("/tenants/update-store", {
        isOnline: newOnlineState,
      });
      if (res.data?.data) {
        setIsOnline(res.data.data.isOnline !== false);
        toast.success(
          `Store is now ${newOnlineState ? "ONLINE 🟢" : "OFFLINE 🔴"}`,
        );
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to update store status";
      toast.error(message);
    } finally {
      setUpdatingOnline(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "supportPhone") {
      const numericValue = value.replace(/[^0-9+\-\s()]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 10MB");
      return;
    }
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(merchantUser?.avatar?.secure_url || null);
    }
  };

  const handleStoreLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Store Logo size must be less than 10MB");
        if (storeLogoInputRef.current) {
          storeLogoInputRef.current.value = "";
        }
        return;
      }
      setStoreLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidBDPhone = (phone?: string): boolean => {
    if (!phone || !phone.trim()) return true;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    return /^(?:\+?88|88)?01[3-9]\d{8}$/.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.phone && !isValidBDPhone(formData.phone)) {
      const msg =
        "Please enter a valid BD Personal Phone number (e.g. 01XXXXXXXXXX)";
      toast.error(msg);
      setError(msg);
      return;
    }
    if (formData.supportPhone && !isValidBDPhone(formData.supportPhone)) {
      const msg =
        "Please enter a valid BD Support Phone number (e.g. 01XXXXXXXXXX)";
      toast.error(msg);
      setError(msg);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      const detailsJson = JSON.stringify({
        details: formData.details,
        storeName: formData.storeName,
        taxId: formData.taxId,
        supportEmail: formData.supportEmail,
        supportPhone: formData.supportPhone,
        warrantyPeriod: formData.warrantyPeriod,
        returnPolicy: formData.returnPolicy,
      });

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("details", detailsJson);

      if (imageFile) {
        data.append("avatar", imageFile);
      }

      const storeData = new FormData();
      storeData.append("name", formData.storeName);
      storeData.append("checkoutNote", checkoutNote);
      if (formData.details) {
        storeData.append("description", formData.details);
      }
      if (storeLogo) {
        storeData.append("logo", storeLogo);
      }
      if (formData.supportEmail || formData.email) {
        storeData.append("contactEmail", formData.supportEmail || formData.email);
      }
      if (formData.supportPhone || formData.phone) {
        storeData.append("contactPhone", formData.supportPhone || formData.phone);
      }
      if (formData.address) {
        storeData.append("contactAddress", formData.address);
      }
      if (formData.returnPolicy) {
        storeData.append("returnPolicy", formData.returnPolicy);
      }
      if (formData.warrantyPeriod) {
        storeData.append("warrantyPeriod", formData.warrantyPeriod);
      }

      const [userResponse, storeResponse] = await Promise.all([
        api.put("/users/me", data, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        api.patch("/tenants/update-store", storeData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      ]);

      if (userResponse.data?.data) {
        localStorage.setItem(
          "merchantUser",
          JSON.stringify(userResponse.data.data),
        );
        sessionStorage.setItem(
          "merchantUser",
          JSON.stringify(userResponse.data.data),
        );
        setMerchantUser(userResponse.data.data);
      }

      toast.success("Profile & Store Settings updated!");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    if (
      confirm(
        "Are you sure you want to logout from all devices? You will be logged out of this session as well.",
      )
    ) {
      try {
        await api.post("/auth/logout-all");
      } catch (err) {
        console.error("Logout all failed", err);
      } finally {
        localStorage.removeItem("merchantToken");
        sessionStorage.removeItem("merchantToken");
        localStorage.removeItem("merchantUser");
        sessionStorage.removeItem("merchantUser");
        router.push("/login");
      }
    }
  };

  return (
    <div className="p-3 sm:p-5 w-full max-w-[1600px] mx-auto min-h-screen">
      {/* Compact Header Sectio      {/* Compact Header Section */}
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] shadow-md p-3.5 sm:p-5 text-white">
        {/* Top bar on all devices: Store Info on left, Sign Out on right */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Merchant / Store Avatar */}
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md shrink-0 group relative overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Store Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                </div>
              )}
              <label 
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10"
                title="Change Avatar"
              >
                <ImagePlus className="w-4 h-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageChange(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Store Name & Subtitle */}
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold tracking-tight truncate max-w-[150px] xs:max-w-[200px] sm:max-w-xs">
                {formData.storeName || "Your Store"}
              </h1>
              <p className="text-indigo-200 text-[11px] sm:text-xs font-medium flex items-center gap-1 truncate">
                <Store className="w-3 h-3 shrink-0" /> Merchant Profile
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Store Logo Container */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-9 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1.5 rounded-xl shadow-xs transition-all">
              <div 
                onClick={() => storeLogoInputRef.current?.click()}
                className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-xs cursor-pointer group/logo relative border border-white/30 bg-black/20"
                title="Click to change Store Logo"
              >
                {storeLogoPreview ? (
                  <img
                    src={storeLogoPreview}
                    alt="Store Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/10">
                    <ImageIcon className="w-5 h-5 text-indigo-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Store Logo
                  </span>
                  {storeLogoPreview && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => storeLogoInputRef.current?.click()}
                  className="text-xs font-semibold text-white hover:text-indigo-200 transition-colors flex items-center gap-1 underline underline-offset-2 decoration-white/40 hover:decoration-white cursor-pointer"
                >
                  <Upload className="w-3 h-3 shrink-0" />
                  <span>{storeLogoPreview ? "Change Logo" : "Upload Logo"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogoutAll}
            className="group bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border border-white/20 shrink-0 whitespace-nowrap ml-auto"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Sign Out All</span>
            <span className="xs:hidden">Sign Out</span>
          </button>
        </div>

        {/* Mobile-Only Store Logo Card (Clean, full-width, perfectly aligned) */}
        <div className="sm:hidden mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              onClick={() => storeLogoInputRef.current?.click()}
              className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-xs cursor-pointer group/logo relative border border-white/30 bg-black/20"
              title="Click to change Store Logo"
            >
              {storeLogoPreview ? (
                <img
                  src={storeLogoPreview}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <ImageIcon className="w-4 h-4 text-indigo-300" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                  Store Logo
                </span>
                {storeLogoPreview && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-indigo-200/80 truncate">Official storefront logo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => storeLogoInputRef.current?.click()}
            className="text-[11px] font-semibold text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-white/20 shrink-0"
          >
            <Upload className="w-3 h-3" />
            <span>{storeLogoPreview ? "Change" : "Upload"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg border border-red-200 shadow-xs text-xs mb-4 flex items-center gap-2 font-medium">
          <Shield className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left Main Column: Status, Personal, Store Identity */}
          <div className="xl:col-span-2 space-y-4">
            {/* Compact Storefront Status Bar */}
            <Card className="border border-gray-200/80 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${isOnline ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-gray-900 whitespace-nowrap">
                        Storefront Status
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          isOnline
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isOnline ? "🟢 ONLINE" : "🔴 OFFLINE"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate sm:whitespace-normal">
                      {isOnline
                        ? "Store website is live for customers."
                        : "Store website is currently hidden from buyers."}
                    </p>
                  </div>
                </div>

                {!isOnlineByAdmin ? (
                  <Link
                    href="/dashboard/support"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors shrink-0 whitespace-nowrap"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-700" /> Locked
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={updatingOnline}
                    onClick={handleToggleStoreOnline}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        isOnline ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              </div>

              {!isOnlineByAdmin && (
                <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 flex items-center justify-between gap-2">
                  <span>
                    🔒 Store locked offline by Authority. Contact Authority to
                    reactivate.
                  </span>
                  <Link
                    href="/dashboard/support"
                    className="font-bold underline text-amber-950"
                  >
                    Contact Support
                  </Link>
                </div>
              )}
            </Card>

            {/* Personal Information */}
            <Card className="border border-gray-200/80 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Personal Contact Info
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <div>
                    <Input
                      label="Personal Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />
                    {formData.phone && !isValidBDPhone(formData.phone) && (
                      <p className="text-[10px] text-red-500 mt-0.5 font-medium">
                        Valid BD phone required (01XXXXXXXXX)
                      </p>
                    )}
                  </div>
                </div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="merchant@store.com"
                  required
                />
              </div>
            </Card>

            {/* Store Identity */}
            <Card id="store-logo-section" className="border border-gray-200/80 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Store Identity & Logo
                  </h3>
                </div>

                {/* Compact Store Logo Selector */}
                <div className="flex items-center gap-2.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                  <div 
                    onClick={() => storeLogoInputRef.current?.click()}
                    className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0 cursor-pointer"
                    title="Change Store Logo"
                  >
                    {storeLogoPreview ? (
                      <img
                        src={storeLogoPreview}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={storeLogoInputRef}
                    onChange={handleStoreLogoChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => storeLogoInputRef.current?.click()}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-800 transition-colors cursor-pointer"
                  >
                    Change Logo
                  </button>
                  <span className="text-[9px] text-gray-400 border-l border-gray-200 pl-2 hidden sm:inline">
                    png/jpg, max 2MB
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Store Name"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="E.g. Astha Mart"
                  />
                  <Input
                    label="Tax / Business ID"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="Trade License / VAT ID"
                  />
                </div>
                <Input
                  label="Business Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete business address"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Textarea
                    label="About Store"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Short description for customers..."
                    rows={2}
                  />
                  <Textarea
                    label="Checkout Note (Optional)"
                    name="checkoutNote"
                    value={checkoutNote}
                    onChange={(e) => setCheckoutNote(e.target.value)}
                    placeholder="Note shown on checkout page..."
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Customer Support, Policies & Store Setup */}
          <div className="space-y-4">
            {/* Store Setup & Aesthetic Checklist Card */}
            <Card id="store-setup-section" className="border border-purple-200/80 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white px-3.5 py-3 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#5022C3]/10 text-[#5022C3] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
                      <span>Store Setup & Checklist</span>
                      {storeSetup && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            storeSetup.score === 100
                              ? "bg-emerald-100 text-emerald-800"
                              : storeSetup.score >= 70
                              ? "bg-purple-100 text-[#5022C3]"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {storeSetup.score}% {storeSetup.score === 100 ? "Ready" : "Done"}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate">
                      {isSetupDismissedOnDashboard
                        ? "Currently hidden from Dashboard"
                        : "Currently visible on Dashboard"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Collapse / Expand Button */}
                  <button
                    type="button"
                    onClick={() => setIsSetupCardExpanded(!isSetupCardExpanded)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[#5022C3] transition-all flex items-center gap-1 cursor-pointer"
                    title={isSetupCardExpanded ? "Collapse checklist steps" : "Expand checklist steps"}
                  >
                    <span>{isSetupCardExpanded ? "Collapse" : "Expand"}</span>
                    {isSetupCardExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Toggle Show/Hide on Dashboard Button */}
                  <button
                    type="button"
                    onClick={handleToggleDashboardSetupCard}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isSetupDismissedOnDashboard
                        ? "bg-[#5022C3] text-white border-[#5022C3] hover:bg-[#431ca7] shadow-xs"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                    title={isSetupDismissedOnDashboard ? "Display this card on your main dashboard" : "Hide this card from your main dashboard"}
                  >
                    {isSetupDismissedOnDashboard ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show on Dashboard</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        <span>Hide from Dashboard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                {/* Progress Bar */}
                {storeSetup && (
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="font-semibold text-gray-700">Setup Progress</span>
                      <span className="font-bold text-[#5022C3]">
                        {storeSetup.requiredCompletedCount ?? storeSetup.completedCount} of {storeSetup.requiredTotalCount ?? 7} core tasks
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          storeSetup.score === 100
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-violet-500 to-[#5022C3]"
                        }`}
                        style={{ width: `${storeSetup.score}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklist Items (Collapsible) */}
                {isSetupCardExpanded && (
                  <>
                    {storeSetup?.steps ? (
                      <div className="space-y-1.5 pt-1">
                        {storeSetup.steps.map((step: any) => {
                          const isDone = step.isCompleted;
                          return (
                            <Link
                              key={step.id}
                              href={step.link}
                              onClick={(e) => {
                                if (step.id === "logo") {
                                  e.preventDefault();
                                  storeLogoInputRef.current?.click();
                                } else if (step.id === "contact" || step.id === "policies") {
                                  e.preventDefault();
                                  document.getElementById("customer-support-section")?.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                                isDone
                                  ? "bg-emerald-50/40 border-emerald-100 text-gray-700 hover:bg-emerald-50"
                                  : "bg-gray-50 border-gray-100 text-gray-800 hover:bg-purple-50/60 hover:border-purple-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`font-semibold truncate ${isDone ? "text-gray-700" : "text-gray-900"}`}>
                                      {step.title}
                                    </span>
                                    {step.isOptional && (
                                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1 rounded">
                                        Optional
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 truncate">
                                    {step.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                {isDone ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                    Done
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-[#5022C3] flex items-center">
                                    Fix <ChevronRight className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-gray-400 animate-pulse">
                        Loading setup checklist...
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            <Card id="customer-support-section" className="border border-gray-200/80 shadow-xs rounded-xl overflow-hidden bg-white">
              <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-2.5 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Support & Policies
                </h3>
              </div>
              <div className="p-4 space-y-3.5">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Customer
                    Support Line
                  </h4>
                  <Input
                    label="Support Email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    placeholder="support@store.com"
                  />
                  <div>
                    <Input
                      label="Support Phone"
                      name="supportPhone"
                      type="tel"
                      value={formData.supportPhone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />
                    {formData.supportPhone &&
                      !isValidBDPhone(formData.supportPhone) && (
                        <p className="text-[10px] text-red-500 mt-0.5 font-medium">
                          Valid BD phone required (01XXXXXXXXX)
                        </p>
                      )}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                    <Shield className="w-3.5 h-3.5 text-gray-400" /> Store
                    Policy Defaults
                  </h4>
                  <Select
                    label="Default Warranty"
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleChange as any}
                    options={[
                      { value: "None", label: "None" },
                      { value: "3 Months", label: "3 Months" },
                      { value: "6 Months", label: "6 Months" },
                      { value: "1 Year", label: "1 Year" },
                      { value: "2 Years", label: "2 Years" },
                    ]}
                  />
                  <Select
                    label="Return Policy"
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleChange as any}
                    options={[
                      { value: "No Returns", label: "No Returns" },
                      { value: "7 Days", label: "7 Days" },
                      { value: "14 Days", label: "14 Days" },
                      { value: "30 Days", label: "30 Days" },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* Quick Save Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save All Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Floating Compact Bar */}
        <div className="fixed bottom-4 right-4 z-30">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-70 cursor-pointer border border-white/20"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
