import React from 'react';
import { X } from 'lucide-react';

interface TournamentCreateModalProps {
  newTour: any;
  setNewTour: (tour: any) => void;
  updating: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TournamentCreateModal: React.FC<TournamentCreateModalProps> = ({
  newTour,
  setNewTour,
  updating,
  onClose,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
        <header className="mb-6">
          <h2 className="text-2xl font-black italic uppercase text-foreground">Launch New <span className="text-neon-purple">Tournament</span></h2>
          <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">Start a new gaming event</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tournament Title</label>
            <input required placeholder="eg. BGMI Winter Cup" value={newTour.title} onChange={e => setNewTour({...newTour, title: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Select Game</label>
              <select value={newTour.game} onChange={e => setNewTour({...newTour, game: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold">
                <option value="BGMI">BGMI</option>
                <option value="Free Fire">Free Fire</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Pool</label>
              <input required placeholder="eg. ₹1,00,000" value={newTour.prizePool} onChange={e => setNewTour({...newTour, prizePool: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date</label>
              <input required placeholder="eg. 25 Oct 2026" value={newTour.date} onChange={e => setNewTour({...newTour, date: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Time</label>
              <input required placeholder="eg. 09:00 PM" value={newTour.time} onChange={e => setNewTour({...newTour, time: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Total Slots</label>
              <input required placeholder="eg. 0/100" value={newTour.slots} onChange={e => setNewTour({...newTour, slots: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Status</label>
              <select value={newTour.status} onChange={e => setNewTour({...newTour, status: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm">
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Thumbnail URL</label>
            <input required placeholder="/bgmi-thumb.png" value={newTour.image} onChange={e => setNewTour({...newTour, image: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm" />
            <p className="text-[8px] text-slate-400 mt-1 italic uppercase font-bold">Default thumbnails: /bgmi-thumb.png or /ff-thumb.png</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Allowed Match Types</label>
            <div className="flex gap-4">
              {['Solo', 'Duo', 'Squad'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={newTour.allowedMatchTypes.includes(type)}
                    onChange={e => {
                      const current = newTour.allowedMatchTypes;
                      const updated = e.target.checked 
                        ? [...current, type]
                        : current.filter((t: string) => t !== type);
                      setNewTour({...newTour, allowedMatchTypes: updated});
                    }}
                    className="w-4 h-4 accent-neon-purple"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase group-hover:text-neon-purple transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={updating === 'new-tour'}
            className="w-full h-14 mt-6 rounded-2xl bg-neon-purple text-white font-black uppercase text-sm tracking-widest hover:bg-neon-purple/90 disabled:opacity-50 transition-all shadow-lg active:scale-95 shadow-neon-purple/20">
            {updating === 'new-tour' ? 'Creating...' : 'Launch Tournament'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TournamentCreateModal;
