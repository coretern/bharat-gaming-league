import React, { useState } from 'react';
import { X, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface GroupScheduleModalProps {
  groupNumber: number;
  tournamentName: string;
  tournamentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const GroupScheduleModal: React.FC<GroupScheduleModalProps> = ({
  groupNumber,
  tournamentName,
  tournamentId,
  onClose,
  onSuccess
}) => {
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleBulkUpdate = async () => {
    if (!matchDate) {
      toast.error('Please enter a match date');
      return;
    }
    setLoading(true);
    try {
      const formattedDate = formatDate(matchDate);
      const res = await fetch('/api/admin/bulk-schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          tournamentName,
          groupNumber,
          matchDate: formattedDate,
          matchTime
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update schedule');
      
      const count = data.matchedCount || 0;
      if (count === 0) {
        toast.error(`No teams found for Group ${groupNumber} in this tournament. Check if group numbers are assigned.`);
        return;
      }
      toast.success(`Schedule assigned to ${count} teams in Group ${groupNumber}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <header className="mb-8 flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                Group <span className="text-google-blue">{groupNumber}</span> Scheduling
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tournament: {tournamentName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Select Match Date
            </label>
            <input 
              type="date" 
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-google-blue/10 transition-all cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Select Match Time
            </label>
            <input 
              type="time" 
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className="w-full h-12 px-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-google-blue/10 transition-all cursor-pointer"
            />
          </div>

          <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed text-center italic bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-dotted border-slate-200 dark:border-slate-800">
            This will update the schedule for ALL teams in this group. Users will see this on their dashboard.
          </p>

          <button 
            disabled={loading}
            onClick={handleBulkUpdate}
            className="w-full h-12 rounded-2xl bg-google-blue text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Processing...' : 'Assign Group Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupScheduleModal;
