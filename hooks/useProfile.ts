import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface SavedPlayer {
  name: string;
  uid: string;
  instagram: string;
}

export interface UserProfile {
  name: string;
  email: string;
  image: string;
  teamName: string;
  gameIGN: string;
  whatsapp: string;
  instagram: string;
  paymentQrUrl: string;
  profileScreenshotUrl: string;
  savedPlayers: SavedPlayer[];
}

const emptyProfile: UserProfile = {
  name: '', email: '', image: '',
  teamName: '', gameIGN: '', whatsapp: '', instagram: '',
  paymentQrUrl: '', profileScreenshotUrl: '',
  savedPlayers: [],
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
    } catch {
      // Profile not found is okay on first load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async (
    fields: Partial<UserProfile>,
    qrFile?: File | null,
    ssFile?: File | null,
    players?: SavedPlayer[]
  ) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', fields.name ?? profile.name);
      fd.append('teamName', fields.teamName ?? profile.teamName);
      fd.append('gameIGN', fields.gameIGN ?? profile.gameIGN);
      fd.append('whatsapp', fields.whatsapp ?? profile.whatsapp);
      fd.append('instagram', fields.instagram ?? profile.instagram);
      if (players) fd.append('savedPlayers', JSON.stringify(players));
      if (qrFile) fd.append('paymentQr', qrFile);
      if (ssFile) fd.append('profileScreenshot', ssFile);

      const res = await fetch('/api/profile', { method: 'PUT', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      setProfile(prev => ({ ...prev, ...data }));
      toast.success('Profile saved!');
      return data;
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, saveProfile, fetchProfile };
}
