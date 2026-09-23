'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'tenant_admin' })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      router.push('/login');
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
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="E-commerce success" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-primary))]/90 to-gray-900/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-xl">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white p-2 rounded-xl">
              <img src="/MEasy.png" alt="MASH ECO Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">masheco</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-[1.15]">
            Start your journey with MashEco today.
          </h1>
          <p className="text-lg text-gray-300 mb-12 leading-relaxed max-w-md">
            Create your store in seconds and unlock the most powerful tools to scale your business online.
          </p>
          
          <div className="flex flex-col gap-4 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-[hsl(var(--accent-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">No hidden fees or setup costs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-[hsl(var(--accent-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Instant store deployment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[hsl(var(--accent-primary))]/20 p-1.5 rounded-full">
                <svg className="w-5 h-5 text-[hsl(var(--accent-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">24/7 dedicated merchant support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-6 sm:p-12 lg:p-16 xl:p-24 relative overflow-y-auto">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <img src="/MEasy.png" alt="MASH ECO" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">masheco</span>
        </div>
        
        <div className="w-full max-w-md mt-10 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create your store</h2>
            <p className="text-gray-500 text-sm">Fill in your details below to get started on masheco.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">Store/Owner Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400" 
                placeholder="e.g. Awesome Electronics" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400" 
                placeholder="admin@mystore.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  id="password" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:border-[hsl(var(--accent-primary))] transition-all outline-none placeholder:text-gray-400" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="mt-2 w-full bg-[hsl(var(--accent-primary))] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[hsl(var(--accent-primary))]/25 hover:shadow-[hsl(var(--accent-primary))]/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Store...</span>
                </div>
              ) : 'Create Store'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Already have a store?{' '}
              <Link href="/login" className="text-[hsl(var(--accent-primary))] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
