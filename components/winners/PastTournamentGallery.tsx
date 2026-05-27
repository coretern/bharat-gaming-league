'use client';

import { Crown, Eye, Gamepad2 } from "lucide-react";
import { PastTournament } from "./types";

interface PastTournamentGalleryProps {
  tournaments: PastTournament[];
}

export default function PastTournamentGallery({ tournaments }: PastTournamentGalleryProps) {
  if (tournaments.length === 0) {
    return (
      <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <Gamepad2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase">No past tournaments yet</h3>
        <p className="text-slate-400 font-medium text-sm">Completed tournaments will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tournaments.map((t, idx) => (
        <div 
          key={idx}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">{t.name}</h3>
              <span className="text-[10px] font-bold text-google-blue uppercase tracking-widest">{t.game} • {t.groups.length} Matches Completed</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-google-green text-[9px] font-black uppercase border border-green-100/50 dark:border-green-500/20">Completed</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.groups.map((g, j) => (
              <div key={j} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/80 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-google-blue uppercase tracking-widest">Group {g.groupNumber}</span>
                    <span className="text-[9px] font-bold text-slate-400">{g.matchDate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-4 h-4 text-yellow-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{g.winnerTeam}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-base font-extrabold text-google-green">₹{g.prize}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{g.matchType}</span>
                    {g.screenshot && (
                      <a href={g.screenshot} target="_blank" rel="noopener noreferrer" className="text-google-blue hover:text-blue-600 text-[10px] font-bold flex items-center gap-0.5 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Proof
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
