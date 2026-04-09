'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import {
  User, Trophy, Calendar, LogOut,
  CheckCircle2, Clock, XCircle, ShieldCheck, ShieldAlert, Plus
} from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MyReg {
  _id: string;
  tournamentName: string;
  teamName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentVerified: boolean;
  createdAt: string;
}

const navItems = [
  { name: 'Profile', icon: User },
  { name: 'My Registrations', icon: Trophy },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'Approved') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
      <CheckCircle2 className="w-3 h-3" /> Approved
    </span>
  );
  if (status === 'Rejected') return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profile');
  const [myRegs, setMyRegs] = useState<MyReg[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setLoadingRegs(true);
      fetch('/api/my-registrations')
        .then(r => r.json())
        .then(data => setMyRegs(Array.isArray(data) ? data : []))
        .catch(() => setMyRegs([]))
        .finally(() => setLoadingRegs(false));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-500 font-bold">Loading...</p>
      </main>
    );
  }

  if (!session) return null;

  const user = session.user!;

  return (
    <main className="min-h-screen pt-24 pb-24 bg-background">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8 mt-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="glass-card p-6 border-foreground/5 text-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-3 ring-4 ring-neon-cyan/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-neon-purple" />
                </div>
              )}
              <h2 className="font-black italic uppercase tracking-tight text-foreground text-lg leading-tight">
                {user.name}
              </h2>
              <p className="text-slate-500 text-xs mt-1 break-all">{user.email}</p>
              <span className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                Player
              </span>
            </div>

            {/* Nav */}
            <div className="glass-card p-3 border-foreground/5">
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.name
                      ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                      : 'text-slate-500 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all mt-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="glass-card p-4 border-foreground/5 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Theme</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <div className="glass-card p-8 border-foreground/5">
                  <h2 className="font-black italic uppercase tracking-tight text-2xl text-foreground mb-6">
                    Profile <span className="text-neon-purple">Info</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', value: user.name || '—' },
                      { label: 'Email Address', value: user.email || '—' },
                      { label: 'Account Type', value: 'Google' },
                      { label: 'Status', value: 'Active Player' },
                    ].map(f => (
                      <div key={f.label} className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{f.label}</p>
                        <p className="font-bold text-foreground text-sm break-all">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 border-foreground/5 flex items-center justify-between">
                  <div>
                    <p className="font-black italic uppercase text-foreground">Ready to compete?</p>
                    <p className="text-slate-500 text-sm mt-0.5">Browse and register for upcoming tournaments.</p>
                  </div>
                  <Link href="/tournaments" className="btn-neon-purple whitespace-nowrap flex items-center gap-2 text-xs">
                    <Plus className="w-4 h-4" /> Browse Tournaments
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'My Registrations' && (
              <div className="glass-card border-foreground/5 overflow-hidden">
                <div className="px-6 py-4 border-b border-foreground/5 flex items-center justify-between">
                  <h2 className="font-black italic uppercase tracking-tight text-foreground">
                    My Registrations
                    <span className="ml-2 text-slate-500 text-sm font-bold">({myRegs.length})</span>
                  </h2>
                  <Link href="/tournaments" className="text-xs font-bold text-neon-cyan hover:text-neon-purple transition-colors">
                    + Register More
                  </Link>
                </div>

                {loadingRegs ? (
                  <div className="py-20 text-center text-slate-500 font-bold">Loading your registrations...</div>
                ) : myRegs.length === 0 ? (
                  <div className="py-20 text-center">
                    <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="font-bold text-slate-500">No registrations yet.</p>
                    <p className="text-sm text-slate-400 mt-1">Register for a tournament to get started.</p>
                    <Link href="/tournaments" className="inline-block mt-4 btn-neon-purple text-xs">
                      Browse Tournaments
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-foreground/5 border-b border-foreground/5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <th className="px-5 py-3">Tournament</th>
                          <th className="px-5 py-3">Team</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Payment</th>
                          <th className="px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5 text-sm text-foreground">
                        {myRegs.map(reg => (
                          <tr key={reg._id} className="hover:bg-foreground/2 transition-colors">
                            <td className="px-5 py-4 font-black italic uppercase">{reg.tournamentName}</td>
                            <td className="px-5 py-4 font-bold text-slate-500">{reg.teamName}</td>
                            <td className="px-5 py-4"><StatusBadge status={reg.status} /></td>
                            <td className="px-5 py-4">
                              {reg.paymentVerified ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-500"><ShieldCheck className="w-3 h-3" />Verified</span>
                              ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500"><ShieldAlert className="w-3 h-3" />Pending</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-[10px] text-slate-400 font-bold">
                              {new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
