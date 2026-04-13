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
    <div className="lg:hidden space-y-4 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 flex items-center gap-4 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] border border-slate-200">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={52} height={52}
            className="rounded-full border border-slate-200 shrink-0" />
        ) : (
          <div className="w-13 h-13 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            <User className="w-6 h-6 text-slate-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-white text-base leading-tight truncate">{user.name}</p>
          <p className="text-slate-500 text-[11px] font-medium truncate">{user.email}</p>
          <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-100">
            Player
          </span>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-google-red hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 flex gap-2 border border-slate-200 shadow-sm">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === item.name
                ? 'bg-blue-50 text-google-blue border border-blue-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.name === 'My Registrations' ? 'Registrations' : item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
