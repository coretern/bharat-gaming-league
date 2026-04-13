import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ProfileTabProps {
  user: { name?: string | null; email?: string | null };
}

export default function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="space-y-5">
      <div className="glass-card p-6">
        <h2 className="font-black italic uppercase tracking-tight text-xl text-foreground mb-5">
          Profile <span className="text-neon-purple">Info</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', value: user.name || '—' },
            { label: 'Email Address', value: user.email || '—' },
            { label: 'Account Type', value: 'Google' },
            { label: 'Status', value: 'Active Player' },
          ].map(f => (
            <div key={f.label} className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{f.label}</p>
              <p className="font-bold text-foreground text-sm break-all">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-black italic uppercase text-foreground text-sm">Ready to compete?</p>
          <p className="text-foreground/50 text-xs mt-0.5">Browse and register for upcoming tournaments.</p>
        </div>
        <Link href="/tournaments" className="btn-neon-purple whitespace-nowrap flex items-center gap-2 text-xs shrink-0">
          <Plus className="w-4 h-4" /> Browse Tournaments
        </Link>
      </div>
    </div>
  );
}
