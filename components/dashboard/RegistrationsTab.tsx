import React from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';
import MobileRegCard from './MobileRegCard';

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
  createdAt: string;
}

interface RegistrationsTabProps {
  myRegs: MyReg[];
  loadingRegs: boolean;
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

export default function RegistrationsTab({ myRegs, loadingRegs }: RegistrationsTabProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900 dark:text-white text-base">
          My Registrations
          <span className="ml-2 text-slate-400 font-medium text-sm">({myRegs.length})</span>
        </h2>
        <Link href="/tournaments" className="text-sm font-medium text-google-blue hover:underline whitespace-nowrap shrink-0">
          + Register More
        </Link>
      </div>

      {loadingRegs ? (
        <div className="py-16 text-center text-foreground/40 font-bold text-sm">Loading your registrations...</div>
      ) : myRegs.length === 0 ? (
        <div className="py-16 text-center">
          <Trophy className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
          <p className="font-bold text-foreground/40 text-sm">No registrations yet.</p>
          <Link href="/tournaments" className="inline-block mt-4 btn-neon-purple text-xs">Browse Tournaments</Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-foreground/5 py-1">
            {myRegs.map(reg => (
              <MobileRegCard key={reg._id} reg={reg} />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-medium">
                  <th className="px-6 py-4">Tournament</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Final Schedule</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {myRegs.map(reg => (
                  <tr key={reg._id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 dark:text-white">{reg.tournamentName}</span>
                        <span className="text-[10px] text-google-blue font-bold uppercase">{reg.matchType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[140px] space-y-2">
                          <StatusBadge status={reg.status} />
                          {reg.status === 'Rejected' && (
                              <Link href={`/register?tournament=${reg._id}&edit=true`} 
                                  className="inline-block px-3 py-1 rounded-md bg-google-red/10 text-[10px] font-bold text-google-red hover:bg-google-red hover:text-white transition-all">
                                  Resubmit
                              </Link>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{reg.teamName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                         <span className="text-xs font-bold text-google-blue">Group {reg.groupNumber}</span>
                         <span className="text-[10px] text-slate-400 font-medium">Slot {reg.slotNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {reg.paymentVerified
                        ? <span className="flex items-center gap-1 text-[10px] font-bold text-google-green"><ShieldCheck className="w-4 h-4" />Verified</span>
                        : <span className="flex items-center gap-1 text-[10px] font-bold text-google-yellow"><ShieldAlert className="w-4 h-4" />Pending</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                        {reg.resultStatus === 'Won' ? (
                            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-google-green to-emerald-600 text-white shadow-lg shadow-green-500/20">
                              <div className="p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">You Won!</span>
                                <span className="text-base font-black italic tabular-nums leading-none">₹{reg.prizeAmount}</span>
                              </div>
                              {reg.winnerScreenshot && (
                                <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 py-2 bg-white/10 hover:bg-white/20 transition-colors border-t border-white/20">
                                  <Eye className="w-3 h-3" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">View Proof</span>
                                </a>
                              )}
                            </div>
                        ) : reg.resultStatus === 'Lost' ? (
                            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex flex-col text-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Result: Lost</span>
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate">Winner: {reg.winnerTeamName || 'Unknown'}</span>
                              </div>
                              {reg.winnerScreenshot && (
                                <a href={reg.winnerScreenshot} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 py-2 bg-slate-50 dark:bg-slate-800/30 text-google-blue hover:bg-blue-50 transition-colors border-t border-slate-100 dark:border-slate-800">
                                  <Eye className="w-3 h-3" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">View Winner</span>
                                </a>
                              )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-3 text-center">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 italic">Match Pending</span>
                                <Clock className="w-4 h-4 text-slate-200" />
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        {reg.matchDate ? (
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-google-blue uppercase">{reg.matchDate}</span>
                                <span className="text-[10px] text-slate-400 font-bold">{reg.matchTime || 'TBA'}</span>
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-slate-300 italic uppercase">Awaiting Schedule</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(reg.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
