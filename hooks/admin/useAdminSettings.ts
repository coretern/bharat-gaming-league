import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface AdminUser {
  name: string;
  email: string;
  image: string;
  isSuperAdmin: boolean;
}

export function useAdminSettings() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointing, setAppointing] = useState(false);
  const [revokingEmail, setRevokingEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      if (!res.ok) throw new Error('Failed to fetch administrators');
      const data = await res.json();
      setAdmins(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const appointAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setAppointing(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), action: 'appoint' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to appoint administrator');

      toast.success(data.message || 'Administrator appointed successfully!');
      setEmailInput('');
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAppointing(false);
    }
  };

  const revokeAdmin = async (email: string) => {
    if (window.confirm(`Are you sure you want to revoke admin privileges from ${email}?`)) {
      if (!window.confirm(`⚠ FINAL WARNING: This user will immediately lose access to all admin panel controls. Are you absolutely sure?`)) {
        return;
      }
    } else {
      return;
    }

    setRevokingEmail(email);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'revoke' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke privileges');

      toast.success(data.message || 'Privileges revoked successfully');
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRevokingEmail(null);
    }
  };

  return {
    admins,
    loading,
    appointing,
    revokingEmail,
    emailInput,
    setEmailInput,
    appointAdmin,
    revokeAdmin,
    refreshAdmins: fetchAdmins,
  };
}
