import React from 'react';
import { X } from 'lucide-react';
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
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
        
        <header className="mb-6">
          <h2 className="text-2xl font-black italic uppercase text-foreground">Edit Tournament</h2>
          <p className="text-xs text-slate-500 font-bold">{editTour.id}</p>
        </header>

        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Title</label>
              <input required value={editTour.title} onChange={e => setEditTour({...editTour, title: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Game</label>
              <select value={editTour.game} onChange={e => setEditTour({...editTour, game: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none">
                <option value="BGMI">BGMI</option>
                <option value="Free Fire">Free Fire</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Status</label>
              <select value={editTour.status} onChange={e => setEditTour({...editTour, status: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none">
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Pool</label>
              <input required value={editTour.prizePool} onChange={e => setEditTour({...editTour, prizePool: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Slots</label>
              <input required value={editTour.slots} onChange={e => setEditTour({...editTour, slots: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date</label>
              <input required value={editTour.date} onChange={e => setEditTour({...editTour, date: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Time</label>
              <input required value={editTour.time} onChange={e => setEditTour({...editTour, time: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Allowed Match Types</label>
            <div className="flex gap-4">
              {['Solo', 'Duo', 'Squad'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
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
                    className="w-4 h-4 accent-neon-purple"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase group-hover:text-neon-purple transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" disabled={updating === editTour.id}
            className="w-full h-12 rounded-xl bg-neon-purple text-white font-black uppercase text-xs hover:bg-neon-purple/90 disabled:opacity-50 transition-all shadow-lg active:scale-95">
            {updating === editTour.id ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TournamentEditorModal;
