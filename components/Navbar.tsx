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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-20 z-40 pointer-events-none"
        style={{
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className={cn(
          "max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-5 py-2 rounded-2xl transition-all duration-500 border backdrop-blur-xl",
          scrolled
            ? "bg-white/85 dark:bg-slate-900/90 shadow-lg shadow-slate-200/40 dark:shadow-slate-950/40 border-slate-200/70 dark:border-slate-800/70"
            : "bg-white/60 dark:bg-slate-900/50 shadow-sm border-slate-200/40 dark:border-slate-800/40"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Image src="/logo.png" alt="BGL" width={34} height={34} className="rounded-xl shadow-sm transition-transform group-hover:scale-105" priority />
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

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {status === 'loading' ? (
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-xl transition-all duration-200",
                    profileOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg border-2 border-blue-200 dark:border-blue-500/30 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                    {!session.user?.image || imageError ? (
                      <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <img 
                        src={session.user.image} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", profileOpen && "rotate-180")} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 z-50">
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
              <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 active:scale-95">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 mx-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                pathname === link.href
                  ? "bg-blue-50 dark:bg-blue-500/10 text-google-blue dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}>
                <link.icon className="w-4 h-4 shrink-0" />
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                    <div className="w-8 h-8 rounded-lg border-2 border-blue-200 dark:border-blue-500/30 overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                      {!session.user?.image || imageError ? (
                        <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <img 
                          src={session.user.image} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{session.user?.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{session.user?.email}</p>
                    </div>
                  </Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl flex items-center gap-3 text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
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
