'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, User, Menu, X, LogOut, ShieldCheck, Medal, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Champions', href: '/winners', icon: Medal },
  { name: 'Rules', href: '/rules', icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* Mobile backdrop blur overlay with fade animation */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 md:hidden bg-slate-950/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in" />
      )}

      <div className="fixed top-0 left-0 right-0 h-20 z-40 pointer-events-none"
        style={{
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className={cn(
          "max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-5 py-2 rounded-2xl transition-all duration-500 border backdrop-blur-xl",
          scrolled
            ? "bg-white/85 dark:bg-slate-900/90 shadow-lg shadow-slate-200/40 dark:shadow-slate-950/40 border-slate-200/70 dark:border-slate-800/70"
            : "bg-white/60 dark:bg-slate-900/50 shadow-sm border-slate-200/40 dark:border-slate-800/40"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200/60 dark:border-slate-800 transition-all duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="BGL" width={32} height={32} className="rounded-lg shadow-sm" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black tracking-tight text-slate-900 dark:text-white leading-none uppercase">
                Bharat<span className="text-google-blue">Gaming</span>
              </span>
              <span className="text-[7px] font-black tracking-[0.3em] text-slate-400 dark:text-slate-500 uppercase mt-0.5">League</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={cn(
                "relative px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300",
                pathname === link.href
                  ? "text-google-blue dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className={cn("flex items-center gap-2 py-1.5 px-2 rounded-xl transition-all duration-200", profileOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60")}>
                  <div className="w-8 h-8 rounded-lg border-2 border-blue-200 dark:border-blue-500/30 overflow-hidden flex items-center justify-center bg-slate-55 dark:bg-slate-800">
                    {!session.user?.image || imageError ? (
                      <User className="w-4 h-4 text-slate-450 dark:text-slate-500" />
                    ) : (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                    )}
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", profileOpen && "rotate-180")} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xl border border-slate-100 dark:border-slate-800 z-50">
                    <div className="px-3 py-2.5 mb-1 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                      <User className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <button onClick={() => { signOut(); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left">
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 active:scale-95">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsOpen(!isOpen)}
              className={cn("p-2 rounded-xl border transition-all duration-300 select-none outline-none shadow-sm",
                isOpen 
                  ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-google-red" 
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}>
              <span className="transition-transform duration-300 block transform rotate-0 hover:rotate-90">
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-slate-200/50 dark:border-slate-800/80 mx-1 transition-all animate-in slide-in-from-top-4 duration-300 flex flex-col gap-3 relative overflow-hidden">
            {/* Ambient glows inside menu */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-google-blue/10 dark:bg-google-blue/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col gap-2 relative z-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                    className={cn("flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 text-google-blue dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    )}>
                    <div className="flex items-center gap-3">
                      <link.icon className={cn("w-4 h-4 shrink-0 transition-all", isActive ? "scale-110 text-google-blue dark:text-blue-400 animate-pulse" : "text-slate-400")} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-google-blue dark:bg-blue-400 animate-ping" />}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-200/60 dark:border-slate-800/80 mt-1 pt-3 relative z-10">
              {session ? (
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/45 dark:border-slate-800 shadow-sm">
                    <div className="w-9 h-9 rounded-lg border-2 border-blue-200 dark:border-blue-500/30 overflow-hidden shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      {!session.user?.image || imageError ? (
                        <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <img src={session.user.image} alt="" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-850 dark:text-slate-200 truncate leading-tight">{session.user?.name}</p>
                      <p className="text-[9.5px] text-slate-450 truncate mt-0.5">{session.user?.email}</p>
                    </div>
                  </Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2.5 border border-transparent transition-colors text-center">
                    <LogOut className="w-4 h-4" /> Logout from Platform
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all">
                  Sign In with Google
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
