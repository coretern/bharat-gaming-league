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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400 leading-none mb-1">Hall of Fame</h2>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{winners.length} Tournament Winners</p>
          </div>
          <button onClick={() => setShowAddWinner(true)} className="flex items-center gap-2 px-5 py-2.5 bg-google-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
              <Plus className="w-4 h-4" /> Add Winner
          </button>
      </div>
      <WinnerTable winners={winners} loading={loadingWinners} onDelete={handleDeleteWinner} />
    </div>
  );
};

export default WinnersTab;
