import { useState } from 'react';
import toast from 'react-hot-toast';

export const useUserActions = (fetchUsers: () => void) => {
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const handleToggleBan = async (email: string, currentStatus: boolean) => {
    setUpdatingUser(email);
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
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (email: string, setConfirmDelete: (v: any) => void) => {
    setUpdatingUser(email);
    try {
      const res = await fetch(`/api/admin/users/${email}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('User deleted permanently');
      setConfirmDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingUser(null);
    }
  };

  return { updatingUser, handleToggleBan, handleDeleteUser };
};
