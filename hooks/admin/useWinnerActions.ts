import { useState } from 'react';
import toast from 'react-hot-toast';

export const useWinnerActions = (loadWinnersData: () => void) => {
  const [updatingWinner, setUpdatingWinner] = useState<string | null>(null);

  const handleAddWinner = async (newWinner: any, setShowAddWinner: (v: boolean) => void) => {
    setUpdatingWinner('new-winner');
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
      setUpdatingWinner(null);
    }
  };

  const handleDeleteWinner = async (id: string) => {
    if (!confirm('Delete this winner?')) return;
    setUpdatingWinner(id);
    try {
      const res = await fetch(`/api/admin/winners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Winner removed');
      loadWinnersData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingWinner(null);
    }
  };

  return { updatingWinner, handleAddWinner, handleDeleteWinner };
};
