'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, User, Menu, X, LogIn, LogOut, ShieldCheck, Medal, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import AuthModal from './AuthModal';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Tournaments', href: '/tournaments', icon: Trophy },
  { name: 'Winners', href: '/winners', icon: Medal },
  { name: 'Rules', href: '/rules', icon: ShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Auto-show Login prompting for first-time visitors in this session
    if (status === 'unauthenticated') {
      const hasShown = sessionStorage.getItem('auth_modal_shown');
      if (!hasShown) {
        const timer = setTimeout(() => {
          setIsAuthModalOpen(true);
          sessionStorage.setItem('auth_modal_shown', 'true');
        }, 800);
        return () => clearTimeout(timer);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [status]);

  return (
    <>
      {/* Top blur fade overlay — blurs content scrolling behind navbar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          height: '100px',
          backdropFilter: scrolled ? `blur(${Math.min(scrollY / 10, 8)}px)` : 'none',
          WebkitBackdropFilter: scrolled ? `blur(${Math.min(scrollY / 10, 8)}px)` : 'none',
          maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
          transition: 'backdrop-filter 0.2s ease',
        }}
      />
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-2.5 shadow-[0_1px_2px_0_rgba(60,64,67,.30)] rounded-full transition-all duration-300 border border-slate-200 dark:border-slate-800",
        scrolled && "shadow-lg border-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Bharat Gaming League"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              BHARAT<span className="text-google-blue">GAMING</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">League</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-all",
                pathname === link.href ? "text-google-blue" : "text-slate-500 hover:text-google-blue"
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

          {status === 'loading' ? null : session ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden transition-all group-hover:border-google-blue">
                   <img src={session.user?.image || ''} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-google-blue transition-colors">Dashboard</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-google-red transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-google-blue text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button className="text-slate-500 p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl border border-slate-200 dark:border-slate-800 mx-4 overflow-hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-sm font-bold p-3 rounded-lg transition-colors flex items-center gap-3",
                pathname === link.href ? "bg-blue-50 dark:bg-blue-500/10 text-google-blue font-bold" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <link.icon className={cn("w-4 h-4", pathname === link.href ? "text-google-blue" : "text-slate-400")} />
              <span className="flex-1">{link.name}</span>
              <ArrowRight className="w-3 h-3 opacity-30" />
            </Link>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
            {session ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-lg">
                   <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <img src={session.user?.image || ''} alt="avatar" className="w-full h-full object-cover" />
                   </div>
                   <span className="flex-1">Dashboard</span>
                   <User className="w-4 h-4 text-slate-400" />
                </Link>
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="w-full p-3 text-sm font-bold text-google-red text-left flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-google-blue text-white py-3 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In with Google
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
