import React from 'react';
import { Users, Trophy, Medal, Gamepad2 } from 'lucide-react';
import { Reg, SiteUser, Tournament, Winner } from '../types/admin';

interface AdminStatsProps {
  registrations: Reg[];
  siteUsers: SiteUser[];
  liveTournaments: Tournament[];
  winners: Winner[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ registrations, siteUsers, liveTournaments, winners }) => {
  const stats = [
    {
      label: 'Registrations',
      value: registrations.length,
      icon: Users,
      color: 'text-google-blue',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      border: 'border-blue-100 dark:border-blue-500/20',
    },
    {
      label: 'Active Users',
      value: siteUsers.length,
      icon: Gamepad2,
      color: 'text-google-green',
      bg: 'bg-green-50 dark:bg-green-500/10',
      border: 'border-green-100 dark:border-green-500/20',
    },
    {
      label: 'Tournaments',
      value: liveTournaments.length,
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-100 dark:border-amber-500/20',
    },
    {
      label: 'Winners',
      value: winners.length,
      icon: Medal,
      color: 'text-google-red',
      bg: 'bg-red-50 dark:bg-red-500/10',
      border: 'border-red-100 dark:border-red-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className={`p-4 rounded-xl bg-white dark:bg-slate-900 border ${s.border} shadow-sm flex items-center gap-3`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-black tabular-nums text-slate-900 dark:text-white leading-none">{s.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
