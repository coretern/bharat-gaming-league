'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface OTPFormProps {
  email: string;
  onSwitchMode: (mode: 'login') => void;
  onVerificationSuccess: (msg: string) => void;
}

export default function OTPForm({ email, onSwitchMode, onVerificationSuccess }: OTPFormProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to verify account');
      } else {
        onVerificationSuccess('Account created successfully! You can now log in with your password.');
        onSwitchMode('login');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-left bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Verify your email</p>
        <p className="text-[11px] text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
          We sent a 6-digit OTP code to: <span className="text-google-blue font-bold">{email}</span>. Please enter it below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-left flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-google-red shrink-0 mt-0.5" />
            <span className="text-[10px] font-bold text-google-red leading-tight">{error}</span>
          </div>
        )}

        <div className="relative">
          <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            maxLength={6}
            placeholder="6-Digit Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-10 pr-3 text-center text-sm font-bold tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-google-blue/15 focus:border-google-blue transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-[11px] placeholder:text-slate-500 dark:placeholder:text-slate-400 placeholder:opacity-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-google-blue text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-98"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="text-center pt-1">
        <button
          onClick={() => onSwitchMode('login')}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-450 hover:text-slate-650 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Login
        </button>
      </div>
    </div>
  );
}
