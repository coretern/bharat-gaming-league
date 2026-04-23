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

const WinnersTab: React.FC<WinnersTabProps> = ({ winners, loadingWinners, setShowAddWinner, handleDeleteWinner }) => {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Winners
            <span className="px-2 py-0.5 rounded-full bg-google-blue/10 text-google-blue text-[9px] font-black uppercase">{winners.length}</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Champion records & prize history</p>
        </div>
        <button onClick={() => setShowAddWinner(true)}
          className="h-8 px-4 bg-google-blue text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" /> Add Winner
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <WinnerTable winners={winners} loading={loadingWinners} onDelete={handleDeleteWinner} />
      </div>
    </div>
  );
};

export default WinnersTab;
