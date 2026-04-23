import React from 'react';
import { Clock, Trophy } from 'lucide-react';
import { Reg } from '../../types/admin';
import { to12Hour } from '@/lib/time-utils';

interface CompletedGroupCardProps {
  groupNumber: number;
  date: string;
  teams: Reg[];
  onViewReg: (reg: Reg) => void;
}

const CompletedGroupCard: React.FC<CompletedGroupCardProps> = ({
  groupNumber,
  date,
  teams,
  onViewReg
}) => {
  const matchTime = to12Hour(teams[0]?.matchTime);
  const winner = teams.find(t => t.resultStatus === 'Won');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header with winner highlight */}
      <div className="bg-slate-100 dark:bg-slate-800/70 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Group {groupNumber}</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{date}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-black italic">{matchTime}</span>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="px-4 py-3 bg-google-green/10 border-b border-google-green/20 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-google-green" />
          <span className="text-[10px] font-black uppercase text-google-green tracking-widest">
            Winner: {winner.teamName}
          </span>
        </div>
      )}
      
      <div className="p-4 space-y-2">
        {teams.map(team => (
          <div
            key={team._id}
            onClick={() => onViewReg(team)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
          >
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${
                team.resultStatus === 'Won' ? 'text-google-green' : 'text-slate-400'
              }`}>{team.teamName}</span>
              <span className="text-[9px] text-slate-300 font-medium">Slot {team.slotNumber}</span>
            </div>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
              team.resultStatus === 'Won' ? 'bg-google-green text-white' :
              team.resultStatus === 'Lost' ? 'bg-slate-200 text-slate-500' :
              'bg-slate-100 text-slate-400'
            }`}>
              {team.resultStatus || 'Playing'}
            </span>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{teams.length} Teams • Match Over</span>
        <button 
          onClick={() => onViewReg(teams[0])}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CompletedGroupCard;
