import React from 'react';
import { Users, Trophy, Medal, Image as ImageIcon, Calendar, FileText, Shield } from "lucide-react";

interface AdminSidebarProps {
  user: { name?: string | null; image?: string | null };
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onTabClick?: (tab: string) => void;
}

const tabs = [
  { name: 'Registrations', icon: Users, color: 'text-google-blue' },
  { name: 'Schedules', icon: Calendar, color: 'text-purple-500' },
  { name: 'Tournaments', icon: Trophy, color: 'text-amber-500' },
  { name: 'Users', icon: Users, color: 'text-google-green' },
  { name: 'Winners', icon: Medal, color: 'text-google-red' },
  { name: 'Media', icon: ImageIcon, color: 'text-cyan-500' },
  { name: 'Logs', icon: FileText, color: 'text-slate-400' },
] as const;

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, activeTab, setActiveTab, onTabClick }) => {
  return (
    <aside className="lg:col-span-1 space-y-3">
      {/* Admin Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-google-blue/20 shrink-0">
            <img src={user.image || ''} alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-google-blue" />
              <span className="text-[9px] text-google-blue font-black uppercase tracking-wider">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Horizontal scroll on mobile, vertical on desktop */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-hide">
          {tabs.map(({ name, icon: Icon, color }) => {
            const isActive = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => {
                  if (activeTab === name && onTabClick) onTabClick(name);
                  setActiveTab(name);
                }}
                className={`flex items-center gap-3 px-4 py-3 lg:w-full whitespace-nowrap transition-all relative shrink-0 ${
                  isActive
                    ? 'bg-google-blue/5 dark:bg-google-blue/10 text-google-blue'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <>
                    {/* Bottom bar on mobile, left bar on desktop */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-google-blue rounded-full lg:hidden" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-google-blue rounded-r-full hidden lg:block" />
                  </>
                )}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-google-blue/10 text-google-blue' : `bg-slate-50 dark:bg-slate-800 ${color}`
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold">{name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
