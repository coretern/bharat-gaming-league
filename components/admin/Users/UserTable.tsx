import React from 'react';
import Image from 'next/image';
import { RefreshCw, Clock, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
import { SiteUser } from '../../types/admin';

interface UserTableProps {
  users: SiteUser[];
  loading: boolean;
  updating: string | null;
  adminEmail: string | undefined;
  confirmDelete: { email: string, stage: number } | null;
  confirmBan: { email: string, stage: number } | null;
  setConfirmBan: (v: { email: string, stage: number } | null) => void;
  onRefresh: () => void;
  onToggleBan: (email: string, currentStatus: boolean) => void;
  onDeleteRequest: (email: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: (email: string, stage: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  updating,
  adminEmail,
  confirmDelete,
  confirmBan,
  setConfirmBan,
  onRefresh,
  onToggleBan,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Website Users ({users.length} Total)</h2>
        <button onClick={onRefresh} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full text-left hidden md:table">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">First Login</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr key={user.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image src={user.image} alt={user.name} width={28} height={28} className="rounded-full shadow-sm" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-google-blue flex items-center justify-center text-[10px] text-white font-bold uppercase">{user.name.charAt(0)}</div>
                    )}
                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500 tracking-tight">{user.email}</td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                        {user.firstLoginAt ? `${new Date(user.firstLoginAt).toLocaleDateString('en-GB')} ${new Date(user.firstLoginAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registered</p>
                   </div>
                </td>
                <td className="px-6 py-4">
                  {user.isBanned ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-google-red border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 text-[10px] font-bold uppercase tracking-widest">Banned</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-green-50 text-google-green border border-green-100 dark:bg-green-500/10 dark:border-green-500/20 text-[10px] font-bold uppercase tracking-widest">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {confirmBan?.email === user.email ? (
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setConfirmBan(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
                          <button onClick={() => onToggleBan(user.email, user.isBanned)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                            confirmBan.stage === 1 ? 'bg-yellow-50 text-google-yellow border border-yellow-200' : 'bg-google-yellow text-white shadow-lg'
                          }`}>
                            {confirmBan.stage === 1 ? 'Confirm?' : 'Final Ban!'}
                          </button>
                       </div>
                    ) : (
                      <button
                        onClick={() => onToggleBan(user.email, user.isBanned)}
                        disabled={updating === user.email || adminEmail === user.email}
                        className={`p-2 rounded-lg transition-all ${
                          user.isBanned 
                            ? 'text-google-green hover:bg-green-50 dark:hover:bg-green-500/10' 
                            : 'text-google-yellow hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                        } disabled:opacity-0`}
                        title={user.isBanned ? 'Unban User' : 'Ban User'}
                      >
                        {user.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      </button>
                    )}

                    {confirmDelete?.email === user.email ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={onDeleteCancel} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
                        <button onClick={() => onDeleteConfirm(user.email, confirmDelete.stage)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                          confirmDelete.stage === 1 ? 'bg-red-50 text-google-red border border-red-200' : 'bg-google-red text-white shadow-lg'
                        }`}>
                          {confirmDelete.stage === 1 ? 'Confirm?' : 'Final Confirm!'}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onDeleteRequest(user.email)}
                        disabled={adminEmail === user.email}
                        className="p-2 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <div key={user.email} className="p-4 space-y-4">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center text-[10px] text-white font-bold uppercase">{user.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 tracking-tight">{user.email}</p>
                    </div>
                  </div>
                  {user.isBanned ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-google-red border border-red-100 text-[8px] font-bold uppercase tracking-widest">Banned</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-green-50 text-google-green border border-green-100 text-[8px] font-bold uppercase tracking-widest">Active</span>
                  )}
               </div>

               <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                      {user.firstLoginAt ? `${new Date(user.firstLoginAt).toLocaleDateString()} ${new Date(user.firstLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Joined Platform</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {confirmBan?.email === user.email ? (
                       <div className="flex items-center gap-2">
                          <button onClick={() => setConfirmBan(null)} className="text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
                          <button onClick={() => onToggleBan(user.email, user.isBanned)} className="h-9 px-3 rounded-xl bg-google-yellow text-white text-[10px] font-bold uppercase shadow-lg">
                             {confirmBan.stage === 1 ? 'Confirm?' : 'Final!'}
                          </button>
                       </div>
                    ) : (
                      <button
                        onClick={() => onToggleBan(user.email, user.isBanned)}
                        disabled={updating === user.email || adminEmail === user.email}
                        className={`h-9 px-3 rounded-xl transition-all flex items-center gap-2 border ${
                          user.isBanned 
                            ? 'border-green-100 text-google-green bg-green-50' 
                            : 'border-yellow-100 text-google-yellow bg-yellow-50'
                        } disabled:opacity-0`}
                      >
                        {user.isBanned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{user.isBanned ? 'Unban' : 'Ban'}</span>
                      </button>
                    )}

                    <button 
                      onClick={() => onDeleteRequest(user.email)}
                      disabled={adminEmail === user.email}
                      className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-50 dark:border-red-500/20 text-google-red flex items-center justify-center disabled:opacity-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
               </div>

               {confirmDelete?.email === user.email && (
                 <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 flex flex-col gap-3">
                    <p className="text-[10px] font-bold text-google-red uppercase tracking-widest text-center">Are you absolutely sure?</p>
                    <div className="flex gap-2">
                       <button onClick={onDeleteCancel} className="flex-1 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-[10px] font-bold uppercase">Cancel</button>
                       <button onClick={() => onDeleteConfirm(user.email, confirmDelete.stage)} className="flex-1 py-2 rounded-lg bg-google-red text-white text-[10px] font-bold uppercase">
                          {confirmDelete.stage === 1 ? 'Confirm' : 'Final Delete'}
                       </button>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
