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
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
         <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-purple/5 blur-2xl rounded-full transition-all group-hover:scale-150" />
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 dark:bg-slate-800 p-1 mb-4 shadow-xl border-2 border-neon-purple/20">
              <img src={user.image || ''} alt="Admin" className="w-full h-full rounded-[1.2rem] object-cover" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-1">{user.name}</h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-neon-purple/10 text-neon-purple rounded-full">Elite Admin</span>
         </div>
      </div>

      <nav className="bg-white dark:bg-slate-900 rounded-[2rem] p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
          {(['Registrations', 'Tournaments', 'Users', 'Winners'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`w-full h-14 rounded-2xl flex items-center gap-4 px-6 transition-all group ${
                      activeTab === tab ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-xl' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}>
                  {tab === 'Registrations' && <Users className={`w-5 h-5 ${activeTab === tab ? 'text-neon-purple' : 'group-hover:text-neon-purple'}`} />}
                  {tab === 'Tournaments' && <Trophy className={`w-5 h-5 ${activeTab === tab ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'}`} />}
                  {tab === 'Users' && <Users className={`w-5 h-5 ${activeTab === tab ? 'text-green-500' : 'group-hover:text-green-500'}`} />}
                  {tab === 'Winners' && <Medal className={`w-5 h-5 ${activeTab === tab ? 'text-amber-500' : 'group-hover:text-amber-500'}`} />}
                  <span className="text-xs font-black uppercase tracking-widest">{tab}</span>
              </button>
          ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
