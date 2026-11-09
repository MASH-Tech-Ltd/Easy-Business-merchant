"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Package,
  User,
  Phone,
  MapPin,
  Mail,
  FileText,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Truck,
  Tag,
  CreditCard,
  MessageCircle,
  PhoneCall,
  Store,
  Globe,
  Share2,
  X,
  Check,
  ClipboardPlus,
} from "lucide-react";
import { api } from "@/utils/api";
import { getMerchantProductThumbnailUrl } from "@/utils/imageOptimizer";
import { bdLocations } from "@/data/locations";
import { toast } from "react-hot-toast";

interface ProductVariant {
  _id?: string;
  color?: string;
  size?: string;
  stock: number;
  sku?: string;
}

interface Product {
  _id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  images?: { secure_url: string }[];
  status?: string;
  stock?: number;
  sku?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  categoryId?: { _id: string; name: string };
}

interface SelectedOrderItem {
  key: string;
  productId: string;
  variantId?: string;
  color?: string;
  size?: string;
  title: string;
  price: number;
  quantity: number;
  maxStock: number;
  image: string;
}

interface ShippingZone {
  name: string;
  cost: number;
  division?: string;
  districts?: string[];
}

interface CustomerRecord {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
}

const ORDER_SOURCES = [
  { id: "Facebook", label: "Facebook", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "Messenger", label: "Messenger", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "WhatsApp", label: "WhatsApp", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "Phone Call", label: "Phone Call", badgeColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "Instagram", label: "Instagram", badgeColor: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "Walk-in", label: "Walk-in", badgeColor: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "Other", label: "Other", badgeColor: "bg-gray-100 text-gray-700 border-gray-200" },
] as const;

type OrderSourceType = (typeof ORDER_SOURCES)[number]["id"];

function computeZoneShipping(
  division: string,
  district: string,
  zones: ShippingZone[] = [],
  defaultCost = 120
): { cost: number; zoneName: string | null } {
  if (!zones || zones.length === 0) return { cost: defaultCost, zoneName: null };

  for (const zone of zones) {
    if (
      zone.division === division &&
      Array.isArray(zone.districts) &&
      zone.districts.length > 0 &&
      zone.districts.includes(district)
    ) {
      return { cost: zone.cost, zoneName: zone.name };
    }
  }

  for (const zone of zones) {
    if (
      zone.division === division &&
      (!zone.districts || zone.districts.length === 0)
    ) {
      return { cost: zone.cost, zoneName: zone.name };
    }
  }

  for (const zone of zones) {
    if (!zone.division && (!zone.districts || zone.districts.length === 0)) {
      return { cost: zone.cost, zoneName: zone.name };
    }
  }

  return { cost: defaultCost, zoneName: null };
}

export default function ManualOrderPage() {
  const router = useRouter();

  // Catalog search & products
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");

  // Variant picker modal state
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [variantModalQty, setVariantModalQty] = useState<number>(1);

  // Selected items in order
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);

  // Customer info state
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [matchedCustomer, setMatchedCustomer] = useState<CustomerRecord | null>(null);
  const [lookingUpCustomer, setLookingUpCustomer] = useState(false);

  // Delivery location state
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [upazila, setUpazila] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Order source
  const [orderSource, setOrderSource] = useState<OrderSourceType>("Facebook");

  // Shipping & pricing state
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [defaultShippingCost, setDefaultShippingCost] = useState<number>(120);
  const [customShippingCharge, setCustomShippingCharge] = useState<string>("");
  const [isCustomShipping, setIsCustomShipping] = useState(false);
  const [discountInput, setDiscountInput] = useState<string>("0");
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "paid">("unpaid");
  const [isDeliveryChargePaid, setIsDeliveryChargePaid] = useState(false);

  // Submission & created order state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [isConfirmingNow, setIsConfirmingNow] = useState(false);

  // Fetch merchant shipping zones from theme
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const res = await api.get("/themes/my-theme");
        const theme = res.data?.data;
        if (theme) {
          if (Array.isArray(theme.shippingZones)) {
            setShippingZones(theme.shippingZones);
          }
          if (typeof theme.defaultShippingCost === "number") {
            setDefaultShippingCost(theme.defaultShippingCost);
          }
        }
      } catch (err) {
        console.error("Error loading shipping zones:", err);
      }
    };
    fetchThemeSettings();
  }, []);

  // Debounce product search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Fetch merchant's own products
  useEffect(() => {
    const fetchMyProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await api.get("/products/my-products", {
          params: {
            page: 1,
            limit: 24,
            search: debouncedProductSearch || undefined,
          },
        });
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch store products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchMyProducts();
  }, [debouncedProductSearch]);

  // Existing customer lookup by phone number
  useEffect(() => {
    const cleanDigits = customerPhone.replace(/[\s\-()]/g, "").trim();
    const normalizedPhone = cleanDigits.startsWith("+880")
      ? "0" + cleanDigits.slice(4)
      : cleanDigits.startsWith("880")
        ? "0" + cleanDigits.slice(3)
        : cleanDigits;

    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      setMatchedCustomer(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLookingUpCustomer(true);
      try {
        const res = await api.get("/customers/my-customers", {
          params: { search: normalizedPhone, limit: 5 },
        });
        const list: CustomerRecord[] = res.data?.data || [];
        const exact = list.find((c) => {
          const cPhone = (c.phone || "").replace(/[\s\-()]/g, "").trim();
          return cPhone === normalizedPhone || cPhone.endsWith(normalizedPhone);
        });
        if (exact) {
          setMatchedCustomer(exact);
          if (!customerName.trim()) {
            setCustomerName(exact.name || "");
          }
          if (!customerEmail.trim() && exact.email) {
            setCustomerEmail(exact.email);
          }
        } else {
          setMatchedCustomer(null);
        }
      } catch (err) {
        setMatchedCustomer(null);
      } finally {
        setLookingUpCustomer(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [customerPhone]);

  // Location dropdown lists
  const divisionsList = useMemo(() => bdLocations.map((d) => d.division), []);
  const districtsList = useMemo(
    () => bdLocations.find((d) => d.division === division)?.districts || [],
    [division]
  );
  const upazilasList = useMemo(
    () => districtsList.find((d) => d.district === district)?.upazilas || [],
    [districtsList, district]
  );

  // Keep district & upazila synced when division/district changes
  useEffect(() => {
    if (districtsList.length > 0 && !districtsList.some((d) => d.district === district)) {
      setDistrict(districtsList[0].district);
    }
  }, [division, districtsList, district]);

  useEffect(() => {
    if (upazilasList.length > 0 && !upazilasList.includes(upazila)) {
      setUpazila(upazilasList[0]);
    } else if (upazilasList.length === 0) {
      setUpazila("");
    }
  }, [district, upazilasList, upazila]);

  // Compute zone shipping charge
  const { cost: zoneShippingCost, zoneName: matchedZoneName } = useMemo(
    () => computeZoneShipping(division, district, shippingZones, defaultShippingCost),
    [division, district, shippingZones, defaultShippingCost]
  );

  useEffect(() => {
    if (!isCustomShipping) {
      setCustomShippingCharge(String(zoneShippingCost));
    }
  }, [zoneShippingCost, isCustomShipping]);

  // Add product handler
  const handleSelectProduct = (product: Product) => {
    const isActive = !product.status || product.status.toUpperCase() === "ACTIVE";
    if (!isActive) {
      toast.error(`"${product.title}" is currently ${product.status?.toLowerCase()} and cannot be added.`);
      return;
    }

    const totalStock = product.stock ?? 0;
    if (totalStock <= 0) {
      toast.error(`"${product.title}" is out of stock.`);
      return;
    }

    // If product has variants, open variant picker modal
    if (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0) {
      const firstAvailableIdx = product.variants.findIndex((v) => (v.stock ?? 0) > 0);
      if (firstAvailableIdx === -1) {
        toast.error(`All variants of "${product.title}" are out of stock.`);
        return;
      }
      setVariantModalProduct(product);
      setSelectedVariantIndex(firstAvailableIdx);
      setVariantModalQty(1);
      return;
    }

    // Non-variant product: add directly
    const itemKey = `${product._id}_base`;
    const unitPrice = product.discountedPrice ?? product.originalPrice ?? 0;
    const image = product.images?.[0]?.secure_url || "";

    setSelectedItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.key === itemKey);
      if (existingIdx > -1) {
        const current = prev[existingIdx];
        if (current.quantity + 1 > totalStock) {
          toast.error(`Maximum available stock (${totalStock}) reached for "${product.title}".`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIdx] = { ...current, quantity: current.quantity + 1 };
        toast.success(`Increased quantity of "${product.title}"`);
        return updated;
      }

      toast.success(`Added "${product.title}" to order`);
      return [
        ...prev,
        {
          key: itemKey,
          productId: product._id,
          title: product.title,
          price: unitPrice,
          quantity: 1,
          maxStock: totalStock,
          image,
        },
      ];
    });
  };

  // Confirm adding variant from modal
  const handleConfirmVariantSelection = () => {
    if (!variantModalProduct || !variantModalProduct.variants) return;
    const variant = variantModalProduct.variants[selectedVariantIndex];
    if (!variant) return;

    const varStock = variant.stock ?? 0;
    if (varStock <= 0) {
      toast.error("Selected variant is out of stock.");
      return;
    }

    const itemKey = `${variantModalProduct._id}_${variant._id || `${variant.color || ""}-${variant.size || ""}`}`;
    const unitPrice = variantModalProduct.discountedPrice ?? variantModalProduct.originalPrice ?? 0;
    const image = variantModalProduct.images?.[0]?.secure_url || "";

    setSelectedItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.key === itemKey);
      if (existingIdx > -1) {
        const current = prev[existingIdx];
        if (current.quantity + variantModalQty > varStock) {
          toast.error(`Only ${varStock} unit(s) available for this variant.`);
          return prev;
        }
        const updated = [...prev];
        updated[existingIdx] = {
          ...current,
          quantity: current.quantity + variantModalQty,
        };
        return updated;
      }

      if (variantModalQty > varStock) {
        toast.error(`Only ${varStock} unit(s) available for this variant.`);
        return prev;
      }

      return [
        ...prev,
        {
          key: itemKey,
          productId: variantModalProduct._id,
          variantId: variant._id,
          color: variant.color,
          size: variant.size,
          title: variantModalProduct.title,
          price: unitPrice,
          quantity: variantModalQty,
          maxStock: varStock,
          image,
        },
      ];
    });

    toast.success(`Added "${variantModalProduct.title}" to order`);
    setVariantModalProduct(null);
  };

  const handleUpdateItemQuantity = (key: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.key !== key) return item;
        const nextQty = item.quantity + delta;
        if (nextQty < 1) return item;
        if (nextQty > item.maxStock) {
          toast.error(`Only ${item.maxStock} unit(s) available in stock.`);
          return item;
        }
        return { ...item, quantity: nextQty };
      })
    );
  };

  const handleRemoveItem = (key: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.key !== key));
  };

  // Financial Calculations
  const subTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  const totalItemsQty = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const effectiveShippingCharge = useMemo(() => {
    const parsed = Number(customShippingCharge);
    if (!isNaN(parsed) && parsed >= 0) return Math.round(parsed);
    return zoneShippingCost;
  }, [customShippingCharge, zoneShippingCost]);

  const effectiveDiscount = useMemo(() => {
    const parsed = Number(discountInput);
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(subTotal, Math.round(parsed));
  }, [discountInput, subTotal]);

  const finalTotal = useMemo(() => {
    const netProducts = Math.max(0, subTotal - effectiveDiscount);
    return isDeliveryChargePaid ? netProducts : netProducts + effectiveShippingCharge;
  }, [subTotal, effectiveDiscount, effectiveShippingCharge, isDeliveryChargePaid]);

  const formattedFullAddress = useMemo(() => {
    const parts = [streetAddress.trim(), upazila, district, division].filter(Boolean);
    return parts.join(", ");
  }, [streetAddress, upazila, district, division]);

  // Submit Manual Order
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      toast.error("Please enter the customer's name (at least 2 characters).");
      return;
    }

    const cleanPhone = customerPhone.replace(/[\s\-()]/g, "").trim();
    if (!/^(?:\+?88|88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 11-digit BD phone number (e.g. 01712345678).");
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 3) {
      toast.error("Please enter the customer's street/delivery address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        ...(customerEmail.trim() ? { customerEmail: customerEmail.trim() } : {}),
        shippingAddress: formattedFullAddress,
        ...(orderNote.trim() ? { note: orderNote.trim() } : {}),
        orderSource,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          ...(item.variantId ? { variantId: item.variantId } : {}),
          ...(item.color ? { color: item.color } : {}),
          ...(item.size ? { size: item.size } : {}),
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        discount: effectiveDiscount,
        shippingCharge: effectiveShippingCharge,
        isDeliveryChargePaid,
        paymentStatus,
      };

      const res = await api.post("/orders/manual-order", payload);
      const savedOrder = res.data?.data;
      toast.success(`Manual Order #${savedOrder?.orderId || ""} created successfully!`);
      setCreatedOrder(savedOrder);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create manual order";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional 1-click Confirm right from the success modal after calling customer
  const handleConfirmCreatedOrderNow = async () => {
    if (!createdOrder?._id) return;
    setIsConfirmingNow(true);
    try {
      await api.patch(`/orders/update-order/${createdOrder._id}`, {
        status: "confirmed",
      });
      toast.success(`Order #${createdOrder.orderId} confirmed and stock updated!`);
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsConfirmingNow(false);
    }
  };

  const handleResetForm = () => {
    setSelectedItems([]);
    setCustomerPhone("");
    setCustomerName("");
    setCustomerEmail("");
    setMatchedCustomer(null);
    setStreetAddress("");
    setOrderNote("");
    setDiscountInput("0");
    setPaymentStatus("unpaid");
    setIsDeliveryChargePaid(false);
    setCreatedOrder(null);
  };

  return (
    <div className="w-full min-h-full bg-[#F8FAFC] p-3 sm:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-5">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/orders"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shrink-0"
              title="Back to Orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">
                  Create Manual Order
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5022C3] border border-purple-200">
                  Offline & Social Channels
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Record orders from Facebook, Messenger, WhatsApp, or phone calls using your live store catalog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/dashboard/orders"
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>

        {/* Main Two-Column Grid */}
        <form onSubmit={handleCreateManualOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN (7 Cols): Product Selection & Selected Items */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Product Catalog Search & Picker */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfcfc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#5022C3] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      1. Select Store Products
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Click any active in-stock product to add it to this order
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3] w-full bg-white"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 max-h-[380px] overflow-y-auto custom-scrollbar">
                {loadingProducts ? (
                  <div className="py-12 text-center text-gray-500 text-sm">
                    <div className="w-7 h-7 border-3 border-purple-200 border-t-[#5022C3] rounded-full animate-spin mx-auto mb-3"></div>
                    Loading store products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-10 text-center">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">No matching products found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try a different search term or add products in Products Management.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((product) => {
                      const isActive = !product.status || product.status.toUpperCase() === "ACTIVE";
                      const stock = product.stock ?? 0;
                      const isOut = !isActive || stock <= 0;
                      const sellingPrice = product.discountedPrice ?? product.originalPrice ?? 0;
                      const inOrderQty = selectedItems
                        .filter((i) => i.productId === product._id)
                        .reduce((s, i) => s + i.quantity, 0);

                      return (
                        <div
                          key={product._id}
                          onClick={() => !isOut && handleSelectProduct(product)}
                          className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            isOut
                              ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                              : inOrderQty > 0
                                ? "bg-purple-50/40 border-[#5022C3] cursor-pointer shadow-2xs"
                                : "bg-white border-gray-200 hover:border-[#5022C3] hover:shadow-xs cursor-pointer"
                          }`}
                        >
                          <div className="w-14 h-14 rounded-lg border border-gray-200 bg-white p-1 shrink-0 overflow-hidden">
                            <img
                              src={
                                getMerchantProductThumbnailUrl(
                                  product.images?.[0]?.secure_url
                                ) || "/placeholder.png"
                              }
                              alt={product.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#5022C3] transition-colors">
                              {product.title}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs sm:text-sm font-extrabold text-[#5022C3]">
                                ৳{sellingPrice.toLocaleString()}
                              </span>
                              {product.originalPrice > sellingPrice && (
                                <span className="text-[11px] text-gray-400 line-through">
                                  ৳{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  !isActive
                                    ? "bg-gray-200 text-gray-700"
                                    : stock > 0
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                              >
                                {!isActive
                                  ? product.status
                                  : stock > 0
                                    ? `${stock} in stock`
                                    : "Out of stock"}
                              </span>

                              {product.hasVariants &&
                                product.variants &&
                                product.variants.length > 0 && (
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                    {product.variants.length} Variants
                                  </span>
                                )}

                              {inOrderQty > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5022C3] text-white">
                                  Added ({inOrderQty})
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isOut}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isOut
                                ? "bg-gray-200 text-gray-400"
                                : "bg-purple-100 text-[#5022C3] group-hover:bg-[#5022C3] group-hover:text-white"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Selected Order Items List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fcfcfc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      2. Selected Order Items ({selectedItems.length})
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Adjust quantities or remove products before creating the order
                    </p>
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <span className="text-xs font-bold text-[#5022C3] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    {totalItemsQty} Unit{totalItemsQty !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="p-4">
                {selectedItems.length === 0 ? (
                  <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <ShoppingBag className="w-9 h-9 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">
                      No products selected yet
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Click on products from the catalog above to add them to this manual order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 p-1 shrink-0 overflow-hidden">
                            <img
                              src={
                                getMerchantProductThumbnailUrl(item.image) ||
                                "/placeholder.png"
                              }
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {item.title}
                            </h4>
                            {(item.color || item.size) && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {item.color && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                    Color: {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    Size: {item.size}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              Unit Price:{" "}
                              <span className="font-semibold text-gray-800">
                                ৳{item.price.toLocaleString()}
                              </span>{" "}
                              • Max Stock: {item.maxStock}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(item.key, -1)}
                              className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs sm:text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(item.key, 1)}
                              className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[85px]">
                            <div className="text-xs sm:text-sm font-extrabold text-gray-900">
                              ৳{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-gray-400">Line Total</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.key)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Order Source Selection */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    3. Order Source Channel
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Select how the customer contacted you to place this order
                  </p>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ORDER_SOURCES.map((src) => {
                  const active = orderSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setOrderSource(src.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        active
                          ? "border-[#5022C3] bg-purple-50 text-[#5022C3] shadow-2xs ring-1 ring-[#5022C3]"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{src.label}</span>
                      {active && <Check className="w-4 h-4 text-[#5022C3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols): Customer Details & Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            {/* 4. Customer Information */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      4. Customer & Delivery Details
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Enter phone number first to auto-check existing customers
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {/* Phone Number with Auto-Lookup */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    {lookingUpCustomer && (
                      <span className="text-[11px] text-purple-600 font-medium">
                        Checking customer record...
                      </span>
                    )}
                    {!lookingUpCustomer && matchedCustomer && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Existing Customer ({matchedCustomer.totalOrders} orders)
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                  />
                </div>

                {/* Customer Name & Optional Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="customer@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                    />
                  </div>
                </div>

                {/* Division / District / Upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#5022C3]"
                    >
                      {divisionsList.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#5022C3]"
                    >
                      {districtsList.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Area / Upazila <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:border-[#5022C3]"
                    >
                      {upazilasList.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Full Delivery Address (House, Road, Landmark){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. House 12, Road 5, Block C..."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                  />
                  {streetAddress.trim() && (
                    <p className="text-[11px] text-gray-500 mt-1 truncate">
                      Formatted: <span className="font-medium text-gray-700">{formattedFullAddress}</span>
                    </p>
                  )}
                </div>

                {/* Order Note */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Order Note / Instructions{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver after 5 PM..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Order Summary & Pricing */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      5. Order Summary & Payment
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      Review charges before creating the manual order
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#5022C3] border border-purple-200">
                  Source: {orderSource}
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery Charge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700">
                        Delivery Charge (BDT)
                      </label>
                      {matchedZoneName && !isCustomShipping && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                          Zone: {matchedZoneName}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={customShippingCharge}
                      onChange={(e) => {
                        setIsCustomShipping(true);
                        setCustomShippingCharge(e.target.value);
                      }}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5022C3]"
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Discount (BDT)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={subTotal}
                      value={discountInput}
                      onChange={(e) => setDiscountInput(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5022C3]"
                    />
                  </div>
                </div>

                {/* Payment Status & Advance Delivery Charge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as "unpaid" | "paid")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white font-semibold text-gray-700 focus:outline-none focus:border-[#5022C3]"
                    >
                      <option value="unpaid">Unpaid (Cash on Delivery)</option>
                      <option value="paid">Paid in Full</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="w-full flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={isDeliveryChargePaid}
                        onChange={(e) => setIsDeliveryChargePaid(e.target.checked)}
                        className="w-4 h-4 text-[#5022C3] rounded focus:ring-[#5022C3]"
                      />
                      <span className="text-xs font-bold text-gray-700">
                        Delivery Charge Paid in Advance
                      </span>
                    </label>
                  </div>
                </div>

                {/* Breakdown Box */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>
                      Subtotal ({selectedItems.length} item
                      {selectedItems.length !== 1 ? "s" : ""}, {totalItemsQty} qty)
                    </span>
                    <span className="font-bold text-gray-900">
                      {subTotal.toLocaleString()} BDT
                    </span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-emerald-700">
                      <span>Discount</span>
                      <span className="font-bold">
                        - {effectiveDiscount.toLocaleString()} BDT
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>
                      Delivery Charge{" "}
                      {isDeliveryChargePaid && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded ml-1">
                          PAID IN ADVANCE
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-gray-900">
                      {effectiveShippingCharge.toLocaleString()} BDT
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-2.5 flex justify-between items-center">
                    <span className="text-sm sm:text-base font-extrabold text-gray-900">
                      Final Total {paymentStatus === "unpaid" ? "(COD)" : "(Paid)"}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-[#5022C3]">
                      {finalTotal.toLocaleString()} BDT
                    </span>
                  </div>
                </div>

                {/* Confirmation Workflow Info Banner */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Two-Step Confirmation Workflow:</span>{" "}
                    This order will be saved as a <strong>Manual Order</strong> with{" "}
                    <strong>Pending Confirmation</strong> status. After calling the customer,
                    confirm the order to deduct stock and forward to courier.
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base bg-[#5022C3] hover:bg-[#401a9c] text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardPlus className="w-5 h-5" />
                  <span>
                    {isSubmitting ? "Creating Manual Order..." : "Create Manual Order"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Variant Selection Modal */}
      {variantModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Select Product Variant
              </h3>
              <button
                type="button"
                onClick={() => setVariantModalProduct(null)}
                className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    getMerchantProductThumbnailUrl(
                      variantModalProduct.images?.[0]?.secure_url
                    ) || "/placeholder.png"
                  }
                  alt={variantModalProduct.title}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {variantModalProduct.title}
                  </h4>
                  <p className="text-sm font-extrabold text-[#5022C3] mt-0.5">
                    ৳
                    {(
                      variantModalProduct.discountedPrice ??
                      variantModalProduct.originalPrice ??
                      0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Available Variants
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {variantModalProduct.variants?.map((v, idx) => {
                    const label =
                      [
                        v.color ? `Color: ${v.color}` : null,
                        v.size ? `Size: ${v.size}` : null,
                      ]
                        .filter(Boolean)
                        .join(" • ") || `Variant #${idx + 1}`;
                    const out = (v.stock ?? 0) <= 0;
                    const isSelected = selectedVariantIndex === idx;

                    return (
                      <button
                        key={v._id || idx}
                        type="button"
                        disabled={out}
                        onClick={() => {
                          setSelectedVariantIndex(idx);
                          setVariantModalQty(1);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          out
                            ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? "border-[#5022C3] bg-purple-50 text-[#5022C3]"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">{label}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            out
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {out ? "Out of stock" : `${v.stock} in stock`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setVariantModalQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-900">
                    {variantModalQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxS =
                        variantModalProduct.variants?.[selectedVariantIndex]?.stock ?? 1;
                      setVariantModalQty((q) => Math.min(maxS, q + 1));
                    }}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setVariantModalProduct(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVariantSelection}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c]"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Created Success Modal */}
      {createdOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-center">
            <div className="p-6 sm:p-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5022C3] border border-purple-200">
                Manual Order • {createdOrder.orderSource || orderSource}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">
                Order #{createdOrder.orderId} Created!
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Saved with <strong>Pending Confirmation</strong> status. Call{" "}
                <span className="font-bold text-gray-800">
                  {createdOrder.customerName} ({createdOrder.customerPhone})
                </span>{" "}
                to verify and confirm the order.
              </p>

              <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100 text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-bold text-[#5022C3]">
                    #{createdOrder.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Source</span>
                  <span className="font-bold text-gray-900">
                    {createdOrder.orderSource}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-bold text-gray-900">
                    {createdOrder.totalPrice?.toLocaleString()} BDT
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-yellow-100 text-yellow-800">
                    Pending Confirmation
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleConfirmCreatedOrderNow}
                disabled={isConfirmingNow}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isConfirmingNow
                  ? "Confirming Order..."
                  : "Customer Confirmed — Confirm Order Now"}
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  + Create Another
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/orders")}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c] transition-colors cursor-pointer"
                >
                  Go to Orders List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

