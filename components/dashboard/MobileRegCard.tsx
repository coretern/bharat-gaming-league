import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldAlert, Eye, ChevronDown, ChevronUp, Gamepad, Key, Copy, Share2, FileDown } from 'lucide-react';
import { to12Hour } from '@/lib/time-utils';

interface MyReg {
  _id: string;
  tournamentName: string;
  matchType: string;
  teamName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  paymentVerified: boolean;
  groupNumber?: number;
  slotNumber?: number;
  resultStatus?: 'Playing' | 'Won' | 'Lost';
  prizeAmount?: number;
  winnerTeamName?: string;
  winnerScreenshot?: string;
  matchDate?: string;
  matchTime?: string;
  roomId?: string;
  roomPassword?: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Approved') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-50 text-google-green border border-green-100">
      <CheckCircle2 className="w-3 h-3" /> Approved
    </span>
  );
  if (status === 'Rejected') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-google-red border border-red-100">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-50 text-google-yellow border border-yellow-100">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function MobileRegCard({ reg }: { reg: MyReg }) {
  const isCompleted = reg.resultStatus === 'Won' || reg.resultStatus === 'Lost';
  const [expanded, setExpanded] = useState(false);

  // Completed matches: compact card
  if (isCompleted && !expanded) {
    return (
      <div
        className={`mx-4 my-2 rounded-xl border-l-4 overflow-hidden ${
          reg.resultStatus === 'Won'
            ? 'border-google-green bg-green-50/50'
            : 'border-slate-400 bg-slate-50/50'
        }`}
      >
        <button onClick={() => setExpanded(true)} className="w-full text-left p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              reg.resultStatus === 'Won'
                ? 'bg-google-green text-white shadow-sm shadow-green-500/20'
                : 'bg-slate-200 text-slate-500'
            }`}>
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase text-foreground truncate leading-tight">{reg.tournamentName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400">{reg.teamName}</span>
                <span className="text-[9px] font-bold text-slate-300">•</span>
                <span className="text-[9px] font-bold text-slate-400">G{reg.groupNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {reg.resultStatus === 'Won' ? (
              <span className="px-2 py-0.5 rounded-md bg-google-green text-white text-[9px] font-black uppercase">
                Won ₹{reg.prizeAmount}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[9px] font-black uppercase">
                Lost
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </button>
      </div>
    );
  }

  // Full card (active matches + expanded completed)
  const statusColor =
    reg.resultStatus === 'Won' ? 'border-google-green bg-green-500/5' :
    reg.resultStatus === 'Lost' ? 'border-slate-400 bg-slate-50/50' :
    reg.status === 'Approved' ? 'border-green-500 bg-green-500/5' :
    reg.status === 'Rejected' ? 'border-red-500 bg-red-500/5' :
    'border-amber-400 bg-amber-400/5';

  return (
    <div className={`mx-4 my-3 rounded-xl border-l-4 p-4 ${statusColor}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-black italic uppercase text-sm text-foreground leading-tight">{reg.tournamentName}</p>
            <span className="text-[9px] font-black uppercase text-neon-purple mt-0.5 inline-block">{reg.matchType}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={reg.status} />
          {isCompleted && (
            <button onClick={() => setExpanded(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400">
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {reg.status === 'Rejected' && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <p className="text-[10px] font-black uppercase text-red-500 mb-1">Reason:</p>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 italic">"{reg.rejectionReason || 'No reason specified'}"</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Team</p>
          <p className="font-bold text-foreground truncate">{reg.teamName}</p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Payment</p>
          {reg.paymentVerified
            ? <span className="flex items-center gap-0.5 font-bold text-green-500"><ShieldCheck className="w-3 h-3" />Done</span>
            : <span className="flex items-center gap-0.5 font-bold text-amber-500"><ShieldAlert className="w-3 h-3" />Pending</span>
          }
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Assignment</p>
          <p className="font-bold text-google-blue">G{reg.groupNumber} : S{reg.slotNumber}</p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Result</p>
          {reg.resultStatus === 'Won' ? (
            <span className="flex items-center gap-1 font-black text-google-green"><Trophy className="w-3 h-3" />Won</span>
          ) : reg.resultStatus === 'Lost' ? (
            <span className="font-bold text-slate-500">Lost</span>
          ) : (
            <span className="font-bold text-slate-400 italic">Pending</span>
          )}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Final Match Info</p>
          {reg.matchDate ? (
            <p className="font-bold text-google-blue">{reg.matchDate} @ {to12Hour(reg.matchTime)}</p>
          ) : (
            <p className="font-bold text-slate-400 italic">Awaiting Schedule</p>
          )}
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Registered</p>
          <p className="font-bold text-foreground/60">{new Date(reg.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Room Details */}
      {reg.roomId && (
        <div className="mb-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20">
          <p className="text-[9px] font-black uppercase tracking-widest text-purple-500 mb-2 flex items-center gap-1">
            <Gamepad className="w-3 h-3" /> Match Room Details
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] font-bold text-purple-400 uppercase mb-0.5">Room ID</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-purple-700 dark:text-purple-300 font-mono">{reg.roomId}</span>
                <button onClick={() => { navigator.clipboard.writeText(reg.roomId || ''); }} className="p-0.5 text-purple-400 hover:text-purple-600"><Copy className="w-3 h-3" /></button>
              </div>
            </div>
            {reg.roomPassword && (
              <div>
                <p className="text-[9px] font-bold text-purple-400 uppercase mb-0.5">Password</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-purple-700 dark:text-purple-300 font-mono">{reg.roomPassword}</span>
                  <button onClick={() => { navigator.clipboard.writeText(reg.roomPassword || ''); }} className="p-0.5 text-purple-400 hover:text-purple-600"><Copy className="w-3 h-3" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Download */}
      {reg.paymentVerified && (
        <button onClick={() => window.open(`/api/receipt?id=${reg._id}`, '_blank')}
          className="w-full mb-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
          <FileDown className="w-3.5 h-3.5" /> Download Receipt
        </button>
      )}

      {/* Outcome View */}
      {reg.resultStatus === 'Won' && (
        <>
          <div className="rounded-xl overflow-hidden mb-2">
            <div className="p-3 bg-google-green text-white shadow-lg shadow-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">VICTORY DETECTED</span>
              </div>
              <span className="text-sm font-black italic">₹{reg.prizeAmount} Won!</span>
            </div>
            {reg.winnerScreenshot && (
              <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-google-green border-t border-green-100 hover:bg-green-100 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">View Winner Proof</span>
              </a>
            )}
          </div>
          <button onClick={() => {
            const text = `🏆 I won ₹${reg.prizeAmount} in ${reg.tournamentName}!\n\nTeam: ${reg.teamName}\n\nPlay on Bharat Gaming League!\n${window.location.origin}`;
            if (navigator.share) {
              navigator.share({ title: 'My Win on BGL!', text }).catch(() => {});
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }
          }} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-green-500/20 mb-2">
            <Share2 className="w-3.5 h-3.5" /> Share Your Win
          </button>
        </>
      )}

      {reg.resultStatus === 'Lost' && (
        <div className="rounded-xl overflow-hidden mb-2 border border-slate-200 dark:border-slate-700">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Match Outcome — Eliminated</span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Winner: <span className="text-google-blue">{reg.winnerTeamName || 'Unknown'}</span></p>
            </div>
          </div>
          {reg.winnerScreenshot && (
            <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-google-blue border-t border-slate-200 dark:border-slate-700 hover:bg-blue-50 transition-colors">
              <Eye className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">View Winner Proof</span>
            </a>
          )}
        </div>
      )}

      {reg.status === 'Rejected' && (
        <Link href={`/register?tournament=${reg._id}&edit=true`}
          className="block w-full text-center py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest transition-all">
          Edit & Resubmit
        </Link>
      )}
    </div>
  );
}
