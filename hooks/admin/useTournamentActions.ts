import { useState } from 'react';
import toast from 'react-hot-toast';

export const useTournamentActions = (fetchTournaments: () => void) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleSaveTournament = async (editTour: any, setEditTour: (v: any) => void) => {
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

  const handleCreateTournament = async (newTour: any, setShowCreateTour: (v: boolean) => void) => {
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

  return { updating, handleSaveTournament, handleCreateTournament };
};
