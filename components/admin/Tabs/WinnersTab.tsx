import React from 'react';
import { Plus } from 'lucide-react';
import WinnerTable from '../Winners/WinnerTable';
import { Winner } from '../../types/admin';

interface WinnersTabProps {
  winners: Winner[];
  loadingWinners: boolean;
  setShowAddWinner: (show: boolean) => void;
  handleDeleteWinner: (id: string) => void;
}

const WinnersTab: React.FC<WinnersTabProps> = ({
  winners,
  loadingWinners,
  setShowAddWinner,
  handleDeleteWinner
}) => {
  return (
    <div className="space-y-6">
      {/* Management Header */}
      <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Victory Registry
                      <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[10px] font-black uppercase tracking-widest">{winners.length} Hall of Famers</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Celebrate and Manage Champion Records</p>
              </div>

              <button onClick={() => setShowAddWinner(true)} 
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-google-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-600">
                  <Plus className="w-4 h-4" /> Add Champion
              </button>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <WinnerTable winners={winners} loading={loadingWinners} onDelete={handleDeleteWinner} />
      </div>
    </div>
  );
};

export default WinnersTab;
