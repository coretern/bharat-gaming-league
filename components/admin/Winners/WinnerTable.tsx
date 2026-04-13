import React from 'react';
import { Trash2 } from 'lucide-react';
import { Winner } from '../../types/admin';

interface WinnerTableProps {
  winners: Winner[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const WinnerTable: React.FC<WinnerTableProps> = ({
  winners,
  loading,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <th className="px-6 py-4">Winner/Team</th>
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4">Prize</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={4} className="py-24 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Loading Winners...</td></tr>
          ) : winners.length === 0 ? (
            <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No winners recorded</td></tr>
          ) : (
            winners.map((win) => (
              <tr key={win._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-sm">
                <td className="px-6 py-4">
                  <p className="font-black italic uppercase text-foreground">{win.playerName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{win.teamName}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold">{win.tournamentName}</p>
                  <p className="text-[9px] text-neon-cyan font-black italic uppercase">{win.date}</p>
                </td>
                <td className="px-6 py-4 font-black italic text-neon-cyan">₹{win.amount}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDelete(win._id)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
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

export default WinnerTable;
