'use client';

import React from 'react';
import Link from 'next/link';
import { useWithdrawalData, WithdrawalHistoryItem } from '@/hooks/useWithdrawalData';
import { useProfile } from '@/hooks/useProfile';
import { Loader, Wallet, ArrowUpRight, ArrowDownRight, IndianRupee, ShieldAlert, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

export default function WithdrawalContent() {
  const { data, loading, error } = useWithdrawalData();
  const { profile, loading: loadingProfile } = useProfile();

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
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Failed to load financial records</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const netBalance = data.totalEarning - data.totalSpend;
  const hasQr = !!profile.paymentQrUrl;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-1 sm:px-0">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Total Spend"
          amount={data.totalSpend}
          icon={<ArrowDownRight className="w-4 h-4 text-google-red" />}
          color="text-google-red"
          bg="bg-red-500/5 dark:bg-red-500/10 border-red-100 dark:border-red-500/10"
          desc="Entry fees paid"
        />
        <MetricCard
          title="Total Earning"
          amount={data.totalEarning}
          icon={<ArrowUpRight className="w-4 h-4 text-google-green" />}
          color="text-google-green"
          bg="bg-green-500/5 dark:bg-green-500/10 border-green-100 dark:border-green-500/10"
          desc="Tournament prizes won"
        />
        <MetricCard
          title="Net Position"
          amount={netBalance}
          icon={<Wallet className="w-4 h-4 text-google-blue" />}
          color={netBalance >= 0 ? 'text-google-green' : 'text-google-red'}
          bg="bg-blue-500/5 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/10"
          desc="Overall balance sheet"
        />
      </div>

      {/* Payout QR Status */}
      <div className={`border rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${
        hasQr 
          ? 'bg-green-50/40 dark:bg-green-500/5 border-green-200/50 dark:border-green-500/20' 
          : 'bg-amber-50/40 dark:bg-amber-500/5 border-amber-200/50 dark:border-amber-500/20'
      }`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${
              hasQr 
                ? 'bg-google-green/10 border-google-green/20 text-google-green' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
            }`}>
              {hasQr ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                {hasQr ? 'Payout Account Configured' : 'Link Payout QR Code'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-1 max-w-xl font-medium">
                {hasQr 
                  ? 'All cash prizes won are manually reviewed by admins and dispatched directly to your PhonePe/GPay QR linked below.' 
                  : 'To claim prize money from tournaments, you must upload your payment QR code in your gaming profile.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            {hasQr && (
              <img 
                src={profile.paymentQrUrl} 
                alt="Payment QR" 
                className="w-11 h-11 rounded-lg border border-slate-200 dark:border-slate-800 object-cover bg-white"
              />
            )}
            <Link 
              href="/dashboard?tab=Profile" 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm transition-all flex items-center gap-1 active:scale-95 ${
                hasQr
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  : 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600 shadow-amber-500/20'
              }`}
            >
              {hasQr ? 'Manage QR' : 'Link Account'}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Financial History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_1px_2px_0_rgba(60,64,67,.30)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base">Ledger & Tournament History</h3>
        </div>

        {data.history.length === 0 ? (
          <div className="py-20 text-center">
            <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">No transaction history recorded.</p>
            <Link href="/tournaments" className="inline-block mt-4 px-4 py-2 rounded-lg bg-google-blue text-white text-[10px] font-black uppercase tracking-widest shadow-md">
              Join Tournament
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {data.history.map((reg) => (
              <div key={reg.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      reg.resultStatus === 'Won' 
                        ? 'bg-green-500/10 text-google-green border border-green-500/10' 
                        : reg.resultStatus === 'Lost' 
                          ? 'bg-slate-150 dark:bg-slate-800 text-slate-500' 
                          : 'bg-blue-500/10 text-google-blue border border-blue-500/10'
                    }`}>
                      {reg.resultStatus === 'Won' ? 'Winner' : reg.resultStatus === 'Lost' ? 'Eliminated' : 'Awaiting Match'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{reg.matchType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate pr-4">{reg.tournamentName}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {reg.matchDate ? `${reg.matchDate} · ${reg.matchTime}` : `Registered ${new Date(reg.createdAt).toLocaleDateString('en-IN')}`}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 border-slate-50 dark:border-slate-800/30 pt-3 sm:pt-0 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Fee Paid</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">₹{reg.spend}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prize Won</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${reg.earning > 0 ? 'text-google-green' : 'text-slate-400 dark:text-slate-650'}`}>
                      {reg.earning > 0 ? `+₹${reg.earning}` : '₹0'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, amount, icon, color, bg, desc }: { title: string; amount: number; icon: React.ReactNode; color: string; bg: string; desc: string }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${bg}`}>
      {/* Decorative pulse glow in the card */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-current opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</span>
        <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-0.5 relative z-10">
        <IndianRupee className="w-3.5 h-3.5 text-slate-400 self-center" />
        <span className={`text-2xl font-extrabold tracking-tight ${color}`}>
          {Math.abs(amount).toLocaleString('en-IN')}
        </span>
      </div>
      
      <p className="text-[9.5px] text-slate-450 dark:text-slate-500 font-semibold mt-2 relative z-10 leading-none">
        {desc}
      </p>
    </div>
  );
}
