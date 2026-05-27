'use client';

import React from 'react';
import { type Reg } from '../../types/admin';

interface RejectionHistoryProps {
  viewReg: Reg;
}

export default function RejectionHistory({ viewReg }: RejectionHistoryProps) {
  const hasReason = !!viewReg.rejectionReason;
  const hasHistory = viewReg.rejectionHistory && viewReg.rejectionHistory.length > 0;

  if (!hasReason && !hasHistory) return null;

  return (
    <div className="mb-6 space-y-3">
      {/* Current / Latest Rejection */}
      {hasReason && (
        <div className={`p-4 rounded-xl border ${viewReg.status === 'Rejected' ? 'bg-red-50/50 border-red-200 dark:bg-red-500/5 dark:border-red-500/15' : 'bg-amber-50/50 border-amber-200 dark:bg-amber-500/5 dark:border-amber-500/15'}`}>
          <h4 className={`text-[9px] font-black uppercase mb-1.5 tracking-widest ${viewReg.status === 'Rejected' ? 'text-google-red' : 'text-amber-600'}`}>
            {viewReg.status === 'Rejected' ? '⚠ Active Rejection Reason' : '⚠ Previous Rejection (Now Resubmitted)'}
          </h4>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed">"{viewReg.rejectionReason}"</p>
          {viewReg.rejectionTargets && viewReg.rejectionTargets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {viewReg.rejectionTargets.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-[8px] font-bold text-google-red uppercase tracking-wider border border-red-200 dark:border-red-500/20">{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Rejection History Timeline */}
      {viewReg.rejectionHistory && viewReg.rejectionHistory.length > 1 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">📋 Rejection History ({viewReg.rejectionHistory.length} rejections)</h4>
          <div className="space-y-2.5">
            {[...viewReg.rejectionHistory].reverse().map((entry, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-google-red shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {new Date(entry.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic mt-0.5">"{entry.reason}"</p>
                  {entry.targets && entry.targets.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.targets.map((t, j) => (
                        <span key={j} className="px-1.5 py-px rounded bg-slate-100 dark:bg-slate-700 text-[7.5px] font-bold text-slate-500 uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
