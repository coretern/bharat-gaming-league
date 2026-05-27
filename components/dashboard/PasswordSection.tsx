'use client';

import React, { useState } from 'react';
import { useProfilePassword } from '@/hooks/useProfilePassword';
import { Section } from './ProfileComponents';
import { KeyRound, Loader2, Key, Eye, EyeOff } from 'lucide-react';

interface PasswordSectionProps {
  hasPassword: boolean;
  email: string;
  onSuccess: () => void;
}

export default function PasswordSection({ hasPassword, email, onSuccess }: PasswordSectionProps) {
  const {
    step,
    otp,
    setOtp,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    cooldown,
    requestOtp,
    verifyAndSetPassword,
    resetForm,
  } = useProfilePassword(onSuccess);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <Section icon={<KeyRound className="w-4 h-4" />} title="Change Password">
      {step === 'idle' ? (
        <div className="flex justify-start">
          <button
            onClick={requestOtp}
            disabled={loading}
            className="h-10 px-6 rounded-lg bg-google-blue hover:bg-blue-600 active:scale-[0.98] text-white text-[11px] font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
            {hasPassword ? 'Change Password' : 'Set Password'}
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="mb-4">
            <h3 className="text-xs font-black text-slate-850 dark:text-slate-250 uppercase tracking-wider mb-1">
              Verify Account Identity
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              We sent a 6-digit verification code to your email <strong className="text-slate-650 dark:text-slate-350 break-all">{email}</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {/* OTP Input with Resend */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-0.5">
                OTP Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 h-10 px-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-center outline-none focus:ring-2 focus:ring-google-blue/20"
                />
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={loading || cooldown > 0}
                  className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-[10px] font-bold text-slate-500 hover:text-slate-700 transition-colors shrink-0 disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-0.5">
                Choose Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-0.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={resetForm}
              disabled={loading}
              className="flex-1 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[10px] tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={verifyAndSetPassword}
              disabled={loading}
              className="flex-1 h-10 rounded-lg bg-google-blue text-white font-black uppercase text-[10px] tracking-wider hover:bg-blue-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                hasPassword ? 'Change Password' : 'Set Password'
              )}
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
