'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Phone } from 'lucide-react';
import SocialLogins from './SocialLogins';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  callbackUrl: string;
  onSwitchMode: (mode: 'login') => void;
  onSignupInitSuccess: (email: string) => void;
}

export default function SignupForm({ email, setEmail, callbackUrl, onSwitchMode, onSignupInitSuccess }: SignupFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !phoneNumber || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to request registration');
      } else {
        onSignupInitSuccess(email);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-google-red shrink-0 mt-0.5" />
            <span className="text-[11px] font-bold text-google-red leading-tight">{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-12 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-955 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-12 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-google-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-98"
        >
          {loading ? 'Sending verification...' : 'Create Account'}
        </button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
        </div>
        <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400">Or continue with</span>
      </div>

      <SocialLogins callbackUrl={callbackUrl} email={email} />

      <div className="text-center pt-2">
        <p className="text-[11px] font-medium text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onSwitchMode('login')}
            className="text-google-blue font-bold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
