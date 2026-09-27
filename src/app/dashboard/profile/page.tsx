'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, LogOut, Store, Shield, Phone, Mail, 
  MapPin, Package, Building2, User, ImagePlus, Upload, Image as ImageIcon,
  Smartphone, Lock, Key, Copy, CheckCircle, X, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [merchantUser, setMerchantUser] = useState<any>(null);

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [checkoutNote, setCheckoutNote] = useState('');
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [storeLogoPreview, setStoreLogoPreview] = useState<string>('');
  const storeLogoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    details: '',
    storeName: '',
    taxId: '',
    supportEmail: '',
    supportPhone: '',
    warrantyPeriod: '1 Year',
    returnPolicy: '14 Days',
  });

  // 2FA Authenticator State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [setupOtp, setSetupOtp] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [disableOtp, setDisableOtp] = useState('');
  const [is2FALoading, setIs2FALoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('merchantUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setMerchantUser(user);
        
        let extraDetails = {};
        try {
          if (user.details && user.details.startsWith('{')) {
            extraDetails = JSON.parse(user.details);
          }
        } catch(e) {}

        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          details: user.details && !user.details.startsWith('{') ? user.details : (extraDetails as any).details || '',
          storeName: (extraDetails as any).storeName || user.name || '',
          taxId: (extraDetails as any).taxId || '',
          supportEmail: (extraDetails as any).supportEmail || user.email || '',
          supportPhone: (extraDetails as any).supportPhone || user.phone || '',
          warrantyPeriod: (extraDetails as any).warrantyPeriod || '1 Year',
          returnPolicy: (extraDetails as any).returnPolicy || '14 Days',
        });
        if (user.avatar?.secure_url) {
          setPreviewUrl(user.avatar.secure_url);
        }
      }
    } catch (e) {
      console.error('Failed to parse merchant user', e);
    }

    const fetchStoreSettings = async () => {
      try {
        const res = await api.get('/tenants/my-store');
        const data = res.data?.data;
        if (data) {
          if (data.settings?.checkoutNote) {
            setCheckoutNote(data.settings.checkoutNote);
          }
          if (data.logo) {
            setStoreLogoPreview(data.logo);
          }
        }
      } catch (err) {
        console.error('Failed to fetch store settings', err);
      }
    };

    const fetch2FAStatus = async () => {
      try {
        const res = await api.get('/auth/2fa/status');
        if (res.data?.success || res.data?.status === 'ok') {
          setIs2FAEnabled(!!res.data?.data?.twoFactorEnabled);
        }
      } catch (err) {
        console.error('Failed to fetch 2FA status', err);
      }
    };

    fetchStoreSettings();
    fetch2FAStatus();
  }, []);

  const handleStart2FASetup = async () => {
    setIs2FALoading(true);
    try {
      const res = await api.post('/auth/2fa/setup');
      if (res.data?.success || res.data?.status === 'ok') {
        setQrCodeUrl(res.data.data.qrCodeUrl);
        setTwoFactorSecret(res.data.data.secret);
        setSetupOtp('');
        setTwoFactorStep(1);
        setIs2FAModalOpen(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate 2FA setup');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerifyEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupOtp.trim() || setupOtp.trim().length < 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setIs2FALoading(true);
    try {
      const res = await api.post('/auth/2fa/verify-enable', { code: setupOtp.trim() });
      if (res.data?.success || res.data?.status === 'ok') {
        toast.success('2FA Authenticator enabled successfully!');
        setIs2FAEnabled(true);
        setRecoveryCodes(res.data.data.recoveryCodes || []);
        setTwoFactorStep(3);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIs2FALoading(true);
    try {
      const res = await api.post('/auth/2fa/disable', { code: disableOtp.trim() });
      if (res.data?.success || res.data?.status === 'ok') {
        toast.success('2FA Authenticator disabled successfully');
        setIs2FAEnabled(false);
        setIsDisable2FAModalOpen(false);
        setDisableOtp('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setIs2FALoading(false);
    }
  };

  const copyToClipboard = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('Avatar image size must be less than 10MB');
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
        toast.error('Store Logo size must be less than 10MB');
        if (storeLogoInputRef.current) {
          storeLogoInputRef.current.value = '';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('details', detailsJson);
      
      if (imageFile) {
        data.append('avatar', imageFile);
      }

      const storeData = new FormData();
      storeData.append('name', formData.storeName);
      storeData.append('checkoutNote', checkoutNote);
      if (formData.details) {
        storeData.append('description', formData.details);
      }
      if (storeLogo) {
        storeData.append('logo', storeLogo);
      }

      const [userResponse, storeResponse] = await Promise.all([
        api.put('/users/me', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        api.patch('/tenants/update-store', storeData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ]);

      if (userResponse.data?.data) {
        sessionStorage.setItem('merchantUser', JSON.stringify(userResponse.data.data));
        setMerchantUser(userResponse.data.data);
      }

      toast.success('Profile and Store Settings updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    if (confirm('Are you sure you want to logout from all devices? You will be logged out of this session as well.')) {
      try {
        await api.post('/auth/logout-all');
      } catch (err) {
        console.error('Logout all failed', err);
      } finally {
        sessionStorage.removeItem('merchantToken');
        sessionStorage.removeItem('merchantUser');
        router.push('/login');
      }
    }
  };

  return (
    <div className="p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 px-8 py-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/20 shadow-2xl flex-shrink-0 group relative overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Store Avatar" className="w-full h-full rounded-xl object-cover bg-white" />
              ) : (
                <div className="w-full h-full rounded-xl bg-white/20 flex items-center justify-center border-2 border-dashed border-white/40">
                  <Store className="w-10 h-10 text-white/70" />
                </div>
              )}
              <label className="absolute inset-0 m-2 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10">
                <ImagePlus className="w-6 h-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Change</span>
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
            <div className="text-white text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight">{formData.storeName || 'Your Store'}</h1>
              <p className="text-indigo-200 mt-2 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <Store className="w-4 h-4" /> MASH ECO Merchant Dashboard
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleLogoutAll}
            className="group bg-white/10 hover:bg-red-500/20 text-white hover:text-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-red-500/50 backdrop-blur-md"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" /> Sign Out All Devices
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50/80 backdrop-blur-md text-red-600 p-4 rounded-xl border border-red-200 shadow-sm text-sm mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 font-medium"><Shield className="w-5 h-5"/> {error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Column 1: Personal & Store Identity */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                  <p className="text-xs text-gray-500 font-medium">Your personal contact details</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Full Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g. John Doe"
                    required
                  />
                  <Input 
                    label="Personal Phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your contact number"
                  />
                </div>
                <Input 
                  label="Email Address" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E.g. your@email.com"
                  required
                />
              </div>
            </Card>

            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Store Identity</h2>
                  <p className="text-xs text-gray-500 font-medium">Public details for your MASH ECO shop</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Store Name" 
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="E.g. TechHaven MASH ECO"
                  />
                  <Input 
                    label="Tax / Registration ID" 
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="VAT or Business ID"
                  />
                </div>
                <Input 
                  label="Business Address" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete business address"
                />
                <Textarea 
                  label="About the Store" 
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Tell customers about your MASH ECO specialties..."
                  rows={4}
                />
                
                <div className="pt-2">
                  <Textarea 
                    label="Checkout Note (Optional)" 
                    name="checkoutNote"
                    value={checkoutNote}
                    onChange={(e) => setCheckoutNote(e.target.value)}
                    placeholder="E.g. Our representative will call you for confirmation."
                    rows={2}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">This text will appear at the bottom of the payment options on the checkout page.</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    Store Logo
                  </label>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group flex-shrink-0">
                      {storeLogoPreview ? (
                        <img src={storeLogoPreview} alt="Store Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="text-center p-2">
                          <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                        </div>
                      )}
                      
                      <div 
                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => storeLogoInputRef.current?.click()}
                      >
                        <Upload className="w-5 h-5 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">Upload</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 pt-1">
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
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        Choose Image
                      </button>
                      <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                        Recommended size: 200x50px. Max file size: 10MB. Supported formats: PNG, JPG, SVG, WEBP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Column 2: Policies & Support */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl h-full">
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Operations & Policies</h2>
                  <p className="text-xs text-gray-500 font-medium">Support info and MASH ECO rules</p>
                </div>
              </div>
              <div className="p-6 space-y-8">
                
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Phone className="w-4 h-4 text-gray-400"/> Customer Support
                  </h3>
                  <Input 
                    label="Support Email" 
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleChange}
                    placeholder="support@store.com"
                  />
                  <Input 
                    label="Support Phone" 
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleChange}
                    placeholder="Customer service line"
                  />
                </div>

                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Shield className="w-4 h-4 text-gray-400"/> MASH ECO Policies
                  </h3>
                  <Select
                    label="Default Warranty"
                    name="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={handleChange as any}
                    options={[
                      { value: 'None', label: 'None' },
                      { value: '3 Months', label: '3 Months' },
                      { value: '6 Months', label: '6 Months' },
                      { value: '1 Year', label: '1 Year' },
                      { value: '2 Years', label: '2 Years' },
                    ]}
                  />
                  <Select
                    label="Return Policy"
                    name="returnPolicy"
                    value={formData.returnPolicy}
                    onChange={handleChange as any}
                    options={[
                      { value: 'No Returns', label: 'No Returns' },
                      { value: '7 Days', label: '7 Days' },
                      { value: '14 Days', label: '14 Days' },
                      { value: '30 Days', label: '30 Days' },
                    ]}
                  />
                </div>
              </div>
            </Card>

            {/* 2FA Security Card */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">2FA Authenticator</h2>
                    <p className="text-xs text-gray-500 font-medium">Protect merchant login with 6-digit TOTP</p>
                  </div>
                </div>
                {is2FAEnabled ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    Enabled
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    Disabled
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {is2FAEnabled
                    ? 'Two-Factor Authentication is currently active on your merchant account. You will need your authenticator app to log in.'
                    : 'Add Google Authenticator, Authy, or Microsoft Authenticator to protect your merchant store against unauthorized access.'}
                </p>

                {is2FAEnabled ? (
                  <button
                    type="button"
                    onClick={() => setIsDisable2FAModalOpen(true)}
                    className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Disable 2FA
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart2FASetup}
                    disabled={is2FALoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {is2FALoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Enable 2FA Authenticator
                      </>
                    )}
                  </button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="sticky bottom-6 z-20 flex justify-center sm:justify-end px-4 sm:px-0">
          <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
            <p className="text-sm text-gray-500 font-medium mr-4 hidden sm:block">Update your profile to save changes</p>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Save className="w-5 h-5" /> 
              {loading ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </div>
        </div>
      </form>

      {/* 2FA Setup Modal */}
      {is2FAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Set Up 2FA Authenticator</h2>
                  <p className="text-xs text-gray-500 font-medium">Protect merchant account with TOTP</p>
                </div>
              </div>
              <button 
                onClick={() => setIs2FAModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {twoFactorStep === 1 && (
                <div className="space-y-5 text-center">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 text-left">
                    <p className="font-semibold mb-1">Step 1: Scan QR Code</p>
                    Open Google Authenticator, Authy, or Microsoft Authenticator and scan the QR code below.
                  </div>

                  {qrCodeUrl && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-3 bg-white border-2 border-gray-200 rounded-2xl shadow-md inline-block">
                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 object-contain" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-500 font-medium">Manual secret key:</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-mono text-xs tracking-wider select-all font-bold">
                        {twoFactorSecret}
                      </code>
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(twoFactorSecret, 'Secret key copied!')}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setTwoFactorStep(2)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-xs"
                  >
                    Next: Enter 6-Digit Code
                  </button>
                </div>
              )}

              {twoFactorStep === 2 && (
                <form onSubmit={handleVerifyEnable2FA} className="space-y-5">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                    <p className="font-semibold mb-1">Step 2: Enter Verification Code</p>
                    Enter the 6-digit verification code currently shown in your Authenticator app.
                  </div>

                  <div className="space-y-2 text-center">
                    <label className="text-xs font-semibold text-gray-700">6-Digit Code</label>
                    <input 
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={setupOtp}
                      onChange={(e) => setSetupOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-widest font-mono text-2xl font-bold text-gray-900"
                      placeholder="000000"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setTwoFactorStep(1)}
                      className="w-1/3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors text-xs"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={is2FALoading}
                      className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2 text-xs"
                    >
                      {is2FALoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Verify & Enable 2FA'}
                    </button>
                  </div>
                </form>
              )}

              {twoFactorStep === 3 && (
                <div className="space-y-5">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">2FA Enabled Successfully!</p>
                      <p className="mt-1">Save these backup recovery codes. If you lose access to your phone, you can use these codes to sign in.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 border border-gray-200 rounded-xl font-mono text-xs text-center font-bold tracking-wider text-gray-800">
                    {recoveryCodes.map((code, idx) => (
                      <div key={idx} className="p-2 bg-white rounded border border-gray-200 shadow-xs">
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'Recovery codes copied!')}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-xs flex items-center gap-2 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Copy All Codes
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIs2FAModalOpen(false); setTwoFactorStep(1); }}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {isDisable2FAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" /> Disable 2FA Authenticator
              </h3>
              <button type="button" onClick={() => setIsDisable2FAModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Disabling 2FA will reduce your account security. Please enter your 6-digit authenticator code or backup recovery code to confirm.
            </p>

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <input 
                type="text"
                maxLength={8}
                value={disableOtp}
                onChange={(e) => setDisableOtp(e.target.value)}
                placeholder="6-digit code or recovery code"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono tracking-widest text-center text-lg text-gray-900"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsDisable2FAModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={is2FALoading}
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  {is2FALoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Disable 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
