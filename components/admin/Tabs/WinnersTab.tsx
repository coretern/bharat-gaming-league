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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Tournament Winners ({winners.length})</h2>
          <button onClick={() => setShowAddWinner(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95">
              <Plus className="w-4 h-4" /> Add Winner
          </button>
      </div>
      <WinnerTable winners={winners} loading={loadingWinners} onDelete={handleDeleteWinner} />
    </div>
  );
};

export default WinnersTab;
