import React from 'react';
import { X, ChevronDown } from 'lucide-react';
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
  const [showTourSelect, setShowTourSelect] = React.useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-8 relative overflow-visible" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-red-50/50 dark:bg-red-500/5 text-google-red hover:bg-google-red hover:text-white transition-all shadow-sm hover:shadow-red-500/20 z-[110] active:scale-95 group">
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        <header className="mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none uppercase tracking-tight">Add <span className="text-google-blue">Winner</span></h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-2">Award a platform champion</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tournament</label>
            
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTourSelect(!showTourSelect)}
                className={`w-full h-11 px-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold transition-all ${showTourSelect ? 'ring-4 ring-google-blue/10 border-google-blue/30' : ''}`}
              >
                <span className={newWinner.tournamentName ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                  {newWinner.tournamentName || 'Select Tournament'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTourSelect ? 'rotate-180' : ''}`} />
              </button>

              {showTourSelect && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-48 overflow-y-auto">
                    {liveTournaments.length === 0 ? (
                      <div className="p-4 text-[10px] text-slate-400 text-center font-bold uppercase">No Active Tournaments</div>
                    ) : (
                      liveTournaments.map((t) => (
                        <button
                          key={t._id}
                          type="button"
                          onClick={() => {
                            setNewWinner({...newWinner, tournamentId: t._id, tournamentName: t.title});
                            setShowTourSelect(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${newWinner.tournamentId === t._id ? 'text-google-blue bg-blue-50/50 dark:bg-blue-500/5' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          {t.title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Player/Leader Name</label>
            <input required placeholder="eg. PlayerOne" value={newWinner.playerName} onChange={e => setNewWinner({...newWinner, playerName: e.target.value})} 
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Team Name (Optional)</label>
            <input placeholder="eg. Team Alpha" value={newWinner.teamName} onChange={e => setNewWinner({...newWinner, teamName: e.target.value})} 
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prize Amount</label>
            <input required placeholder="e.g. 500" value={newWinner.amount} onChange={e => setNewWinner({...newWinner, amount: e.target.value})} 
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
          </div>
          
          <button type="submit" disabled={updating === 'new-winner'}
            className="w-full h-12 mt-4 rounded-xl bg-google-blue text-white font-bold uppercase text-[11px] tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            {updating === 'new-winner' ? 'Registering...' : 'Confirm Winner Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WinnerAddModal;
