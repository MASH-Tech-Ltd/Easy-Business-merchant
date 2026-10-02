'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Key, Lock, Eye, EyeOff, Smartphone, 
  Copy, CheckCircle, X, AlertTriangle, ShieldAlert, ArrowRight,
  Shield, Check, RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/utils/api';
import { toast } from 'react-hot-toast';

export default function SecurityPage() {
  const router = useRouter();

  // 2FA State
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

  // Password Update State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    fetch2FAStatus();
  }, []);

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

  // 2FA Actions
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
      toast.error(err.response?.data?.message || 'Invalid 2FA code. Please try again.');
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
        toast.success('2FA Authenticator has been disabled');
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

  // Password Update Action
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: typeof fieldErrors = {};

    if (!passwordForm.oldPassword) {
      errors.oldPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and a number';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await api.post('/auth/change-password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data?.success || res.data?.status === 'ok') {
        toast.success('Password updated successfully!');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password';
      if (msg.toLowerCase().includes('current password')) {
        setFieldErrors({ oldPassword: msg });
      } else if (msg.toLowerCase().includes('password')) {
        setFieldErrors({ newPassword: msg });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const copyToClipboard = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  // Password requirements calculation
  const hasMinLength = passwordForm.newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordForm.newPassword);
  const hasLower = /[a-z]/.test(passwordForm.newPassword);
  const hasNumber = /\d/.test(passwordForm.newPassword);

  return (
    <div className="p-3 sm:p-6 w-full max-w-[1800px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">Security & 2FA Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Manage Two-Factor Authentication and update your merchant account password.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 border shadow-sm ${
            is2FAEnabled 
              ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50/80 text-amber-700 border-amber-200'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${is2FAEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            2FA Status: <span className="font-bold">{is2FAEnabled ? 'Protected' : 'Standard'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        
        {/* ── CARD 1: TWO-FACTOR AUTHENTICATION (2FA) ────────────────────── */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">2FA Authenticator App</h2>
                  <p className="text-xs text-gray-500 font-medium">Time-based One Time Password</p>
                </div>
              </div>
              {is2FAEnabled ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  Off
                </span>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                is2FAEnabled ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                {is2FAEnabled ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-sm mb-0.5">
                    {is2FAEnabled ? 'Your merchant store is protected with 2FA' : 'Two-Factor Authentication is currently disabled'}
                  </p>
                  <p>
                    {is2FAEnabled
                      ? 'Every time you log in, you will be prompted for a 6-digit verification code from Google Authenticator, Authy, or Microsoft Authenticator.'
                      : 'Protect your merchant business against unauthorized access. Scanning a QR code connects your smartphone to your account.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recommended Authenticator Apps:</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-700">
                    Google Authenticator
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-700">
                    Authy App
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-700">
                    MS Authenticator
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/30">
            {is2FAEnabled ? (
              <button
                type="button"
                onClick={() => setIsDisable2FAModalOpen(true)}
                className="w-full py-3 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Turn Off 2FA Authenticator
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart2FASetup}
                disabled={is2FALoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                {is2FALoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> Enable 2FA Authenticator
                  </>
                )}
              </button>
            )}
          </div>
        </Card>

        {/* ── CARD 2: UPDATE PASSWORD WITH OLD PASSWORD ────────────────── */}
        <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500 font-medium">Update your password using your current (old) password</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
            {/* Old Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, oldPassword: e.target.value });
                    if (fieldErrors.oldPassword) setFieldErrors(prev => ({ ...prev, oldPassword: undefined }));
                  }}
                  placeholder="Enter current password"
                  className={`w-full px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none pr-10 ${
                    fieldErrors.oldPassword ? 'border-2 border-red-400 bg-red-50/20' : 'bg-gray-50 border border-gray-200 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.oldPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{fieldErrors.oldPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                    if (fieldErrors.newPassword) setFieldErrors(prev => ({ ...prev, newPassword: undefined }));
                  }}
                  placeholder="Enter new strong password"
                  className={`w-full px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none pr-10 ${
                    fieldErrors.newPassword ? 'border-2 border-red-400 bg-red-50/20' : 'bg-gray-50 border border-gray-200 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Re-enter new password"
                  className={`w-full px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none pr-10 ${
                    fieldErrors.confirmPassword ? 'border-2 border-red-400 bg-red-50/20' : 'bg-gray-50 border border-gray-200 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500 font-semibold mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements Checklist */}
            {passwordForm.newPassword && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <p className="font-bold text-slate-700 mb-1">Password Strength Requirements:</p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <Check className="w-3.5 h-3.5" /> At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <Check className="w-3.5 h-3.5" /> Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <Check className="w-3.5 h-3.5" /> Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                    <Check className="w-3.5 h-3.5" /> Number (0-9)
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
            >
              {isPasswordLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Key className="w-4 h-4" /> Update Password Now
                </>
              )}
            </button>
          </form>
        </Card>

      </div>

      {/* ── 2FA SETUP MODAL ─────────────────────────────────────────────────── */}
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
                  <p className="text-xs text-gray-500 font-medium">Step-by-step TOTP enrollment</p>
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

      {/* ── DISABLE 2FA MODAL ──────────────────────────────────────────────── */}
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
              Disabling 2FA will reduce your merchant account security. Please enter your 6-digit authenticator code or backup recovery code to confirm.
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
