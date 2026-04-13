import { Trophy } from "lucide-react";

interface TournamentHeaderProps {
  tournament: any;
  entryFee: number;
}

export default function TournamentHeader({ tournament, entryFee }: TournamentHeaderProps) {
  if (!tournament) return null;
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
       <div className="absolute -right-4 -top-4 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full" />
       <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[.2em]">Live Tournament</span>
          </div>
          <h3 className="font-black italic uppercase text-3xl tracking-tighter">{tournament.title}</h3>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-300">
              <p>Match Entry Fee: <span className="text-white">₹{entryFee}</span></p>
              <p>Prize Pool: <span className="text-green-400">{tournament.prizePool}</span></p>
              <p>Schedule: <span className="text-white">{tournament.date}</span></p>
          </div>
       </div>
    </div>
  );
}
