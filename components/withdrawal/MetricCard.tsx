'use client';

import React from 'react';
import { IndianRupee } from 'lucide-react';

interface MetricCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  desc: string;
}

export default function MetricCard({ title, amount, icon, color, bg, desc }: MetricCardProps) {
  return (
    <div className={`rounded-2xl border p-3.5 sm:p-5 shadow-sm relative overflow-hidden transition-all duration-300 ${bg}`}>
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-current opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 relative z-10">
        <span className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{title}</span>
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-center shrink-0">{icon}</div>
      </div>
      <div className="flex items-baseline gap-0.5 relative z-10">
        <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 self-center" />
        <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${color}`}>{Math.abs(amount).toLocaleString('en-IN')}</span>
      </div>
      <p className="text-[8.5px] sm:text-[9.5px] text-slate-450 dark:text-slate-500 font-semibold mt-2 relative z-10 leading-none">{desc}</p>
    </div>
  );
}
