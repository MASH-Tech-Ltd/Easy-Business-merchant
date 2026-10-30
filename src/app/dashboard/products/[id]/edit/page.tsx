'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { MultipleImageUpload } from '@/components/ui/MultipleImageUpload';

const FEATURE_PLACEHOLDERS = [
  'যেমন: ৪০ ঘণ্টা দীর্ঘস্থায়ী ব্যাটারি লাইফ ও ফাস্ট চার্জিং',
  'যেমন: অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) ও ক্লিয়ার কলিং',
  'যেমন: ডিপ বেস ও হাই-রেস অডিও (Hi-Res Audio)',
  'যেমন: ব্লুটুথ ৫.৩ ও ডুয়াল ডিভাইস মাল্টিপয়েন্ট কানেক্টিভিটি',
  'যেমন: আরামদায়ক ও প্রিমিয়াম লাইটওয়েট ডিজাইন',
  'যেমন: পানি ও ঘাম প্রতিরোধী (IPX4 ওয়াটার রেজিস্ট্যান্ট)',
  'যেমন: ১ বছরের অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি',
];

const SPEC_GROUP_PRESETS = [
  {
    group: 'General Info বা সাধারণ তথ্য',
    entries: [
      { name: 'নাম (যেমন: Brand বা ব্র্যান্ড)', value: 'মান (যেমন: Sony / Apple)' },
      { name: 'নাম (যেমন: Model বা মডেল)', value: 'মান (যেমন: WH-1000XM5)' },
      { name: 'নাম (যেমন: Color বা কালার)', value: 'মান (যেমন: Matte Black / Silver)' },
      { name: 'নাম (যেমন: Origin বা দেশ)', value: 'মান (যেমন: Made in Japan / Vietnam)' },
    ],
  },
  {
    group: 'Technical Specs বা কারিগরি বিবরণ',
    entries: [
      { name: 'নাম (যেমন: Connectivity বা সংযোগ)', value: 'মান (যেমন: Bluetooth 5.3, AUX 3.5mm)' },
      { name: 'নাম (যেমন: Sound Driver বা স্পিকার)', value: 'মান (যেমন: 40mm Dome Type Drivers)' },
      { name: 'নাম (যেমন: Frequency বা ফ্রিকোয়েন্সি)', value: 'মান (যেমন: 4Hz - 40,000Hz)' },
      { name: 'নাম (যেমন: Noise Cancellation)', value: 'মান (যেমন: Dual Noise Sensor ANC)' },
    ],
  },
  {
    group: 'Battery & Power বা ব্যাটারি ও চার্জিং',
    entries: [
      { name: 'নাম (যেমন: Battery Life বা ব্যাকআপ)', value: 'মান (যেমন: Up to 40 Hours)' },
      { name: 'নাম (যেমন: Charging Port বা পোর্ট)', value: 'মান (যেমন: USB Type-C Fast Charging)' },
      { name: 'নাম (যেমন: Charging Time বা সময়)', value: 'মান (যেমন: 3.5 Hours for Full Charge)' },
      { name: 'নাম (যেমন: Quick Charge বা ফাস্ট চার্জ)', value: 'মান (যেমন: 3 Min Charge = 3 Hours)' },
    ],
  },
  {
    group: 'Design & Build বা মাপ ও স্থায়িত্ব',
    entries: [
      { name: 'নাম (যেমন: Weight বা ওজন)', value: 'মান (যেমন: 250 grams)' },
      { name: 'নাম (যেমন: Cushion Material বা উপাদান)', value: 'মান (যেমন: Soft Fit Leather)' },
      { name: 'নাম (যেমন: Foldable বা ভাঁজযোগ্য)', value: 'মান (যেমন: Yes / Swivel Structure)' },
      { name: 'নাম (যেমন: Water Resistance বা প্রতিরোধ)', value: 'মান (যেমন: IPX4 Splash Proof)' },
    ],
  },
  {
    group: 'Warranty & Package বা ওয়ারেন্টি ও বক্স',
    entries: [
      { name: 'নাম (যেমন: Warranty বা ওয়ারেন্টি)', value: 'মান (যেমন: 1 Year Official Brand Warranty)' },
      { name: 'নাম (যেমন: Box Contents বা বক্সে যা আছে)', value: 'মান (যেমন: Headphone, Case, Type-C Cable)' },
      { name: 'নাম (যেমন: Microphone বা মাইক)', value: 'মান (যেমন: 4 Beamforming Built-in Mics)' },
      { name: 'নাম (যেমন: Compatibility বা ডিভাইস সাপোর্ট)', value: 'মান (যেমন: Android, iOS, Windows, Mac)' },
    ],
  },
];

const getSpecGroupPlaceholder = (groupIndex: number) => {
  const preset = SPEC_GROUP_PRESETS[groupIndex % SPEC_GROUP_PRESETS.length];
  return `গ্রুপ নাম (যেমন: ${preset.group})`;
};

const getSpecEntryPlaceholder = (groupIndex: number, entryIndex: number) => {
  const preset = SPEC_GROUP_PRESETS[groupIndex % SPEC_GROUP_PRESETS.length];
  if (entryIndex < preset.entries.length) {
    return preset.entries[entryIndex];
  }
  const fallbackEntries = [
    { name: 'নাম (যেমন: Feature বা ফিচার)', value: 'মান (যেমন: Touch Sensor Controls)' },
    { name: 'নাম (যেমন: Special Feature)', value: 'মান (যেমন: Multipoint Auto-Switch)' },
    { name: 'নাম (যেমন: App Support বা অ্যাপ)', value: 'মান (যেমন: Sony Headphones Connect)' },
  ];
  return fallbackEntries[(entryIndex - preset.entries.length) % fallbackEntries.length];
};

const UNIT_OPTIONS = [
  { label: 'Piece / পিস (pc)', value: 'pc' },
  { label: 'Item / আইটেম', value: 'item' },
  { label: 'Box / বক্স (box)', value: 'box' },
  { label: 'Pack / প্যাকেট (pack)', value: 'pack' },
  { label: 'Set / সেট (set)', value: 'set' },
  { label: 'Pair / জোড়া (pair)', value: 'pair' },
  { label: 'Kilogram / কেজি (kg)', value: 'kg' },
  { label: 'Gram / গ্রাম (g)', value: 'g' },
  { label: 'Liter / লিটার (L)', value: 'l' },
  { label: 'Milliliter / মিলি (ml)', value: 'ml' },
  { label: 'Meter / মিটার (m)', value: 'm' },
  { label: 'Dozen / ডজন (dz)', value: 'dozen' },
  { label: 'Other / অন্যান্য (কাস্টম একক)...', value: 'custom' },
];

const PRESET_UNIT_VALUES = [
  'pc',
  'item',
  'box',
  'pack',
  'set',
  'pair',
  'kg',
  'g',
  'l',
  'ml',
  'm',
  'dozen',
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [initialImages, setInitialImages] = useState<any[]>([]);
  const [isCustomUnit, setIsCustomUnit] = useState(false);

  // Form State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{group: string, entries: {name: string, value: string}[]}[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>(['']);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<Array<{ _id?: string; color: string; size: string; stock: string; sku: string }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    saveAmount: '',
    categoryId: '',
    brand: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    condition: 'New',
    status: 'ACTIVE',
    sku: '',
    unit: 'pc',
    stock: '',
    isAuthentic: false
  });

  const handleUnitSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setIsCustomUnit(true);
      setFormData((prev) => ({ ...prev, unit: '' }));
    } else {
      setIsCustomUnit(false);
      setFormData((prev) => ({ ...prev, unit: val }));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [resolvedParams.id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/my-categories?limit=1000');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/get-product/${resolvedParams.id}`);
      const product = response.data.data;
      if (product) {
        setFormData({
          title: product.title || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          originalPrice: product.originalPrice?.toString() || '',
          discountedPrice: product.discountedPrice?.toString() || '',
          saveAmount: product.saveAmount?.toString() || '',
          categoryId: typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId || '',
          brand: product.brand || '',
          weight: product.weight?.toString() || '',
          length: product.dimensions?.length?.toString() || '',
          width: product.dimensions?.width?.toString() || '',
          height: product.dimensions?.height?.toString() || '',
          condition: product.condition || 'New',
          status: product.status || 'ACTIVE',
          sku: product.sku || '',
          unit: product.unit || '',
          stock: product.stock?.toString() || '',
          isAuthentic: product.isAuthentic || false
        });

        if (product.unit && !PRESET_UNIT_VALUES.includes(product.unit.toLowerCase())) {
          setIsCustomUnit(true);
        }
        
        if (product.features && Array.isArray(product.features) && product.features.length > 0) {
          setFeatures(product.features);
        }

        if (product.videos && Array.isArray(product.videos) && product.videos.length > 0) {
          setVideos(product.videos);
        }
        
        if (product.specifications && Array.isArray(product.specifications)) {
          setSpecifications(product.specifications);
        }

        if (product.hasVariants !== undefined) {
          setHasVariants(Boolean(product.hasVariants && product.variants?.length > 0));
        }

        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
          setHasVariants(true);
          setVariants(product.variants.map((v: any) => ({
            _id: v._id,
            color: v.color || '',
            size: v.size || '',
            stock: v.stock !== undefined ? String(v.stock) : '0',
            sku: v.sku || ''
          })));
        }

        if (product.images && Array.isArray(product.images)) {
          setInitialImages(product.images);
          setPreviewUrls(product.images.map((img: any) => img.secure_url));
        }
      }
      setInitialFetchDone(true);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      const errMsg = 'Failed to load product details';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (files: File[], urls: string[]) => {
    setImageFiles(files);
    setPreviewUrls(urls);
    if (fieldErrors.images) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated.images;
        return updated;
      });
    }
  };

  const addSpecGroup = () => {
    setSpecifications([...specifications, { group: '', entries: [{ name: '', value: '' }] }]);
  };

  const handleToggleVariants = (checked: boolean) => {
    setHasVariants(checked);
    if (checked && variants.length === 0) {
      const initial = [{ color: '', size: '', stock: formData.stock || '10', sku: '' }];
      setVariants(initial);
      setFormData(prev => ({ ...prev, stock: initial[0].stock }));
    }
  };

  const handleAddVariant = () => {
    const updated = [...variants, { color: '', size: '', stock: '0', sku: '' }];
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
    const sum = updated.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    setFormData(prev => ({ ...prev, stock: String(sum) }));
  };

  const handleVariantChange = (index: number, field: 'color' | 'size' | 'stock' | 'sku', value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
    if (field === 'stock') {
      const sum = updated.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
      setFormData(prev => ({ ...prev, stock: String(sum) }));
    }
  };

  const addSpecEntry = (groupIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[groupIndex].entries.push({ name: '', value: '' });
    setSpecifications(newSpecs);
  };

  const updateSpecGroup = (index: number, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index].group = value;
    setSpecifications(newSpecs);
  };

  const updateSpecEntry = (groupIndex: number, entryIndex: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[groupIndex].entries[entryIndex][field] = value;
    setSpecifications(newSpecs);
  };

  const removeSpecGroup = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const removeSpecEntry = (groupIndex: number, entryIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[groupIndex].entries.splice(entryIndex, 1);
    setSpecifications(newSpecs);
  };

  const calculateSaveAmount = () => {
    const original = parseFloat(formData.originalPrice);
    const discounted = parseFloat(formData.discountedPrice);
    if (!isNaN(original) && !isNaN(discounted) && original > discounted) {
      return (original - discounted).toFixed(2);
    }
    return '0';
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleVideoChange = (index: number, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = value;
    setVideos(newVideos);
  };

  const addVideo = () => {
    if (videos.length < 2) {
      setVideos([...videos, '']);
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const fieldOrder = ['title', 'categoryId', 'images', 'discountedPrice', 'originalPrice', 'stock', 'weight'];
    const firstInvalid = fieldOrder.find(field => errors[field]) || Object.keys(errors)[0];
    if (firstInvalid) {
      const container = document.getElementById(`field-${firstInvalid}`);
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = container.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
        if (focusable) {
          setTimeout(() => focusable.focus(), 200);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Item Name / Product Title is required';
    }

    if (!formData.categoryId || !formData.categoryId.trim()) {
      errors.categoryId = 'Please select a Category';
    }

    if (previewUrls.length === 0 && imageFiles.length === 0) {
      errors.images = 'At least one product image is required (maximum 4)';
    } else if (previewUrls.length > 4) {
      errors.images = 'You can upload a maximum of 4 images';
    }

    if (!formData.discountedPrice || formData.discountedPrice.toString().trim() === '') {
      errors.discountedPrice = 'Sell/Current price is required';
    } else {
      const sellPrice = parseFloat(formData.discountedPrice);
      if (isNaN(sellPrice) || sellPrice < 0) {
        errors.discountedPrice = 'Selling price must be 0 or greater';
      }
    }

    if (!formData.originalPrice || formData.originalPrice.toString().trim() === '') {
      errors.originalPrice = 'Regular/Old price is required';
    } else {
      const regPrice = parseFloat(formData.originalPrice);
      if (isNaN(regPrice) || regPrice < 0) {
        errors.originalPrice = 'Regular price must be 0 or greater';
      } else {
        const sellPrice = parseFloat(formData.discountedPrice);
        if (!isNaN(sellPrice) && regPrice < sellPrice) {
          errors.originalPrice = 'Regular price cannot be less than selling price';
        }
      }
    }

    if (formData.stock && formData.stock.toString().trim() !== '') {
      const stockNum = parseFloat(formData.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        errors.stock = 'Stock quantity cannot be negative';
      }
    }

    if (formData.weight && formData.weight.toString().trim() !== '') {
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum) || weightNum < 0) {
        errors.weight = 'Weight cannot be negative';
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return false; // Stop immediately, do not call backend
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return; // Stop immediately, do not call backend
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (['length', 'width', 'height', 'saveAmount', 'stock'].includes(key)) return; // Handled below
        if (value !== undefined && value !== null && value !== '') data.append(key, value as string);
      });

      // Compatibility aliases
      if (formData.title) data.append('name', formData.title);
      if (formData.discountedPrice) data.append('price', formData.discountedPrice);

      // Dimensions Object
      const dimensions = {
        length: parseFloat(formData.length || '0'),
        width: parseFloat(formData.width || '0'),
        height: parseFloat(formData.height || '0')
      };
      data.append('dimensions', JSON.stringify(dimensions));
      
      // Specifications
      if (specifications.length > 0) {
        data.append('specifications', JSON.stringify(specifications));
      } else {
        data.append('specifications', '[]');
      }
      
      // Save amount calculation
      data.append('saveAmount', calculateSaveAmount());

      // Variants and Stock Synchronization
      data.append('hasVariants', String(hasVariants));
      if (hasVariants && variants.length > 0) {
        const validVariants = variants.map(v => ({
          ...(v._id ? { _id: v._id } : {}),
          color: v.color.trim(),
          size: v.size.trim(),
          stock: Math.max(0, Number(v.stock) || 0),
          sku: v.sku.trim(),
        }));
        data.append('variants', JSON.stringify(validVariants));
        const computedStock = validVariants.reduce((sum, v) => sum + v.stock, 0);
        data.append('stock', String(computedStock));
      } else {
        data.append('stock', formData.stock ? String(formData.stock) : '0');
        data.append('variants', '[]');
      }
      
      // Features
      const filteredFeatures = features.filter(f => f.trim() !== '');
      if (filteredFeatures.length > 0) {
        data.append('features', JSON.stringify(filteredFeatures));
      } else {
        data.append('features', '[]');
      }

      // Videos
      const filteredVideos = videos.filter(v => v.trim() !== '');
      if (filteredVideos.length > 0) {
        data.append('videos', JSON.stringify(filteredVideos));
      } else {
        data.append('videos', '[]');
      }
      
      // Send existing images and imageManifest in exact previewUrls sequence
      let fileCount = 0;
      const imageManifest: Array<{ type: 'existing' | 'new'; secure_url?: string; newIndex?: number }> = [];
      const existingImagesToKeep: any[] = [];

      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          imageManifest.push({ type: 'new', newIndex: fileCount });
          fileCount++;
        } else {
          const existingImg = initialImages.find(img => img.secure_url === url);
          if (existingImg) {
            existingImagesToKeep.push(existingImg);
            imageManifest.push({ type: 'existing', secure_url: url });
          }
        }
      });

      data.append('existingImages', JSON.stringify(existingImagesToKeep));
      data.append('imageManifest', JSON.stringify(imageManifest));

      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          data.append('images', file);
        });
      }

      const response = await api.patch(`/products/update-product/${resolvedParams.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data?.message || 'Product updated successfully!');
      router.push('/dashboard/products');
    } catch (err: any) {
      const serverErrors: Record<string, string> = {};
      const backendErrors = err.response?.data?.errors || err.response?.data?.data;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((item: any) => {
          let fieldKey = item.field || '';
          if (fieldKey.startsWith('body.')) {
            fieldKey = fieldKey.replace('body.', '');
          }
          if (fieldKey) {
            serverErrors[fieldKey] = item.message;
          }
        });
        setFieldErrors(prev => ({ ...prev, ...serverErrors }));
        scrollToFirstError(serverErrors);
      } else {
        const errMsg = err.response?.data?.message || err.message || 'Failed to update product';
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!initialFetchDone) {
    return <div className="p-12 text-center text-gray-500">Loading product details...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/dashboard/products" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Edit Product</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link 
            href="/dashboard/products"
            className="px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Discard
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#5022C3] hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="w-full max-w-[1800px] mx-auto flex flex-col xl:flex-row gap-6">
          
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col gap-6">
            <Card title="General Information" subtitle="পণ্যের নাম, আকর্ষণীয় বর্ণনা ও বিস্তারিত তথ্য দিন">
              <div className="space-y-6">
                <div id="field-title">
                  <Input 
                    label="Item Name" 
                    hint="পণ্যের পূর্ণ নাম ও মডেল লিখুন (যেমন: Sony WH-1000XM5 Wireless Headphones)"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g. Sony WH-1000XM5 Headphones"
                    error={fieldErrors.title}
                    required
                  />
                </div>
                
                <Textarea 
                  label="Short Description" 
                  hint="১-২ লাইনে পণ্যের মূল সারসংক্ষেপ লিখুন (যা মূল প্রোডাক্ট পেজে হাইলাইট হিসেবে দেখাবে)"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief summary of the product..."
                  rows={2}
                />
                
                <Textarea 
                  label="Product Description" 
                  hint="পণ্যের বিস্তারিত বৈশিষ্ট্য, সুবিধা, ব্যবহারবিধি ও ওয়ারেন্টি তথ্য বিস্তারিত লিখুন"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write something..."
                />
              </div>
            </Card>

            <Card title="External Videos (Max 2)" subtitle="ইউটিউব ভিডিওর সম্পূর্ণ লিংক দিন (যেমন: রিভিউ বা আনবক্সিং ভিডিও)">
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input 
                      placeholder="E.g. https://www.youtube.com/watch?v=..."
                      value={video}
                      onChange={(e) => handleVideoChange(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeVideo(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {videos.length < 2 && (
                  <button 
                    type="button"
                    onClick={addVideo}
                    className="text-sm font-medium text-[#5022C3] flex items-center gap-1 mt-2 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Video URL
                  </button>
                )}
              </div>
            </Card>

            <Card title="Quick Overview (Features)" subtitle="পণ্যের প্রধান আকর্ষণ বা বুলেট পয়েন্টসমূহ এক এক করে যোগ করুন">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input 
                      placeholder={FEATURE_PLACEHOLDERS[index % FEATURE_PLACEHOLDERS.length]}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFeature(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addFeature}
                  className="text-sm font-medium text-[#5022C3] flex items-center gap-1 mt-2 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Feature
                </button>
              </div>
            </Card>

            <div id="field-images">
              <Card title="Media" subtitle="পণ্যের পরিষ্কার ও আকর্ষণীয় ছবি আপলোড করুন (১:১ স্কয়ার রেশিও সবচেয়ে ভালো)">
                <MultipleImageUpload 
                  files={imageFiles}
                  previewUrls={previewUrls}
                  onChange={handleImageChange}
                  error={fieldErrors.images}
                  maxFiles={4}
                  recommendedRatio="1:1 (Square)"
                />
              </Card>
            </div>

            <Card title="Pricing" subtitle="বিক্রয়মূল্য ও পূর্বের মূল্য দিন (স্বয়ংক্রিয়ভাবে ডিসকাউন্ট ও সাশ্রয় হিসাব হবে)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div id="field-discountedPrice">
                  <Input 
                    label="Sell/Current Price" 
                    hint="বর্তমান বিক্রয়মূল্য (গ্রাহক যে মূল্যে পণ্যটি কিনবে)"
                    name="discountedPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    placeholder="E.g. 299.99"
                    error={fieldErrors.discountedPrice}
                    required
                  />
                </div>
                <div id="field-originalPrice">
                  <Input 
                    label="Regular/Old Price" 
                    hint="আগের বা মূল মূল্য (ডিসকাউন্ট হিসেবে দেখানোর জন্য)"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="E.g. 399.99"
                    error={fieldErrors.originalPrice}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card title="Specifications" subtitle="টেকনিক্যাল তথ্য বা স্পেসিফিকেশন গ্রুপ আকারে সাজান (যেমন: General Info, Battery, Connectivity)">
              <div className="space-y-6">
                {specifications.map((spec, groupIndex) => (
                  <div key={groupIndex} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Input 
                        placeholder={getSpecGroupPlaceholder(groupIndex)}
                        value={spec.group}
                        onChange={(e) => updateSpecGroup(groupIndex, e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeSpecGroup(groupIndex)}
                        className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200 ml-2">
                      {spec.entries.map((entry, entryIndex) => {
                        const entryPlaceholder = getSpecEntryPlaceholder(groupIndex, entryIndex);
                        return (
                          <div key={entryIndex} className="flex items-center gap-3">
                            <Input 
                              placeholder={entryPlaceholder.name}
                              value={entry.name}
                              onChange={(e) => updateSpecEntry(groupIndex, entryIndex, 'name', e.target.value)}
                            />
                            <Input 
                              placeholder={entryPlaceholder.value}
                              value={entry.value}
                              onChange={(e) => updateSpecEntry(groupIndex, entryIndex, 'value', e.target.value)}
                            />
                            <button 
                              type="button" 
                              onClick={() => removeSpecEntry(groupIndex, entryIndex)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                      <button 
                        type="button"
                        onClick={() => addSpecEntry(groupIndex)}
                        className="text-sm font-medium text-[#5022C3] flex items-center gap-1 mt-2 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Spec Entry
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addSpecGroup}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Specification Group
                </button>
              </div>
            </Card>

            <Card title="Inventory" subtitle="স্টক পরিমাণ, এসকেইউ (SKU) ও ভ্যারিয়েন্ট অপশন নির্ধারণ করুন">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input 
                    label="Product Serial / SKU" 
                    hint="স্টক ট্র্যাক করার নিজস্ব ইউনিক কোড (যেমন: PROD-001)"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="E.g. PROD-001"
                  />
                  <div className="space-y-2">
                    <Select 
                      label="Unit Name" 
                      hint="পরিমাপের একক সিলেক্ট করুন (যেমন: pc, box, pack, kg)"
                      name="unit"
                      value={isCustomUnit ? 'custom' : (formData.unit || 'pc')}
                      onChange={handleUnitSelectChange}
                      options={UNIT_OPTIONS}
                    />
                    {isCustomUnit && (
                      <Input 
                        placeholder="কাস্টম পরিমাপের একক লিখুন (যেমন: roll, bottle, bundle)"
                        value={formData.unit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                        autoFocus
                      />
                    )}
                  </div>
                  {!hasVariants && (
                    <div id="field-stock">
                      <Input 
                        label="Stock Quantity" 
                        hint="বর্তমানে কয়টি ইউনিট মজুদ আছে"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="E.g. 100"
                        error={fieldErrors.stock}
                      />
                    </div>
                  )}
                </div>

                {/* Variants Toggle & Management */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        This product has options (Colors & Sizes)
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        বিভিন্ন কালার বা সাইজ থাকলে অন করুন। প্রতিটির জন্য আলাদা স্টক নির্ধারণ করা যাবে।
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasVariants}
                        onChange={(e) => handleToggleVariants(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5022C3]"></div>
                    </label>
                  </div>

                  {hasVariants && (
                    <div className="mt-5 space-y-4 bg-gray-50/80 p-4 sm:p-5 rounded-xl border border-gray-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                            Product Variations
                          </span>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-[#5022C3]">
                            {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Total Calculated Stock:</span>
                          <span className="text-sm font-black text-[#5022C3] bg-white px-2.5 py-0.5 rounded-lg border border-purple-200 shadow-2xs">
                            {variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} units
                          </span>
                        </div>
                      </div>

                      {/* Variant Rows */}
                      <div className="space-y-3">
                        <div className="hidden sm:grid grid-cols-12 gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2">
                          <div className="col-span-4">Color (Option)</div>
                          <div className="col-span-3">Size (Option)</div>
                          <div className="col-span-3">Quantity (Stock)</div>
                          <div className="col-span-2 text-right">Action</div>
                        </div>

                        {variants.map((variant, index) => (
                          <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                            <div className="sm:col-span-4">
                              <label className="sm:hidden text-[10px] font-bold text-gray-500 uppercase">Color</label>
                              <input 
                                type="text"
                                placeholder="e.g. Red, Black, Blue"
                                value={variant.color}
                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3]/30 focus:border-[#5022C3]"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="sm:hidden text-[10px] font-bold text-gray-500 uppercase">Size</label>
                              <input 
                                type="text"
                                placeholder="e.g. S, M, L, XL"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3]/30 focus:border-[#5022C3]"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="sm:hidden text-[10px] font-bold text-gray-500 uppercase">Stock Quantity</label>
                              <input 
                                type="number"
                                min="0"
                                placeholder="e.g. 10"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                className="w-full px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5022C3]/30 focus:border-[#5022C3]"
                              />
                            </div>
                            <div className="sm:col-span-2 flex justify-end">
                              <button 
                                type="button" 
                                onClick={() => handleRemoveVariant(index)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Variant"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button 
                          type="button"
                          onClick={handleAddVariant}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#5022C3] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Variant Option</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            
            <div id="field-categoryId">
              <Card title="Category" subtitle="পণ্যটি কোন ক্যাটাগরির অন্তর্ভুক্ত তা নির্বাচন করুন">
                {categories.length === 0 ? (
                  <div className="text-sm text-gray-500 mb-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 text-center">
                    No categories found. Create one first!
                  </div>
                ) : (
                  <Select 
                    label="Category"
                    hint="সঠিক ক্যাটাগরি বেছে নিলে ক্রেতাদের জন্য পণ্যটি খুঁজে পাওয়া সহজ হবে"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    error={fieldErrors.categoryId}
                    required
                    options={categories.map(c => ({ label: c.name, value: c._id }))}
                  />
                )}
                <Link 
                  href="/dashboard/categories/new"
                  className="w-full mt-4 block text-center px-4 py-2.5 text-sm font-medium text-white bg-[#5022C3] hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Add Category
                </Link>
              </Card>
            </div>

            <Card title="Brand (SEO & Data Feed)" subtitle="পণ্যটির প্রস্তুতকারক ব্র্যান্ডের নাম দিন">
              <Input 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Brand Name (যেমন: Sony, Samsung, Apple)"
                hint="ব্র্যান্ডের নাম লিখুন যাতে সার্চ ও এসইও (SEO)-তে পণ্যটি সহজে পাওয়া যায়"
              />
            </Card>

            <Card title="Product Weight & Dimensions" subtitle="সঠিক কুরিয়ার চার্জ নির্ধারণের জন্য পণ্যের ওজন ও মাপ দিন">
              <div className="space-y-6">
                <div id="field-weight">
                  <Input 
                    label="Weight (kg)" 
                    hint="কুরিয়ার ডেলিভারি চার্জ নির্ধারণে পণ্যের মোট ওজন (কেজিতে)"
                    name="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 1.5"
                    error={fieldErrors.weight}
                  />
                </div>
                <div>
                  <div className="mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Dimensions (cm)</label>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-normal normal-case leading-relaxed">
                      পণ্যের প্যাকেটের মাপ: দৈর্ঘ্য (L) × প্রস্থ (W) × উচ্চতা (H) সেমি-তে
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input name="length" type="number" placeholder="L (দৈর্ঘ্য)" value={formData.length} onChange={handleChange} />
                    <Input name="width" type="number" placeholder="W (প্রস্থ)" value={formData.width} onChange={handleChange} />
                    <Input name="height" type="number" placeholder="H (উচ্চতা)" value={formData.height} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Condition (SEO & Data Feed)" subtitle="পণ্যের অবস্থা (নতুন বা ব্যবহৃত)">
              <Select 
                name="condition"
                hint="পণ্যটি নতুন (New), রিফার্বিশড (Refurbished) নাকি পুরাতন (Used)"
                value={formData.condition}
                onChange={handleChange}
                options={[
                  { label: 'New (নতুন)', value: 'New' },
                  { label: 'Refurbished (রিফার্বিশড)', value: 'Refurbished' },
                  { label: 'Used (ব্যবহৃত)', value: 'Used' },
                ]}
              />
            </Card>

            <Card title="Product Status" subtitle="ওয়েবসাইটে প্রদর্শনের অবস্থা নির্ধারণ করুন">
              <Select 
                name="status"
                hint="ACTIVE রাখলে স্টোরে সরাসরি দেখাবে, DRAFT রাখলে শুধু ড্রাফট হিসেবে থাকবে"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: 'ACTIVE (সরাসরি ওয়েবসাইটে প্রদর্শিত)', value: 'ACTIVE' },
                  { label: 'DRAFT (খসড়া / লুকানো)', value: 'DRAFT' },
                  { label: 'ARCHIVED (সংরক্ষিত)', value: 'ARCHIVED' },
                ]}
              />
            </Card>

            <Card title="Authentication" subtitle="প্রোডাক্টের সত্যতা নিশ্চয়তা ব্যাজ">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isAuthentic"
                  checked={formData.isAuthentic}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#5022C3] rounded focus:ring-[#5022C3]"
                />
                <div>
                  <span className="font-semibold text-gray-900 block">100% Authentic Product</span>
                  <span className="text-xs text-gray-500">প্রোডাক্ট পেজে ১০০% অরিজিনাল অথেনটিসিটি ভেরিফায়েড ব্যাজ প্রদর্শনের জন্য টিক দিন</span>
                </div>
              </label>
            </Card>

          </div>
        </div>
      </div>
    </form>
  );
}
