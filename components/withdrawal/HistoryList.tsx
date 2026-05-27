'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { type WithdrawalHistoryItem } from '@/hooks/useWithdrawalData';

interface HistoryListProps {
  history: WithdrawalHistoryItem[];
}

export default function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center shadow-sm">
        <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">No transaction history recorded.</p>
        <Link href="/tournaments" className="inline-block mt-4 px-4 py-2 rounded-lg bg-google-blue text-white text-[10px] font-black uppercase tracking-widest shadow-md">Join Tournament</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5">
      {history.map((reg) => {
        const isWon = reg.resultStatus === 'Won';
        const isLost = reg.resultStatus === 'Lost';
        const borderLeft = isWon ? 'border-l-google-green' : isLost ? 'border-l-slate-400 dark:border-l-slate-700' : 'border-l-google-blue';
        
        return (
          <div key={reg.id} className={`border-l-4 ${borderLeft} bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-r-2xl rounded-l-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:shadow-md hover:translate-x-0.5 transition-all duration-200`}>
            {/* Left Block: Match info */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Status icon based on outcome */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                isWon ? 'bg-green-500/10 text-google-green border border-green-500/20' : 
                isLost ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700' : 
                'bg-blue-500/10 text-google-blue border border-blue-500/20'
              }`}>
                <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    isWon ? 'bg-google-green text-white shadow-sm' : 
                    isLost ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 
                    'bg-google-blue text-white shadow-sm'
                  }`}>
                    {isWon ? 'Winner' : isLost ? 'Eliminated' : 'Awaiting Match'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-google-blue dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/5 px-1.5 py-0.5 rounded">
                    {reg.matchType}
                  </span>
                </div>
                
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate pr-4 leading-snug">{reg.tournamentName}</h4>
                
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span>{reg.matchDate ? `${reg.matchDate} @ ${reg.matchTime}` : `Registered ${new Date(reg.createdAt).toLocaleDateString('en-IN')}`}</span>
                </div>
              </div>
            </div>
            
            {/* Right Block: Fees & Prize aggregation */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3.5 sm:pt-0 shrink-0">
              <div className="text-left sm:text-right">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Fee Paid</p>
                <div className="flex items-baseline gap-0.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-350 mt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">₹</span>
                  <span>{reg.spend}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Prize Won</p>
                <div className={`flex items-baseline gap-0.5 text-sm sm:text-base font-extrabold mt-0.5 ${
                  isWon ? 'text-google-green drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]' : 'text-slate-400 dark:text-slate-650 font-medium'
                }`}>
                  {isWon ? (
                    <>
                      <span className="text-[11px] font-black">+₹</span>
                      <span>{reg.earning}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-semibold">₹</span>
                      <span>0</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
