'use client';

import { useState, useEffect } from 'react';
import { 
  Palette, CheckCircle2, LayoutTemplate, 
  Settings, Type, Link as LinkIcon, Save,
  Phone, Mail, MapPin, Shield, HelpCircle, Image as ImageIcon,
  Truck, Plus, Trash2, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { bdLocations } from '@/data/locations';

const availableThemes = [
  { id: 'design-01', name: 'Design 01 (Classic)', color: '#ffffff', textColor: '#171717', accent: '#5022C3' },
  { id: 'design-02', name: 'Design 02 (Minimal)', color: '#f8fafc', textColor: '#0f172a', accent: '#3b82f6' },
  { id: 'design-03', name: 'Design 03 (Brutalist)', color: '#050505', textColor: '#ffffff', accent: '#06b6d4' },
  { id: 'design-04', name: 'Design 04 (Clean)', color: '#ffffff', textColor: '#111827', accent: '#111827' },
  { id: 'design-05', name: 'Design 05 (Premium)', color: '#ffffff', textColor: '#000000', accent: '#000000' },
];

// Global cache for instant UI rendering during client navigation
let globalThemeCache: any = null;

export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState(globalThemeCache?.activeTheme || 'design-01');
  const [savedTheme, setSavedTheme] = useState(globalThemeCache?.savedTheme || 'design-01');
  const [primaryColor, setPrimaryColor] = useState(globalThemeCache?.primaryColor || '#5022C3');
  const [buttonColors, setButtonColors] = useState(globalThemeCache?.buttonColors || { addToCart: '', buyNow: '' });
  const [fontFamily, setFontFamily] = useState(globalThemeCache?.fontFamily || 'Inter');
  const [language, setLanguage] = useState(globalThemeCache?.language || 'en');
  const [currencySymbol, setCurrencySymbol] = useState(globalThemeCache?.currencySymbol || '৳');
  const [footer, setFooter] = useState<{
    socialLinks: { facebook: string; youtube: string; tiktok: string };
    contactInfo: { email: string; phone: string; address: string };
    policies: { aboutUs: string; privacyPolicy: string; termsAndConditions: string; returnPolicy: string };
    copyrightText: string;
  }>(globalThemeCache?.footer || {
    socialLinks: { facebook: '', youtube: '', tiktok: '' },
    contactInfo: { email: '', phone: '', address: '' },
    policies: { aboutUs: '', privacyPolicy: '', termsAndConditions: '', returnPolicy: '' },
    copyrightText: ''
  });
  const [banner, setBanner] = useState<{
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: any;
  }>(globalThemeCache?.banner || {
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: null
  });
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(globalThemeCache?.bannerPreviewUrl || null);
  const [bannerErrors, setBannerErrors] = useState<Record<string, string>>({});
  
  const [loading, setLoading] = useState(!globalThemeCache);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [activePolicyTab, setActivePolicyTab] = useState<string>('aboutUs');

  // Shipping zones state
  interface ShippingZone { name: string; cost: number; division: string; districts: string[]; }
  const [defaultShippingCost, setDefaultShippingCost] = useState(globalThemeCache?.defaultShippingCost ?? 120);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(globalThemeCache?.shippingZones || []);
  const [newZone, setNewZone] = useState<ShippingZone>({ name: '', cost: 0, division: '', districts: [] });
  const [newZoneDistrictsList, setNewZoneDistrictsList] = useState<string[]>([]);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    if (!globalThemeCache) setLoading(true);
    try {
      const res = await api.get('/themes/my-theme');
      const themeData = res.data.data;
      if (themeData) {
        let dbTheme = 'design-01';
        if (themeData.themeId) {
          dbTheme = themeData.themeId === 'light' ? 'design-01' : themeData.themeId;
          setActiveTheme(dbTheme);
          setSavedTheme(dbTheme);
        }
        if (themeData.primaryColor) setPrimaryColor(themeData.primaryColor);
        if (themeData.buttonColors) {
          setButtonColors({
            addToCart: themeData.buttonColors.addToCart || '',
            buyNow: themeData.buttonColors.buyNow || ''
          });
        }
        if (themeData.fontFamily) setFontFamily(themeData.fontFamily);
        if (themeData.language) setLanguage(themeData.language);
        if (themeData.currencySymbol) setCurrencySymbol(themeData.currencySymbol);
        if (Array.isArray(themeData.shippingZones)) setShippingZones(themeData.shippingZones);
        if (themeData.defaultShippingCost !== undefined) setDefaultShippingCost(themeData.defaultShippingCost);
        
        const newFooter = {
            socialLinks: {
              facebook: themeData.footer?.socialLinks?.facebook || '',
              youtube: themeData.footer?.socialLinks?.youtube || '',
              tiktok: themeData.footer?.socialLinks?.tiktok || '',
            },
            contactInfo: {
              email: themeData.footer?.contactInfo?.email || '',
              phone: themeData.footer?.contactInfo?.phone || '',
              address: themeData.footer?.contactInfo?.address || '',
            },
            policies: {
              aboutUs: themeData.footer?.policies?.aboutUs || '',
              privacyPolicy: themeData.footer?.policies?.privacyPolicy || '',
              termsAndConditions: themeData.footer?.policies?.termsAndConditions || '',
              returnPolicy: themeData.footer?.policies?.returnPolicy || '',
            },
            copyrightText: themeData.footer?.copyrightText || '',
        };
        setFooter(newFooter);

        const newBanner = {
            title: themeData.banner?.title || '',
            subtitle: themeData.banner?.subtitle || '',
            description: themeData.banner?.description || '',
            buttonText: themeData.banner?.buttonText || '',
            buttonLink: themeData.banner?.buttonLink || '',
            image: themeData.banner?.image || null
        };
        setBanner(newBanner);
        
        let newBannerUrl = null;
        if (themeData.banner?.image?.secure_url) {
          newBannerUrl = themeData.banner.image.secure_url;
          setBannerPreviewUrl(newBannerUrl);
        }

        // Save to global cache
        globalThemeCache = {
          activeTheme: dbTheme,
          savedTheme: dbTheme,
          primaryColor: themeData.primaryColor || '#5022C3',
          buttonColors: {
            addToCart: themeData.buttonColors?.addToCart || '',
            buyNow: themeData.buttonColors?.buyNow || ''
          },
          fontFamily: themeData.fontFamily || 'Inter',
          language: themeData.language || 'en',
          currencySymbol: themeData.currencySymbol || '৳',
          footer: newFooter,
          banner: newBanner,
          bannerPreviewUrl: newBannerUrl,
          defaultShippingCost: themeData.defaultShippingCost ?? 120,
          shippingZones: Array.isArray(themeData.shippingZones) ? themeData.shippingZones : []
        };
      }
    } catch (error) {
      console.error('Error fetching theme', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    // Frontend Validation for Banner
    const hasBannerContent = banner.title || banner.subtitle || banner.description || banner.buttonText || banner.buttonLink || bannerImageFile || bannerPreviewUrl;
    
    if (hasBannerContent) {
      let isValid = true;
      const errors: Record<string, string> = {};

      if (!banner.title) { errors.title = 'Title is required'; isValid = false; }
      if (!banner.subtitle) { errors.subtitle = 'Subtitle is required'; isValid = false; }
      if (!banner.description) { errors.description = 'Description is required'; isValid = false; }
      if (!banner.buttonText) { errors.buttonText = 'Button text is required'; isValid = false; }
      if (!banner.buttonLink) { errors.buttonLink = 'Button link is required'; isValid = false; }
      if (!bannerImageFile && !bannerPreviewUrl) { errors.image = 'Banner image is required'; isValid = false; }

      setBannerErrors(errors);

      if (!isValid) {
        toast.error('Please fix the errors in the Banner Settings.');
        return;
      }
    } else {
      setBannerErrors({});
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        themeId: activeTheme,
        primaryColor,
        buttonColors,
        fontFamily,
        language,
        currencySymbol,
        footer,
        banner,
        shippingZones,
        defaultShippingCost
      }));
      
      if (bannerImageFile) {
        formData.append('bannerImage', bannerImageFile);
      }
      
      await api.put('/themes/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSavedTheme(activeTheme);
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving theme', error);
      const errorMessage = error.response?.data?.message || 'Failed to save settings';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateFooter = (section: 'socialLinks' | 'contactInfo' | 'policies', field: string, value: string) => {
    setFooter((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center flex-shrink-0">
               <Palette className="w-10 h-10 text-white" />
            </div>
            <div className="text-white text-center md:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">Store Theme & Settings</h1>
              <p className="text-indigo-200 mt-2 text-sm font-medium">
                Customize the look, feel, and details of your storefront
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col pb-24">
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-8 bg-gray-50/80 p-2 rounded-xl border border-gray-100 shadow-sm w-full">
          {[
            { id: 'template', label: 'Theme Template', icon: LayoutTemplate },
            { id: 'customization', label: 'Advanced Customization', icon: Settings },
            { id: 'banner', label: 'Banner Settings', icon: ImageIcon },
            { id: 'footer', label: 'Footer & Policies', icon: Type },
            { id: 'shipping', label: 'Shipping', icon: Truck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all grow md:grow-0 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm border border-gray-100'
                  : 'text-gray-500 hover:bg-white hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
        {/* Theme Template Selection */}
        {activeTab === 'template' && (
        <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Choose a Theme Template</h2>
              <p className="text-xs text-gray-500 font-medium">Select a base design for your store</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableThemes.map((theme) => (
                <div 
                  key={theme.id}
                  onClick={() => {
                    setActiveTheme(theme.id);
                    setPrimaryColor(theme.accent);
                  }}
                  className={`group relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                    activeTheme === theme.id 
                      ? 'border-indigo-600 ring-4 ring-indigo-50 bg-indigo-50/10 scale-[1.02]' 
                      : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {savedTheme === theme.id && (
                    <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-br-lg rounded-tl-xl z-20 shadow-sm border-r border-b border-indigo-700">
                      Live
                    </div>
                  )}
                  {activeTheme === theme.id && (
                    <div className="absolute top-3 right-3 text-indigo-600 z-10">
                      <CheckCircle2 className="w-6 h-6 fill-indigo-100" />
                    </div>
                  )}
                  <div 
                    className="w-full h-36 rounded-xl mb-4 border border-gray-200 shadow-sm flex flex-col p-4 relative overflow-hidden group-hover:shadow-md transition-shadow"
                    style={{ backgroundColor: theme.color }}
                  >
                    {/* Mockup UI */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-16 h-4 rounded-md" style={{ backgroundColor: theme.textColor, opacity: 0.8 }}></div>
                      <div className="flex gap-1.5">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.2 }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.textColor, opacity: 0.2 }}></div>
                      </div>
                    </div>
                    <div className="w-3/4 h-6 rounded-md mb-2" style={{ backgroundColor: theme.textColor, opacity: 0.9 }}></div>
                    <div className="w-1/2 h-4 rounded-md mb-4" style={{ backgroundColor: theme.textColor, opacity: 0.5 }}></div>
                    <div className="w-24 h-8 rounded-lg mt-auto shadow-sm transition-colors duration-300" style={{ backgroundColor: activeTheme === theme.id ? primaryColor : theme.accent }}></div>
                  </div>
                  <h4 className={`font-bold text-center transition-colors ${activeTheme === theme.id ? 'text-indigo-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {theme.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </Card>
        )}

        {/* Advanced Customization */}
        {activeTab === 'customization' && (
          <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0">
            <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Advanced Customization</h2>
                <p className="text-xs text-gray-500 font-medium">Fine-tune your store's appearance</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Palette className="w-4 h-4 text-gray-500" /> Primary Accent Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="absolute inset-[-10px] w-20 h-20 cursor-pointer" 
                      />
                    </div>
                    <Input 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                      className="w-32 font-mono uppercase text-center" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Used for primary buttons, active states, and highlights.</p>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Palette className="w-4 h-4 text-gray-500" /> Add to Cart Button Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                      <input 
                        type="color" 
                        value={buttonColors.addToCart || primaryColor} 
                        onChange={(e) => setButtonColors({ ...buttonColors, addToCart: e.target.value })} 
                        className="absolute inset-[-10px] w-20 h-20 cursor-pointer" 
                      />
                    </div>
                    <Input 
                      value={buttonColors.addToCart} 
                      onChange={(e) => setButtonColors({ ...buttonColors, addToCart: e.target.value })} 
                      placeholder={primaryColor}
                      className="w-32 font-mono uppercase text-center" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Optional. Overrides the primary color.</p>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Palette className="w-4 h-4 text-gray-500" /> Buy Now Button Color
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer group">
                      <input 
                        type="color" 
                        value={buttonColors.buyNow || '#ef4444'} 
                        onChange={(e) => setButtonColors({ ...buttonColors, buyNow: e.target.value })} 
                        className="absolute inset-[-10px] w-20 h-20 cursor-pointer" 
                      />
                    </div>
                    <Input 
                      value={buttonColors.buyNow} 
                      onChange={(e) => setButtonColors({ ...buttonColors, buyNow: e.target.value })} 
                      placeholder="#ef4444"
                      className="w-32 font-mono uppercase text-center" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-medium">Optional. Defaults to standard red.</p>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Type className="w-4 h-4 text-gray-500" /> Heading Font
                  </label>
                  <Select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    options={[
                      { value: "Inter", label: "Inter (Default)" },
                      { value: "Roboto", label: "Roboto" },
                      { value: "Playfair Display", label: "Playfair Display" },
                      { value: "Montserrat", label: "Montserrat" }
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-3 font-medium">Select the font used for titles and headers.</p>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <LayoutTemplate className="w-4 h-4 text-gray-500" /> Store Language
                  </label>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    options={[
                      { value: "en", label: "English (EN)" },
                      { value: "bn", label: "Bengali (BN)" }
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-3 font-medium">Select the default language for your storefront.</p>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Type className="w-4 h-4 text-gray-500" /> Currency Symbol
                  </label>
                  <Input 
                    value={currencySymbol} 
                    onChange={(e) => setCurrencySymbol(e.target.value)} 
                    placeholder="e.g. ৳, BDT, $"
                  />
                  <p className="text-xs text-gray-500 mt-3 font-medium">Set the currency symbol to display (e.g. ৳ or BDT).</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Banner Settings */}
        {activeTab === 'banner' && (
          <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0 lg:col-span-2">
            <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
              <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Banner Settings</h2>
                <p className="text-xs text-gray-500 font-medium">Configure the hero banner for your storefront</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Banner Image</h4>
                  <ImageUpload 
                    error={bannerErrors.image}
                    previewUrl={bannerPreviewUrl}
                    onChange={(file) => {
                      if (file && file.size > 10 * 1024 * 1024) {
                        toast.error('Banner image size must be less than 10MB');
                        return;
                      }
                      setBannerImageFile(file);
                      if (file) {
                        setBannerPreviewUrl(URL.createObjectURL(file));
                      } else {
                        setBannerPreviewUrl(null);
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Banner Content</h4>
                  <div className="space-y-5">
                    <Input 
                      label="Title"
                      type="text" 
                      error={bannerErrors.title}
                      value={banner.title} 
                      onChange={(e) => setBanner(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Summer Sale 2026"
                    />
                    <Input 
                      label="Subtitle"
                      type="text" 
                      error={bannerErrors.subtitle}
                      value={banner.subtitle} 
                      onChange={(e) => setBanner(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="e.g. Up to 50% off on all electronics"
                    />
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700">Description</label>
                      <textarea
                        value={banner.description}
                        onChange={(e) => setBanner(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g. Discover premium products curated for every lifestyle and budget."
                        className={`w-full min-h-[100px] px-4 py-3 rounded-xl border ${bannerErrors.description ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none text-sm shadow-sm`}
                      />
                      {bannerErrors.description && <p className="mt-1 text-xs text-red-500">{bannerErrors.description}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Button Text"
                        type="text" 
                        error={bannerErrors.buttonText}
                        value={banner.buttonText} 
                        onChange={(e) => setBanner(prev => ({ ...prev, buttonText: e.target.value }))}
                        placeholder="e.g. Shop Now"
                      />
                      <Input 
                        label="Button Link"
                        type="text" 
                        error={bannerErrors.buttonLink}
                        value={banner.buttonLink} 
                        onChange={(e) => setBanner(prev => ({ ...prev, buttonLink: e.target.value }))}
                        placeholder="e.g. /categories"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Footer Settings */}
        {activeTab === 'footer' && (
          <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full mb-0">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Footer Settings</h2>
              <p className="text-xs text-gray-500 font-medium">Manage contact info and important links</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Contact Information
                </h4>
                <div className="space-y-5">
                  <Input 
                    label="Support Email"
                    type="email" 
                    value={footer.contactInfo.email} 
                    onChange={(e) => updateFooter('contactInfo', 'email', e.target.value)}
                    placeholder="support@mystore.com"
                  />
                  <Input 
                    label="Phone Number"
                    type="text" 
                    value={footer.contactInfo.phone} 
                    onChange={(e) => updateFooter('contactInfo', 'phone', e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Store Address</label>
                    <textarea 
                      value={footer.contactInfo.address} 
                      onChange={(e) => updateFooter('contactInfo', 'address', e.target.value)}
                      placeholder="123 Main St, City, Country"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Policy Content */}
              <div className="space-y-6">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" /> Policy Content
                </h4>
                <div className="space-y-3">
                  {[
                    { id: 'aboutUs', label: 'About Us Content' },
                    { id: 'privacyPolicy', label: 'Privacy Policy Content' },
                    { id: 'termsAndConditions', label: 'Terms & Conditions Content' },
                    { id: 'returnPolicy', label: 'Return Policy Content' },
                  ].map(policy => (
                    <div key={policy.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button 
                        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-sm font-bold text-gray-700 transition-colors"
                        onClick={() => setActivePolicyTab(activePolicyTab === policy.id ? '' : policy.id)}
                      >
                        {policy.label}
                        <svg className={`w-4 h-4 transition-transform ${activePolicyTab === policy.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      
                      {activePolicyTab === policy.id && (
                        <div className="p-4 border-t border-gray-100">
                          <Textarea 
                            value={footer.policies[policy.id as keyof typeof footer.policies]} 
                            onChange={(e) => updateFooter('policies', policy.id, e.target.value)}
                            placeholder={`Enter ${policy.label} here...`}
                            className="min-h-[250px]" 
                            richText={true}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links & Copyright */}
              <div className="lg:col-span-2 space-y-6 pt-4">
                <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" /> Social Links & Copyright
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input 
                    label="Facebook URL"
                    type="url" 
                    value={footer.socialLinks.facebook} 
                    onChange={(e) => updateFooter('socialLinks', 'facebook', e.target.value)}
                    placeholder="https://facebook.com/yourstore"
                  />
                  <Input 
                    label="YouTube URL"
                    type="url" 
                    value={footer.socialLinks.youtube} 
                    onChange={(e) => updateFooter('socialLinks', 'youtube', e.target.value)}
                    placeholder="https://youtube.com/@yourstore"
                  />
                  <Input 
                    label="TikTok URL"
                    type="url" 
                    value={footer.socialLinks.tiktok} 
                    onChange={(e) => updateFooter('socialLinks', 'tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@yourstore"
                  />
                </div>
                <div className="pt-2 max-w-md">
                  <Input 
                    label="Copyright Text"
                    type="text" 
                    value={footer.copyrightText} 
                    onChange={(e) => setFooter(prev => ({ ...prev, copyrightText: e.target.value }))}
                    placeholder="© 2026 Your Store Name"
                  />
                </div>
              </div>

            </div>
          </div>
        </Card>
        )}

        {/* Shipping Settings Tab */}
        {activeTab === 'shipping' && (
          <Card className="p-8 border border-gray-100 shadow-sm rounded-2xl bg-white animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-visible">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Shipping Zones</h3>
                <p className="text-gray-500 text-sm">Configure delivery charges based on customer location.</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Default Shipping */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">Default Shipping Cost</h4>
                <p className="text-sm text-gray-500 mb-4">This cost applies to any location that doesn't match a specific zone below.</p>
                <div className="max-w-xs">
                  <Input 
                    type="number" 
                    value={defaultShippingCost.toString()} 
                    onChange={(e) => setDefaultShippingCost(Number(e.target.value))}
                    placeholder="e.g. 120"
                    label="Amount (BDT)"
                  />
                </div>
              </div>

              {/* Existing Zones */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">Configured Zones</h4>
                {shippingZones.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No shipping zones configured yet. Add one below.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {shippingZones.map((zone, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="space-y-1">
                          <h5 className="font-bold text-gray-900 flex items-center gap-2">
                            {zone.name}
                            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                              {zone.cost === 0 ? 'Free' : `৳ ${zone.cost}`}
                            </span>
                          </h5>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{zone.division}</span>
                            {zone.districts.length > 0 && ` • ${zone.districts.join(', ')}`}
                            {zone.districts.length === 0 && ` • All districts`}
                          </p>
                        </div>
                        <button 
                          onClick={() => setShippingZones(prev => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Delete Zone"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Zone */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4">Add New Zone</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input 
                    label="Zone Name" 
                    placeholder="e.g. Inside Dhaka"
                    value={newZone.name}
                    onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input 
                    label="Delivery Charge (৳)" 
                    type="number"
                    placeholder="e.g. 80 (0 for Free)"
                    value={newZone.cost.toString()}
                    onChange={(e) => setNewZone(prev => ({ ...prev, cost: Number(e.target.value) }))}
                  />
                  
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Division</label>
                    <Select 
                      value={newZone.division} 
                      onChange={(e) => {
                        setNewZone(prev => ({ ...prev, division: e.target.value, districts: [] }));
                        const found = bdLocations.find(d => d.division === e.target.value);
                        setNewZoneDistrictsList(found ? found.districts.map(d => d.district) : []);
                      }}
                      options={[
                        { label: 'Select Division...', value: '' },
                        ...bdLocations.map(d => ({ label: d.division, value: d.division }))
                      ]}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 flex justify-between">
                      <span>Districts</span>
                      <span className="text-xs text-gray-400 font-normal">Optional</span>
                    </label>
                    <Select 
                      disabled={!newZone.division}
                      value="" 
                      onChange={(e) => {
                        const dist = e.target.value;
                        if (dist && !newZone.districts.includes(dist)) {
                          setNewZone(prev => ({ ...prev, districts: [...prev.districts, dist] }));
                        }
                      }}
                      options={[
                        { label: 'Select districts to add...', value: '' },
                        ...newZoneDistrictsList.map(dist => ({ label: dist, value: dist }))
                      ]}
                    />
                    
                    {newZone.districts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {newZone.districts.map(dist => (
                          <div key={dist} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-indigo-100">
                            {dist}
                            <button 
                              onClick={() => setNewZone(prev => ({ ...prev, districts: prev.districts.filter(d => d !== dist) }))}
                              className="hover:text-indigo-900 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">If no districts are selected, this zone applies to the entire division.</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    if (!newZone.name) {
                      toast.error("Please provide a zone name");
                      return;
                    }
                    setShippingZones(prev => [...prev, newZone]);
                    setNewZone({ name: '', cost: 0, division: '', districts: [] });
                    setNewZoneDistrictsList([]);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Zone
                </button>
              </div>
            </div>
          </Card>
        )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 z-50">
        <div className="bg-white/90 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 flex items-center gap-4">
          <p className="text-sm text-gray-500 font-medium ml-2 hidden sm:block">Update theme to save changes</p>
          <button 
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-6 md:px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 w-full md:w-auto"
          >
            <Save className="w-5 h-5" /> 
            {saving ? 'Saving Changes...' : 'Save Theme Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
