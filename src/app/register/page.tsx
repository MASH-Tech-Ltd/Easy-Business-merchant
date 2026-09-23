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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute blur-[80px] opacity-50 rounded-full w-[400px] h-[400px] bg-[hsla(var(--accent-primary),0.4)] -top-[100px] -right-[100px]"></div>
        <div className="absolute blur-[80px] opacity-50 rounded-full w-[500px] h-[500px] bg-[hsla(280,80%,60%,0.3)] -bottom-[150px] -left-[150px]"></div>
      </div>
      
      <div className="glass-panel w-full max-w-[440px] p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-br from-[hsl(var(--text-primary))] to-[hsl(var(--text-secondary))] bg-clip-text text-transparent">Create Your MASH ECO Store</h2>
          <p className="text-[hsl(var(--text-secondary))] text-[0.95rem]">Join the platform and start selling today</p>
        </div>
        
        {error && (
          <div className="bg-[hsla(0,80%,50%,0.1)] text-[hsl(0,80%,50%)] p-3 rounded-[var(--radius-md)] text-sm mb-6 border border-[hsla(0,80%,50%,0.2)] text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-[hsl(var(--text-primary))]">Store/Owner Name</label>
            <input 
              type="text" 
              id="name" 
              className="input-field" 
              placeholder="e.g. Awesome MASH ECO" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-[hsl(var(--text-primary))]">Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary mt-4 w-full text-base" disabled={loading}>
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-[hsl(var(--text-secondary))]">
          Already have a store? <Link href="/login" className="text-[hsl(var(--accent-primary))] font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
