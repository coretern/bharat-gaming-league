import { Trophy } from "lucide-react";

interface TournamentHeaderProps {
  tournament: any;
  entryFee: number;
}

export default function TournamentHeader({ tournament, entryFee }: TournamentHeaderProps) {
  if (!tournament) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] relative overflow-hidden">
       <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-google-blue mb-3">
              <Trophy className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Official Tournament</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{tournament.title}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:text-right">
              <div>
                <p className="text-[9px] font-bold uppercase text-slate-400">Match Prize Pool</p>
                <p className="text-xl font-bold text-google-green">{tournament.prizePool}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-slate-400">Entry Fee</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">₹{entryFee}</p>
              </div>
          </div>
       </div>
    </div>
  );
}
