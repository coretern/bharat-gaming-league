import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Tournament } from '../../types/admin';

interface TournamentEditorModalProps {
  editTour: Tournament;
  setEditTour: (tour: Tournament) => void;
  updating: string | null;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

const TournamentEditorModal: React.FC<TournamentEditorModalProps> = ({
  editTour,
  setEditTour,
  updating,
  onClose,
  onSave
}) => {
  const [showGameSelect, setShowGameSelect] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl p-8 relative mt-10 mb-10 overflow-visible" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-red-50/50 dark:bg-red-500/5 text-google-red hover:bg-google-red hover:text-white transition-all shadow-sm hover:shadow-red-500/20 z-[110] active:scale-95 group">
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
        
        <header className="mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none uppercase tracking-tight">Edit <span className="text-google-blue">Tournament</span></h2>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-2">Update event parameters</p>
        </header>

        <form onSubmit={onSave} className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tournament Title</label>
              <input required value={editTour.title} onChange={e => setEditTour({...editTour, title: e.target.value})} 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
            </div>
            
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Game</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowGameSelect(!showGameSelect); setShowStatusSelect(false); }}
                  className={`w-full h-11 px-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold transition-all ${showGameSelect ? 'ring-4 ring-google-blue/10 border-google-blue/30' : ''}`}
                >
                  <span className="text-slate-900 dark:text-white">{editTour.game}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showGameSelect ? 'rotate-180' : ''}`} />
                </button>

                {showGameSelect && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {['BGMI', 'Free Fire'].map((game) => (
                      <button
                        key={game}
                        type="button"
                        onClick={() => {
                          setEditTour({...editTour, game});
                          setShowGameSelect(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${editTour.game === game ? 'text-google-blue bg-blue-50/50 dark:bg-blue-500/5' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {game}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Status</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowStatusSelect(!showStatusSelect); setShowGameSelect(false); }}
                  className={`w-full h-11 px-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold transition-all ${showStatusSelect ? 'ring-4 ring-google-blue/10 border-google-blue/30' : ''}`}
                >
                  <span className="text-slate-900 dark:text-white">{editTour.status}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStatusSelect ? 'rotate-180' : ''}`} />
                </button>

                {showStatusSelect && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {['Open', 'Closed', 'Coming Soon'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setEditTour({...editTour, status});
                          setShowStatusSelect(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${editTour.status === status ? 'text-google-blue bg-blue-50/50 dark:bg-blue-500/5' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prize Pool</label>
              <input required value={editTour.prizePool} onChange={e => setEditTour({...editTour, prizePool: e.target.value})} 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Slots (Occupied/Total)</label>
              <input required value={editTour.slots} onChange={e => setEditTour({...editTour, slots: e.target.value})} 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Date</label>
              <input required value={editTour.date} onChange={e => setEditTour({...editTour, date: e.target.value})} 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Time</label>
              <input required value={editTour.time} onChange={e => setEditTour({...editTour, time: e.target.value})} 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-google-blue/10 transition-all" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Allowed Match Types</label>
            <div className="flex gap-6 pl-1">
              {['Solo', 'Duo', 'Squad'].map(type => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(editTour.allowedMatchTypes || ['Solo', 'Duo', 'Squad']).includes(type)}
                    onChange={e => {
                      const current = editTour.allowedMatchTypes || ['Solo', 'Duo', 'Squad'];
                      const updated = e.target.checked 
                        ? [...current, type]
                        : current.filter((t: string) => t !== type);
                      setEditTour({...editTour, allowedMatchTypes: updated});
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-google-blue focus:ring-google-blue transition-colors cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-google-blue transition-colors uppercase tracking-tight">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" disabled={updating === editTour.id}
            className="w-full h-12 mt-4 rounded-xl bg-google-blue text-white font-bold uppercase text-[11px] tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            {updating === editTour.id ? 'Saving Changes...' : 'Synchronize Tournament'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TournamentEditorModal;
