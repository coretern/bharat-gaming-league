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
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">First Login</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-center">Logins</th>
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
                      <div className="w-7 h-7 rounded-full bg-neon-purple flex items-center justify-center text-[10px] text-white font-black uppercase">{user.name.charAt(0)}</div>
                    )}
                    <p className="text-xs font-black text-foreground line-clamp-1 italic uppercase">{user.name}</p>
                    {user.isBanned && (
                      <span className="px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[8px] font-black uppercase tracking-tighter shadow-sm animate-pulse">Banned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-neon-cyan">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black italic text-foreground tracking-tight">{new Date(user.createdAt).toLocaleDateString()}</p>
                      <p className="text-[8px] font-bold uppercase">{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[10px] font-black uppercase tracking-tighter text-slate-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-0.5 rounded-lg bg-neon-cyan/10 text-neon-cyan text-[10px] font-black">{user.loginCount || 1}x</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleBan(user.email, user.isBanned)}
                      disabled={updating === user.email || adminEmail === user.email}
                      className={`p-2 rounded-xl transition-all ${
                        user.isBanned 
                          ? 'text-green-500 hover:bg-green-500/10' 
                          : 'text-amber-500 hover:bg-amber-500/10'
                      } disabled:opacity-0`}
                      title={user.isBanned ? 'Unban User' : 'Ban User'}
                    >
                      {user.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    </button>

                    {confirmDelete?.email === user.email ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={onDeleteCancel} className="text-[10px] text-slate-400 hover:text-slate-600">Cancel</button>
                        <button onClick={() => onDeleteConfirm(user.email, confirmDelete.stage)} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                          confirmDelete.stage === 1 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-red-500 text-white shadow-lg scale-105'
                        }`}>
                          {confirmDelete.stage === 1 ? 'Confirm?' : 'Final Confirm!'}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onDeleteRequest(user.email)}
                        disabled={adminEmail === user.email}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors disabled:opacity-0"
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
      </div>
    </div>
  );
};

export default UserTable;
