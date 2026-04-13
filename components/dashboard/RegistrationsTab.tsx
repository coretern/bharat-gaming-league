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
  createdAt: string;
}

interface RegistrationsTabProps {
  myRegs: MyReg[];
  loadingRegs: boolean;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Approved') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
      <CheckCircle2 className="w-3 h-3" /> Approved
    </span>
  );
  if (status === 'Rejected') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function RegistrationsTab({ myRegs, loadingRegs }: RegistrationsTabProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-foreground/5 flex items-center justify-between gap-2">
        <h2 className="font-black italic uppercase tracking-tight text-foreground text-sm">
          My Registrations
          <span className="ml-2 text-foreground/40 font-bold">({myRegs.length})</span>
        </h2>
        <Link href="/tournaments" className="text-xs font-bold text-neon-cyan hover:text-neon-purple transition-colors whitespace-nowrap shrink-0">
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-foreground/5 border-b border-foreground/5 text-foreground/40 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-4 py-3">Tournament</th>
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5 text-sm text-foreground">
                {myRegs.map(reg => (
                  <tr key={reg._id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-4 py-3 font-black italic uppercase text-xs">{reg.tournamentName}</td>
                    <td className="px-4 py-3 text-[10px] font-black uppercase text-neon-purple">{reg.matchType}</td>
                    <td className="px-4 py-3 font-bold text-foreground/50 text-xs">{reg.teamName}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5 mt-1 min-w-[140px]">
                          <StatusBadge status={reg.status} />
                          {reg.status === 'Rejected' && (
                              <div className="space-y-2">
                                  <div className="bg-red-50 dark:bg-red-500/5 p-3 rounded-2xl border border-red-500/10">
                                      <p className="text-[11px] font-bold text-red-600 dark:text-red-400">"{reg.rejectionReason || 'No reason specified'}"</p>
                                  </div>
                                  <Link href={`/register?tournament=${reg._id}&edit=true`} 
                                      className="block px-3 py-1.5 rounded-xl bg-neon-cyan/10 text-[10px] font-black uppercase text-neon-cyan hover:bg-neon-cyan hover:text-white transition-all text-center">
                                      Edit & Resubmit
                                  </Link>
                              </div>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {reg.paymentVerified
                        ? <span className="flex items-center gap-1 text-[10px] font-bold text-green-500"><ShieldCheck className="w-3 h-3" />Verified</span>
                        : <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500"><ShieldAlert className="w-3 h-3" />Pending</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-[10px] text-foreground/40 font-bold">{new Date(reg.createdAt).toLocaleDateString()}</td>
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
