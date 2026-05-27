'use client';

import React, { useRef, useState } from 'react';
import { useWithdrawalData } from '@/hooks/useWithdrawalData';
import { useProfile } from '@/hooks/useProfile';
import { Loader, Wallet, ArrowUpRight, ArrowDownRight, ShieldAlert, CheckCircle2, ChevronRight, Eye, X } from 'lucide-react';
import MetricCard from './MetricCard';
import HistoryList from './HistoryList';

export default function WithdrawalContent() {
  const { data, loading, error } = useWithdrawalData();
  const { profile, loading: loadingProfile, saveProfile, saving } = useProfile();
  const [showQrPopup, setShowQrPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading || loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <Loader className="w-8 h-8 animate-spin text-google-blue" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing ledger...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 shadow-sm">
          <ShieldAlert className="w-10 h-10 text-google-red mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Failed to load records</h3>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const netBalance = data.totalEarning - data.totalSpend;
  const hasQr = !!profile.paymentQrUrl;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-1 sm:px-0">
      {/* Metrics Row — 2 column on mobile for Spend & Earning, Net Position spans full */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
        <MetricCard title="Total Spend" amount={data.totalSpend} icon={<ArrowDownRight className="w-3.5 h-3.5 text-google-red" />} color="text-google-red" bg="bg-red-500/5 dark:bg-red-500/10 border-red-100/50 dark:border-red-500/10" desc="Entry fees paid" />
        <MetricCard title="Total Earning" amount={data.totalEarning} icon={<ArrowUpRight className="w-3.5 h-3.5 text-google-green" />} color="text-google-green" bg="bg-green-500/5 dark:bg-green-500/10 border-green-100/50 dark:border-green-500/10" desc="Tournament prizes won" />
        <div className="col-span-2 sm:col-span-1">
          <MetricCard title="Net Position" amount={netBalance} icon={<Wallet className="w-3.5 h-3.5 text-google-blue" />} color={netBalance >= 0 ? 'text-google-green' : 'text-google-red'} bg="bg-blue-500/5 dark:bg-blue-500/10 border-blue-100/50 dark:border-blue-500/10" desc="Overall balance sheet" />
        </div>
      </div>

      {/* Payout QR Status */}
      <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${
        hasQr ? 'bg-green-50/40 dark:bg-green-500/5 border-green-200/40 dark:border-green-500/20' : 'bg-amber-50/40 dark:bg-amber-500/5 border-amber-200/40 dark:border-amber-500/20'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-5">
          <div className="flex gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center border ${
              hasQr ? 'bg-google-green/10 border-google-green/20 text-google-green' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
            }`}>
              {hasQr ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">{hasQr ? 'Payout Account Configured' : 'Link Payout QR Code'}</h4>
              <p className="text-[9.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1 max-w-xl font-medium">
                {hasQr ? 'All cash prizes won are manually reviewed by admins and dispatched directly to your PhonePe/GPay QR linked below.' : 'To claim prize money from tournaments, you must upload your payment QR code in your gaming profile.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full md:w-auto gap-3 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-200/50 dark:border-slate-800/40 md:border-0 shrink-0">
            {hasQr ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowQrPopup(true)} className="relative group cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shrink-0">
                  <img src={profile.paymentQrUrl} alt="Payment QR" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 object-cover bg-white shadow-sm" />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3 h-3 text-white" />
                  </div>
                </button>
                <div className="text-left leading-none">
                  <span className="text-[8px] font-black text-google-green uppercase tracking-widest">Linked</span>
                  <button onClick={() => setShowQrPopup(true)} className="block text-[9px] font-bold text-slate-400 hover:text-google-blue mt-0.5">
                    View QR
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[8.5px] font-bold uppercase tracking-wider">Awaiting Setup</span>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await saveProfile({}, file);
            }} />

            {saving ? (
              <div className="flex items-center gap-1.5 py-1 text-[9px] font-black uppercase text-slate-400">
                <Loader className="w-3 h-3 animate-spin" /> Uploading...
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className={`h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all flex items-center gap-1 active:scale-95 ${
                hasQr 
                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-transparent text-slate-700 dark:text-slate-200' 
                  : 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600 shadow-amber-500/20'
              }`}>
                {hasQr ? 'Change QR' : 'Link QR'}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial History Section */}
      <HistoryList history={data.history} />

      {/* QR Code Popup Modal */}
      {showQrPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowQrPopup(false)}>
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowQrPopup(false)} className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-1">Your Payout QR</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">PhonePe / GPay Linked QR Code</p>
            <div className="w-64 h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-2 bg-white flex items-center justify-center shadow-sm">
              <img src={profile.paymentQrUrl} alt="Payout QR" className="max-w-full max-h-full object-contain" />
            </div>
            <p className="text-[10px] text-slate-500 font-semibold text-center mt-4 uppercase tracking-widest leading-relaxed">
              Admins use this QR directly to disburse prize payouts.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
