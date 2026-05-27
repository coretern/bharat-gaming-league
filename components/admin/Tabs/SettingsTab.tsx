'use client';

import React from 'react';
import { useAdminSettings } from '@/hooks/admin/useAdminSettings';
import { Shield, UserPlus, Trash2, Loader2, Crown, ShieldAlert } from 'lucide-react';

export default function SettingsTab() {
  const {
    admins,
    loading,
    appointing,
    revokingEmail,
    emailInput,
    setEmailInput,
    appointAdmin,
    revokeAdmin,
  } = useAdminSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <Loader2 className="w-6 h-6 animate-spin text-google-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
          <span className="p-1.5 rounded-lg bg-google-blue/10 text-google-blue">
            <Shield className="w-4 h-4" />
          </span>
          Platform Administration Settings
        </h2>
        <p className="text-[11px] text-slate-400 font-medium">
          Configure security privileges, appoint official administrators, and manage platform permissions.
        </p>
      </div>

      {/* Appoint Administrator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white mb-3">
          <span className="p-1 rounded-lg bg-google-green/10 text-google-green">
            <UserPlus className="w-3.5 h-3.5" />
          </span>
          Appoint New Administrator
        </h3>
        <p className="text-[10px] text-slate-400 font-medium mb-4">
          Promote a registered user to Administrator. The user must have signed up on BGL at least once before promotion.
        </p>

        <form onSubmit={appointAdmin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter user email address"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            className="flex-1 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/20 transition-all"
            disabled={appointing}
          />
          <button
            type="submit"
            disabled={appointing}
            className="h-11 px-5 rounded-xl bg-google-blue hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {appointing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              'Appoint Admin'
            )}
          </button>
        </form>
      </div>

      {/* Current Administrators List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-850 dark:text-white mb-4 uppercase tracking-wider">
          Active Administrators ({admins.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {admins.map(admin => (
            <div key={admin.email} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl border border-slate-200/50 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-850">
                  {admin.image ? (
                    <img src={admin.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {admin.name}
                    </p>
                    {admin.isSuperAdmin ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase tracking-wider border border-amber-100 dark:border-amber-900/30">
                        <Crown className="w-2.5 h-2.5" /> Super
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {admin.email}
                  </p>
                </div>
              </div>

              {/* Prevent revoking root superadmin */}
              {!admin.isSuperAdmin ? (
                <button
                  onClick={() => revokeAdmin(admin.email)}
                  disabled={revokingEmail !== null}
                  className="p-2 rounded-xl text-slate-400 hover:text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  title="Revoke Admin Access"
                >
                  {revokingEmail === admin.email ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : (
                <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mr-2 select-none">
                  Protected
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
          <strong>Security Notice:</strong> All administrative modifications, promotions, and access revocations are cryptographically tracked and stored in the system audit logs. Ensure you have proper authorization before changing user role configurations.
        </p>
      </div>
    </div>
  );
}
