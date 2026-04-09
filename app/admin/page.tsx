'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Edit2, Trash2, Users, CheckCircle, ShieldCheck, ShieldAlert,
  X, ExternalLink, RefreshCw, Eye, ImageOff, ShieldOff, UserCheck, Clock
} from "lucide-react";
import { tournaments } from "@/data/tournaments";
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Reg {
  _id: string;
  tournamentName: string;
  teamName: string;
  userName: string;
  userEmail: string;
  userImage: string;
  leaderUid: string;
  whatsapp: string;
  paymentScreenshot: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentVerified: boolean;
  createdAt: string;
}

interface SiteUser {
  _id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
  firstLoginAt: string;
  lastLoginAt: string;
  loginCount: number;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'Registrations' | 'Users' | 'Tournaments'>('Registrations');
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [siteUsers, setSiteUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const isAdmin = (session?.user as any)?.isAdmin === true;

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/register');
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setSiteUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
      fetchUsers();
    }
  }, [isAdmin]);

  const updateStatus = async (id: string, payload: object) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Updated!');
      fetchRegistrations();
    } catch {
      toast.error('Failed to update');
    } finally {
      setUpdating(null);
    }
  };

  // ── Guards ────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-500 font-bold">Checking access...</p>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center max-w-sm shadow-lg">
          <ShieldOff className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase text-foreground mb-2">Login Required</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in with your admin Google account.</p>
          <button onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center max-w-sm shadow-lg">
          <ShieldOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black italic uppercase text-foreground mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm mb-1">Logged in as:</p>
          <p className="font-bold text-foreground text-sm mb-4 break-all">{session?.user?.email}</p>
          <p className="text-xs text-slate-400">This account is not authorised as admin.</p>
        </div>
      </main>
    );
  }

  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const approvedCount = registrations.filter(r => r.status === 'Approved').length;

  return (
    <main className="min-h-screen pt-24 bg-background">
      <Navbar />

      {/* Screenshot Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImg(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300">
              <X className="w-7 h-7" />
            </button>
            <img src={previewImg} alt="Payment Screenshot" className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]" />
            <a href={previewImg} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
              <ExternalLink className="w-4 h-4" /> Open Full Size
            </a>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">
              Admin <span className="text-neon-red">Panel</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs font-bold uppercase tracking-widest">
              Welcome back, {session.user?.name?.split(' ')[0]}
            </p>
          </div>
          <button onClick={() => { fetchRegistrations(); fetchUsers(); }}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-foreground border border-foreground/10 px-4 py-2 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: siteUsers.length, color: 'text-neon-cyan' },
            { label: 'Total Registrations', value: registrations.length, color: 'text-neon-purple' },
            { label: 'Pending', value: pendingCount, color: 'text-amber-500' },
            { label: 'Approved', value: approvedCount, color: 'text-green-500' },
            { label: 'Tournaments', value: tournaments.length, color: 'text-neon-red' },
          ].map(s => (
            <div key={s.label} className="glass-card p-5 border-foreground/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-black italic ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-3 border-foreground/5">
              <nav className="flex lg:flex-col gap-2 overflow-x-auto">
                {[
                  { name: 'Registrations', icon: CheckCircle, count: registrations.length },
                  { name: 'Users', icon: UserCheck, count: siteUsers.length },
                  { name: 'Tournaments', icon: Plus },
                ].map(item => (
                  <button key={item.name} onClick={() => setActiveTab(item.name as any)}
                    className={`whitespace-nowrap flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${
                      activeTab === item.name
                        ? 'bg-neon-red/10 text-neon-red border border-neon-red/20'
                        : 'text-slate-500 hover:bg-foreground/5 hover:text-foreground'
                    }`}>
                    <div className="flex items-center gap-2"><item.icon className="w-4 h-4" />{item.name}</div>
                    {item.count != null && (
                      <span className="bg-neon-red text-white text-[10px] px-2 py-0.5 rounded-full">{item.count}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">

            {/* Registrations Tab */}
            {activeTab === 'Registrations' && (
              <div className="glass-card border-foreground/5 overflow-hidden bg-background shadow-md">
                <div className="px-6 py-4 border-b border-foreground/5">
                  <h2 className="font-black uppercase italic tracking-tight text-foreground">
                    Tournament Registrations <span className="text-slate-500 text-sm font-bold">({registrations.length})</span>
                  </h2>
                </div>
                {loading ? (
                  <div className="py-20 text-center text-slate-500 font-bold">Loading...</div>
                ) : registrations.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 font-bold">No registrations yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-foreground/5 border-b border-foreground/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Team</th>
                          <th className="px-4 py-3">Tournament</th>
                          <th className="px-4 py-3">UID / WA</th>
                          <th className="px-4 py-3">Screenshot</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5 text-sm text-foreground">
                        {registrations.map(reg => (
                          <tr key={reg._id} className="hover:bg-foreground/2 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {reg.userImage
                                  ? <img src={reg.userImage} alt="" className="w-8 h-8 rounded-full shrink-0" />
                                  : <div className="w-8 h-8 rounded-full bg-foreground/10 shrink-0" />}
                                <div>
                                  <p className="font-bold text-xs">{reg.userName}</p>
                                  <p className="text-[10px] text-slate-500">{reg.userEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-black italic uppercase text-xs">{reg.teamName}</td>
                            <td className="px-4 py-4 text-xs text-slate-500 font-semibold max-w-[130px] truncate">{reg.tournamentName}</td>
                            <td className="px-4 py-4">
                              <p className="text-[10px] font-bold text-neon-cyan">{reg.leaderUid}</p>
                              <p className="text-[10px] text-slate-500">{reg.whatsapp}</p>
                            </td>
                            <td className="px-4 py-4">
                              {reg.paymentScreenshot ? (
                                <button onClick={() => setPreviewImg(reg.paymentScreenshot)}
                                  className="flex items-center gap-1.5 text-xs font-bold text-neon-cyan hover:text-neon-purple transition-colors">
                                  <Eye className="w-4 h-4" /> View
                                </button>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <ImageOff className="w-3 h-3" /> None
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border w-fit ${
                                  reg.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                  : reg.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                  {reg.status}
                                </span>
                                {reg.paymentVerified
                                  ? <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold"><ShieldCheck className="w-3 h-3" />Verified</span>
                                  : <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold"><ShieldAlert className="w-3 h-3" />Unverified</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-1.5 justify-end flex-wrap">
                                <button disabled={updating === reg._id || reg.status === 'Approved'}
                                  onClick={() => updateStatus(reg._id, { status: 'Approved', paymentVerified: true })}
                                  className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed" title="Approve">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button disabled={updating === reg._id || reg.status === 'Rejected'}
                                  onClick={() => updateStatus(reg._id, { status: 'Rejected' })}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed" title="Reject">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'Users' && (
              <div className="glass-card border-foreground/5 overflow-hidden bg-background shadow-md">
                <div className="px-6 py-4 border-b border-foreground/5">
                  <h2 className="font-black uppercase italic tracking-tight text-foreground">
                    Website Users <span className="text-slate-500 text-sm font-bold">({siteUsers.length} total)</span>
                  </h2>
                </div>
                {loadingUsers ? (
                  <div className="py-20 text-center text-slate-500 font-bold">Loading users...</div>
                ) : siteUsers.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 font-bold">No users logged in yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-foreground/5 border-b border-foreground/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <th className="px-5 py-3">User</th>
                          <th className="px-5 py-3">Email</th>
                          <th className="px-5 py-3">First Login</th>
                          <th className="px-5 py-3">Last Login</th>
                          <th className="px-5 py-3">Logins</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5 text-sm text-foreground">
                        {siteUsers.map(u => (
                          <tr key={u._id} className="hover:bg-foreground/2 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                {u.image ? (
                                  <img src={u.image} alt="" className="w-8 h-8 rounded-full shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4 text-neon-purple" />
                                  </div>
                                )}
                                <p className="font-bold text-xs">{u.name || '—'}</p>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-neon-cyan font-bold">{u.email}</td>
                            <td className="px-5 py-4 text-[10px] text-slate-500 font-semibold">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(u.firstLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                              <div className="text-[9px] text-slate-400">
                                {new Date(u.firstLoginAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-[10px] text-slate-500 font-semibold">
                              {new Date(u.lastLoginAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[10px] font-black">
                                {u.loginCount}x
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tournaments Tab */}
            {activeTab === 'Tournaments' && (
              <div className="glass-card border-foreground/5 overflow-hidden shadow-md bg-background">
                <div className="px-6 py-4 border-b border-foreground/5">
                  <h2 className="font-black uppercase italic text-foreground">All Tournaments</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-foreground/5 border-b border-foreground/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-5 py-3">Tournament</th>
                        <th className="px-5 py-3">Game</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Prize</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5 text-foreground">
                      {tournaments.map(t => (
                        <tr key={t.id} className="hover:bg-foreground/2 transition-colors">
                          <td className="px-5 py-5 font-black italic uppercase text-sm">{t.title}</td>
                          <td className="px-5 py-5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.game === 'BGMI' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'}`}>
                              {t.game}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-xs text-slate-500 font-semibold">{t.date}</td>
                          <td className="px-5 py-5 text-xs font-bold text-neon-cyan">{t.prizePool}</td>
                          <td className="px-5 py-5 text-right space-x-2">
                            <button className="p-1.5 rounded-lg bg-foreground/5 text-slate-500 hover:text-neon-cyan border border-foreground/5"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg bg-foreground/5 text-slate-500 hover:text-red-500 border border-foreground/5"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
