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
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] text-center">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={80} height={80}
            className="rounded-full mx-auto mb-4 border border-slate-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <User className="w-10 h-10 text-slate-400" />
          </div>
        )}
        <h2 className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight">{user.name}</h2>
        <p className="text-slate-500 text-xs mt-1 break-all font-medium">{user.email}</p>
        <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-google-blue border border-blue-100">
          Player
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl py-2 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)]">
        {navItems.map(item => (
          <button key={item.name} onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 px-6 py-3 transition-all relative ${
              activeTab === item.name
                ? 'text-google-blue bg-blue-50/50 dark:bg-blue-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {activeTab === item.name && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-google-blue rounded-r-full" />}
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
        <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-4 px-6 py-3 text-sm font-medium text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
