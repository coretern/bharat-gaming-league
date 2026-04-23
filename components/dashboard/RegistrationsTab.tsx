import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import RegCard, { type RegCardData } from './RegCard';

interface RegistrationsTabProps {
  myRegs: RegCardData[];
  loadingRegs: boolean;
}

export default function RegistrationsTab({ myRegs, loadingRegs }: RegistrationsTabProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900 dark:text-white text-base">
          My Registrations
          <span className="ml-2 text-slate-400 font-medium text-sm">({myRegs.length})</span>
        </h2>
        <Link href="/tournaments" className="text-sm font-medium text-google-blue hover:underline whitespace-nowrap shrink-0">
          + Register More
        </Link>
      </div>

      {/* Content */}
      {loadingRegs ? (
        <div className="py-16 text-center text-foreground/40 font-bold text-sm">Loading your registrations...</div>
      ) : myRegs.length === 0 ? (
        <div className="py-16 text-center">
          <Trophy className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
          <p className="font-bold text-foreground/40 text-sm">No registrations yet.</p>
          <Link href="/tournaments" className="inline-block mt-4 btn-neon-purple text-xs">Browse Tournaments</Link>
        </div>
      ) : (
        <div className="p-2 sm:p-3 space-y-1">
          {myRegs.map(reg => (
            <RegCard key={reg._id} reg={reg} />
          ))}
        </div>
      )}
    </div>
  );
}
