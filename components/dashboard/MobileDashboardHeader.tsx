'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, LogOut, Pencil, Check, X, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useProfile } from '@/hooks/useProfile';

interface MobileDashboardHeaderProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: any[];
}

export default function MobileDashboardHeader({ user, activeTab, setActiveTab, navItems }: MobileDashboardHeaderProps) {
  const { profile, loading, saving, saveProfile } = useProfile();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user.name || '');

  useEffect(() => {
    if (!loading && profile.name) setNameValue(profile.name);
  }, [loading, profile.name]);

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    await saveProfile({ name: nameValue.trim() });
    setEditingName(false);
  };

  const handleCancel = () => {
    setNameValue(profile.name || user.name || '');
    setEditingName(false);
  };

  return (
    <div className="lg:hidden space-y-4 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 flex items-center gap-4 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] border border-slate-200">
        {user.image ? (
          <Image src={user.image} alt="avatar" width={52} height={52}
            className="rounded-full border border-slate-200 shrink-0" />
        ) : (
          <div className="w-13 h-13 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            <User className="w-6 h-6 text-slate-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="flex-1 min-w-0 h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-google-blue/30"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button onClick={handleSaveName} disabled={saving} className="p-1.5 rounded-lg text-google-green hover:bg-green-50 transition-colors">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button onClick={handleCancel} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white text-base leading-tight truncate">{nameValue || user.name}</p>
              <button onClick={() => setEditingName(true)} className="p-1 rounded-md text-slate-400 hover:text-google-blue hover:bg-blue-50 transition-colors shrink-0">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-slate-500 text-[11px] font-medium truncate mt-0.5">{user.email}</p>
          <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-google-blue border border-blue-100">
            Player
          </span>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-google-red hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-1.5 flex gap-2 border border-slate-200 shadow-sm">
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === item.name
                ? 'bg-blue-50 text-google-blue border border-blue-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.name === 'My Registrations' ? 'Registrations' : item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
