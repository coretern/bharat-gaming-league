import React from 'react';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface MobileDashboardHeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: any[];
}

export default function MobileDashboardHeader({ user, activeTab, setActiveTab, navItems }: MobileDashboardHeaderProps) {
  return (
    <div className="lg:hidden space-y-3 mb-5">
      <div className="glass-card p-4 flex items-center gap-4 relative">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={56} height={56}
            className="rounded-full ring-2 ring-neon-cyan/30 shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-neon-purple/10 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-neon-purple" />
          </div>
        )}
        <div className="min-w-0 flex-1 pr-24">
          <p className="font-black italic uppercase tracking-tight text-foreground text-sm leading-tight truncate">{user.name}</p>
          <p className="text-foreground/40 text-[11px] mt-0.5 truncate">{user.email}</p>
          <span className="inline-block mt-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
            Player
          </span>
        </div>
      </div>

      <div className="glass-card p-1.5 flex gap-1.5">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
              activeTab === item.name
                ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <item.icon className="w-3.5 h-3.5 shrink-0" />
            {item.name === 'My Registrations' ? 'Registrations' : item.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-red-500 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" /> Sign Out
      </button>
    </div>
  );
}
