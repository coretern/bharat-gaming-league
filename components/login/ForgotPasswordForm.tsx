'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSwitchMode: (mode: 'login') => void;
  onResetSuccess: (msg: string) => void;
}

export default function ForgotPasswordForm({ email, setEmail, onSwitchMode, onResetSuccess }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'init' | 'reset'>('init');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to request reset OTP');
      } else {
        setStep('reset');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
      } else {
        onResetSuccess('Password reset successfully! You can now log in using your new password.');
        onSwitchMode('login');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'init') {
    return (
      <div className="space-y-6">
        <div className="text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reset password</p>
          <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
            Enter your email below. We will send a 6-digit OTP code to reset your password.
          </p>
        </div>
        <form onSubmit={handleInitSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-google-red shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold text-google-red leading-tight">{error}</span>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-google-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-98"
          >
            {loading ? 'Sending OTP...' : 'Send Reset Code'}
          </button>
        </form>
        <div className="text-center pt-2">
          <button
            onClick={() => onSwitchMode('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-slate-650 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Set new password</p>
        <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
          Enter the 6-digit OTP code sent to <span className="text-google-blue font-bold">{email}</span> and configure a new password.
        </p>
      </div>

      <form onSubmit={handleResetSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-google-red shrink-0 mt-0.5" />
            <span className="text-[11px] font-bold text-google-red leading-tight">{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              maxLength={6}
              placeholder="6-Digit Reset Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full h-11 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 text-center text-sm font-bold tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-xs placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-google-blue text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-98"
        >
          {loading ? 'Resetting password...' : 'Reset Password'}
        </button>
      </form>
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => setStep('init')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-450 hover:text-slate-650 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Email Entry
        </button>
      </div>
    </div>
  );
}
