import React from 'react';
import { Edit2 } from 'lucide-react';
import { Tournament } from '../../types/admin';

interface TournamentTableProps {
  tournaments: Tournament[];
  loading: boolean;
  tourSearch: string;
  tourGameFilter: string;
  tourStatusFilter: string;
  onEdit: (tournament: Tournament) => void;
}

const TournamentTable: React.FC<TournamentTableProps> = ({
  tournaments,
  loading,
  tourSearch,
  tourGameFilter,
  tourStatusFilter,
  onEdit
}) => {
  const filteredTours = tournaments
    .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
    .filter(t => tourGameFilter === 'All' || t.game === tourGameFilter)
    .filter(t => tourStatusFilter === 'All' || t.status === tourStatusFilter);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <th className="px-5 py-3">Tournament</th>
            <th className="px-5 py-3">Game</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Prize</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 border-x border-slate-100 dark:border-slate-800">
          {loading ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold">Loading tournaments...</td></tr>
          ) : filteredTours.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No tournaments found</td></tr>
          ) : (
            filteredTours.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-5 text-sm">
                  <p className="font-black text-foreground italic uppercase">{t.title}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                    t.status === 'Open' ? 'bg-green-100 text-green-600' :
                    t.status === 'Closed' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>{t.status}</span>
                </td>
                <td className="px-5 py-5 text-xs text-slate-500 font-bold">
                  <span className="text-foreground">{t.game}</span>
                </td>
                <td className="px-5 py-5 text-xs text-slate-500 font-semibold">{t.date}</td>
                <td className="px-5 py-5 text-xs font-bold text-neon-cyan">{t.prizePool}</td>
                <td className="px-5 py-5 text-right">
                  <button onClick={() => onEdit(t)} className="p-1.5 rounded-lg bg-foreground/5 text-slate-500 hover:text-neon-cyan border border-foreground/5 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentTable;
