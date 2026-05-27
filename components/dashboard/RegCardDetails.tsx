'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy, ShieldCheck, ShieldAlert, Gamepad, Copy, Share2, FileDown, Eye, CreditCard, Loader
} from 'lucide-react';
import { to12Hour } from '@/lib/time-utils';
import toast from 'react-hot-toast';
import { type RegCardData } from './RegCard';

interface RegCardDetailsProps {
  reg: RegCardData;
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied!', { duration: 1500 });
}

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</p>
      <div className="text-xs">{children}</div>
    </div>
  );
}

export default function RegCardDetails({ reg }: RegCardDetailsProps) {
  const isWon = reg.resultStatus === 'Won';
  const isLost = reg.resultStatus === 'Lost';
  const isCompleted = isWon || isLost;
  const [repaying, setRepaying] = useState(false);

  return (
    <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-3">
      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-slate-800" />

      {/* Rejection reason */}
      {reg.status === 'Rejected' && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
          <p className="text-[10px] font-black uppercase text-google-red mb-1">Rejection Reason</p>
          <p className="text-xs font-medium text-red-600 dark:text-red-400 italic">"{reg.rejectionReason || 'No reason specified'}"</p>
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
        <InfoCell label="Payment">
          {reg.paymentVerified
            ? <span className="flex items-center gap-1 font-bold text-google-green"><ShieldCheck className="w-3.5 h-3.5" />Verified</span>
            : <span className="flex items-center gap-1 font-bold text-amber-500"><ShieldAlert className="w-3.5 h-3.5" />Pending</span>
          }
        </InfoCell>
        <InfoCell label="Schedule">
          {reg.matchDate ? (
            <span className="font-bold text-google-blue">
              {reg.matchDate}, {to12Hour(reg.matchTime)}
            </span>
          ) : (
            <span className="font-medium text-slate-400 italic">Awaiting</span>
          )}
        </InfoCell>
        <InfoCell label="Result">
          {isWon ? <span className="font-black text-google-green flex items-center gap-1"><Trophy className="w-3 h-3" />Won ₹{reg.prizeAmount}</span>
            : isLost ? <span className="font-bold text-slate-500">Eliminated</span>
            : <span className="font-medium text-slate-400 italic">Pending</span>}
        </InfoCell>
        <InfoCell label="Registered">
          <span className="font-medium text-slate-500">{new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </InfoCell>
      </div>

      {/* Room Details */}
      {reg.roomId && (
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/15">
          <p className="text-[9px] font-black uppercase tracking-widest text-purple-500 mb-2 flex items-center gap-1.5">
            <Gamepad className="w-3.5 h-3.5" /> Match Room
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase">Room ID</span>
              <code className="text-sm font-black text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md">{reg.roomId}</code>
              <button onClick={() => copyText(reg.roomId || '')} className="p-1 rounded-md text-purple-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-colors"><Copy className="w-3 h-3" /></button>
            </div>
            {reg.roomPassword && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase">Password</span>
                <code className="text-sm font-black text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-500/10 px-2 py-0.5 rounded-md">{reg.roomPassword}</code>
                <button onClick={() => copyText(reg.roomPassword || '')} className="p-1 rounded-md text-purple-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-colors"><Copy className="w-3 h-3" /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Winner banner */}
      {isWon && (
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-google-green to-emerald-600 text-white shadow-lg shadow-green-500/15">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest">Victory — ₹{reg.prizeAmount} Won!</span>
            </div>
            {reg.winnerScreenshot && (
              <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold uppercase opacity-80 hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" /> View Proof
              </a>
            )}
          </div>
        </div>
      )}

      {/* Lost banner */}
      {isLost && (
        <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eliminated</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">Winner: <span className="text-google-blue">{reg.winnerTeamName || 'Unknown'}</span></span>
            </div>
            {reg.winnerScreenshot && (
              <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
                className="text-[10px] font-bold text-google-blue flex items-center gap-1 hover:underline">
                <Eye className="w-3.5 h-3.5" /> Proof
              </a>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {isWon && (
          <button onClick={() => {
            const text = `🏆 I won ₹${reg.prizeAmount} in ${reg.tournamentName}!\n\nTeam: ${reg.teamName}\n\nPlay on Bharat Gaming League!\n${window.location.origin}`;
            if (navigator.share) { navigator.share({ title: 'My Win on BGL!', text }).catch(() => {}); }
            else { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }
          }} className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-green-500/15">
            <Share2 className="w-3.5 h-3.5" /> Share Your Win
          </button>
        )}
        {reg.paymentVerified && (
          <button onClick={() => window.open(`/api/receipt?id=${reg._id}`, '_blank')}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
            <FileDown className="w-3.5 h-3.5" /> Download Receipt
          </button>
        )}
        {!reg.paymentVerified && reg.entryFee > 0 && (
          <button
            onClick={async () => {
              if (repaying) return;
              setRepaying(true);
              const toastId = toast.loading('Initializing payment session...');
              try {
                const res = await fetch(`/api/payment/repay?id=${reg._id}`, { method: 'POST' });
                const resData = await res.json();
                if (!res.ok) throw new Error(resData.error || 'Failed to initialize repayment');
                
                toast.success('Redirecting to secure gateway...', { id: toastId });
                const cashfree = (window as any).Cashfree({ mode: "sandbox" });
                cashfree.checkout({ paymentSessionId: resData.paymentSessionId, redirectTarget: "_self" });
              } catch (err: any) {
                toast.error(err.message || 'Payment failed to initiate', { id: toastId });
                setRepaying(false);
              }
            }}
            disabled={repaying}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-orange-500/10"
          >
            {repaying ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
            Pay Entry Fee (₹{reg.entryFee})
          </button>
        )}
        {reg.status === 'Rejected' && (
          <Link href={`/register?tournament=${reg._id}&edit=true`}
            className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all">
            Edit & Resubmit
          </Link>
        )}
      </div>
    </div>
  );
}
