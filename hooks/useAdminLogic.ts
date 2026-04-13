import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Reg, SiteUser, Tournament, Winner } from '@/components/types/admin';

// Sub-hooks
import { useTournamentActions } from './admin/useTournamentActions';
import { useUserActions } from './admin/useUserActions';
import { useRegistrationActions } from './admin/useRegistrationActions';
import { useWinnerActions } from './admin/useWinnerActions';

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
    tourStatusFilter, setTourStatusFilter, isAdmin, fetchUsers,
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
    handleDeleteWinner: wActions.handleDeleteWinner
  };
};
