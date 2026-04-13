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
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,.15)] transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Total Registrations</p>
          <p className="text-3xl font-medium text-google-blue">{registrations.length}</p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,.15)] transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Active Users</p>
          <p className="text-3xl font-medium text-google-green">{siteUsers.length}</p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,.15)] transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Live Tournaments</p>
          <p className="text-3xl font-medium text-google-red">{liveTournaments.length}</p>
      </div>
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,.15)] transition-shadow">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Hall of Fame</p>
          <p className="text-3xl font-medium text-google-yellow">{winners.length}</p>
      </div>
    </div>
  );
};

export default AdminStats;
