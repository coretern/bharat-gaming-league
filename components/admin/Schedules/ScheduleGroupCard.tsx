import React, { useState } from 'react';
import { Clock, Gamepad, Key, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Reg } from '../../types/admin';
import toast from 'react-hot-toast';
import { to12Hour } from '@/lib/time-utils';

interface ScheduleGroupCardProps {
  groupNumber: number;
  date: string;
  teams: Reg[];
  onViewReg: (reg: Reg) => void;
}

const ScheduleGroupCard: React.FC<ScheduleGroupCardProps> = ({
  groupNumber, date, teams, onViewReg
}) => {
  const matchTime = to12Hour(teams[0]?.matchTime);
  const existingRoom = teams[0]?.roomId;
  const [showRoom, setShowRoom] = useState(false);
  const [roomId, setRoomId] = useState(existingRoom || '');
  const [roomPw, setRoomPw] = useState(teams[0]?.roomPassword || '');
  const [sending, setSending] = useState(false);

  const handleSendRoom = async () => {
    if (!roomId.trim()) { toast.error('Enter a Room ID'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/admin/room-details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: teams[0]?.tournamentId,
          tournamentName: teams[0]?.tournamentName,
          groupNumber, roomId: roomId.trim(), roomPassword: roomPw.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Room shared with ${data.updatedCount} teams!`);
      setShowRoom(false);
    } catch (err: any) { toast.error(err.message); } finally { setSending(false); }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-google-blue/30 transition-all">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-google-blue uppercase tracking-widest mb-0.5">Group {groupNumber}</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          {existingRoom && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-[8px] font-black text-google-green uppercase">
              <CheckCircle2 className="w-2.5 h-2.5" /> Room Sent
            </span>
          )}
          <div className="flex items-center gap-1.5 text-google-blue">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm font-black italic">{matchTime}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        {teams.map(team => (
          <div key={team._id} onClick={() => onViewReg(team)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{team.teamName}</span>
              <span className="text-[9px] text-slate-400 font-medium">Slot {team.slotNumber}</span>
            </div>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
              team.resultStatus === 'Won' ? 'bg-google-green text-white' :
              team.resultStatus === 'Lost' ? 'bg-slate-200 text-slate-500' :
              'bg-google-blue/10 text-google-blue'
            }`}>{team.resultStatus || 'Playing'}</span>
          </div>
        ))}
      </div>

      {/* Room Details Inline */}
      {showRoom && (
        <div className="px-4 pb-4 space-y-2">
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Gamepad className="w-3.5 h-3.5 text-purple-500" />
              <input value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Room ID"
                className="flex-1 h-8 px-3 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/20 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-300/30" />
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-purple-500" />
              <input value={roomPw} onChange={e => setRoomPw(e.target.value)} placeholder="Password (optional)"
                className="flex-1 h-8 px-3 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/20 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-300/30" />
            </div>
            <button onClick={handleSendRoom} disabled={sending}
              className="w-full h-8 rounded-lg bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
              {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              {sending ? 'Sending...' : 'Send to All Teams'}
            </button>
          </div>
        </div>
      )}
      
      <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[9px] font-bold text-slate-400 uppercase">{teams.length} Teams</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowRoom(!showRoom)}
            className="text-[10px] font-black text-purple-500 uppercase tracking-widest hover:underline flex items-center gap-1">
            <Gamepad className="w-3 h-3" /> {showRoom ? 'Close' : 'Room'}
          </button>
          <button onClick={() => onViewReg(teams[0])}
            className="text-[10px] font-black text-google-blue uppercase tracking-widest hover:underline">
            Manage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGroupCard;
