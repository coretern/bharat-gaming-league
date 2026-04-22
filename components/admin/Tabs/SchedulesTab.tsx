import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Reg } from '../../types/admin';
import ScheduleGroupCard from '../Schedules/ScheduleGroupCard';
import CompletedGroupCard from '../Schedules/CompletedGroupCard';

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
  const [showTrash, setShowTrash] = useState(false);
  const scheduledRegs = registrations.filter(r => !!r.matchDate);

  // Separate: active (no winner) vs completed (winner set)
  const groupedActive: Record<string, Record<string, Record<number, Reg[]>>> = {};
  const groupedCompleted: Record<string, Record<string, Record<number, Reg[]>>> = {};

  scheduledRegs.forEach(reg => {
    if (!reg.matchDate) return;
    const tourName = reg.tournamentName;
    const date = reg.matchDate;
    const gNum = reg.groupNumber || 0;

    // A group is "completed" if any team in it has Won
    // We'll categorize per-group later after collecting all
    const target = groupedActive;
    if (!target[tourName]) target[tourName] = {};
    if (!target[tourName][date]) target[tourName][date] = {};
    if (!target[tourName][date][gNum]) target[tourName][date][gNum] = [];
    target[tourName][date][gNum].push(reg);
  });

  // Now separate completed groups (where any team has resultStatus === 'Won')
  Object.keys(groupedActive).forEach(tourName => {
    Object.keys(groupedActive[tourName]).forEach(date => {
      Object.keys(groupedActive[tourName][date]).forEach(gNumStr => {
        const gNum = parseInt(gNumStr);
        const teams = groupedActive[tourName][date][gNum];
        const hasWinner = teams.some(t => t.resultStatus === 'Won');
        if (hasWinner) {
          if (!groupedCompleted[tourName]) groupedCompleted[tourName] = {};
          if (!groupedCompleted[tourName][date]) groupedCompleted[tourName][date] = {};
          groupedCompleted[tourName][date][gNum] = teams;
          delete groupedActive[tourName][date][gNum];
          // Clean up empty parents
          if (Object.keys(groupedActive[tourName][date]).length === 0) {
            delete groupedActive[tourName][date];
          }
          if (Object.keys(groupedActive[tourName]).length === 0) {
            delete groupedActive[tourName];
          }
        }
      });
    });
  });

  const activeCount = Object.values(groupedActive).flatMap(d =>
    Object.values(d).flatMap(g => Object.values(g))
  ).reduce((sum, teams) => sum + teams.length, 0);

  const completedGroupCount = Object.values(groupedCompleted).flatMap(d =>
    Object.values(d).flatMap(g => Object.keys(g))
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Match Schedule
              <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[10px] font-black uppercase tracking-widest">
                {activeCount} Teams Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Finalized Groups and Match Timings</p>
          </div>
        </div>
      </div>

      {/* Active Matches */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium animate-pulse uppercase italic tracking-widest text-sm">Synchronizing Match Data...</div>
      ) : activeCount === 0 && completedGroupCount === 0 ? (
        <div className="py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
          <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No groups have been scheduled yet.</p>
          <p className="text-[10px] text-slate-300 uppercase mt-2">Go to Registrations → Full Groups to assign dates.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedActive).map(tourName => (
            <div key={tourName} className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 ml-1">
                <Trophy className="w-4 h-4 text-google-blue" />
                {tourName}
              </h3>
              {Object.keys(groupedActive[tourName]).map(date => (
                <div key={date} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(groupedActive[tourName][date]).map(gNumStr => {
                    const gNum = parseInt(gNumStr);
                    const teams = groupedActive[tourName][date][gNum];
                    return (
                      <ScheduleGroupCard
                        key={gNum}
                        groupNumber={gNum}
                        date={date}
                        teams={teams}
                        onViewReg={setViewReg}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Completed / Trash Section */}
      {completedGroupCount > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-400 dark:group-hover:bg-red-950 transition-colors">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black uppercase text-slate-500 tracking-tight">
                  Completed Matches
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {completedGroupCount} group{completedGroupCount > 1 ? 's' : ''} with winner declared
                </p>
              </div>
            </div>
            {showTrash ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showTrash && (
            <div className="space-y-8 opacity-60">
              {Object.keys(groupedCompleted).map(tourName => (
                <div key={tourName} className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 ml-1">
                    <Trophy className="w-4 h-4 text-slate-400" />
                    {tourName}
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">COMPLETED</span>
                  </h3>
                  {Object.keys(groupedCompleted[tourName]).map(date => (
                    <div key={date} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.keys(groupedCompleted[tourName][date]).map(gNumStr => {
                        const gNum = parseInt(gNumStr);
                        const teams = groupedCompleted[tourName][date][gNum];
                        return (
                          <CompletedGroupCard
                            key={gNum}
                            groupNumber={gNum}
                            date={date}
                            teams={teams}
                            onViewReg={setViewReg}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulesTab;
