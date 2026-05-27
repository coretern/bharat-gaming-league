import React from 'react';
import Image from 'next/image';
import { User, LogOut } from 'lucide-react';
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={80} height={80}
            className="rounded-full mx-auto mb-4 border border-slate-100 dark:border-slate-800" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
            <User className="w-10 h-10 text-slate-450" />
          </div>
        )}
        <h2 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">{user.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 break-all font-medium">{user.email}</p>
        <span className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-google-blue dark:text-blue-400 border border-blue-100/50 dark:border-blue-500/20">
          Player
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl py-3 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {navItems.map(item => (
          <div key={item.name} className="px-3 py-0.5">
            <button onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all relative ${
                activeTab === item.name
                  ? 'text-google-blue dark:text-white bg-blue-50 dark:bg-blue-500/10 font-bold border border-blue-100/30 dark:border-blue-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">{item.name}</span>
            </button>
          </div>
        ))}
        <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
        <div className="px-3">
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

