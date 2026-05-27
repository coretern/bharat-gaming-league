'use client';

import { Trophy, Medal } from "lucide-react";
import { Winner } from "./types";

interface WinnersGridProps {
  sortedDates: string[];
  groupedWinners: Record<string, Winner[]>;
}

export default function WinnersGrid({ sortedDates, groupedWinners }: WinnersGridProps) {
  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <Medal className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase">No winners announced yet</h3>
        <p className="text-slate-400 font-medium text-sm">Compete in active tournaments to secure your spot!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {new Date(date).toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}
            </span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {groupedWinners[date].map((w) => (
              <div 
                key={w._id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 mx-auto mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold text-google-blue uppercase tracking-widest mb-1 line-clamp-1">{w.tournamentName}</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">₹{w.amount}</p>
                </div>
                <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{w.playerName}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{w.teamName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
