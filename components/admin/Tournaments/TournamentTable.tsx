import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Tournament } from '../../types/admin';

interface TournamentTableProps {
  tournaments: Tournament[];
  loading: boolean;
  tourSearch: string;
  tourGameFilter: string;
  tourStatusFilter: string;
  onEdit: (tournament: Tournament) => void;
  onDelete: (id: string) => void;
}

const TournamentTable: React.FC<TournamentTableProps> = ({
  tournaments,
  loading,
  tourSearch,
  tourGameFilter,
  tourStatusFilter,
  onEdit,
  onDelete
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState<{ id: string; stage: number } | null>(null);

  const filteredTours = tournaments
    .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
    .filter(t => tourGameFilter === 'All' || t.game === tourGameFilter)
    .filter(t => tourStatusFilter === 'All' || t.status === tourStatusFilter);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete || confirmDelete.id !== id) {
      setConfirmDelete({ id, stage: 1 });
      return;
    }

    if (confirmDelete.stage === 1) {
      onDelete(id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Desktop View */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4">Game</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Prize Pool</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={5} className="py-24 text-center text-slate-400 text-[10px] font-bold uppercase">Refreshing Ecosystem...</td></tr>
          ) : filteredTours.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No active tournaments found</td></tr>
          ) : (
            filteredTours.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{t.date}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t.game}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                    t.status === 'Open' ? 'bg-green-50 text-google-green border-green-100 dark:bg-green-500/10' :
                    t.status === 'Closed' ? 'bg-red-50 text-google-red border-red-100 dark:bg-red-500/10' :
                    'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/50'
                  }`}>{t.status}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-google-blue tracking-widest">{t.prizePool}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={(e) => handleDeleteClick(t.id, e)} 
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${confirmDelete?.id === t.id ? 'bg-red-600 text-white animate-pulse' : 'bg-red-50 text-google-red border border-red-100'}`}
                    >
                        {confirmDelete?.id === t.id ? 'Click to Confirm' : 'Delete'}
                    </button>
                    <button onClick={() => onEdit(t)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-google-blue transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
           <div className="py-12 text-center text-slate-400 text-[10px] font-bold uppercase">Loading...</div>
        ) : filteredTours.length === 0 ? (
           <div className="py-12 text-center text-slate-400 text-[10px] font-bold uppercase">No tournaments found</div>
        ) : (
          filteredTours.map((t) => (
            <div key={t.id} className="p-5 space-y-4">
               <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.game}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-none">{t.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                    t.status === 'Open' ? 'bg-green-50 text-google-green border-green-100' :
                    t.status === 'Closed' ? 'bg-red-50 text-google-red border-red-100' :
                    'bg-slate-50 text-slate-500 border-slate-100'
                  }`}>{t.status}</span>
               </div>
               
               <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prize/Date</span>
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-bold text-google-blue">{t.prizePool}</span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full" />
                       <span className="text-[10px] font-bold text-slate-500">{t.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => handleDeleteClick(t.id, e)} 
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${confirmDelete?.id === t.id ? 'bg-red-600 text-white' : 'text-google-red bg-red-50 border border-red-100'}`}
                    >
                        {confirmDelete?.id === t.id ? 'Confirm?' : 'Delete'}
                    </button>
                    <button onClick={() => onEdit(t)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-google-blue flex items-center justify-center">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TournamentTable;
