import React from 'react';
import { Users, Trophy, Medal } from "lucide-react";

interface AdminSidebarProps {
  user: { name?: string | null; image?: string | null };
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  activeTab,
  setActiveTab
}) => {
  return (
    <aside className="lg:col-span-1 space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
              <img src={user.image || ''} alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-google-blue font-bold uppercase tracking-wider">System Administrator</p>
            </div>
         </div>
      </div>

      <nav className="bg-white dark:bg-slate-900 rounded-xl py-2 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)]">
          {(['Registrations', 'Tournaments', 'Users', 'Winners'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`w-full h-12 flex items-center gap-4 px-6 transition-all relative ${
                      activeTab === tab 
                        ? 'text-google-blue bg-blue-50/50 dark:bg-blue-500/10' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}>
                  {activeTab === tab && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-google-blue rounded-r-full" />}
                  {tab === 'Registrations' && <Users className="w-5 h-5" />}
                  {tab === 'Tournaments' && <Trophy className="w-5 h-5" />}
                  {tab === 'Users' && <Users className="w-5 h-5" />}
                  {tab === 'Winners' && <Medal className="w-5 h-5" />}
                  <span className="text-xs font-bold">{tab}</span>
              </button>
          ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
