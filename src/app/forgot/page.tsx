'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      setSuccess('OTP sent successfully to your email');
      setResetToken(data.data?.resetToken || data.resetToken);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, otp, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute blur-[80px] opacity-50 rounded-full w-[400px] h-[400px] bg-[hsla(var(--accent-primary),0.4)] -top-[100px] -right-[100px]"></div>
        <div className="absolute blur-[80px] opacity-50 rounded-full w-[500px] h-[500px] bg-[hsla(280,80%,60%,0.3)] -bottom-[150px] -left-[150px]"></div>
      </div>
      
      <div className="glass-panel w-full max-w-[440px] p-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/MEasy.png" alt="MASH ECO" className="w-20 h-20 object-contain mb-4" />
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-br from-[hsl(var(--text-primary))] to-[hsl(var(--text-secondary))] bg-clip-text text-transparent">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-[hsl(var(--text-secondary))] text-[0.95rem]">
            {step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>
        
        {error && (
          <div className="bg-[hsla(0,80%,50%,0.1)] text-[hsl(0,80%,50%)] p-3 rounded-[var(--radius-md)] text-sm mb-6 border border-[hsla(0,80%,50%,0.2)] text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-[hsla(120,80%,50%,0.1)] text-[hsl(120,80%,40%)] p-3 rounded-[var(--radius-md)] text-sm mb-6 border border-[hsla(120,80%,50%,0.2)] text-center">
            {success}
          </div>
        )}
        
        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-[hsl(var(--text-primary))]">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="input-field" 
                placeholder="admin@mystore.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn-primary mt-4 w-full text-base" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="otp" className="text-sm font-medium text-[hsl(var(--text-primary))]">OTP</label>
              <input 
                type="text" 
                id="otp" 
                className="input-field text-center font-bold tracking-widest text-lg" 
                placeholder="••••••"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required 
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-[hsl(var(--text-primary))]">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="input-field w-full pr-10" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="btn-primary mt-4 w-full text-base" disabled={loading || success.includes('Redirecting')}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <p className="mt-8 text-center text-sm text-[hsl(var(--text-secondary))]">
          Remembered your password? <Link href="/login" className="text-[hsl(var(--accent-primary))] font-semibold hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
