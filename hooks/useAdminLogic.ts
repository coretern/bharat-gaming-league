import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Reg, SiteUser, Tournament, Winner } from '@/components/types/admin';

// Sub-hooks
import { useTournamentActions } from './admin/useTournamentActions';
import { useUserActions } from './admin/useUserActions';
import { useRegistrationActions } from './admin/useRegistrationActions';
import { useWinnerActions } from './admin/useWinnerActions';

export const useAdminLogic = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize from URL or default to Registrations
  const initialTab = (searchParams.get('tab') as any) || 'Registrations';
  const [activeTab, setActiveTabState] = useState<'Registrations' | 'Users' | 'Tournaments' | 'Winners' | 'Media'>(initialTab);

  // Wrapper to update URL when tab changes
  const setActiveTab = (tab: 'Registrations' | 'Users' | 'Tournaments' | 'Winners' | 'Media') => {
    setActiveTabState(tab);
    // Update URL without full refresh
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/admin?${params.toString()}`, { scroll: false });
  };
  const [registrations, setRegistrations] = useState<Reg[]>([]);
  
  // Initialize filter from URL or default to Pending
  const initialFilter = (searchParams.get('filter') as any) || 'Pending';
  const [regFilter, setRegFilterState] = useState<'Pending' | 'Approved' | 'Rejected'>(initialFilter);

  // Wrapper to update URL when filter changes
  const setRegFilter = (filter: 'Pending' | 'Approved' | 'Rejected') => {
    setRegFilterState(filter);
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', filter);
    router.push(`/admin?${params.toString()}`, { scroll: false });
  };

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
  const [confirmDelete, setConfirmDelete] = useState<{ email: string, stage: number } | null>(null);
  const [confirmBan, setConfirmBan] = useState<{ email: string, stage: number } | null>(null);
  const [showCreateTour, setShowCreateTour] = useState(false);
  const [newTour, setNewTour] = useState({ title: '', game: 'BGMI', prizePool: '₹50,000', date: '', time: '08:00 PM', slots: '0/100', image: '/bgmi-thumb.png', status: 'Open', allowedMatchTypes: ['Solo', 'Duo', 'Squad'] });
  const [showAddWinner, setShowAddWinner] = useState(false);
  const [newWinner, setNewWinner] = useState({ tournamentId: '', tournamentName: '', playerName: '', teamName: '', amount: '', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
  const [regSearch, setRegSearch] = useState('');
  const [regTourFilter, setRegTourFilter] = useState('All');
  const [tourSearch, setTourSearch] = useState('');
  const [tourGameFilter, setTourGameFilter] = useState('All');
  const [tourStatusFilter, setTourStatusFilter] = useState('All');
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'All' | 'Profile' | 'Payout'>('All');

  const isAdmin = (session?.user as any)?.isAdmin === true;

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/register', { cache: 'no-store' });
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load registrations'); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setSiteUsers(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load users'); } finally { setLoadingUsers(false); }
  };

  const fetchTournaments = async () => {
    setLoadingTours(true);
    try {
      const res = await fetch('/api/tournaments', { cache: 'no-store' });
      const data = await res.json();
      setLiveTournaments(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load tournaments'); } finally { setLoadingTours(false); }
  };

  const loadWinnersData = async () => {
    setLoadingWinners(true);
    try {
      const res = await fetch('/api/admin/winners');
      const data = await res.json();
      setWinners(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load winners'); } finally { setLoadingWinners(false); }
  };

  useEffect(() => {
    if (isAdmin) { fetchRegistrations(); fetchUsers(); fetchTournaments(); loadWinnersData(); }
  }, [isAdmin]);

  const tActions = useTournamentActions(fetchTournaments);
  const rActions = useRegistrationActions(fetchRegistrations);
  const uActions = useUserActions(fetchUsers);
  const wActions = useWinnerActions(loadWinnersData);

  const updating = tActions.updating || rActions.updatingReg || uActions.updatingUser || wActions.updatingWinner;

  return {
    session, status, activeTab, setActiveTab, registrations, regFilter, setRegFilter, siteUsers, liveTournaments, winners,
    loading, loadingUsers, loadingTours, loadingWinners, previewImg, setPreviewImg, rejectingId, setRejectingId,
    rejectionOptions, setRejectionOptions, viewReg, setViewReg, editTour, setEditTour, updating, confirmDelete, setConfirmDelete,
    confirmBan, setConfirmBan,
    showCreateTour, setShowCreateTour, newTour, setNewTour, showAddWinner, setShowAddWinner, newWinner, setNewWinner,
    regSearch, setRegSearch, regTourFilter, setRegTourFilter, tourSearch, setTourSearch, tourGameFilter, setTourGameFilter,
    tourStatusFilter, setTourStatusFilter, isAdmin, 
    fetchUsers, fetchRegistrations, fetchTournaments, loadWinnersData,
    handleUpdateStatus: (id: string, update: any) => rActions.handleUpdateStatus(id, update, setViewReg, setRejectingId),
    handleDeleteRegistration: (id: string) => rActions.handleDeleteRegistration(id, setViewReg),
    handleToggleBan: (email: string, currentStatus: boolean) => {
      // If unbanning, just do it
      if (currentStatus) {
        uActions.handleToggleBan(email, currentStatus);
        return;
      }
      
      // If first attempt to ban
      if (!confirmBan || confirmBan.email !== email) {
        setConfirmBan({ email, stage: 1 });
        return;
      }

      // If second attempt to ban
      if (confirmBan.stage === 1) {
        setConfirmBan({ email, stage: 2 });
        return;
      }

      // Third attempt (Final confirmation)
      uActions.handleToggleBan(email, currentStatus);
      setConfirmBan(null);
    },
    handleDeleteUser: (email: string) => uActions.handleDeleteUser(email, setConfirmDelete),
    handleSaveTournament: (e: any) => { e.preventDefault(); tActions.handleSaveTournament(editTour, setEditTour); },
    handleCreateTournament: (e: any) => { e.preventDefault(); tActions.handleCreateTournament(newTour, setShowCreateTour); },
    handleAddWinner: (e: any) => { e.preventDefault(); wActions.handleAddWinner(newWinner, setShowAddWinner); },
    handleDeleteWinner: wActions.handleDeleteWinner,
    onSyncGroups: async () => {
      try {
        const res = await fetch('/api/admin/sync-groups');
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          await fetchRegistrations();
        } else {
          toast.error(data.error || 'Sync failed');
        }
      } catch {
        toast.error('Network error during sync');
      }
    },
    mediaList: registrations.flatMap(reg => {
      const items: any[] = [];
      if (reg.payoutDetails?.qrCodeUrl) {
        items.push({ url: reg.payoutDetails.qrCodeUrl, type: 'Payout', regId: reg._id, fieldKey: 'qr', teamName: reg.teamName, createdAt: reg.createdAt });
      }
      reg.players.forEach((p, idx) => {
        if (p.profileScreenshot) {
          items.push({ url: p.profileScreenshot, type: 'Profile', regId: reg._id, fieldKey: `p${idx}`, teamName: reg.teamName, playerName: p.name, createdAt: reg.createdAt });
        }
      });
      return items;
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(m => mediaTypeFilter === 'All' || m.type === mediaTypeFilter)
    .filter(m => !mediaSearch || m.teamName.toLowerCase().includes(mediaSearch.toLowerCase()) || m.playerName?.toLowerCase().includes(mediaSearch.toLowerCase())),
    mediaSearch, setMediaSearch, mediaTypeFilter, setMediaTypeFilter,
    handleDeleteMedia: async (regId: string, fieldKey: string) => {
      if (!confirm('Are you sure you want to delete this photo? User will have to re-upload it.')) return;
      try {
        const res = await fetch('/api/admin/media', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ regId, fieldKey })
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Media deleted successfully');
          await fetchRegistrations();
        } else {
          toast.error(data.error || 'Failed to delete');
        }
      } catch { toast.error('Network error'); }
    }
  };
};
