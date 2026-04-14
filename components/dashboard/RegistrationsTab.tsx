import React from 'react';
import Link from 'next/link';
import { Trophy, CheckCircle2, Clock, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

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
          <div className="md:hidden divide-y divide-foreground/5">
            {myRegs.map(reg => {
              const statusColor =
                reg.status === 'Approved' ? 'border-green-500 bg-green-500/5' :
                reg.status === 'Rejected' ? 'border-red-500 bg-red-500/5' :
                'border-amber-400 bg-amber-400/5';

              return (
                <div key={reg._id} className={`mx-4 my-3 rounded-xl border-l-4 p-4 ${statusColor}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                          <p className="font-black italic uppercase text-sm text-foreground leading-tight">{reg.tournamentName}</p>
                          <span className="text-[9px] font-black uppercase text-neon-purple mt-0.5 inline-block">{reg.matchType}</span>
                      </div>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>

                  {reg.status === 'Rejected' && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                          <p className="text-[10px] font-black uppercase text-red-500 mb-1">Reason:</p>
                          <p className="text-xs font-bold text-red-600 dark:text-red-400 italic">"{reg.rejectionReason || 'No reason specified'}"</p>
                      </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 text-xs mb-4">
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
                      <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">Registered</p>
                      <p className="font-bold text-foreground/60">{new Date(reg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {reg.status === 'Rejected' && (
                      <Link href={`/register?tournament=${reg._id}&edit=true`}
                          className="block w-full text-center py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest transition-all">
                          Edit & Resubmit
                      </Link>
                  )}
                </div>
              );
            })}
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
