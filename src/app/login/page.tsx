'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      const user = data.data.user;
      if (user && user.role !== 'tenant_admin') {
        throw new Error('Access denied. Merchant account required.');
      }
      
      sessionStorage.setItem('merchantUser', JSON.stringify(user));
      router.push('/dashboard');
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
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-br from-[hsl(var(--text-primary))] to-[hsl(var(--text-secondary))] bg-clip-text text-transparent">Welcome to masheco</h2>
          <p className="text-[hsl(var(--text-secondary))] text-[0.95rem]">Sign in to manage your MASH ECO merchant store</p>
        </div>
        
        {error && (
          <div className="bg-[hsla(0,80%,50%,0.1)] text-[hsl(0,80%,50%)] p-3 rounded-[var(--radius-md)] text-sm mb-6 border border-[hsla(0,80%,50%,0.2)] text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-[hsl(var(--text-primary))]">Password</label>
              <Link href="/forgot" className="text-[13px] text-[hsl(var(--accent-primary))] font-medium transition-colors duration-200 hover:text-[hsl(var(--accent-hover))]">Forgot password?</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="input-field w-full pr-10" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          
          <button type="submit" className="btn-primary mt-4 w-full text-base" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-[hsl(var(--text-secondary))]">
          Don't have a store yet? <Link href="/register" className="text-[hsl(var(--accent-primary))] font-semibold hover:underline">Create one now</Link>
        </p>
      </div>
    </div>
  );
}
