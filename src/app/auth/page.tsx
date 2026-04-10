'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const result = login(email, password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const result = register(name, email, password);
        if (result.success) {
          router.push('/dashboard');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-2xl font-arabic">ح</span>
          </div>
          <h1 className="text-2xl font-bold font-display">
            {mode === 'login' ? 'Welcome Back' : 'Join HifzPro'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Sign in to continue your journey' : 'Create an account to track your progress'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            {mode === 'login' ? 'First user registered automatically becomes admin' : 'By signing up, you agree to learn and grow in faith 🌟'}
          </p>
        </div>
      </div>
    </div>
  );
}
