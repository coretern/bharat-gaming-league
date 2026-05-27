'use client';

import { Trophy } from 'lucide-react';

interface Winner {
  team: string;
  prize: string;
  tournament: string;
}

const winners: Winner[] = [
  { team: 'Team Alpha', prize: '₹1,000', tournament: 'Pro League S15' },
  { team: 'Shadow Squad', prize: '₹500', tournament: 'Alpha Cups Elite' },
  { team: 'Death Reapers', prize: '₹2,500', tournament: 'Winter Clash' },
  { team: 'BloodBath Boys', prize: '₹750', tournament: 'Pro League S14' },
  { team: 'Noob Slayers', prize: '₹300', tournament: 'Open Cup' },
  { team: 'Fire Lords', prize: '₹1,500', tournament: 'BGMI Invitational' },
];

function TickerRow() {
  const items = [...winners, ...winners, ...winners];
  return (
    <div className="flex gap-6 animate-[marquee_40s_linear_infinite] whitespace-nowrap items-center">
      {items.map((w, i) => (
        <div key={i} className="flex items-center gap-2.5 px-4 py-2 bg-white/70 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm backdrop-blur-sm">
          <Trophy className="w-3 h-3 text-google-yellow shrink-0" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">{w.team}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase select-none">won</span>
          <span className="text-xs font-extrabold text-emerald-500">{w.prize}</span>
          <span className="text-[9px] text-google-blue font-bold tracking-wider uppercase bg-blue-50/80 dark:bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-100/80 dark:border-blue-800/30">
            {w.tournament}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WinnersTicker() {
  return (
    <div className="relative w-full py-4 overflow-hidden bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50 dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-900/30 border-y border-slate-100/80 dark:border-slate-800/60">
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <TickerRow />
    </div>
  );
}
