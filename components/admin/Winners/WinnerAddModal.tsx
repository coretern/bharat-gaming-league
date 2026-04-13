import React from 'react';
import { X } from 'lucide-react';
import { Tournament } from '../../types/admin';

interface WinnerAddModalProps {
  newWinner: any;
  setNewWinner: (winner: any) => void;
  liveTournaments: Tournament[];
  updating: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const WinnerAddModal: React.FC<WinnerAddModalProps> = ({
  newWinner,
  setNewWinner,
  liveTournaments,
  updating,
  onClose,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
        <header className="mb-6">
          <h2 className="text-2xl font-black italic uppercase text-foreground">Add Winner</h2>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tournament</label>
            <select 
              required
              value={newWinner.tournamentId} 
              onChange={e => {
                const tour = liveTournaments.find(t => t._id === e.target.value);
                setNewWinner({...newWinner, tournamentId: e.target.value, tournamentName: tour?.title || ''});
              }}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none"
            >
              <option value="">Select Tournament</option>
              {liveTournaments.map(t => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Player/Leader Name</label>
            <input required value={newWinner.playerName} onChange={e => setNewWinner({...newWinner, playerName: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Team Name (Optional)</label>
            <input value={newWinner.teamName} onChange={e => setNewWinner({...newWinner, teamName: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Amount</label>
            <input required value={newWinner.amount} onChange={e => setNewWinner({...newWinner, amount: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" placeholder="e.g. 500" />
          </div>
          
          <button type="submit" disabled={updating === 'new-winner'}
            className="w-full h-12 rounded-xl bg-neon-cyan text-white font-black uppercase text-xs hover:bg-neon-cyan/90 disabled:opacity-50 transition-all shadow-lg active:scale-95">
            {updating === 'new-winner' ? 'Adding...' : 'Add Winner Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WinnerAddModal;
