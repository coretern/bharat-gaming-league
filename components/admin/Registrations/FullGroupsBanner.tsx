import React from 'react';
import { CalendarCheck, Zap, ArrowRight } from 'lucide-react';

export interface FullGroupInfo {
  tournamentName: string;
  tournamentId?: string;
  groupNumber: number;
  totalCount: number;
  target: number;
  gameType: string;
}

interface FullGroupsBannerProps {
  fullGroups: FullGroupInfo[];
  onSchedule: (group: FullGroupInfo) => void;
}

const FullGroupsBanner: React.FC<FullGroupsBannerProps> = ({
  fullGroups,
  onSchedule
}) => {
  if (fullGroups.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-google-green/40 bg-gradient-to-r from-google-green/5 via-emerald-50/50 to-google-green/5 dark:from-google-green/10 dark:via-emerald-950/30 dark:to-google-green/10 p-5">
      {/* Animated background glow */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-google-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-google-green text-white shadow-lg shadow-green-500/30 animate-bounce">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-white">
              {fullGroups.length} Group{fullGroups.length > 1 ? 's' : ''} Ready to Schedule!
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              These groups are full — assign match date & time
            </p>
          </div>
        </div>

        {/* Group Cards */}
        <div className="flex flex-wrap gap-2">
          {fullGroups.map((g) => (
            <button
              key={`${g.tournamentName}-${g.groupNumber}`}
              onClick={() => onSchedule(g)}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-google-green/20 hover:border-google-green/60 shadow-sm hover:shadow-lg hover:shadow-green-500/10 transition-all active:scale-95"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-google-green/10 text-google-green">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-slate-800 dark:text-white truncate max-w-[140px]">
                  {g.tournamentName}
                </p>
                <p className="text-[9px] font-bold text-slate-400">
                  Group {g.groupNumber} • {g.totalCount}/{g.target} Full
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-google-green group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullGroupsBanner;
