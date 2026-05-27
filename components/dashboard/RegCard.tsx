'use client';

import React, { useState } from 'react';
import { Trophy, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import RegCardDetails from './RegCardDetails';

export interface RegCardData {
  _id: string;
  tournamentName: string;
  matchType: string;
  teamName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  paymentVerified: boolean;
  groupNumber?: number;
  slotNumber?: number;
  resultStatus?: 'Playing' | 'Won' | 'Lost';
  prizeAmount?: number;
  winnerTeamName?: string;
  winnerScreenshot?: string;
  matchDate?: string;
  matchTime?: string;
  roomId?: string;
  roomPassword?: string;
  orderId?: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Approved: 'bg-green-50 dark:bg-green-500/10 text-google-green border-green-200 dark:border-green-500/20',
    Rejected: 'bg-red-50 dark:bg-red-500/10 text-google-red border-red-200 dark:border-red-500/20',
    Pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20',
  }[status] || '';
  const Icon = status === 'Approved' ? CheckCircle2 : status === 'Rejected' ? XCircle : Clock;
  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider border ${styles}`}>
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {status}
    </span>
  );
}

export default function RegCard({ reg }: { reg: RegCardData }) {
  const isWon = reg.resultStatus === 'Won';
  const isLost = reg.resultStatus === 'Lost';
  const isCompleted = isWon || isLost;
  const [expanded, setExpanded] = useState(false);

  // Border accent color
  const borderAccent = isWon ? 'border-l-google-green' :
    isLost ? 'border-l-slate-300 dark:border-l-slate-600' :
    reg.status === 'Approved' ? 'border-l-google-green' :
    reg.status === 'Rejected' ? 'border-l-google-red' :
    'border-l-amber-400';

  return (
    <div className={`border-l-[3px] ${borderAccent} bg-white dark:bg-slate-900 rounded-r-xl mx-0.5 sm:mx-0 my-2 shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      {/* Header — always visible */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-2.5 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
            isWon ? 'bg-gradient-to-br from-google-green to-emerald-600 text-white shadow-sm' :
            isLost ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' :
            'bg-google-blue/10 text-google-blue'
          }`}>
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{reg.tournamentName}</p>
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold text-google-blue uppercase">{reg.matchType}</span>
              <span className="text-[8px] sm:text-[9px] text-slate-300">•</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 truncate max-w-[80px] sm:max-w-none">{reg.teamName}</span>
              {reg.groupNumber && (
                <>
                  <span className="text-[8px] sm:text-[9px] text-slate-300">•</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">G{reg.groupNumber}:S{reg.slotNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isWon && <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-google-green text-white text-[9px] sm:text-[10px] font-black">₹{reg.prizeAmount}</span>}
          {isLost && <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] sm:text-[10px] font-black uppercase">Lost</span>}
          {!isCompleted && <StatusBadge status={reg.status} />}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
        </div>
      </button>

      {/* Expanded body */}
      {expanded && <RegCardDetails reg={reg} />}
    </div>
  );
}
