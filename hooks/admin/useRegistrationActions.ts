import { useState } from 'react';
import toast from 'react-hot-toast';

export const useRegistrationActions = (fetchRegistrations: () => void) => {
  const [updatingReg, setUpdatingReg] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, update: any, setViewReg: (v: any) => void, setRejectingId: (v: any) => void) => {
    setUpdatingReg(id);
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
      setUpdatingReg(null);
    }
  };

  const handleDeleteRegistration = async (id: string, setViewReg: (v: any) => void) => {
    if (!confirm('Are you ABSOLUTELY sure? This will delete the registration permanently.')) return;
    setUpdatingReg(id);
    try {
      const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Registration deleted');
      setViewReg(null);
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingReg(null);
    }
  };

  return { updatingReg, handleUpdateStatus, handleDeleteRegistration };
};
