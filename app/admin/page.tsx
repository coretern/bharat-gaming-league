'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Edit2, Trash2, Users, CheckCircle, ShieldCheck, ShieldAlert,
  X, ExternalLink, RefreshCw, Eye, ImageOff, ShieldOff, UserCheck, Clock, Info, Trophy, Medal,
  Search, Download, Filter
} from "lucide-react";
import toast from 'react-hot-toast';
import Image from 'next/image';
import * as XLSX from 'xlsx';

interface Player {
  name: string;
  uid: string;
  profileScreenshot: string;
  instagram?: string;
}

interface Reg {
  _id: string;
  tournamentName: string;
  matchType: string;
  teamName: string;
  userName: string;
  userEmail: string;
  userImage: string;
  players: Player[];
  whatsapp: string;
  instagram?: string;
  payoutDetails?: {
    qrCodeUrl: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  rejectionTargets?: string[];
  previousRejectionReason?: string;
  isResubmitted?: boolean;
  paymentVerified: boolean;
  orderId?: string;
  createdAt: string;
}

interface SiteUser {
  _id: string;
  email: string;
  name: string;
  image: string;
  createdAt: string;
  lastLogin?: string;
  loginCount: number;
  isBanned: boolean;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'Registrations' | 'Users' | 'Tournaments' | 'Winners'>('Registrations');
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [regFilter, setRegFilter] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [siteUsers, setSiteUsers] = useState<SiteUser[]>([]);
  const [liveTournaments, setLiveTournaments] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionOptions, setRejectionOptions] = useState({ qr: false, profiles: false, playerIndices: [] as number[], msg: "" });
  const [viewReg, setViewReg] = useState<Reg | null>(null);
  const [editTour, setEditTour] = useState<any | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ email: string, stage: number } | null>(null);
  const [showCreateTour, setShowCreateTour] = useState(false);
  const [newTour, setNewTour] = useState({
    title: '',
    game: 'BGMI',
    prizePool: '₹50,000',
    date: '',
    time: '08:00 PM',
    slots: '0/100',
    image: '/bgmi-thumb.png',
    status: 'Open'
  });

  const [showAddWinner, setShowAddWinner] = useState(false);
  const [newWinner, setNewWinner] = useState({
    tournamentId: '',
    tournamentName: '',
    playerName: '',
    teamName: '',
    amount: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  });

  // Filter States
  const [regSearch, setRegSearch] = useState('');
  const [regTourFilter, setRegTourFilter] = useState('All');
  const [tourSearch, setTourSearch] = useState('');
  const [tourGameFilter, setTourGameFilter] = useState('All');
  const [tourStatusFilter, setTourStatusFilter] = useState('All');

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

  const fetchTournaments = async () => {
    setLoadingTours(true);
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setLiveTournaments(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load tournaments');
    } finally {
      setLoadingTours(false);
    }
  };

  const loadWinnersData = async () => {
    setLoadingWinners(true);
    try {
      const res = await fetch('/api/admin/winners');
      const data = await res.json();
      setWinners(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load winners');
    } finally {
      setLoadingWinners(false);
    }
  };

  const exportToExcel = (data: any[], fileName: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
      toast.success('Excel exported successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const createTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating('new-tour');
    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success('Tournament created!');
      setShowCreateTour(false);
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
      fetchUsers();
      fetchTournaments();
      loadWinnersData();
    }
  }, [isAdmin]);

  const addWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating('new-winner');
    try {
      const res = await fetch('/api/admin/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWinner),
      });
      if (!res.ok) throw new Error('Failed to add');
      toast.success('Winner added!');
      setShowAddWinner(false);
      loadWinnersData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const deleteWinnerEntry = async (id: string) => {
    if (!confirm('Delete this winner?')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/winners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Winner removed');
      loadWinnersData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (email: string) => {
    setUpdating(email);
    try {
      const res = await fetch(`/api/admin/users/${email}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      toast.success('User deleted permanently');
      setConfirmDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const toggleBan = async (email: string, currentStatus: boolean) => {
    setUpdating(email);
    try {
      const res = await fetch(`/api/admin/users/${email}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      toast.success(currentStatus ? 'User unbanned' : 'User banned');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const saveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTour) return;
    setUpdating(editTour.id);
    try {
      const res = await fetch(`/api/admin/tournaments/${editTour.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTour),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Tournament updated!');
      setEditTour(null);
      fetchTournaments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you ABSOLUTELY sure? This will delete the registration permanently. This action cannot be undone.')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Registration deleted permanently');
      setViewReg(null);
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const updateStatus = async (id: string, payload: object) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Status updated');
      fetchRegistrations();
      setViewReg(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center font-black uppercase text-slate-400">Verifying Admin Access...</div>;
  if (!session || !isAdmin) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-red-500">Access Denied</div>;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 font-bold">
      <Navbar />

      <div className="container mx-auto px-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Users</p>
                <p className="text-4xl font-black italic tracking-tighter text-neon-cyan">{siteUsers.length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Registrations</p>
                <p className="text-4xl font-black italic tracking-tighter text-neon-purple">{registrations.length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending</p>
                <p className="text-4xl font-black italic tracking-tighter text-amber-500">{registrations.filter(r => r.status === 'Pending').length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Approved</p>
                <p className="text-4xl font-black italic tracking-tighter text-green-500">{registrations.filter(r => r.status === 'Approved').length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tournaments</p>
                <p className="text-4xl font-black italic tracking-tighter text-red-500">{liveTournaments.length}</p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0 space-y-2">
            {[
              { id: 'Registrations', icon: CheckCircle, count: registrations.length },
              { id: 'Users', icon: Users, count: siteUsers.length },
              { id: 'Tournaments', icon: Plus, count: liveTournaments.length },
              { id: 'Winners', icon: Medal, count: winners.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  activeTab === tab.id
                    ? 'bg-neon-purple/10 border-neon-purple text-neon-purple'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-black italic uppercase tracking-tight">{tab.id}</span>
                </div>
                {tab.count > 0 && (
                  <span className="w-6 h-6 rounded-full bg-neon-purple text-white text-[10px] flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Winners Tab */}
            {activeTab === 'Winners' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Tournament Winners ({winners.length})</h2>
                    <button onClick={() => setShowAddWinner(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-white rounded-xl text-xs font-black uppercase hover:bg-neon-cyan/90 transition-all shadow-lg active:scale-95">
                        <Plus className="w-4 h-4" /> Add Winner
                    </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th className="px-6 py-4">Winner/Team</th>
                        <th className="px-6 py-4">Tournament</th>
                        <th className="px-6 py-4">Prize</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loadingWinners ? (
                         <tr><td colSpan={4} className="py-24 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Loading Winners...</td></tr>
                      ) : winners.length === 0 ? (
                         <tr><td colSpan={4} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No winners recorded</td></tr>
                      ) : winners.map((win) => (
                        <tr key={win._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors text-sm">
                          <td className="px-6 py-4">
                            <p className="font-black italic uppercase text-foreground">{win.playerName}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{win.teamName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold">{win.tournamentName}</p>
                            <p className="text-[9px] text-neon-cyan font-black italic uppercase">{win.date}</p>
                          </td>
                          <td className="px-6 py-4 font-black italic text-neon-cyan">₹{win.amount}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => deleteWinnerEntry(win._id)} className="p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'Registrations' && (
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                    {(['Pending', 'Approved', 'Rejected'] as const).map(f => (
                        <button key={f} onClick={() => setRegFilter(f)} 
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${regFilter === f ? 'bg-white dark:bg-slate-700 text-neon-purple shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{regFilter} Registrations</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Manage and track all tournament entries</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by Team or Player..." 
                                value={regSearch}
                                onChange={(e) => setRegSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all"
                            />
                        </div>
                        <select 
                            value={regTourFilter} 
                            onChange={(e) => setRegTourFilter(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                        >
                            <option value="All">All Tournaments</option>
                            {Array.from(new Set(registrations.map(r => r.tournamentName))).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => {
                                const filtered = registrations
                                    .filter(r => r.status === regFilter)
                                    .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
                                    .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
                                    .map(r => ({
                                        'Team Name': r.teamName,
                                        'WhatsApp': r.whatsapp,
                                        'Tournament': r.tournamentName,
                                        'Type': r.matchType,
                                        'Status': r.status,
                                        'Payment': r.paymentVerified ? 'Verified' : 'Pending',
                                        'Date': new Date(r.createdAt).toLocaleString(),
                                        'Leader': r.players[0]?.name || 'N/A',
                                        'Leader UID': r.players[0]?.uid || 'N/A'
                                    }));
                                exportToExcel(filtered, 'Registrations');
                            }}
                            className="h-10 px-4 flex items-center gap-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase hover:bg-green-600 transition-all shadow-lg active:scale-95"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                      </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <th className="px-6 py-4">Team / Phone</th>
                          <th className="px-6 py-4">Leader / UID</th>
                          <th className="px-6 py-4">Tournament</th>
                          <th className="px-6 py-4 text-center">Payment</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                          <tr><td colSpan={5} className="py-24 text-center text-slate-400 text-xs font-black uppercase tracking-widest">Loading...</td></tr>
                        ) : registrations
                            .filter(r => r.status === regFilter)
                            .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
                            .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
                            .length === 0 ? (
                          <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No matches found</td></tr>
                        ) : registrations
                            .filter(r => r.status === regFilter)
                            .filter(r => r.teamName.toLowerCase().includes(regSearch.toLowerCase()) || r.players.some(p => p.name.toLowerCase().includes(regSearch.toLowerCase())))
                            .filter(r => regTourFilter === 'All' || r.tournamentName === regTourFilter)
                            .map((reg) => (
                          <tr key={reg._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-5">
                                <div>
                                    <p className="font-black italic uppercase text-foreground leading-none mb-1">{reg.teamName}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{reg.whatsapp}</p>
                                    {reg.isResubmitted && (
                                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-neon-purple text-white text-[7px] font-black uppercase animate-pulse">Resubmitted</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <p className="text-xs font-black uppercase italic text-foreground leading-none mb-1">{reg.players[0]?.name || reg.userName}</p>
                                <p className="text-[10px] text-neon-cyan font-bold uppercase tracking-tighter">{reg.players[0]?.uid || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-5">
                                <p className="text-xs text-foreground font-bold leading-none mb-1">{reg.tournamentName}</p>
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{reg.matchType}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                                    reg.paymentVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                    {reg.paymentVerified ? 'Verified' : 'Pending'}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setViewReg(reg)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-neon-purple transition-all" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      deleteRegistration(reg._id);
                                  }} 
                                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                  title="Delete Permanent"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Users' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Website Users ({siteUsers.length} Total)</h2>
                    <button onClick={fetchUsers} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400">
                        <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
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
                      {siteUsers.map((user) => (
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
                              {/* Ban Toggle */}
                              <button
                                onClick={() => toggleBan(user.email, user.isBanned)}
                                disabled={updating === user.email || (session?.user as any)?.email === user.email}
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
                                <button onClick={() => setConfirmDelete(null)} className="text-[10px] text-slate-400 hover:text-slate-600">Cancel</button>
                                <button onClick={() => {
                                  if (confirmDelete.stage === 1) setConfirmDelete({ ...confirmDelete, stage: 2 });
                                  else deleteUser(user.email);
                                }} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                                  confirmDelete.stage === 1 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-red-500 text-white shadow-lg scale-105'
                                }`}>
                                  {confirmDelete.stage === 1 ? 'Confirm?' : 'Final Confirm!'}
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setConfirmDelete({ email: user.email, stage: 1 })}
                                disabled={(session?.user as any)?.email === user.email}
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
            )}

            {activeTab === 'Tournaments' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">All Tournaments</h2>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search Tournaments..." 
                                value={tourSearch}
                                onChange={(e) => setTourSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                            />
                        </div>
                        <select 
                            value={tourGameFilter} 
                            onChange={(e) => setTourGameFilter(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                        >
                            <option value="All">All Games</option>
                            <option value="BGMI">BGMI</option>
                            <option value="Free Fire">Free Fire</option>
                        </select>
                        <select 
                            value={tourStatusFilter} 
                            onChange={(e) => setTourStatusFilter(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Coming Soon">Coming Soon</option>
                        </select>
                        <button 
                            onClick={() => {
                                const filtered = liveTournaments
                                    .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
                                    .filter(t => tourGameFilter === 'All' || t.game === tourGameFilter)
                                    .filter(t => tourStatusFilter === 'All' || t.status === tourStatusFilter)
                                    .map(t => ({
                                        'Title': t.title,
                                        'Game': t.game,
                                        'Prize Pool': t.prizePool,
                                        'Date': t.date,
                                        'Time': t.time,
                                        'Slots': t.slots,
                                        'Status': t.status
                                    }));
                                exportToExcel(filtered, 'Tournaments');
                            }}
                            className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95"
                            title="Export to Excel"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowCreateTour(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-xl text-xs font-black uppercase hover:bg-neon-purple/90 transition-all shadow-lg active:scale-95">
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th className="px-5 py-3">Tournament</th>
                        <th className="px-5 py-3">Game</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Prize</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 border-x border-slate-100 dark:border-slate-800">
                      {loadingTours ? (
                        <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold">Loading tournaments...</td></tr>
                      ) : liveTournaments
                        .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
                        .filter(t => tourGameFilter === 'All' || t.game === tourGameFilter)
                        .filter(t => tourStatusFilter === 'All' || t.status === tourStatusFilter)
                        .length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No tournaments found</td></tr>
                      ) : liveTournaments
                        .filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()))
                        .filter(t => tourGameFilter === 'All' || t.game === tourGameFilter)
                        .filter(t => tourStatusFilter === 'All' || t.status === tourStatusFilter)
                        .map((t) => (
                        <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-5 py-5 text-sm">
                            <p className="font-black text-foreground italic uppercase">{t.title}</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                              t.status === 'Open' ? 'bg-green-100 text-green-600' :
                              t.status === 'Closed' ? 'bg-red-100 text-red-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>{t.status}</span>
                          </td>
                          <td className="px-5 py-5 text-xs text-slate-500 font-bold">
                            <span className="text-foreground">{t.game}</span>
                          </td>
                          <td className="px-5 py-5 text-xs text-slate-500 font-semibold">{t.date}</td>
                          <td className="px-5 py-5 text-xs font-bold text-neon-cyan">{t.prizePool}</td>
                          <td className="px-5 py-5 text-right">
                            <button onClick={() => setEditTour(t)} className="p-1.5 rounded-lg bg-foreground/5 text-slate-500 hover:text-neon-cyan border border-foreground/5 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
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

      {/* Edit Tournament Modal */}
      {editTour && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditTour(null)}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
                <button onClick={() => setEditTour(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
                
                <header className="mb-6">
                    <h2 className="text-2xl font-black italic uppercase text-foreground">Edit Tournament</h2>
                    <p className="text-xs text-slate-500 font-bold">{editTour.id}</p>
                </header>

                <form onSubmit={saveTournament} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Title</label>
                            <input required value={editTour.title} onChange={e => setEditTour({...editTour, title: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Game</label>
                            <select value={editTour.game} onChange={e => setEditTour({...editTour, game: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none">
                                <option value="BGMI">BGMI</option>
                                <option value="Free Fire">Free Fire</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Status</label>
                            <select value={editTour.status} onChange={e => setEditTour({...editTour, status: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none">
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Coming Soon">Coming Soon</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Pool</label>
                            <input required value={editTour.prizePool} onChange={e => setEditTour({...editTour, prizePool: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Slots</label>
                            <input required value={editTour.slots} onChange={e => setEditTour({...editTour, slots: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date</label>
                            <input required value={editTour.date} onChange={e => setEditTour({...editTour, date: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Time</label>
                            <input required value={editTour.time} onChange={e => setEditTour({...editTour, time: e.target.value})} className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none" />
                        </div>
                    </div>
                    
                    <button type="submit" disabled={updating === editTour.id}
                        className="w-full h-12 rounded-xl bg-neon-purple text-white font-black uppercase text-xs hover:bg-neon-purple/90 disabled:opacity-50 transition-all shadow-lg active:scale-95">
                        {updating === editTour.id ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
          </div>
      )}

      {/* Registration Details Modal */}
      {viewReg && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setViewReg(null)}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative mt-10 mb-10 overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase text-foreground leading-none">Team <span className="text-neon-purple">{viewReg.teamName}</span></h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-500">{viewReg.tournamentName}</span>
                            <span className="px-3 py-1 bg-neon-cyan/10 rounded-full text-[10px] font-black uppercase text-neon-cyan">{viewReg.matchType}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                viewReg.status === 'Approved' ? 'bg-green-500 text-white' :
                                viewReg.status === 'Rejected' ? 'bg-red-500 text-white' :
                                'bg-neon-purple text-white'
                            }`}>
                                {viewReg.isResubmitted && viewReg.status === 'Pending' ? 'Resubmitted' : viewReg.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => deleteRegistration(viewReg._id)}
                            disabled={updating === viewReg._id}
                            className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                            title="Delete Permanently"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setViewReg(null)} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Players Info */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Squad Members</h3>
                        <div className="grid gap-3">
                            {viewReg.players.map((p, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-foreground text-sm">{p.name}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[10px] text-neon-cyan font-black">{p.uid}</p>
                                                {p.instagram && (
                                                    <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] text-neon-purple hover:underline flex items-center gap-0.5">
                                                        <ExternalLink className="w-2.5 h-2.5" /> Instagram
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {p.profileScreenshot && (
                                            <button onClick={() => setPreviewImg(p.profileScreenshot)} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-neon-purple transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-6">
                        {/* Registration Stats */}
                        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2">Registration Info</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</span>
                                    <a href={`https://wa.me/${viewReg.whatsapp}`} target="_blank" className="text-xs font-black text-neon-cyan hover:underline">{viewReg.whatsapp}</a>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Registered On</span>
                                    <span className="text-xs font-black text-foreground">{new Date(viewReg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Payment Status</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${viewReg.paymentVerified ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {viewReg.paymentVerified ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                                {viewReg.orderId && (
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Order ID</span>
                                        <span className="text-[10px] font-black text-slate-400 select-all tracking-tighter">{viewReg.orderId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30">
                            <h4 className="text-[10px] font-black uppercase text-amber-600 mb-3 tracking-widest">Payout Details (QR)</h4>
                            {viewReg.payoutDetails?.qrCodeUrl ? (
                                <button onClick={() => setPreviewImg(viewReg.payoutDetails!.qrCodeUrl!)} 
                                    className="mt-4 w-full h-10 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-[10px] font-black uppercase text-amber-600 flex items-center justify-center gap-2 hover:bg-amber-100 transition-all">
                                    <Eye className="w-3 h-3" /> View QR Scanner
                                </button>
                            ) : (
                                <p className="text-[10px] font-bold text-amber-600/50 italic">No QR Code provided</p>
                            )}
                        </div>

                        {viewReg.status === 'Rejected' && viewReg.rejectionReason && (
                            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <h4 className="text-[10px] font-black uppercase text-amber-600 mb-2">Current Rejection Reason</h4>
                                <p className="text-xs font-bold text-slate-500 italic">"{viewReg.rejectionReason}"</p>
                            </div>
                        )}

                        {viewReg.previousRejectionReason && (
                            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                                <h4 className="text-[10px] font-black uppercase text-red-500 mb-2">Previous Rejection Reason</h4>
                                <p className="text-xs font-bold text-slate-500 italic">"{viewReg.previousRejectionReason}"</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                                onClick={() => updateStatus(viewReg._id, { status: 'Approved' })}
                                className="flex-1 h-12 rounded-xl bg-green-500 text-white font-black uppercase text-xs hover:bg-green-600 disabled:opacity-50 shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                                Approve
                            </button>
                            <div className="flex-1 space-y-3">
                                {rejectingId === viewReg._id ? (
                                    <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-900/5 border border-red-200 dark:border-red-900/20 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <header className="flex justify-between items-center">
                                            <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Rejection Suite</p>
                                            <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[8px] font-black">ACTION REQUIRED</span>
                                        </header>

                                         <div className="space-y-4">
                                            {/* Payout Issue */}
                                            <label className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                                                rejectionOptions.qr ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-red-200'
                                            }`}>
                                                <input type="checkbox" checked={rejectionOptions.qr} 
                                                    onChange={e => setRejectionOptions({...rejectionOptions, qr: e.target.checked})}
                                                    className="w-4 h-4 rounded-full border-2 border-current bg-transparent checked:bg-white accent-white hidden" />
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${rejectionOptions.qr ? 'border-white bg-white' : 'border-slate-200 dark:border-slate-700'}`}>
                                                    {rejectionOptions.qr && <CheckCircle className="w-3.5 h-3.5 text-red-500" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase leading-tight">Payout QR Issue</span>
                                                    <span className={`text-[8px] font-bold ${rejectionOptions.qr ? 'text-white/80' : 'text-slate-400'}`}>Screenshot not clear or incorrect</span>
                                                </div>
                                            </label>

                                            {/* Player Issues */}
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Player Proof Issues:</p>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {viewReg.players.map((p, idx) => (
                                                        <label key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                                                            rejectionOptions.playerIndices.includes(idx) ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-amber-200'
                                                        }`}>
                                                            <input type="checkbox" 
                                                                checked={rejectionOptions.playerIndices.includes(idx)}
                                                                onChange={e => {
                                                                    const newIndices = e.target.checked 
                                                                        ? [...rejectionOptions.playerIndices, idx]
                                                                        : rejectionOptions.playerIndices.filter(i => i !== idx);
                                                                    setRejectionOptions({
                                                                        ...rejectionOptions, 
                                                                        playerIndices: newIndices,
                                                                        profiles: newIndices.length > 0
                                                                    });
                                                                }}
                                                                className="hidden" />
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${rejectionOptions.playerIndices.includes(idx) ? 'border-white bg-white' : 'border-slate-200 dark:border-slate-700'}`}>
                                                                {rejectionOptions.playerIndices.includes(idx) && <X className="w-3.5 h-3.5 text-amber-500" />}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase leading-tight">{p.name}</span>
                                                                <span className={`text-[8px] font-bold ${rejectionOptions.playerIndices.includes(idx) ? 'text-white/80' : 'text-slate-400'}`}>{p.uid}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase text-slate-400 ml-1">Additional Message:</p>
                                            <textarea 
                                                placeholder="Explain what exactly needs fixing..."
                                                value={rejectionOptions.msg}
                                                onChange={e => setRejectionOptions({...rejectionOptions, msg: e.target.value})}
                                                className="w-full h-24 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    const targets = [];
                                                    let finalMsg = rejectionOptions.msg;
                                                    if (rejectionOptions.qr) targets.push('qr');
                                                    if (rejectionOptions.playerIndices.length > 0) {
                                                        targets.push('profiles');
                                                        const names = rejectionOptions.playerIndices.map(i => viewReg.players[i].name).join(', ');
                                                        if (!finalMsg) finalMsg = `Check profile screens for: ${names}`;
                                                        else finalMsg = `[Profile Issue: ${names}] ${finalMsg}`;
                                                    }
                                                    updateStatus(viewReg._id, { 
                                                        status: 'Rejected', 
                                                        rejectionReason: finalMsg,
                                                        rejectionTargets: targets,
                                                        rejectionIndices: rejectionOptions.playerIndices
                                                     });
                                                     setRejectingId(null);
                                                }}
                                                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase hover:bg-red-600 transition-all font-bold">
                                                Confirm Reject
                                            </button>
                                            <button onClick={() => setRejectingId(null)} className="px-4 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase text-slate-500 font-bold">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button disabled={updating === viewReg._id || viewReg.status === 'Approved'}
                                        onClick={() => {
                                            setRejectingId(viewReg._id);
                                            setRejectionOptions({ qr: false, profiles: false, playerIndices: [], msg: "" });
                                        }}
                                        className="w-full h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-xs hover:bg-red-500/20 disabled:opacity-50 transition-all active:scale-95">
                                        {viewReg.status === 'Rejected' ? 'Update Rejection' : 'Reject Registration'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      )}

      {/* Screenshot Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImg(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors">
              <X className="w-7 h-7" />
            </button>
            <img src={previewImg} alt="Registration Screenshot" className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]" />
            <a href={previewImg} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" /> Open Full Size
            </a>
          </div>
        </div>
      )}
      {/* Add Winner Modal */}
      {showAddWinner && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowAddWinner(false)}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowAddWinner(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
                <header className="mb-6">
                    <h2 className="text-2xl font-black italic uppercase text-foreground">Add Tournament <span className="text-neon-cyan">Winner</span></h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">Record a new champion</p>
                </header>

                <form onSubmit={addWinner} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">1. Select Tournament</label>
                            <select 
                                required 
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                onChange={(e) => {
                                    const t = liveTournaments.find(x => x.id === e.target.value);
                                    if (t) setNewWinner({...newWinner, tournamentId: t.id, tournamentName: t.title});
                                }}
                            >
                                <option value="">Choose a tournament...</option>
                                {liveTournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">2. Auto-Fill from Registration</label>
                            <select 
                                disabled={!newWinner.tournamentId}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all disabled:opacity-50"
                                onChange={(e) => {
                                    const reg = registrations.find(r => r._id === e.target.value);
                                    if (reg) {
                                        setNewWinner({
                                            ...newWinner,
                                            playerName: reg.players[0]?.name || reg.userName,
                                            teamName: reg.teamName
                                        });
                                    }
                                }}
                            >
                                <option value="">Select a team...</option>
                                {registrations
                                    .filter(r => r.tournamentId === newWinner.tournamentId)
                                    .map(r => (
                                        <option key={r._id} value={r._id}>
                                            {r.teamName} ({r.players[0]?.name || r.userName})
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Player Name</label>
                            <input required placeholder="eg. KillerYT" value={newWinner.playerName} onChange={e => setNewWinner({...newWinner, playerName: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Team Name</label>
                            <input required placeholder="eg. Team Alpha" value={newWinner.teamName} onChange={e => setNewWinner({...newWinner, teamName: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Amount (₹)</label>
                            <input required type="number" placeholder="eg. 500" value={newWinner.amount} onChange={e => setNewWinner({...newWinner, amount: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date</label>
                            <input required placeholder="eg. 18 Oct 2026" value={newWinner.date} onChange={e => setNewWinner({...newWinner, date: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                    </div>

                    <button type="submit" disabled={updating === 'new-winner'}
                        className="w-full h-14 mt-6 rounded-2xl bg-neon-cyan text-white font-black uppercase text-sm tracking-widest hover:bg-neon-cyan/90 disabled:opacity-50 transition-all shadow-lg active:scale-95">
                        {updating === 'new-winner' ? 'Recording...' : 'Publish Winner'}
                    </button>
                </form>
            </div>
        </div>
      )}
      {/* Create Tournament Modal */}
      {showCreateTour && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowCreateTour(false)}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 relative mt-10 mb-10" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowCreateTour(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X className="w-6 h-6" /></button>
                <header className="mb-6">
                    <h2 className="text-2xl font-black italic uppercase text-foreground">Launch New <span className="text-neon-purple">Tournament</span></h2>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">Start a new gaming event</p>
                </header>

                <form onSubmit={createTournament} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Tournament Title</label>
                        <input required placeholder="eg. BGMI Winter Cup" value={newTour.title} onChange={e => setNewTour({...newTour, title: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Select Game</label>
                            <select value={newTour.game} onChange={e => setNewTour({...newTour, game: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold">
                                <option value="BGMI">BGMI</option>
                                <option value="Free Fire">Free Fire</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Prize Pool</label>
                            <input required placeholder="eg. ₹1,00,000" value={newTour.prizePool} onChange={e => setNewTour({...newTour, prizePool: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Date</label>
                            <input required placeholder="eg. 25 Oct 2026" value={newTour.date} onChange={e => setNewTour({...newTour, date: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Time</label>
                            <input required placeholder="eg. 09:00 PM" value={newTour.time} onChange={e => setNewTour({...newTour, time: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Total Slots</label>
                            <input required placeholder="eg. 0/100" value={newTour.slots} onChange={e => setNewTour({...newTour, slots: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Status</label>
                            <select value={newTour.status} onChange={e => setNewTour({...newTour, status: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold">
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Coming Soon">Coming Soon</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Thumbnail URL</label>
                        <input required placeholder="/bgmi-thumb.png" value={newTour.image} onChange={e => setNewTour({...newTour, image: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold" />
                        <p className="text-[8px] text-slate-400 mt-1 italic uppercase">Default thumbnails: /bgmi-thumb.png or /ff-thumb.png</p>
                    </div>

                    <button type="submit" disabled={updating === 'new-tour'}
                        className="w-full h-14 mt-6 rounded-2xl bg-neon-purple text-white font-black uppercase text-sm tracking-widest hover:bg-neon-purple/90 disabled:opacity-50 transition-all shadow-lg active:scale-95">
                        {updating === 'new-tour' ? 'Creating...' : 'Launch Tournament'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </main>
  );
}
