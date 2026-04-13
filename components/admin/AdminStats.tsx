import React from 'react';
import { Reg, SiteUser, Tournament, Winner } from '../types/admin';

interface AdminStatsProps {
  registrations: Reg[];
  siteUsers: SiteUser[];
  liveTournaments: Tournament[];
  winners: Winner[];
}

const AdminStats: React.FC<AdminStatsProps> = ({
  registrations,
  siteUsers,
  liveTournaments,
  winners
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Registrations</p>
          <p className="text-4xl font-black italic tracking-tighter text-neon-purple leading-none">{registrations.length}</p>
      </div>
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Users</p>
          <p className="text-4xl font-black italic tracking-tighter text-neon-cyan leading-none">{siteUsers.length}</p>
      </div>
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Events</p>
          <p className="text-4xl font-black italic tracking-tighter text-green-500 leading-none">{liveTournaments.length}</p>
      </div>
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Champions</p>
          <p className="text-4xl font-black italic tracking-tighter text-amber-500 leading-none">{winners.length}</p>
      </div>
    </div>
  );
};

export default AdminStats;
