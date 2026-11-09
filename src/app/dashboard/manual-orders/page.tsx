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
  Truck,
  Tag,
  CreditCard,
  PhoneCall,
  Store,
  Globe,
  Share2,
  X,
  Check,
  ClipboardPlus,
  Headphones,
  Layers,
  DollarSign,
} from "lucide-react";
import { api } from "@/utils/api";
import { getMerchantProductThumbnailUrl } from "@/utils/imageOptimizer";
import { bdLocations } from "@/data/locations";
import { toast } from "react-hot-toast";

/* React Icon Components (FontAwesome / Bootstrap / Remix SVG paths) */
const FaFacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
  </svg>
);

const FaMessengerIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z" />
  </svg>
);

const FaWhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const FaInstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

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
  address?: string;
  totalOrders: number;
  totalSpent: number;
}

const ORDER_SOURCES = [
  {
    id: "Facebook",
    label: "Facebook",
    icon: FaFacebookIcon,
    iconBg: "bg-blue-100 text-[#1877F2]",
  },
  {
    id: "Messenger",
    label: "Messenger",
    icon: FaMessengerIcon,
    iconBg: "bg-indigo-100 text-[#0084FF]",
  },
  {
    id: "WhatsApp",
    label: "WhatsApp",
    icon: FaWhatsappIcon,
    iconBg: "bg-emerald-100 text-[#25D366]",
  },
  {
    id: "Phone Call",
    label: "Phone Call",
    icon: PhoneCall,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: "Instagram",
    label: "Instagram",
    icon: FaInstagramIcon,
    iconBg: "bg-pink-100 text-[#E4405F]",
  },
  {
    id: "Walk-in",
    label: "Walk-in",
    icon: Store,
    iconBg: "bg-purple-100 text-[#5022C3]",
  },
  {
    id: "Other",
    label: "Other",
    icon: Globe,
    iconBg: "bg-slate-100 text-slate-600",
  },
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
  const [pendingAutoLocation, setPendingAutoLocation] = useState<{
    division?: string;
    district?: string;
    upazila?: string;
  } | null>(null);

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

  // Debounce product search (1.5 seconds after user finishes typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch.trim());
    }, 1500);
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

  // Helper to parse saved full shipping address ("street, upazila, district, division") and auto-fill location fields
  const applyCustomerSavedAddress = (savedAddress: string) => {
    if (!savedAddress || !savedAddress.trim()) return;
    const parts = savedAddress
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length >= 4) {
      const maybeDivision = parts[parts.length - 1];
      const maybeDistrict = parts[parts.length - 2];
      const maybeUpazila = parts[parts.length - 3];
      const streetPart = parts.slice(0, parts.length - 3).join(", ");

      const matchedDiv = bdLocations.find(
        (d) => d.division.toLowerCase() === maybeDivision.toLowerCase()
      );
      if (matchedDiv) {
        const matchedDist = matchedDiv.districts.find(
          (dist) => dist.district.toLowerCase() === maybeDistrict.toLowerCase()
        );
        const matchedUpz = matchedDist?.upazilas.find(
          (u) => u.toLowerCase() === maybeUpazila.toLowerCase()
        );

        setPendingAutoLocation({
          division: matchedDiv.division,
          district: matchedDist?.district,
          upazila: matchedUpz,
        });
        setDivision(matchedDiv.division);
        if (matchedDist) setDistrict(matchedDist.district);
        if (matchedUpz) setUpazila(matchedUpz);
        setStreetAddress(streetPart || savedAddress.trim());
        return;
      }
    } else if (parts.length === 3) {
      const maybeDivision = parts[2];
      const maybeDistrict = parts[1];
      const streetPart = parts[0];

      const matchedDiv = bdLocations.find(
        (d) => d.division.toLowerCase() === maybeDivision.toLowerCase()
      );
      if (matchedDiv) {
        const matchedDist = matchedDiv.districts.find(
          (dist) => dist.district.toLowerCase() === maybeDistrict.toLowerCase()
        );
        setPendingAutoLocation({
          division: matchedDiv.division,
          district: matchedDist?.district,
        });
        setDivision(matchedDiv.division);
        if (matchedDist) setDistrict(matchedDist.district);
        setStreetAddress(streetPart || savedAddress.trim());
        return;
      }
    }

    // Fallback: populate streetAddress directly
    setStreetAddress(savedAddress.trim());
  };

  // Existing customer lookup by phone number (1.5 seconds after user finishes typing)
  useEffect(() => {
    const cleanDigits = customerPhone.replace(/[\s\-()]/g, "").trim();
    const normalizedPhone = cleanDigits.startsWith("+880")
      ? "0" + cleanDigits.slice(4)
      : cleanDigits.startsWith("880")
        ? "0" + cleanDigits.slice(3)
        : cleanDigits;

    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      setMatchedCustomer(null);
      setLookingUpCustomer(false);
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
          if (exact.name) {
            setCustomerName(exact.name);
          }
          if (exact.email) {
            setCustomerEmail(exact.email);
          }
          if (exact.address) {
            applyCustomerSavedAddress(exact.address);
          }
        } else {
          setMatchedCustomer(null);
        }
      } catch (err) {
        setMatchedCustomer(null);
      } finally {
        setLookingUpCustomer(false);
      }
    }, 1500);

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

  // Keep district & upazila synced when division/district changes, respecting auto-filled customer address
  useEffect(() => {
    if (districtsList.length === 0) return;
    if (
      pendingAutoLocation?.district &&
      districtsList.some((d) => d.district === pendingAutoLocation.district)
    ) {
      if (district !== pendingAutoLocation.district) {
        setDistrict(pendingAutoLocation.district);
      }
      return;
    }
    if (!districtsList.some((d) => d.district === district)) {
      setDistrict(districtsList[0].district);
    }
  }, [division, districtsList, district, pendingAutoLocation]);

  useEffect(() => {
    if (upazilasList.length === 0) {
      setUpazila("");
      return;
    }
    if (
      pendingAutoLocation?.upazila &&
      upazilasList.includes(pendingAutoLocation.upazila)
    ) {
      if (upazila !== pendingAutoLocation.upazila) {
        setUpazila(pendingAutoLocation.upazila);
      }
      setPendingAutoLocation(null);
      return;
    }
    if (!upazilasList.includes(upazila)) {
      setUpazila(upazilasList[0]);
    }
  }, [district, upazilasList, upazila, pendingAutoLocation]);

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

  const activeSourceMeta = useMemo(
    () => ORDER_SOURCES.find((s) => s.id === orderSource) || ORDER_SOURCES[0],
    [orderSource]
  );
  const ActiveSourceIcon = activeSourceMeta.icon;

  return (
    <div className="w-full min-h-full bg-[#F8FAFC] p-2.5 sm:p-4 lg:p-5 font-sans">
      <div className="w-full max-w-none mx-auto space-y-4">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard/orders"
              className="w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors shrink-0"
              title="Back to Orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-900">
                Create Manual Order
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 truncate sm:whitespace-normal">
                Record orders from Facebook, Messenger, WhatsApp, or phone calls using your live store catalog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#5022C3]" />
              <span>View All Orders</span>
            </Link>
          </div>
        </div>

        {/* Main Responsive Two-Column Grid */}
        <form onSubmit={handleCreateManualOrder} className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 items-start">
          {/* LEFT COLUMN (7 Cols on XL): Product Selection, Selected Items & Order Source */}
          <div className="xl:col-span-7 space-y-4 sm:space-y-5">
            {/* 1. Product Catalog Search & Picker */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-3.5 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfcfc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5022C3] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
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

                <div className="relative w-full sm:w-80">
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
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                          title={product.title}
                          className={`group relative flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-200 ${
                            isOut
                              ? "bg-gray-50/70 border-gray-200 opacity-60 cursor-not-allowed"
                              : inOrderQty > 0
                                ? "bg-purple-50/60 border-[#5022C3] ring-1 ring-[#5022C3]/20 cursor-pointer shadow-xs"
                                : "bg-white border-gray-200/90 hover:border-[#5022C3] hover:bg-purple-50/15 hover:shadow-sm cursor-pointer"
                          }`}
                        >
                          <div className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-xl border border-gray-200/80 bg-gray-50 p-1 shrink-0 overflow-hidden shadow-2xs">
                            <img
                              src={
                                getMerchantProductThumbnailUrl(
                                  product.images?.[0]?.secure_url
                                ) || "/placeholder.png"
                              }
                              alt={product.title}
                              loading="lazy"
                              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#5022C3] transition-colors">
                                {product.title}
                              </h3>
                              <button
                                type="button"
                                disabled={isOut}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-2xs ${
                                  isOut
                                    ? "bg-gray-200 text-gray-400"
                                    : inOrderQty > 0
                                      ? "bg-[#5022C3] text-white"
                                      : "bg-purple-100 text-[#5022C3] group-hover:bg-[#5022C3] group-hover:text-white"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                              <span className="text-sm sm:text-base font-extrabold text-[#5022C3]">
                                ৳{sellingPrice.toLocaleString()}
                              </span>
                              {product.originalPrice > sellingPrice && (
                                <span className="text-[11px] text-gray-400 line-through font-medium">
                                  ৳{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  !isActive
                                    ? "bg-gray-200 text-gray-700"
                                    : stock > 0
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                                      : "bg-red-50 text-red-600 border border-red-200/80"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    !isActive
                                      ? "bg-gray-500"
                                      : stock > 0
                                        ? "bg-emerald-500"
                                        : "bg-red-500"
                                  }`}
                                />
                                {!isActive
                                  ? product.status
                                  : stock > 0
                                    ? `${stock} in stock`
                                    : "Out of stock"}
                              </span>

                              {product.hasVariants &&
                                product.variants &&
                                product.variants.length > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                                    <Layers className="w-2.5 h-2.5" />
                                    {product.variants.length} Variants
                                  </span>
                                )}

                              {inOrderQty > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5022C3] text-white shadow-2xs">
                                  <Check className="w-2.5 h-2.5" />
                                  Added ({inOrderQty})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Selected Order Items List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-3.5 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#fcfcfc]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
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

              <div className="p-3.5 sm:p-4">
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
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
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
                              className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs sm:text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQuantity(item.key, 1)}
                              className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
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
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
              <div className="p-3.5 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
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

              <div className="p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {ORDER_SOURCES.map((src) => {
                  const active = orderSource === src.id;
                  const IconComp = src.icon;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setOrderSource(src.id)}
                      className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        active
                          ? "border-[#5022C3] bg-purple-50 text-[#5022C3] shadow-2xs ring-1 ring-[#5022C3]"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            active ? "bg-[#5022C3] text-white" : src.iconBg
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate">{src.label}</span>
                      </div>
                      {active && <Check className="w-4 h-4 text-[#5022C3] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 Cols on XL): Customer Details & Order Summary */}
          <div className="xl:col-span-5 space-y-4 sm:space-y-5">
            {/* 4. Customer Information */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-3.5 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
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

              <div className="p-3.5 sm:p-5 space-y-4">
                {/* Phone Number with Auto-Lookup */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    {lookingUpCustomer && (
                      <span className="text-xs text-gray-500">
                        Checking customer...
                      </span>
                    )}
                    {!lookingUpCustomer && matchedCustomer && (
                      <span className="text-xs font-medium text-emerald-600">
                        Existing Customer ({matchedCustomer.totalOrders} orders)
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01712345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                    />
                  </div>
                  {matchedCustomer && (
                    <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-gray-500">
                      <span className="truncate">
                        Auto-filled: <span className="font-medium text-gray-700">{matchedCustomer.name}</span>
                      </span>
                      {matchedCustomer.address && (
                        <button
                          type="button"
                          onClick={() => applyCustomerSavedAddress(matchedCustomer.address!)}
                          className="shrink-0 text-xs font-medium text-[#5022C3] hover:underline cursor-pointer"
                        >
                          Re-apply address
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Customer Name & Optional Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="customer@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Division / District / Upazila */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
                </div>

                {/* Order Note */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Order Note / Instructions{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Call before delivery, deliver after 5 PM..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#5022C3] focus:ring-1 focus:ring-[#5022C3]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Order Summary & Pricing */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
              <div className="p-3.5 sm:p-5 border-b border-gray-100 bg-[#fcfcfc] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <span className="text-xs text-gray-500">
                  Source: <span className="font-semibold text-gray-800">{orderSource}</span>
                </span>
              </div>

              <div className="p-3.5 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Delivery Charge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">
                        Delivery Charge (BDT)
                      </label>
                      {matchedZoneName && !isCustomShipping && (
                        <span className="text-[11px] text-gray-500">
                          {matchedZoneName}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Truck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="number"
                        min={0}
                        value={customShippingCharge}
                        onChange={(e) => {
                          setIsCustomShipping(true);
                          setCustomShippingCharge(e.target.value);
                        }}
                        className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5022C3]"
                      />
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Discount (BDT)
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="number"
                        min={0}
                        max={subTotal}
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#5022C3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Status & Advance Delivery Charge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
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
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                      Subtotal ({selectedItems.length} item
                      {selectedItems.length !== 1 ? "s" : ""}, {totalItemsQty} qty)
                    </span>
                    <span className="font-bold text-gray-900">
                      {subTotal.toLocaleString()} BDT
                    </span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-emerald-700">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Discount
                      </span>
                      <span className="font-bold">
                        - {effectiveDiscount.toLocaleString()} BDT
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
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
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5022C3]" />
                Select Product Variant
              </h3>
              <button
                type="button"
                onClick={() => setVariantModalProduct(null)}
                className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-full cursor-pointer"
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
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
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
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 cursor-pointer"
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
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 cursor-pointer"
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
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVariantSelection}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c] cursor-pointer"
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5022C3] border border-purple-200">
                <ActiveSourceIcon className="w-3 h-3" />
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
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isConfirmingNow
                    ? "Confirming Order..."
                    : "Customer Confirmed — Confirm Order Now"}
                </span>
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Another</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/orders")}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#5022C3] text-white hover:bg-[#401a9c] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Go to Orders List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
