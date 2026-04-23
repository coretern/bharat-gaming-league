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
      {/* Desktop Table */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4">Champion / Team</th>
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4">Prize</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={4} className="py-24 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">Synchronizing Champions...</td></tr>
          ) : winners.length === 0 ? (
            <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No winners recorded yet</td></tr>
          ) : (
            winners.map((win) => (
              <tr key={win._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{win.playerName}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{win.teamName}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">{win.tournamentName}</p>
                  <p className="text-[10px] text-google-blue font-bold uppercase tracking-widest leading-none mt-1">{win.date}</p>
                </td>
                <td className="px-6 py-4 font-bold text-google-green">₹{win.amount}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onDelete(win._id)} className="p-2 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        ) : winners.length === 0 ? (
           <div className="py-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No winners recorded</div>
        ) : (
          winners.map((win) => (
            <div key={win._id} className="p-5 space-y-4">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Champion</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{win.playerName}</p>
                    <p className="text-[10px] text-google-blue font-bold uppercase tracking-widest">{win.teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Prize</p>
                    <p className="text-base font-bold text-google-green">₹{win.amount}</p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Tournament</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{win.tournamentName}</p>
                    <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">{win.date}</p>
                  </div>
                  <button onClick={() => onDelete(win._id)} className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-50 dark:border-red-500/20 text-google-red flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WinnerTable;
