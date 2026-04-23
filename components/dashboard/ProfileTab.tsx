'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useProfile, SavedPlayer } from '@/hooks/useProfile';
import { Loader2, Save, Gamepad2, User2, Users, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { EditBtn, Section, InfoField, ProfileInput, UploadField } from './ProfileComponents';

interface ProfileTabProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export default function ProfileTab({ user }: ProfileTabProps) {
  const { profile, loading, saving, saveProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.name || '');

  const [teamName, setTeamName] = useState('');
  const [gameIGN, setGameIGN] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [savedPlayers, setSavedPlayers] = useState<SavedPlayer[]>([]);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState('');

  const qrRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      setDisplayName(profile.name || user.name || '');
      setTeamName(profile.teamName); setGameIGN(profile.gameIGN);
      setWhatsapp(profile.whatsapp); setInstagram(profile.instagram);
      setSavedPlayers(profile.savedPlayers?.length ? profile.savedPlayers : []);
    }
  }, [loading, profile]);

  const handleSave = async () => {
    await saveProfile({ name: displayName, teamName, gameIGN, whatsapp, instagram }, qrFile, undefined, savedPlayers);
    setQrFile(null); setQrPreview('');
    setEditing(false);
  };

  const handleCancel = () => {
    setDisplayName(profile.name || user.name || '');
    setTeamName(profile.teamName); setGameIGN(profile.gameIGN);
    setWhatsapp(profile.whatsapp); setInstagram(profile.instagram);
    setSavedPlayers(profile.savedPlayers?.length ? profile.savedPlayers : []);
    setQrFile(null); setQrPreview('');
    setEditing(false);
  };

  const addPlayer = () => setSavedPlayers(prev => [...prev, { name: '', uid: '', instagram: '' }]);
  const removePlayer = (i: number) => setSavedPlayers(prev => prev.filter((_, idx) => idx !== i));
  const updatePlayer = (i: number, field: keyof SavedPlayer, val: string) => {
    setSavedPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-google-blue" /></div>;

  const qrDisplay = qrPreview || profile.paymentQrUrl;
  const isEmpty = !profile.teamName && !profile.gameIGN && !profile.whatsapp;
  const isEditable = editing || isEmpty;
  const pencil = !isEditable ? <EditBtn onClick={() => setEditing(true)} /> : undefined;

  return (
    <div className="space-y-5">
      {/* Personal Info */}
      <Section icon={<User2 className="w-4 h-4" />} title="Personal Information" subtle action={pencil}>
        {isEditable ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <ProfileInput label="Full Name" placeholder="Your name" value={displayName} onChange={setDisplayName} />
            <InfoField label="Email" value={user.email || '—'} />
            <InfoField label="Status" value="Verified Participant" accent />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <InfoField label="Full Name" value={displayName || user.name || '—'} />
            <InfoField label="Email" value={user.email || '—'} />
            <InfoField label="Status" value="Verified Participant" accent />
          </div>
        )}
      </Section>

      {/* Gaming + Uploads row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Section icon={<Gamepad2 className="w-4 h-4" />} title="Gaming Profile" action={pencil}>
          {isEditable ? (
            <div className="space-y-4">
              <ProfileInput label="Team Name" placeholder="e.g. Team Phoenix" value={teamName} onChange={setTeamName} />
              <ProfileInput label="Game UID" placeholder="Your in-game UID" value={gameIGN} onChange={setGameIGN} />
              <ProfileInput label="WhatsApp" placeholder="+91 9876543210" value={whatsapp} onChange={setWhatsapp} />
              <ProfileInput label="Instagram" placeholder="https://instagram.com/..." value={instagram} onChange={setInstagram} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoField label="Team Name" value={teamName || '—'} />
              <InfoField label="Game UID" value={gameIGN || '—'} />
              <InfoField label="WhatsApp" value={whatsapp || '—'} />
              <InfoField label="Instagram" value={instagram || '—'} link />
            </div>
          )}
        </Section>

        <Section icon={<ImageIcon className="w-4 h-4" />} title="Payout QR" action={pencil}>
          <div className="space-y-4">
            <UploadField label="Payment QR" hint="PhonePe/GPay QR for prize payouts" preview={qrDisplay} inputRef={qrRef} editable={isEditable}
              onFile={(f) => { setQrFile(f); setQrPreview(URL.createObjectURL(f)); }} />
          </div>
        </Section>
      </div>

      {/* Team Members */}
      <Section icon={<Users className="w-4 h-4" />} title="Saved Team Members" action={pencil}>
        <p className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Save your squad. Auto-filled during tournament registration.</p>
        {savedPlayers.length === 0 && !isEditable ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Users className="w-6 h-6 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-400">No saved teammates yet</p>
          </div>
        ) : (
          <>
            {savedPlayers.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 mb-2">
                <div className="w-7 h-7 rounded-lg bg-google-blue/10 text-google-blue flex items-center justify-center text-xs font-black shrink-0 mt-1">{i + 1}</div>
                {isEditable ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input value={p.name} onChange={e => updatePlayer(i, 'name', e.target.value)} placeholder="Name" className="h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/20" />
                    <input value={p.uid} onChange={e => updatePlayer(i, 'uid', e.target.value)} placeholder="Game UID" className="h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/20" />
                    <input value={p.instagram} onChange={e => updatePlayer(i, 'instagram', e.target.value)} placeholder="Instagram" className="h-9 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-google-blue/20" />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 py-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.name || '—'}</span>
                    <span className="text-xs font-bold text-slate-500">{p.uid || '—'}</span>
                    <span className="text-xs font-medium text-slate-400 truncate">{p.instagram || '—'}</span>
                  </div>
                )}
                {isEditable && (
                  <button onClick={() => removePlayer(i)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-1"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
            {isEditable && (
              <button onClick={addPlayer} className="mt-1 w-full h-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-google-blue hover:border-google-blue/30 hover:bg-google-blue/5 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Player
              </button>
            )}
          </>
        )}
      </Section>

      {/* Save / Cancel */}
      {isEditable && (
        <div className="flex gap-3">
          {!isEmpty && (
            <button onClick={handleCancel} className="flex-1 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-black uppercase text-xs tracking-[0.15em] hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="flex-1 h-12 rounded-xl bg-google-blue text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      )}
    </div>
  );
}
