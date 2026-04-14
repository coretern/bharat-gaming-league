import React from 'react';
import { Calendar, Search, MapPin, Clock, Trophy } from 'lucide-react';
import { Reg } from '../../types/admin';

interface SchedulesTabProps {
  registrations: Reg[];
  loading: boolean;
  setViewReg: (reg: Reg) => void;
}

const SchedulesTab: React.FC<SchedulesTabProps> = ({
  registrations,
  loading,
  setViewReg
}) => {
  const scheduledRegs = registrations.filter(r => !!r.matchDate);

  // Group by Tournament -> Match Date -> Group Number
  const groupedMatches: Record<string, Record<string, Record<number, Reg[]>>> = {};
  
  scheduledRegs.forEach(reg => {
    if (!reg.matchDate) return;
    if (!groupedMatches[reg.tournamentName]) groupedMatches[reg.tournamentName] = {};
    if (!groupedMatches[reg.tournamentName][reg.matchDate]) groupedMatches[reg.tournamentName][reg.matchDate] = {};
    if (!groupedMatches[reg.tournamentName][reg.matchDate][reg.groupNumber || 0]) {
      groupedMatches[reg.tournamentName][reg.matchDate][reg.groupNumber || 0] = [];
    }
    groupedMatches[reg.tournamentName][reg.matchDate][reg.groupNumber || 0].push(reg);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Match Schedule
              <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[10px] font-black uppercase tracking-widest">
                {scheduledRegs.length} Teams Scheduled
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Finalized Groups and Match Timings</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium animate-pulse uppercase italic tracking-widest text-sm">Synchronizing Match Data...</div>
      ) : scheduledRegs.length === 0 ? (
        <div className="py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No groups have been scheduled yet.</p>
            <p className="text-[10px] text-slate-300 uppercase mt-2">Go to Registrations → Full Groups to assign dates.</p>
        </div>
      ) : (
        <div className="space-y-8">
            {Object.keys(groupedMatches).map(tourName => (
                <div key={tourName} className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 ml-1">
                        <Trophy className="w-4 h-4 text-google-blue" />
                        {tourName}
                    </h3>
                    
                    {Object.keys(groupedMatches[tourName]).map(date => (
                        <div key={date} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.keys(groupedMatches[tourName][date]).map(gNumStr => {
                                const gNum = parseInt(gNumStr);
                                const teams = groupedMatches[tourName][date][gNum];
                                const matchTime = teams[0]?.matchTime || 'TBA';
                                
                                return (
                                    <div key={gNum} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-google-blue/30 transition-all">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black text-google-blue uppercase tracking-widest mb-0.5">Group {gNum}</p>
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
                                                <div key={team._id} onClick={() => setViewReg(team)} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
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
                                                onClick={() => setViewReg(teams[0])}
                                                className="text-[10px] font-black text-google-blue uppercase tracking-widest hover:underline"
                                            >
                                                Manage Match
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SchedulesTab;
