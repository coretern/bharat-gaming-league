'use client';

import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { type Reg } from '../../types/admin';
import { to12Hour } from '@/lib/time-utils';

interface RegistrationTableProps {
  registrations: Reg[];
  loading: boolean;
  regFilter: string;
  regSearch: string;
  regTourFilter: string;
  regGameFilter: string;
  regGroupFilter: string;
  regMatchTypeFilter: string;
  setViewReg: (reg: Reg) => void;
  deleteRegistration: (id: string) => void;
}

export default function RegistrationTable({
  registrations, loading, regFilter, regSearch,
  regTourFilter, regGameFilter, regGroupFilter, regMatchTypeFilter,
  setViewReg, deleteRegistration
}: RegistrationTableProps) {
  const filteredRegs = registrations
    .filter(r => !r.matchDate)
    .filter(r => r.status === regFilter)
    .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
    .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
    .filter(r => regGameFilter === 'All' || (r.game ? r.game === regGameFilter : r.tournamentName.toLowerCase().includes(regGameFilter.toLowerCase())))
    .filter(r => regGroupFilter === 'All' || r.groupNumber?.toString() === regGroupFilter)
    .filter(r => regMatchTypeFilter === 'All' || r.matchType === regMatchTypeFilter);

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 w-12 text-center">#</th>
            <th className="px-6 py-4">Team / Contact</th>
            <th className="px-6 py-4">Game Username / UID</th>
            <th className="px-6 py-4">Tournament</th>
            <th className="px-6 py-4">Group / Slot</th>
            <th className="px-6 py-4">Verification</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <tr><td colSpan={7} className="py-20 text-center text-slate-400 text-sm italic font-medium">Synchronizing with server...</td></tr>
          ) : filteredRegs.length === 0 ? (
            <tr><td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-sm">No registrations found in this view</td></tr>
          ) : (
            filteredRegs.map((reg, index) => {
              const isApproved = reg.status === 'Approved';
              const rowBg = isApproved 
                ? 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04] dark:bg-emerald-500/[0.01] dark:hover:bg-emerald-500/[0.03]' 
                : 'hover:bg-blue-50/30 dark:hover:bg-blue-500/5';
              return (
                <tr key={reg._id} className={`transition-colors group ${rowBg}`}>
                  <td className="px-6 py-4 text-center relative">
                    {isApproved && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-google-green rounded-r" />}
                    <span className={`text-[10px] font-black ${isApproved ? 'text-google-green' : 'text-slate-300 dark:text-slate-650'}`}>
                      {filteredRegs.length - index}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{reg.teamName}</span>
                      <span className="text-[10px] font-medium text-slate-500">{reg.whatsapp}</span>
                      {reg.isResubmitted && (
                        <span className="mt-1 text-[8px] font-bold text-google-blue uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded w-fit">Resubmitted</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{reg.players[0]?.name || reg.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tighter">{reg.players[0]?.uid || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{reg.tournamentName}</span>
                      <span className="text-[10px] text-google-blue font-bold uppercase tracking-widest">{reg.matchType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{reg.groupNumber ? `Group ${reg.groupNumber}` : 'N/A'}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{reg.slotNumber ? `Slot ${reg.slotNumber}` : 'Pending Slot'}</span>
                      {reg.matchDate && (
                        <span className="text-[9px] text-google-blue font-black uppercase mt-0.5">{reg.matchDate} @ {to12Hour(reg.matchTime)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {/* Enrollment Badge */}
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest border w-fit ${
                        isApproved 
                          ? 'bg-green-550 dark:bg-green-500/20 text-google-green border-green-200 dark:border-green-500/20' 
                          : reg.status === 'Rejected'
                          ? 'bg-red-50 text-google-red border-red-200 dark:bg-red-500/10 dark:border-red-500/20'
                          : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
                      }`}>
                        {isApproved ? '✓ Approved' : reg.status === 'Rejected' ? '✗ Rejected' : '⧗ Pending'}
                      </span>
                      {/* Payment Badge */}
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[7.5px] font-bold uppercase tracking-wide border w-fit ${
                        reg.paymentVerified 
                          ? 'bg-green-50 text-google-green border-green-200 dark:bg-green-500/10 dark:border-green-500/20' 
                          : reg.paymentStatus === 'Failed'
                          ? 'bg-red-50 text-google-red border-red-200 dark:bg-red-500/10 dark:border-red-500/20'
                          : 'bg-yellow-50 text-google-yellow border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20'
                      }`}>
                        Payment: {reg.paymentVerified ? 'Verified' : (reg.paymentStatus || 'Pending')}
                      </span>
                      <div className="text-[8.5px] font-bold text-slate-400 uppercase leading-none mt-0.5">
                        {new Date(reg.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setViewReg(reg)} className="p-2 rounded-lg text-slate-400 hover:text-google-blue hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteRegistration(reg._id); }} className="p-2 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium italic">Synchronizing...</div>
        ) : filteredRegs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">No registrations found</div>
        ) : (
          filteredRegs.map((reg) => {
            const isApproved = reg.status === 'Approved';
            const cardBorder = isApproved
              ? 'border-l-[3px] border-l-google-green bg-emerald-500/[0.01]'
              : 'border-l-[3px] border-l-transparent';
            return (
              <div key={reg._id} className={`p-5 space-y-4 rounded-r-2xl ${cardBorder}`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white text-sm truncate leading-tight">{reg.teamName}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{reg.whatsapp}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      isApproved 
                        ? 'bg-google-green text-white shadow-sm' 
                        : reg.status === 'Rejected'
                        ? 'bg-google-red text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {isApproved ? '✓ Approved' : reg.status === 'Rejected' ? '✗ Rejected' : '⧗ Pending'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold uppercase tracking-wider border ${
                      reg.paymentVerified 
                        ? 'bg-green-50 text-google-green border-green-100 dark:bg-green-500/10 dark:border-green-500/20' 
                        : reg.paymentStatus === 'Failed'
                        ? 'bg-red-50 text-google-red border-red-100 dark:bg-red-500/10 dark:border-red-500/20'
                        : 'bg-yellow-50 text-google-yellow border-yellow-100 dark:bg-yellow-500/10 dark:border-yellow-500/20'
                    }`}>
                      Payment: {reg.paymentVerified ? 'Verified' : (reg.paymentStatus || 'Pending')}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Game Username</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{reg.players[0]?.name || reg.userName}</p>
                    <p className="text-[9.5px] text-slate-400 font-mono tracking-tighter mt-0.5">{reg.players[0]?.uid || 'N/A'}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Assignment</p>
                    <p className="text-xs font-bold text-google-blue truncate">{reg.groupNumber ? `Group ${reg.groupNumber}` : 'N/A'}</p>
                    <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{reg.slotNumber ? `Slot ${reg.slotNumber}` : 'Pending Slot'}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setViewReg(reg)} className="flex-1 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm">View Details</button>
                  <button onClick={() => deleteRegistration(reg._id)} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-google-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
