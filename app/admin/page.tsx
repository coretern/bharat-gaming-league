'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Users, Trophy, Medal,
  Search, Download
} from "lucide-react";
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Types
import { Reg, SiteUser, Tournament, Winner } from '@/components/types/admin';

// Components
import RegistrationTable from '@/components/admin/Registrations/RegistrationTable';
import RegistrationDetailsModal from '@/components/admin/Registrations/RegistrationDetailsModal';
import RejectionModal from '@/components/admin/Registrations/RejectionModal';
import TournamentTable from '@/components/admin/Tournaments/TournamentTable';
import TournamentEditorModal from '@/components/admin/Tournaments/TournamentEditorModal';
import TournamentCreateModal from '@/components/admin/Tournaments/TournamentCreateModal';
import UserTable from '@/components/admin/Users/UserTable';
import WinnerTable from '@/components/admin/Winners/WinnerTable';
import WinnerAddModal from '@/components/admin/Winners/WinnerAddModal';
import ScreenshotModal from '@/components/admin/Shared/ScreenshotModal';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'Registrations' | 'Users' | 'Tournaments' | 'Winners'>('Registrations');
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  const [regFilter, setRegFilter] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [siteUsers, setSiteUsers] = useState<SiteUser[]>([]);
  const [liveTournaments, setLiveTournaments] = useState<Tournament[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingWinners, setLoadingWinners] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionOptions, setRejectionOptions] = useState({ qr: false, profiles: false, playerIndices: [] as number[], msg: "" });
  const [viewReg, setViewReg] = useState<Reg | null>(null);
  const [editTour, setEditTour] = useState<Tournament | null>(null);
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
    status: 'Open',
    allowedMatchTypes: ['Solo', 'Duo', 'Squad']
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
      const res = await fetch('/api/register', { cache: 'no-store' });
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
      const res = await fetch('/api/tournaments', { cache: 'no-store' });
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

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
      fetchUsers();
      fetchTournaments();
      loadWinnersData();
    }
  }, [isAdmin]);

  // Handlers
  const handleUpdateStatus = async (id: string, update: any) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Status updated!');
      setViewReg(null);
      setRejectingId(null);
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Are you ABSOLUTELY sure? This will delete the registration permanently.')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Registration deleted');
      setViewReg(null);
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleBan = async (email: string, currentStatus: boolean) => {
    setUpdating(email);
    try {
      const res = await fetch(`/api/admin/users/${email}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success(currentStatus ? 'User unbanned' : 'User banned');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (email: string) => {
    setUpdating(email);
    try {
      const res = await fetch(`/api/admin/users/${email}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('User deleted permanently');
      setConfirmDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
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

  const handleCreateTournament = async (e: React.FormEvent) => {
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

  const handleAddWinner = async (e: React.FormEvent) => {
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

  const handleDeleteWinner = async (id: string) => {
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

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center font-black italic uppercase text-lg animate-pulse">Checking credentials...</div>;
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 shadow-xl"><Users className="w-10 h-10" /></div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Admin Access Needed</h1>
        <p className="max-w-md text-slate-500 font-medium">This zone is restricted to authorized personnel only. Please sign in with an administrator account.</p>
        <button onClick={() => signIn('google')} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Sign In As Admin</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black pb-24 font-sans text-slate-900 dark:text-white">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32">
        {/* Stats Grid */}
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Section */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-purple/5 blur-2xl rounded-full transition-all group-hover:scale-150" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900 dark:bg-slate-800 p-1 mb-4 shadow-xl border-2 border-neon-purple/20">
                    <img src={session.user?.image || ''} alt="Admin" className="w-full h-full rounded-[1.2rem] object-cover" />
                  </div>
                  <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-1">{session.user?.name}</h1>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-neon-purple/10 text-neon-purple rounded-full">Elite Admin</span>
               </div>
            </div>

            <nav className="bg-white dark:bg-slate-900 rounded-[2rem] p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                {(['Registrations', 'Tournaments', 'Users', 'Winners'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`w-full h-14 rounded-2xl flex items-center gap-4 px-6 transition-all group ${
                            activeTab === tab ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-xl' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}>
                        {tab === 'Registrations' && <Users className={`w-5 h-5 ${activeTab === tab ? 'text-neon-purple' : 'group-hover:text-neon-purple'}`} />}
                        {tab === 'Tournaments' && <Trophy className={`w-5 h-5 ${activeTab === tab ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'}`} />}
                        {tab === 'Users' && <Users className={`w-5 h-5 ${activeTab === tab ? 'text-green-500' : 'group-hover:text-green-500'}`} />}
                        {tab === 'Winners' && <Medal className={`w-5 h-5 ${activeTab === tab ? 'text-amber-500' : 'group-hover:text-amber-500'}`} />}
                        <span className="text-xs font-black uppercase tracking-widest">{tab}</span>
                    </button>
                ))}
            </nav>
          </aside>

          {/* Main Content Space */}
          <div className="lg:col-span-3 space-y-6">
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
                            <input type="text" placeholder="Search by Team or Player..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none" />
                        </div>
                        <select value={regTourFilter} onChange={(e) => setRegTourFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                            <option value="All">All Tournaments</option>
                            {Array.from(new Set(registrations.map(r => r.tournamentName))).map(name => <option key={name} value={name}>{name}</option>)}
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
                            className="h-10 px-4 flex items-center gap-2 bg-green-500 text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                      </div>
                  </div>
                  <RegistrationTable 
                    registrations={registrations} 
                    loading={loading} 
                    regFilter={regFilter} 
                    regSearch={regSearch} 
                    regTourFilter={regTourFilter} 
                    setViewReg={setViewReg} 
                    deleteRegistration={handleDeleteRegistration} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'Users' && (
              <UserTable 
                users={siteUsers} 
                loading={loadingUsers} 
                updating={updating} 
                adminEmail={session.user?.email || undefined} 
                confirmDelete={confirmDelete} 
                onRefresh={fetchUsers} 
                onToggleBan={handleToggleBan} 
                onDeleteRequest={(email) => setConfirmDelete({ email, stage: 1 })} 
                onDeleteCancel={() => setConfirmDelete(null)} 
                onDeleteConfirm={(email, stage) => {
                  if (stage === 1) setConfirmDelete({ email, stage: 2 });
                  else handleDeleteUser(email);
                }} 
              />
            )}

            {activeTab === 'Tournaments' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">All Tournaments</h2>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search Tournaments..." value={tourSearch} onChange={(e) => setTourSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none" />
                        </div>
                        <select value={tourGameFilter} onChange={(e) => setTourGameFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                            <option value="All">All Games</option>
                            <option value="BGMI">BGMI</option>
                            <option value="Free Fire">Free Fire</option>
                        </select>
                        <select value={tourStatusFilter} onChange={(e) => setTourStatusFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none">
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Coming Soon">Coming Soon</option>
                        </select>
                        <button onClick={() => setShowCreateTour(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-purple text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95">
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                    </div>
                </div>
                <TournamentTable 
                  tournaments={liveTournaments} 
                  loading={loadingTours} 
                  tourSearch={tourSearch} 
                  tourGameFilter={tourGameFilter} 
                  tourStatusFilter={tourStatusFilter} 
                  onEdit={setEditTour} 
                />
              </div>
            )}

            {activeTab === 'Winners' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Tournament Winners ({winners.length})</h2>
                    <button onClick={() => setShowAddWinner(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-white rounded-xl text-xs font-black uppercase shadow-lg active:scale-95">
                        <Plus className="w-4 h-4" /> Add Winner
                    </button>
                </div>
                <WinnerTable winners={winners} loading={loadingWinners} onDelete={handleDeleteWinner} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals Section */}
      {previewImg && <ScreenshotModal url={previewImg} onClose={() => setPreviewImg(null)} />}
      
      {editTour && (
        <TournamentEditorModal 
          editTour={editTour} 
          setEditTour={setEditTour} 
          updating={updating} 
          onClose={() => setEditTour(null)} 
          onSave={handleSaveTournament} 
        />
      )}

      {showCreateTour && (
        <TournamentCreateModal 
          newTour={newTour} 
          setNewTour={setNewTour} 
          updating={updating} 
          onClose={() => setShowCreateTour(false)} 
          onSubmit={handleCreateTournament} 
        />
      )}

      {showAddWinner && (
        <WinnerAddModal 
          newWinner={newWinner} 
          setNewWinner={setNewWinner} 
          liveTournaments={liveTournaments} 
          updating={updating} 
          onClose={() => setShowAddWinner(false)} 
          onSubmit={handleAddWinner} 
        />
      )}

      {viewReg && (
          <RegistrationDetailsModal 
            viewReg={viewReg} 
            updating={updating} 
            onClose={() => setViewReg(null)} 
            onDelete={handleDeleteRegistration} 
            onApprove={(id) => handleUpdateStatus(id, { status: 'Approved' })} 
            onRejectRequest={(id) => {
              setRejectingId(id);
              setRejectionOptions({ qr: false, profiles: false, playerIndices: [], msg: "" });
            }} 
            onPreviewImage={setPreviewImg} 
          />
      )}

      {rejectingId && viewReg && (
          <RejectionModal 
            viewReg={viewReg} 
            rejectionOptions={rejectionOptions} 
            setRejectionOptions={setRejectionOptions} 
            onCancel={() => setRejectingId(null)} 
            onConfirm={(finalMsg, targets) => handleUpdateStatus(rejectingId, { status: 'Rejected', rejectionReason: finalMsg, rejectionTargets: targets, rejectionIndices: rejectionOptions.playerIndices, previousRejectionReason: viewReg.rejectionReason })} 
          />
      )}
      
      <Footer />
    </main>
  );
}
