import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Reg, SiteUser, Tournament, Winner } from '@/components/types/admin';

export const useAdminLogic = () => {
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

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
      fetchUsers();
      fetchTournaments();
      loadWinnersData();
    }
  }, [isAdmin]);

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

  return {
    session,
    status,
    activeTab,
    setActiveTab,
    registrations,
    regFilter,
    setRegFilter,
    siteUsers,
    liveTournaments,
    winners,
    loading,
    loadingUsers,
    loadingTours,
    loadingWinners,
    previewImg,
    setPreviewImg,
    rejectingId,
    setRejectingId,
    rejectionOptions,
    setRejectionOptions,
    viewReg,
    setViewReg,
    editTour,
    setEditTour,
    updating,
    confirmDelete,
    setConfirmDelete,
    showCreateTour,
    setShowCreateTour,
    newTour,
    setNewTour,
    showAddWinner,
    setShowAddWinner,
    newWinner,
    setNewWinner,
    regSearch,
    setRegSearch,
    regTourFilter,
    setRegTourFilter,
    tourSearch,
    setTourSearch,
    tourGameFilter,
    setTourGameFilter,
    tourStatusFilter,
    setTourStatusFilter,
    isAdmin,
    fetchUsers,
    handleUpdateStatus,
    handleDeleteRegistration,
    handleToggleBan,
    handleDeleteUser,
    handleSaveTournament,
    handleCreateTournament,
    handleAddWinner,
    handleDeleteWinner
  };
};
