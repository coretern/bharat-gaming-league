import React from 'react';
import { Clock } from 'lucide-react';
import { Reg } from '../../types/admin';

interface ScheduleGroupCardProps {
  groupNumber: number;
  date: string;
  teams: Reg[];
  onViewReg: (reg: Reg) => void;
}

const ScheduleGroupCard: React.FC<ScheduleGroupCardProps> = ({
  groupNumber,
  date,
  teams,
  onViewReg
}) => {
  const matchTime = teams[0]?.matchTime || 'TBA';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-google-blue/30 transition-all">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-google-blue uppercase tracking-widest mb-0.5">Group {groupNumber}</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">{date}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end text-google-blue">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-black italic">{matchTime}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {teams.map(team => (
          <div
            key={team._id}
            onClick={() => onViewReg(team)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{team.teamName}</span>
              <span className="text-[9px] text-slate-400 font-medium">Slot {team.slotNumber}</span>
            </div>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
              team.resultStatus === 'Won' ? 'bg-google-green text-white' :
              team.resultStatus === 'Lost' ? 'bg-slate-200 text-slate-500' :
              'bg-google-blue/10 text-google-blue'
            }`}>
              {team.resultStatus || 'Playing'}
            </span>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{teams.length} Teams Finalized</span>
        <button 
          onClick={() => onViewReg(teams[0])}
          className="text-[10px] font-black text-google-blue uppercase tracking-widest hover:underline"
        >
          Manage Match
        </button>
      </div>
    </div>
  );
};

export default ScheduleGroupCard;
