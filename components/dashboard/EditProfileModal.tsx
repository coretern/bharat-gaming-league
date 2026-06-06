'use client';

import React, { useState, useEffect } from 'react';
import { X, Pencil, KeyRound, Loader2, Check, Eye, EyeOff, Key } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useProfilePassword } from '@/hooks/useProfilePassword';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { profile, loading: profileLoading, saving, saveProfile, fetchProfile } = useProfile();
  const {
    step, otp, setOtp, password, setPassword,
    confirmPassword, setConfirmPassword, loading: pwLoading,
    cooldown, requestOtp, verifyAndSetPassword, resetForm,
  } = useProfilePassword(fetchProfile);

  const [nameValue, setNameValue] = useState(user.name || '');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (!profileLoading && profile.name) setNameValue(profile.name);
  }, [profileLoading, profile.name]);

  useEffect(() => {
    if (!isOpen) { resetForm(); }
  }, [isOpen]);

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    await saveProfile({ name: nameValue.trim() });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-2xl">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Edit Profile</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Edit Name Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pencil className="w-3.5 h-3.5 text-google-blue" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Display Name</h3>
              </div>
              <div className="flex gap-2">
                <input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-google-blue/25 transition-shadow"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <button
                  onClick={handleSaveName}
                  disabled={saving || nameValue.trim() === (profile.name || user.name || '')}
                  className="h-10 px-4 rounded-xl bg-google-blue text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-600 active:scale-[0.97] transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">This name is shown on your profile and registrations.</p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800" />

            {/* Password Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <KeyRound className="w-3.5 h-3.5 text-google-yellow" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {profile.hasPassword ? 'Change Password' : 'Set Password'}
                </h3>
              </div>

              {step === 'idle' ? (
                <button
                  onClick={requestOtp}
                  disabled={pwLoading}
                  className="h-10 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 border border-slate-200 dark:border-slate-700"
                >
                  {pwLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                  {profile.hasPassword ? 'Change Password' : 'Set Password'}
                </button>
              ) : (
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-[11px] text-slate-500 font-medium">
                    We sent a 6-digit code to <strong className="text-slate-700 dark:text-slate-300">{user.email}</strong>
                  </p>

                  {/* OTP */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">OTP Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text" maxLength={6} placeholder="6-digit code"
                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold tracking-widest text-center outline-none focus:ring-2 focus:ring-google-blue/20"
                      />
                      <button onClick={requestOtp} disabled={pwLoading || cooldown > 0}
                        className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 disabled:opacity-50">
                        {cooldown > 0 ? `${cooldown}s` : 'Resend'}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">New Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters"
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/20" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPass ? 'text' : 'password'} placeholder="Retype password"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-google-blue/20" />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button onClick={resetForm} disabled={pwLoading}
                      className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                    <button onClick={verifyAndSetPassword} disabled={pwLoading}
                      className="flex-1 h-9 rounded-lg bg-google-blue text-white text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                      {pwLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (profile.hasPassword ? 'Change' : 'Set Password')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
