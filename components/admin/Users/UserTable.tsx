import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RefreshCw, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react';
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
  users, loading, updating, adminEmail, confirmDelete,
  onRefresh, onToggleBan, onDeleteRequest, onDeleteCancel, onDeleteConfirm
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Users</h2>
          <p className="text-[10px] text-slate-400 font-medium">{users.length} total registered</p>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm font-medium">Loading users...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <table className="w-full text-left hidden md:table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard?view=${user.email}`} target="_blank" className="flex items-center gap-2.5 group/u">
                      {user.image ? (
                        <Image src={user.image} alt={user.name} width={28} height={28} className="rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center text-[10px] font-bold">{user.name.charAt(0)}</div>
                      )}
                      <span className="text-xs font-bold text-slate-800 dark:text-white group-hover/u:text-google-blue transition-colors">{user.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-medium">{user.email}</td>
                  <td className="px-4 py-3 text-[10px] font-medium text-slate-400">
                    {user.firstLoginAt ? new Date(user.firstLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge banned={user.isBanned} />
                  </td>
                  <td className="px-4 py-3">
                    <DesktopActions
                      user={user} adminEmail={adminEmail} updating={updating}
                      confirmDelete={confirmDelete}
                      onToggleBan={onToggleBan} onDeleteRequest={onDeleteRequest}
                      onDeleteCancel={onDeleteCancel} onDeleteConfirm={onDeleteConfirm}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <div key={user.email} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {user.image ? (
                      <Image src={user.image} alt={user.name} width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center text-[10px] font-bold">{user.name.charAt(0)}</div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <StatusBadge banned={user.isBanned} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Joined {user.firstLoginAt ? new Date(user.firstLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {adminEmail !== user.email && (
                      <>
                        <button onClick={() => onToggleBan(user.email, user.isBanned)} disabled={updating === user.email}
                          className={`h-8 px-3 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1 border transition-colors ${
                            user.isBanned ? 'border-green-200 text-google-green bg-green-50' : 'border-amber-200 text-amber-500 bg-amber-50'
                          } disabled:opacity-50`}>
                          {user.isBanned ? <><ShieldCheck className="w-3 h-3" /> Unban</> : <><ShieldAlert className="w-3 h-3" /> Ban</>}
                        </button>
                        <button onClick={() => onDeleteRequest(user.email)}
                          className="h-8 w-8 rounded-lg bg-red-50 text-google-red flex items-center justify-center border border-red-100">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {confirmDelete?.email === user.email && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20 flex items-center gap-2">
                    <p className="text-[10px] font-bold text-google-red uppercase flex-1">Are you sure?</p>
                    <button onClick={onDeleteCancel} className="h-7 px-3 rounded-md bg-white border border-slate-200 text-[10px] font-bold">Cancel</button>
                    <button onClick={() => onDeleteConfirm(user.email, confirmDelete.stage)}
                      className="h-7 px-3 rounded-md bg-google-red text-white text-[10px] font-bold">
                      {confirmDelete.stage === 1 ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function StatusBadge({ banned }: { banned: boolean }) {
  return banned ? (
    <span className="px-2 py-0.5 rounded-md bg-red-50 text-google-red border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 text-[9px] font-bold uppercase">Banned</span>
  ) : (
    <span className="px-2 py-0.5 rounded-md bg-green-50 text-google-green border border-green-100 dark:bg-green-500/10 dark:border-green-500/20 text-[9px] font-bold uppercase">Active</span>
  );
}

function DesktopActions({ user, adminEmail, updating, confirmDelete, onToggleBan, onDeleteRequest, onDeleteCancel, onDeleteConfirm }: any) {
  if (adminEmail === user.email) return <div className="text-right text-[9px] text-slate-300 font-medium italic">You</div>;

  return (
    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {confirmDelete?.email === user.email ? (
        <div className="flex items-center gap-1.5">
          <button onClick={onDeleteCancel} className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Cancel</button>
          <button onClick={() => onDeleteConfirm(user.email, confirmDelete.stage)}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${confirmDelete.stage === 1 ? 'bg-red-50 text-google-red border border-red-200' : 'bg-google-red text-white'}`}>
            {confirmDelete.stage === 1 ? 'Confirm?' : 'Delete!'}
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => onToggleBan(user.email, user.isBanned)} disabled={updating === user.email}
            className={`p-1.5 rounded-lg transition-colors ${user.isBanned ? 'text-google-green hover:bg-green-50' : 'text-amber-500 hover:bg-amber-50'} disabled:opacity-50`}
            title={user.isBanned ? 'Unban' : 'Ban'}>
            {user.isBanned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => onDeleteRequest(user.email)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-google-red hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

export default UserTable;
