import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ProfileTabProps {
  user: { name?: string | null; email?: string | null };
}

export default function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 shadow-[0_1px_2px_0_rgba(60,64,67,.30)]">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-6">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          {[
            { label: 'Full Name', value: user.name || '—' },
            { label: 'Email Address', value: user.email || '—' },
            { label: 'Platform Status', value: 'Verified Participant' },
            { label: 'Membership', value: 'Standard Tier' },
          ].map(f => (
            <div key={f.label} className="border-b border-slate-50 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{f.label}</p>
              <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">Join a new competition</p>
          <p className="text-slate-500 text-xs mt-0.5">Explore available tournaments and secure your slot.</p>
        </div>
        <Link href="/tournaments" className="bg-google-blue text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Browse Tournaments
        </Link>
      </div>
    </div>
  );
}
