import React from 'react';
import Image from 'next/image';
import { User, Trophy, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface DashboardSidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: any[];
}

export default function DashboardSidebar({ user, activeTab, setActiveTab, navItems }: DashboardSidebarProps) {
  return (
    <div className="hidden lg:block lg:col-span-1 space-y-4">
      <div className="glass-card p-6 text-center">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={80} height={80}
            className="rounded-full mx-auto mb-3 ring-4 ring-neon-cyan/20" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-neon-purple" />
          </div>
        )}
        <h2 className="font-black italic uppercase tracking-tight text-foreground text-lg leading-tight">{user.name}</h2>
        <p className="text-foreground/40 text-xs mt-1 break-all">{user.email}</p>
        <span className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
          Player
        </span>
      </div>

      <div className="glass-card p-3">
        {navItems.map(item => (
          <button key={item.name} onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.name
                ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </button>
        ))}
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all mt-1">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
