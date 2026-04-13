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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
      <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Total Registrations</p>
          <p className="text-2xl md:text-3xl font-bold text-google-blue">{registrations.length}</p>
      </div>
      <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Active Users</p>
          <p className="text-2xl md:text-3xl font-bold text-google-green">{siteUsers.length}</p>
      </div>
      <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Live Tournaments</p>
          <p className="text-2xl md:text-3xl font-bold text-google-red">{liveTournaments.length}</p>
      </div>
      <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Winners Pool</p>
          <p className="text-2xl md:text-3xl font-bold text-google-yellow">{winners.length}</p>
      </div>
    </div>
  );
};

export default AdminStats;
