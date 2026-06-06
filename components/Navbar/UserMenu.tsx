'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, ChevronDown, Landmark, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  session: any;
}

export default function UserMenu({ session }: UserMenuProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isAdmin = session?.user?.isAdmin;

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Withdrawal', href: '/withdrawal', icon: Landmark },
    ...(isAdmin ? [{ label: 'Admin Panel', href: '/admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-full transition-all duration-200 border select-none",
          profileOpen 
            ? "bg-slate-100 dark:bg-white/[0.08] border-slate-200/80 dark:border-white/10" 
            : "border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04]"
        )}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700">
          {!session.user?.image || imageError ? (
            <User className="w-4 h-4 text-slate-400" />
          ) : (
            <img 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)} 
            />
          )}
        </div>
        <ChevronDown 
          className={cn(
            "w-3 h-3 text-slate-400 dark:text-slate-500 transition-transform duration-200", 
            profileOpen && "rotate-180"
          )} 
        />
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111127] rounded-2xl p-1 shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-white/[0.06] z-50">
          {/* User info header */}
          <div className="px-3 py-3 mb-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-none">
              {session.user?.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1.5">
              {session.user?.email}
            </p>
          </div>
          
          <div className="h-px bg-slate-100 dark:bg-white/[0.06] mx-2 mb-1" />

          {/* Menu items */}
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <item.icon className="w-4 h-4 text-slate-400 dark:text-slate-500" /> 
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/[0.06] mx-2 my-1" />

          {/* Logout */}
          <button
            onClick={() => {
              signOut();
              setProfileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/[0.06] transition-all text-left"
          >
            <LogOut className="w-4 h-4" /> 
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
